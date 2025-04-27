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
            'file'            => 'nullable|file|max:5120',
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
        $validatedData = $this->validateRequest($request);

        // If validation failed, return early
        if ($validatedData instanceof \Illuminate\Http\JsonResponse) {
            return $validatedData;
        }

        // Check if category and skills validation is required
        $categoryValidationResult = $this->validateCategoryAndSkills($request, $validatedData, $project);
        if ($categoryValidationResult) {
            return $categoryValidationResult;
        }

        // Handle file upload if exists
        $validatedData = $this->handleFileUpload($request, $validatedData);

        // Update project
        $project->update($validatedData);

        // Return the updated project response
        return response()->json($project, 200);
    }

    // Validate the incoming request
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'sometimes|nullable|string',
            'category_id'     => 'sometimes|exists:categories,id',
            'required_skills' => 'sometimes|nullable|array',
            'budget'          => 'sometimes|numeric',
            'status'          => 'sometimes|in:Open,In Progress,Closed',
            'file'            => 'sometimes|nullable|file|max:5120',
        ]);
    }

    // Validate category and skills based on the input
    private function validateCategoryAndSkills(Request $request, array $validatedData, Project $project)
    {
        $category = null;

        if ($request->has('category_id')) {
            $category = Category::find($validatedData['category_id']);
            if (!$category) {
                return response()->json(['message' => 'Selected category not found.'], 404);
            }
        } elseif (isset($validatedData['required_skills']) && $project->category) {
            $category = $project->category;
        }

        if ($category && isset($validatedData['required_skills'])) {
            $availableSkills = $category->skills ?? [];
            foreach ($validatedData['required_skills'] as $skill) {
                if (!in_array($skill, $availableSkills)) {
                    return response()->json([
                        'message' => "Invalid skill selection: {$skill}. Please choose only from the available skills for the selected category."
                    ], 422);
                }
            }
        }

        return null;
    }

    // Handle file upload logic
    private function handleFileUpload(Request $request, array $validatedData)
    {
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('project_files');
            $validatedData['file'] = $filePath;
        }

        return $validatedData;
    }


    // (Optional) Delete a project
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['message' => 'Project deleted'], 200);
    }


    // Get all projects created by the authenticated client
    public function myProjects()
    {
        // Only fetch projects where client_id matches the logged-in client
        $clientId = Auth::user()->id;

        $projects = Project::with(['assignedFreelancer', 'category'])
                    ->where('client_id', $clientId)
                    ->where('status', 'Open')
                    ->get();

        return response()->json($projects, 200);
    }
}
