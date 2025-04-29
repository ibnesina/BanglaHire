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

        // 1) Base query, exclude already-bid projects for freelancers
        $query = Project::with(['client', 'category'])
            ->when(
                $user && $user->type === 'Freelancer',
                function($q) use ($user) {
                    $q->whereDoesntHave('biddings', function($qb) use ($user) {
                        $qb->where('freelancer_id', $user->id);
                    });
                }
            );

        // 2) Category filter (early return on 404)
        if ($request->filled('category_id')) {
            $cat = Category::find($request->input('category_id'));
            if (! $cat) {
                return response()->json(['message' => 'Category not found'], 404);
            }
            $query->where('category_id', $cat->id);
        }

        // 3) If skills are provided, do best‐match sorting
        if ($request->filled('skills')) {
            $skills = array_map('trim', explode(',', $request->input('skills')));
            $projects = $query->get()->sort(function($a, $b) use ($skills) {
                $aCnt = $this->countSkillOverlap($a->required_skills, $skills);
                $bCnt = $this->countSkillOverlap($b->required_skills, $skills);
                if ($bCnt !== $aCnt) {
                    return $bCnt <=> $aCnt;
                }
                return $b->created_at <=> $a->created_at;
            })->values();

            return response()->json($projects, 200);
        }

        // 4) No skills filter: return recent projects
        //    – limit 20 if no category, else all in category
        $projects = $query
            ->orderBy('created_at', 'desc')
            ->when(! $request->filled('category_id'), fn($q) => $q->limit(20))
            ->get();

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

