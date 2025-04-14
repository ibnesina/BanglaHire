<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AssignedProjectRequest;
use App\Models\Project;
use App\Models\AssignedProject;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AssignedProjectRequestController extends Controller
{
    // For freelancer: List all project requests assigned to him/her
    public function index()
    {
        $freelancerId = Auth::user()->id; // Assumes the authenticated freelancer model contains freelancer_id
        $requests = AssignedProjectRequest::where('freelancer_id', $freelancerId)->get();
        return response()->json($requests);
    }

    // For client: Create a new project request
    public function store(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'project_id'    => 'required|exists:projects,id',
            'freelancer_id' => 'required|uuid|exists:freelancers,freelancer_id',
            'message'       => 'nullable|string'
        ]);

        // Use the authenticated client's id
        $validated['client_id'] = Auth::user()->id;

        // Retrieve the project to obtain the amount
        $project = Project::findOrFail($validated['project_id']);
        $validated['amount'] = $project->budget; // Ensure your Project model/table has an amount field

        $validated['request_date'] = now();
        $validated['status'] = 'Pending';

        $requestEntry = AssignedProjectRequest::create($validated);

        return response()->json($requestEntry, 201);
    }

    // For freelancer: Update the request status (e.g., Accept, Reject, or Expire)
    public function update(Request $request, $id)
    {
        $projectRequest = AssignedProjectRequest::findOrFail($id);

        // Validate the update; only allow status update here
        $validated = $request->validate([
            'status' => 'required|in:Accepted,Rejected,Expired'
        ]);

        // Ensure that the authenticated freelancer is the one assigned in the request
        $freelancerId = Auth::user()->id;
        if ($projectRequest->freelancer_id !== $freelancerId) {
            $result = response()->json(['error' => 'Unauthorized'], 403);
        } else {
            // Record the freelancer response time
            $projectRequest->freelancer_response_date = now();

            if ($validated['status'] === 'Accepted') {
                DB::beginTransaction();
                try {
                    // Create an instance in the assigned_projects table.
                    // Note: The assigned_projects table requires a deadline. Here we set a default deadline 7 days from now.
                    $assignedProject = AssignedProject::create([
                        'project_id'     => $projectRequest->project_id,
                        'client_id'      => $projectRequest->client_id,
                        'freelancer_id'  => $projectRequest->freelancer_id,
                        'deadline'       => Carbon::now()->addDays(7)->toDateString(),
                        'payment_amount' => $projectRequest->amount,
                        // Other fields will use default values as defined in its migration
                    ]);

                    // Update the request record with the new assigned project ID and set status to Accepted
                    $projectRequest->assigned_project_id = $assignedProject->id;
                    $projectRequest->status = 'Accepted';
                    $projectRequest->save();

                    DB::commit();
                    $result = response()->json($projectRequest);
                } catch (\Exception $e) {
                    DB::rollBack();
                    $result = response()->json([
                        'error'   => 'Failed to accept request',
                        'message' => $e->getMessage()
                    ], 500);
                }
            } else {
                // For Rejected or Expired statuses, simply update the record
                $projectRequest->status = $validated['status'];
                $projectRequest->save();
                $result = response()->json($projectRequest);
            }
        }

        return $result;
    }


    // Optionally, show details of a single project request
    public function show($id)
    {
        $requestEntry = AssignedProjectRequest::findOrFail($id);
        return response()->json($requestEntry);
    }
}

