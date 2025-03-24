<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AssignedProject;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignedProjectController extends Controller
{
    // List all assignments (visible to clients, freelancers, and admins)
    public function index()
    {
        $assignments = AssignedProject::with(['project', 'client', 'freelancer', 'review'])->get();
        return response()->json($assignments, 200);
    }

    // Show a single assignment by ID
    public function show($id)
    {
        $assignment = AssignedProject::with(['project', 'client', 'freelancer', 'review'])->findOrFail($id);
        return response()->json($assignment, 200);
    }

    // Create a new project assignment (only the client who created the project can assign it)
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'project_id'     => 'required|exists:projects,id',
            // freelancer_id must be provided to assign the project
            'freelancer_id'  => 'required|exists:freelancers,freelancer_id',
            // deadline when the project is expected to be completed
            'deadline'       => 'required|date',
            'payment_amount' => 'required|numeric',
            'status'         => 'required|in:Assigned,In Progress,Completed,Canceled',
            'payment_status' => 'required|in:Pending,Released,Disputed',
            // completion_date and review_id are optional at assignment
            'completion_date'=> 'nullable|date',
            'review_id'      => 'nullable|exists:reviews,id',
        ]);

        // Retrieve the project and ensure that the authenticated client is the creator
        $project = Project::findOrFail($validatedData['project_id']);
        if (Auth::user()->id !== $project->client_id) {
            return response()->json(['error' => 'Unauthorized: You do not own this project'], 403);
        }

        // Force the client_id from the authenticated client
        $validatedData['client_id'] = Auth::user()->id;
        $validatedData['assigned_date'] = now();

        $assignment = AssignedProject::create($validatedData);

        return response()->json($assignment, 201);
    }

    // Update an assignment (for example, to change status, deadline, or payment info)
    public function update(Request $request, $id)
    {
        $assignment = AssignedProject::findOrFail($id);

        $validatedData = $request->validate([
            'status'         => 'sometimes|in:Assigned,In Progress,Completed,Canceled',
            'deadline'       => 'sometimes|date',
            'payment_amount' => 'sometimes|numeric',
            'payment_status' => 'sometimes|in:Pending,Released,Disputed',
            'completion_date'=> 'sometimes|nullable|date',
            'review_id'      => 'sometimes|nullable|exists:reviews,id',
        ]);

        $assignment->update($validatedData);

        return response()->json($assignment, 200);
    }

    // Delete an assignment
    public function destroy($id)
    {
        $assignment = AssignedProject::findOrFail($id);
        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted'], 200);
    }
}