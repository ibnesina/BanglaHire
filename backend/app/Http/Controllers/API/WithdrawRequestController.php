<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWithdrawRequest;
use App\Models\User;
use App\Models\WithdrawRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class WithdrawRequestController extends Controller
{
    use AuthorizesRequests;
    
    // List all requests of the authenticated user
    public function index(Request $request)
    {
        return $request->user()
                       ->withdrawRequests()
                       ->orderBy('created_at','desc')
                       ->get();
    }

    // Show a single request
    public function show(WithdrawRequest $withdraw_request)
    {
        $this->authorize('view', $withdraw_request);
        return $withdraw_request;
    }

    // Store a new withdraw request
    public function store(StoreWithdrawRequest $request)
    {
        $validated = $request->validated();
        $user      = $request->user();
        $gross     = $validated['amount'];

        // We'll capture the created model here
        $withdrawRequest = null;

        DB::transaction(function () use ($user, $gross, $validated, &$withdrawRequest) {
            // 1) Deduct the full requested amount from the user
            $user->decrement('balance', $gross);                           // :contentReference[oaicite:1]{index=1}

            // 2) Calculate & credit 2% fee to the super-admin
            $fee   = round($gross * 0.02, 2);
            $admin = User::where('id', function ($query) {
                $query->select('admin_id')
                      ->from('admins')
                      ->where('is_super_admin', 1);
            })->first();

            $admin->increment('balance', $fee);                             // :contentReference[oaicite:2]{index=2}

            // 3) Create the withdraw request for the *net* amount
            $withdrawRequest = WithdrawRequest::create([
                'user_id'         => $user->id,
                'amount'          => $gross - $fee,
                'gateway'         => $validated['gateway'],
                'payment_details' => $validated['payment_details'],
            ]);
        }, 5); // retry up to 5 times on deadlock :contentReference[oaicite:3]{index=3}

        return response($withdrawRequest, Response::HTTP_CREATED);
    }

    // Admin-only: approve
    public function approve(WithdrawRequest $withdraw_request)
    {
        $this->authorize('approve', $withdraw_request);
        $withdraw_request->update(['status' => 'approved']);
        return response()->noContent();
    }

    // Admin-only: reject
    public function reject(WithdrawRequest $withdraw_request)
    {
        $this->authorize('approve', $withdraw_request);
        $withdraw_request->update(['status' => 'rejected']);
        return response()->noContent();
    }
}
