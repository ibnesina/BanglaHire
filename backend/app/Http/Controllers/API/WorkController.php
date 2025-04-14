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
        $json = null;
        $query = Project::with(['client', 'category']);

        // If a category filter is provided, validate and apply it.
        if ($request->has('category_id')) {
            $categoryId = $request->input('category_id');
            $category = Category::find($categoryId);
            if (!$category) {
                $json = response()->json(['message' => 'Category not found'], 404);
            } else {
                $query->where('category_id', $categoryId);
            }
        }

        // If no error response has been set, continue building the response.
        if (is_null($json)) {
            // When no filters are provided, return the 20 most recent projects.
            if (!$request->has('category_id') && !$request->has('skills')) {
                $projects = $query->orderBy('created_at', 'desc')->limit(20)->get();
                $json = response()->json($projects, 200);
            }
            // When a category is provided but no skills filter.
            elseif (!$request->has('skills')) {
                $projects = $query->orderBy('created_at', 'desc')->get();
                $json = response()->json($projects, 200);
            }
            // When the 'skills' parameter is provided, handle best-match sorting.
            else {
                $requestedSkills = array_map('trim', explode(',', $request->input('skills')));
                $projects = $query->get();
                $sorted = $projects->sort(function ($a, $b) use ($requestedSkills) {
                    $aOverlap = $this->countSkillOverlap($a->required_skills, $requestedSkills);
                    $bOverlap = $this->countSkillOverlap($b->required_skills, $requestedSkills);
                    // Descending order by overlap count.
                    if ($bOverlap !== $aOverlap) {
                        return $bOverlap <=> $aOverlap;
                    }
                    // Tiebreaker: most recent projects first.
                    return $b->created_at <=> $a->created_at;
                })->values();
                $json = response()->json($sorted, 200);
            }
        }

        return $json;
    }

    /**
     * Private helper to count how many of $requestedSkills appear in $projectSkills.
     *
     * @param mixed $projectSkills Expected to be an array of skills (e.g., ['Laravel', 'Vue.js'])
     * @param array $requestedSkills
     * @return int
     */
    private function countSkillOverlap($projectSkills, $requestedSkills)
    {
        if (!is_array($projectSkills)) {
            return 0;
        }
        return count(array_intersect($projectSkills, $requestedSkills));
    }

}

