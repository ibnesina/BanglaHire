<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Freelancer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TalentController extends Controller
{
    /**
     * GET /talent
     *
     * Optional query parameters:
     *  - category_id: filter by category
     *  - skills: comma-separated list to best-match sort
     *  - sort=highest_rating: sort by average rating (when no skills)
     *
     * When no filters provided, returns 20 random freelancers.
     */
    public function index(Request $request)
    {
        $query = Freelancer::with('user')
            ->withAvg('reviews', 'rating');

        // 1) No filters → random 20
        $noCategory = !$request->filled('category_id');
        $noSkills   = !$request->filled('skills');
        $noSort     = $request->input('sort') !== 'highest_rating';

        if ($noCategory && $noSkills && $noSort) {
            $freelancers = $query->inRandomOrder()->limit(20)->get();
            return response()->json($freelancers, 200);
        }

        // 2) Category filter
        if ($request->filled('category_id')) {
            $categoryId = $request->input('category_id');
            if (! Category::where('id', $categoryId)->exists()) {
                return response()->json(['message' => 'Category not found'], 404);
            }
            $query->where('category_id', $categoryId);
        }

        // 3) If no skills but sort=highest_rating
        if ($noSkills && $request->input('sort') === 'highest_rating') {
            $query->orderBy('reviews_avg_rating', 'desc');
        }

        $freelancers = $query->get();

        // 4) Skills best-match sorting
        if ($request->filled('skills')) {
            $requested = array_map('trim', explode(',', $request->input('skills')));
            $freelancers = $freelancers->sort(function ($a, $b) use ($requested) {
                $aCount = $this->countOverlap($a->skills, $requested);
                $bCount = $this->countOverlap($b->skills, $requested);
                if ($aCount === $bCount) {
                    $aRating = $a->reviews_avg_rating ?? 0;
                    $bRating = $b->reviews_avg_rating ?? 0;
                    return $bRating <=> $aRating;
                }
                return $bCount <=> $aCount;
            })->values();
        }

        return response()->json($freelancers, 200);
    }

    /**
     * Count overlapping skills between two arrays.
     */
    private function countOverlap($freelancerSkills, array $requestedSkills): int
    {
        if (! is_array($freelancerSkills)) {
            return 0;
        }
        return count(array_intersect($freelancerSkills, $requestedSkills));
    }
}
