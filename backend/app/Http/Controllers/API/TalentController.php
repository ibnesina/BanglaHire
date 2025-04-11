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
        // If no filter is provided, return random freelancers (with user info and avg rating)
        if (!$request->has('category_id') && !$request->has('sort')) {
            return $this->getRandomFreelancers();
        }

        // Base query: include associated user and compute average rating from reviews.
        $query = Freelancer::with('user')
            ->withAvg('reviews', 'rating');

        // Filter by category if provided.
        if ($request->has('category_id')) {
            $categoryId = $request->input('category_id');

            // Validate category existence.
            $category = Category::find($categoryId);
            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }
            $query->where('category_id', $categoryId);
        }

        // If skills are provided, we fetch all freelancers and then sort them manually
        // by the number of matching skills between freelancer->skills and requested skills.
        if ($request->has('skills')) {
            // Expected format: "Laravel,Vue.js,MySQL"
            $requestedSkills = array_map('trim', explode(',', $request->input('skills')));
            $freelancers = $query->get();

            $sorted = $freelancers->sort(function ($a, $b) use ($requestedSkills) {
                $aMatchCount = $this->countOverlap($a->skills, $requestedSkills);
                $bMatchCount = $this->countOverlap($b->skills, $requestedSkills);
                // In case of equal skill match counts, use average rating (if available) to break ties.
                if ($aMatchCount === $bMatchCount) {
                    $aRating = $a->reviews_avg_rating ?? 0;
                    $bRating = $b->reviews_avg_rating ?? 0;
                    return $bRating <=> $aRating;
                }
                return $bMatchCount <=> $aMatchCount;
            })->values(); // Reindex collection

            return response()->json($sorted);
        } else {
            // If no skills filter is given but a sort parameter is provided.
            if ($request->has('sort') && $request->input('sort') === 'highest_rating') {
                $query->orderBy('reviews_avg_rating', 'desc');
            }

            $freelancers = $query->get();
            return response()->json($freelancers);
        }
    }

    /**
     * Helper method: return a random list of freelancers (with user info and average rating computed).
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
     * Helper method: counts the number of overlapping skills.
     *
     * @param mixed $freelancerSkills (Expected: array of skills, e.g. ['Laravel', 'Vue.js'])
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