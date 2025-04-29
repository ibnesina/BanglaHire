<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkController extends Controller
{
    /**
     * GET /work
     *
     * Query Parameters (optional):
     *  - category_id => number (to filter projects by that category)
     *  - skills => comma-separated list of skills for best-match sorting
     *
     *  Examples:
     *    - GET /work                  // Returns most recent projects (no filter)
     *    - GET /work?category_id=1    // Returns projects in category 1, sorted by most recent
     *    - GET /work?category_id=1&skills=Laravel,Vue.js
     *         Returns projects in category 1, sorted by best match with the listed skills.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Base query with eager loads; exclude projects the freelancer has already bid on
        $query = Project::with(['client', 'category', 'biddings'])
            ->when(
                optional($user)->type === 'Freelancer',
                fn($q) => $q->whereDoesntHave('biddings', fn($qb) =>
                    $qb->where('freelancer_id', Auth::id())
                )
            );

        // If filtering by category, validate first
        if ($request->filled('category_id')) {
            $categoryId = $request->input('category_id');
            if (! Category::find($categoryId)) {
                return response()->json(['message' => 'Category not found'], 404);
            }
            $query->where('category_id', $categoryId);
        }

        // Decide whether to sort by skills or by recency
        if ($request->filled('skills')) {
            $requestedSkills = array_map('trim', explode(',', $request->input('skills')));
            $projects = $query->get()->sort(function ($a, $b) use ($requestedSkills) {
                $aOverlap = $this->countSkillOverlap($a->required_skills, $requestedSkills);
                $bOverlap = $this->countSkillOverlap($b->required_skills, $requestedSkills);
                if ($bOverlap !== $aOverlap) {
                    return $bOverlap <=> $aOverlap;
                }
                return $b->created_at <=> $a->created_at;
            })->values();
        } else {
            // No skills filter: limit to 20 most recent if no category, else all in category
            $projects = $query
                ->orderBy('created_at', 'desc')
                ->when(! $request->filled('category_id'), fn($q) => $q->limit(20))
                ->get();
        }

        return response()->json($projects, 200);
    }

    /**
     * Private helper to count how many of $requestedSkills appear in $projectSkills.
     *
     * @param mixed $projectSkills Expected to be an array of skills (e.g., ['Laravel', 'Vue.js'])
     * @param array $requestedSkills
     * @return int
     */
    private function countSkillOverlap($projectSkills, array $requestedSkills): int
    {
        if (! is_array($projectSkills)) {
            return 0;
        }
        return count(array_intersect($projectSkills, $requestedSkills));
    }

}

