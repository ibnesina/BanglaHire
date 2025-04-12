<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Project;
use Illuminate\Http\Request;

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
        // Base query: eager-load client and category if you want to display that info
        $query = Project::with(['client', 'category']);

        // If no query params, return the most recent projects.
        if (!$request->has('category_id') && !$request->has('skills')) {
            // Return, for example, the 20 most recent projects
            $projects = $query->orderBy('created_at', 'desc')->limit(20)->get();
            return response()->json($projects, 200);
        }

        // If category is specified, filter by that category
        if ($request->has('category_id')) {
            $categoryId = $request->input('category_id');
            $category = Category::find($categoryId);

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            $query->where('category_id', $categoryId);
        }

        // If no 'skills' param, return projects (filtered by category if provided) in most recent order
        if (!$request->has('skills')) {
            $projects = $query->orderBy('created_at', 'desc')->get();
            return response()->json($projects, 200);
        }

        // If 'skills' param is provided, we handle "best match" sorting
        $requestedSkills = array_map('trim', explode(',', $request->input('skills')));

        // Get the current list from the DB (already filtered by category if given)
        $projects = $query->get();

        // Sort them by overlap of required_skills with $requestedSkills
        // Then (optionally) break ties by recency if you wish
        $sorted = $projects->sort(function ($a, $b) use ($requestedSkills) {
            $aOverlap = $this->countSkillOverlap($a->required_skills, $requestedSkills);
            $bOverlap = $this->countSkillOverlap($b->required_skills, $requestedSkills);

            // Descending by overlap
            if ($bOverlap !== $aOverlap) {
                return $bOverlap <=> $aOverlap;  // More overlap => higher
            }

            // Tiebreak by recency (newest first)
            return $b->created_at <=> $a->created_at;
        })->values();  // Reindex collection

        return response()->json($sorted, 200);
    }

    /**
     * Private helper to count how many of $requestedSkills appear in $projectSkills.
     */
    private function countSkillOverlap($projectSkills, $requestedSkills)
    {
        if (!is_array($projectSkills)) {
            return 0;
        }
        return count(array_intersect($projectSkills, $requestedSkills));
    }
}
