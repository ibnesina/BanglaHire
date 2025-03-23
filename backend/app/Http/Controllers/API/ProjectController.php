<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ProjectController extends Controller
{
    // Everyone can see the list of projects
    public function index()
    {
        // For a more robust approach, you may want to paginate or filter
        $projects = Project::with('assignedFreelancer')->get();
        return response()->json($projects, 200);
    }

    // Everyone can view individual projects
    public function show($id)
    {
        $project = Project::with('assignedFreelancer')->findOrFail($id);
        return response()->json($project, 200);
    }

    // Only clients can create a project
    public function store(Request $request)
    {
        // Make sure user is a client (e.g., via middleware or role check)
        // $this->authorize('create', Project::class); // or some custom logic

        $validatedData = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'required_skills' => 'nullable|string', // or array if you use JSON
            'budget'        => 'required|numeric',
            'file'          => 'nullable|file',
        ]);

        // Handle file upload if needed
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('project_files');
            $validatedData['file'] = $filePath;
        }

        // Set the client_id from the auth user
        $validatedData['client_id'] = Auth::user()->id;

        $project = Project::create($validatedData);

        return response()->json($project, 201);
    }

    // Only the client who owns the project can update it
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        // Ensure the authenticated user is the owner or has permission
        // $this->authorize('update', $project);

        $validatedData = $request->validate([
            'title'         => 'sometimes|string|max:255',
            'description'   => 'sometimes|nullable|string',
            'required_skills' => 'sometimes|nullable|string',
            'budget'        => 'sometimes|numeric',
            'status'        => 'sometimes|in:Open,In Progress,Closed',
            'file'          => 'sometimes|file|nullable',
        ]);

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('project_files');
            $validatedData['file'] = $filePath;
        }

        $project->update($validatedData);

        return response()->json($project, 200);
    }

    // (Optional) If you want to allow project deletion
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        // $this->authorize('delete', $project);

        $project->delete();

        return response()->json(['message' => 'Project deleted'], 200);
    }
}