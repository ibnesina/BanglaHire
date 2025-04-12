<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ProjectController extends Controller
{
    // Everyone can see the list of projects
    public function index()
    {
        // Optionally paginate or add filtering
        $projects = Project::with(['assignedFreelancer', 'category'])->get();
        return response()->json($projects, 200);
    }

    // Everyone can view individual projects
    public function show($id)
    {
        $project = Project::with(['assignedFreelancer', 'category'])->findOrFail($id);
        return response()->json($project, 200);
    }

    // Only clients can create a project
    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            // category_id is required and must exist in categories table
            'category_id'     => 'required|exists:categories,id',
            // required_skills should be submitted as an array
            'required_skills' => 'required|array',
            'budget'          => 'required|numeric',
            'file'            => 'nullable|file',
        ]);

        // Validate file upload if exists
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('project_files');
            $validatedData['file'] = $filePath;
        }

        // Set the client_id from the authenticated user
        $validatedData['client_id'] = Auth::user()->id;

        // Fetch the selected category and its available skills
        $category = Category::find($validatedData['category_id']);
        if (!$category) {
            return response()->json(['message' => 'Selected category not found.'], 404);
        }
        // The category skills should be available as an array (cast in the model)
        $availableSkills = $category->skills ?? [];

        // Ensure every required skill is in the available skills list
        foreach ($validatedData['required_skills'] as $skill) {
            if (!in_array($skill, $availableSkills)) {
                return response()->json([
                    'message' => "Invalid skill selection: {$skill}. Please choose only from the available skills for the selected category."
                ], 422);
            }
        }

        // Create the project
        $project = Project::create($validatedData);

        return response()->json($project, 201);
    }

    // Only the client who owns the project can update it
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validatedData = $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'sometimes|nullable|string',
            'category_id'     => 'sometimes|exists:categories,id',
            // Allow required_skills to be updated (as an array)
            'required_skills' => 'sometimes|nullable|array',
            'budget'          => 'sometimes|numeric',
            'status'          => 'sometimes|in:Open,In Progress,Closed',
            'file'            => 'sometimes|nullable|file',
        ]);

        if ($request->has('category_id')) {
            // If category is updated, revalidate required_skills against the new category
            $category = Category::find($validatedData['category_id']);
            if (!$category) {
                return response()->json(['message' => 'Selected category not found.'], 404);
            }
            if (isset($validatedData['required_skills'])) {
                $availableSkills = $category->skills ?? [];
                foreach ($validatedData['required_skills'] as $skill) {
                    if (!in_array($skill, $availableSkills)) {
                        return response()->json([
                            'message' => "Invalid skill selection: {$skill}. Please choose only from the available skills for the selected category."
                        ], 422);
                    }
                }
            }
        } elseif (isset($validatedData['required_skills'])) {
            // If category_id is not updated and required_skills are provided,
            // use the project's existing category for validation.
            $category = $project->category;
            if ($category) {
                $availableSkills = $category->skills ?? [];
                foreach ($validatedData['required_skills'] as $skill) {
                    if (!in_array($skill, $availableSkills)) {
                        return response()->json([
                            'message' => "Invalid skill selection: {$skill}. Please choose only from the available skills for the project's category."
                        ], 422);
                    }
                }
            }
        }

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('project_files');
            $validatedData['file'] = $filePath;
        }

        $project->update($validatedData);
        return response()->json($project, 200);
    }

    // (Optional) Delete a project
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['message' => 'Project deleted'], 200);
    }
}