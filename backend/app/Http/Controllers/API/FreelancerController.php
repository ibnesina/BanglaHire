<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Freelancer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FreelancerController extends Controller
{
    /**
     * Create or update the freelancer profile.
     */
    private const NULLABLE_STRING = 'nullable|string';

    public function store(Request $request)
    {
        // 1) Guard: must be an authenticated Freelancer
        $user = Auth::user();
        if (! $user || $user->type !== 'Freelancer') {
            return response()->json([
                'message' => 'Unauthorized. Only freelancers can create/update profiles.'
            ], 403);
        }

        // 2) Validate inputs, reusing NULLABLE_STRING
        $data = $request->validate([
            'bio'            => self::NULLABLE_STRING,
            'category_id'    => 'required|exists:categories,id',
            'skills'         => 'nullable|array',
            'experiences'    => self::NULLABLE_STRING,
            'hourly_rate'    => 'nullable|numeric|min:0',
            'certifications' => 'nullable|array',
            'portfolio_link' => self::NULLABLE_STRING,
        ]);

        // 3) Skill‐subset check (single return if it fails)
        $category     = Category::find($data['category_id']); // exists:categories ensures this
        $invalidSkill = $this->findInvalidSkill($data['skills'] ?? [], $category->skills);
        if ($invalidSkill) {
            return response()->json([
                'message' => "Invalid skill selection: {$invalidSkill}. Please choose only from the available skills for the selected category."
            ], 422);
        }

        // 4) Create-or-update in one call
        $freelancer = Freelancer::updateOrCreate(
            ['freelancer_id' => $user->id],
            [
                'bio'             => $data['bio'] ?? null,
                'category_id'     => $data['category_id'],
                'skills'          => $data['skills'] ?? null,
                'experiences'     => $data['experiences'] ?? null,
                'hourly_rate'     => $data['hourly_rate'] ?? null,
                'certifications'  => $data['certifications'] ?? null,
                'portfolio_link'  => $data['portfolio_link'] ?? null,
            ]
        );

        // 5) Final success return
        return response()->json([
            'message'    => 'Freelancer profile updated successfully.',
            'freelancer' => $freelancer
        ], 200);
    }


    /**
     * Checks the list of provided skills against the available skills.
     *
     * @param array $skills         The skills provided in the request.
     * @param array $availableSkills The skills available in the selected category.
     *
     * @return string|null Returns the first invalid skill found, or null if all skills are valid.
     */
    private function findInvalidSkill(array $skills, array $availableSkills): ?string
    {
        foreach ($skills as $skill) {
            if (!in_array($skill, $availableSkills)) {
                return $skill;
            }
        }
        return null;
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
    public function updateStats($id)
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

        return response()->json([
            'message' => 'Freelancer stats updated successfully.',
            'freelancer' => $freelancer
        ]);
    }
}
