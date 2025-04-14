<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Freelancer;
use App\Models\Category;

class TalentController extends Controller
{
    /**
     * GET /talent
     *
     * Query Parameters:
     *  - category_id (optional): Filters freelancers by a given category ID.
     *  - skills (optional): A comma-separated list of skills to filter and sort by best match.
     *  - sort (optional): When set to "highest_rating", sorts by highest average rating.
     *
     * When no query parameters are specified, a set of random freelancers is returned.
     */
    public function index(Request $request)
    {
        $response = null;

        // When no filters are provided, use random freelancers.
        if (!$request->has('category_id') && !$request->has('sort')) {
            $response = $this->getRandomFreelancers();
        } else {
            // Build base query.
            $query = Freelancer::with('user')->withAvg('reviews', 'rating');

            // Apply category filter if provided.
            if ($request->has('category_id')) {
                $categoryId = $request->input('category_id');
                $category = Category::find($categoryId);
                if (!$category) {
                    $response = response()->json(['message' => 'Category not found'], 404);
                } else {
                    $query->where('category_id', $categoryId);
                }
            }

            // Proceed only if no error response is set.
            if (is_null($response)) {
                if ($request->has('skills')) {
                    $requestedSkills = array_map('trim', explode(',', $request->input('skills')));
                    $freelancers = $query->get();
                    $sorted = $freelancers->sort(function ($a, $b) use ($requestedSkills) {
                        $aMatchCount = $this->countOverlap($a->skills, $requestedSkills);
                        $bMatchCount = $this->countOverlap($b->skills, $requestedSkills);
                        if ($aMatchCount === $bMatchCount) {
                            $aRating = $a->reviews_avg_rating ?? 0;
                            $bRating = $b->reviews_avg_rating ?? 0;
                            return $bRating <=> $aRating;
                        }
                        return $bMatchCount <=> $aMatchCount;
                    })->values();

                    $response = response()->json($sorted);
                } else {
                    // Apply sort if specified (and no skills filter)
                    if ($request->has('sort') && $request->input('sort') === 'highest_rating') {
                        $query->orderBy('reviews_avg_rating', 'desc');
                    }

                    $freelancers = $query->get();
                    $response = response()->json($freelancers);
                }
            }
        }

        return $response;
    }

    /**
     * Helper method: Return a random list of freelancers (with user info and average rating computed).
     */
    private function getRandomFreelancers()
    {
        $freelancers = Freelancer::with('user')
            ->withAvg('reviews', 'rating')
            ->inRandomOrder()
            ->limit(20)
            ->get();

        return response()->json($freelancers);
    }

    /**
     * Helper method: Count the number of overlapping skills.
     *
     * @param mixed $freelancerSkills Expected to be an array of skills, e.g. ['Laravel', 'Vue.js']
     * @param array $requestedSkills
     * @return int
     */
    private function countOverlap($freelancerSkills, array $requestedSkills)
    {
        if (!is_array($freelancerSkills)) {
            return 0;
        }
        return count(array_intersect($freelancerSkills, $requestedSkills));
    }

}

