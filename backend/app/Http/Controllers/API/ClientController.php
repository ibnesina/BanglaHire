<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    /**
     * Create or update the client profile.
     */
    public function store(Request $request)
    {
        $request->validate([
            'company_name' => 'nullable|string|max:255',
            'payment_method_verified' => 'nullable|boolean',
        ]);

        $user = Auth::user();

        // Only users with type "Client" can create or update a client profile
        if ($user->type !== 'Client') {
            return response()->json(['message' => 'Unauthorized. Only clients can create/update profiles.'], 403);
        }

        // Update or create the client record using the user's id as client_id
        $client = Client::updateOrCreate(
            ['client_id' => $user->id],
            $request->only(['company_name', 'payment_method_verified'])
        );

        return response()->json([
            'message' => 'Client profile updated successfully.',
            'client'  => $client
        ]);
    }

    /**
     * Retrieve a client profile by ID.
     */
    public function show($id)
    {
        $client = Client::with('user')->findOrFail($id);
        return response()->json($client);
    }

    /**
     * Retrieve all client profiles.
     */
    public function index()
    {
        $clients = Client::with('user')->get();
        return response()->json($clients);
    }

    /**
     * Delete a client profile.
     */
    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json(['message' => 'Client profile deleted successfully.']);
    }

    /**
     * Update client stats (Admin only).
     *
     * Prototype for calculated fields:
     * - posted_projects_id
     * - total_spending
     * - average_freelancer_rating_given
     * - total_projects_posted
     * - completed_projects
     * - active_projects
     * - freelancer_performance_score
     */
    public function updateStats($id)
    {
        // $client = Client::findOrFail($id);
        // Example pseudo-code for future use:
        // $client->total_spending = Payment::where('client_id', $id)->sum('amount');
        // $client->average_freelancer_rating_given = Review::where('client_id', $id)->avg('rating');
        // ...
        // $client->save();

        return response()->json(['message' => 'Client stats updated successfully.']);
    }
}
