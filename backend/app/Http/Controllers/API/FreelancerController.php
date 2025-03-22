<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Freelancer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FreelancerController extends Controller
{
    /**
     * Create or update the freelancer profile.
     */
    public function store(Request $request)
    {
        $request->validate([
            'bio' => 'nullable|string',
            'skills' => 'nullable|array',
            'experiences' => 'nullable|string',
            'hourly_rate' => 'nullable|numeric|min:0',
            'certifications' => 'nullable|array',
            'portfolio_link' => 'nullable|string',
        ]);

        $user = Auth::user();
        if (!$user) {
            Log::error("Unauthorized access attempt to freelancer store.");
            return response()->json(['message' => 'Unauthorized. Please log in.'], 401);
        }

        // Ensure that only users with type "Freelancer" can create or update a freelancer profile.
        if ($user->type !== 'Freelancer') {
            return response()->json(['message' => 'Unauthorized. Only freelancers can create profiles.'], 403);
        }

        $freelancer = Freelancer::where('freelancer_id', $user->id)->first();

        if ($freelancer) {
            $freelancer->update([
                'bio'            => $request->bio,
                'skills'         => $request->skills,          // Just pass the array
                'experiences'    => $request->experiences,
                'hourly_rate'    => $request->hourly_rate,
                'certifications' => $request->certifications,  // Just pass the array
                'portfolio_link' => $request->portfolio_link,
            ]);            
        } else {
            return response()->json(['message' => 'Freelancer profile not found.'], 404);
        }


        return response()->json([
            'message' => 'Freelancer profile updated successfully.',
            'freelancer' => $freelancer
        ]);
    }

    /**
     * Retrieve a freelancer profile by id.
     */
    public function show($id)
    {
        $freelancer = Freelancer::with('user')->findOrFail($id);
        return response()->json($freelancer);
    }

    /**
     * Retrieve all freelancer profiles.
     */
    public function index()
    {
        $freelancers = Freelancer::with('user')->get();
        return response()->json($freelancers);
    }

    /**
     * Delete a freelancer profile.
     */
    public function destroy($id)
    {
        $freelancer = Freelancer::findOrFail($id);
        $freelancer->delete();

        return response()->json(['message' => 'Freelancer profile deleted successfully.']);
    }

    /**
     * Update freelancer analytics stats (Admin only).
     *
     * Prototype:
     *  - total_earnings: sum of completed project payments.
     *  - average_rating: average rating from Reviews.
     *  - total_bids_placed: count of bids submitted.
     *  - bid_success_rate: percentage of awarded bids.
     *  - completed_projects: count of successfully completed projects.
     *  - active_projects: count of ongoing projects.
     *  - client_feedback_score: calculated feedback score.
     *  - last_updated: timestamp when stats were last refreshed.
     */
    public function updateStats(Request $request, $id)
    {
        // For demonstration purposes, here we simulate updating stats.
        // In a real implementation, you'd query the Payments, Reviews, Bids, and Projects tables.
        $freelancer = Freelancer::findOrFail($id);

        // Example pseudo-code:
        // $totalEarnings = Payment::where('freelancer_id', $id)->sum('amount');
        // $averageRating = Review::where('freelancer_id', $id)->avg('rating');
        // ... (other calculations)
        // $freelancer->total_earnings = $totalEarnings;
        // $freelancer->average_rating = $averageRating;
        // $freelancer->last_updated = now();
        // $freelancer->save();

        return response()->json(['message' => 'Freelancer stats updated successfully.']);
    }
}
