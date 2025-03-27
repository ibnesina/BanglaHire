<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PaymentHistory;
use App\Models\AssignedProject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentHistoryController extends Controller
{
    // List all payment histories with related sender, receiver, and project data
    public function index()
    {
        $payments = PaymentHistory::with(['sender', 'receiver', 'project'])->get();
        return response()->json($payments, 200);
    }

    // Show a single payment record
    public function show($id)
    {
        $payment = PaymentHistory::with(['sender', 'receiver', 'project'])->findOrFail($id);
        return response()->json($payment, 200);
    }

    // Update an existing payment record
    public function update(Request $request, $id)
    {
        $payment = PaymentHistory::findOrFail($id);

        $validatedData = $request->validate([
            // 'amount'          => 'sometimes|numeric',
            // 'project_id'      => 'sometimes|exists:projects,id',
            'status'          => 'sometimes|in:Pending,Completed,Failed,Refunded',
            // 'payment_type'    => 'sometimes|in:Direct,Hourly,Fixed-Price,Escrow',
        ]);

        if(isset($validatedData['status']) && $validatedData['status'] === 'Completed') {
            $admin = User::where('id', function ($query) {
                $query->select('admin_id')
                      ->from('admins')
                      ->where('is_super_admin', 1);
            })->first();    

            $freelancer = User::find($payment->receiver_id);

            if($payment->payment_type == 'Escrow') {
                $admin->balance += $payment->amount * 0.05;
                $freelancer->balance += $payment->amount * 0.95;
            }
            else {
                $admin->balance += $payment->amount * 0.15;
                $freelancer->balance += $payment->amount * 0.85;
            }

            $admin->save();
            $freelancer->save();
        }
        else if(isset($validatedData['status']) && $validatedData['status'] === 'Refunded') {
            $client = User::find($payment->sender_id);
            $client->balance += $payment->amount;
            $client->save();

            $existingPayment = AssignedProject::where('project_id', $payment->project_id)
                ->where('client_id', $payment->sender_id)
                ->where('freelancer_id', $payment->receiver_id)
                ->first();
            
            $existingPayment->status = 'Canceled';
            $existingPayment->payment_status = 'Disputed';

            $existingPayment->save();
        }

        $payment->update($validatedData);
        return response()->json($payment, 200);
    }

    // Delete a payment record
    public function destroy($id)
    {
        $payment = PaymentHistory::findOrFail($id);
        $payment->delete();
        return response()->json(['message' => 'Payment record deleted'], 200);
    }

    // Get payments for the authenticated client (what they spent)
    public function getClientPayments()
    {
        $clientId = Auth::user()->id;
        $payments = PaymentHistory::where('sender_id', $clientId)
            ->with(['sender', 'receiver', 'project'])
            ->get();
        return response()->json($payments, 200);
    }

    // Get payments for the authenticated freelancer (what they received)
    public function getFreelancerPayments()
    {
        $freelancerId = Auth::user()->id;
        $payments = PaymentHistory::where('receiver_id', $freelancerId)
            ->with(['sender', 'receiver', 'project'])
            ->get();
        return response()->json($payments, 200);
    }
}