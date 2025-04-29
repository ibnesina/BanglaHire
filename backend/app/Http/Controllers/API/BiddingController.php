<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bidding;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BiddingController extends Controller
{
    // Show all biddings for a project (optional)
    public function index($projectId)
    {
        $biddings = Bidding::where('project_id', $projectId)
                        ->with(['freelancer', 'freelancer.user'])
                        ->get();

        return response()->json($biddings, 200);
    }

    // Show all biddings placed by the authenticated freelancer
    public function myBiddings()
    {
        $freelancerId = Auth::id();
        $biddings = Bidding::where('freelancer_id', $freelancerId)
                        ->with(['project.client', 'project.category'])
                        ->get();

        return response()->json($biddings, 200);
    }


    // Freelancer places a bid
    public function store(Request $request, $projectId)
    {
        // Make sure user is a freelancer
        // e.g., $this->authorize('create', Bidding::class);

        $project = Project::findOrFail($projectId);

        $validatedData = $request->validate([
            'cover_letter'   => 'required|string',
            'bidding_amount' => 'required|numeric',
        ]);

        $validatedData['project_id'] = $project->id;
        // Suppose your authenticated freelancer has a uuid in `Auth::user()->freelancer_id`
        $validatedData['freelancer_id'] = Auth::user()->id;

        $bidding = Bidding::create($validatedData);

        return response()->json($bidding, 201);
    }

    // (Optional) If you want to allow freelancers to update their bid
    public function update(Request $request, $id)
    {
        $bidding = Bidding::findOrFail($id);

        $validatedData = $request->validate([
            'cover_letter'   => 'sometimes|nullable|string',
            'bidding_amount' => 'sometimes|numeric',
        ]);

        $bidding->update($validatedData);

        return response()->json($bidding, 200);
    }
}

