<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AssignedProject;
use App\Models\PaymentHistory;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignedProjectController extends Controller
{
    // List all assignments (visible to clients, freelancers, and admins)
    public function index()
    {
        $assignments = AssignedProject::with(['project', 'client', 'freelancer', 'review'])->get();
        return response()->json($assignments, 200);
    }

    // Show a single assignment by ID
    public function show($id)
    {
        $assignment = AssignedProject::with(['project', 'client', 'freelancer', 'review'])->findOrFail($id);
        return response()->json($assignment, 200);
    }

    // Create a new project assignment (only the client who created the project can assign it)
    public function store(Request $request)
    {
        // Validate the incoming data
        $validatedData = $request->validate([
            'project_id'     => 'required|exists:projects,id',   // Project ID
            'freelancer_id'  => 'required|exists:freelancers,freelancer_id',  // Freelancer ID
            'payment_amount' => 'required|numeric',  // Payment amount (taken from bid)
        ]);

        // Retrieve the project and ensure that the authenticated client is the owner
        $project = Project::findOrFail($validatedData['project_id']);
        if (Auth::user()->id !== $project->client_id) {
            return response()->json(['error' => 'Unauthorized: You do not own this project'], 403);
        }

        // Auto-generate the deadline (7 days from today)
        $deadline = now()->addDays(7);

        // Update the project's status to "In Progress" when it is assigned
        $project->status = 'Assigned';
        $project->assigned_freelancer_id = $validatedData['freelancer_id'];
        $project->save();

        // Create the assignment record with necessary details
        $assignment = AssignedProject::create([
            'project_id'       => $validatedData['project_id'],
            'freelancer_id'    => $validatedData['freelancer_id'],
            'payment_amount'   => $validatedData['payment_amount'],
            'deadline'         => $deadline,
            'status'           => 'Assigned',  // Automatically set to 'Assigned'
            'payment_status'   => 'Pending',   // Automatically set to 'Pending'
            'client_id'        => Auth::user()->id,  // Authenticated client
            'assigned_date'    => now(),
        ]);

        return response()->json($assignment, 201);  // Return the created assignment
    }


    // Update an assignment (for example, to change status, deadline, or payment info)
    public function update(Request $request, $id)
    {
        $assignment = AssignedProject::findOrFail($id);

        $validatedData = $request->validate([
            'status'         => 'sometimes|in:Assigned,In Progress,Completed,Canceled',
            'payment_status' => 'sometimes|in:Pending,Released,Disputed', // No need to input, handled by default
            'completion_date'=> 'sometimes|nullable|date',
            'review_id'      => 'sometimes|nullable|exists:reviews,id',
        ]);

        // Case 1: Freelancer submits project - update status to "In Progress" in the assignment and "Submitted" in the project
        if (isset($validatedData['status']) && $validatedData['status'] === 'Submitted') {
            $assignment->status = 'Submitted';
            $assignment->save();

            // Update project status to "Submitted" for freelancer
            $project = Project::findOrFail($assignment->project_id);
            $project->status = 'Submitted';
            $project->save();

            return response()->json($assignment, 200);  // Return updated assignment status
        }

        // Case 2: Client accepts project - update status to "Completed" in the assignment and "Closed" in the project
        if (isset($validatedData['status']) && $validatedData['status'] === 'Completed') {

            // Update the assignment status to "Completed"
            $assignment->status = 'Completed';
            $assignment->save();

            // Mark the payment as "Completed" in the PaymentHistory
            $paymentHistory = PaymentHistory::where('project_id', $assignment->project_id)
                ->where('sender_id', $assignment->client_id)
                ->where('receiver_id', $assignment->freelancer_id)
                ->first();

            if ($paymentHistory) {
                // Update the payment status to "Completed"
                $paymentHistory->status = 'Completed';
                $paymentHistory->save();

                // Perform the calculation for admin and freelancer split
                $admin = User::where('id', function ($query) {
                    $query->select('admin_id')
                        ->from('admins')
                        ->where('is_super_admin', 1);  // Get the super admin
                })->first();

                $freelancer = User::find($paymentHistory->receiver_id);

                // Payment type splitting logic
                if ($paymentHistory->payment_type == 'Escrow') {
                    // 5% goes to the admin and 95% to the freelancer
                    $admin->balance += $paymentHistory->amount * 0.05;
                    $freelancer->balance += $paymentHistory->amount * 0.95;
                } else {
                    // 10% goes to the admin and 90% to the freelancer
                    $admin->balance += $paymentHistory->amount * 0.10;
                    $freelancer->balance += $paymentHistory->amount * 0.90;
                }

                // Save the updated balances for both admin and freelancer
                $admin->save();
                $freelancer->save();
            }

            // Update the project status to "Closed" for the client
            $project = Project::findOrFail($assignment->project_id);
            $project->status = 'Closed';
            $project->save();

            return response()->json($assignment, 200);
        }

        // Handle other status updates, such as cancellation or other changes
        $assignment->update($validatedData);

        return response()->json($assignment, 200);  // Return updated assignment
    }


    // Delete an assignment
    public function destroy($id)
    {
        $assignment = AssignedProject::findOrFail($id);
        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted'], 200);
    }
}

