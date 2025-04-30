<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LocalJob;
use Illuminate\Support\Facades\Auth;

class LocalJobController extends Controller
{
    // List all job posts
    public function index()
    {
        $jobs = LocalJob::all();
        return response()->json($jobs);
    }

    // Show a single job post
    public function show($id)
    {
        $job = LocalJob::findOrFail($id);
        return response()->json($job);
    }

    // Create a new job post (clients only)
    public function store(Request $request)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'category'     => 'required|in:Photography,Tutoring,Cooking',
            'location'     => 'required|string|max:255',
            'payment_type' => 'required|in:Fixed,Hourly',
            'budget'       => 'required|numeric',
            'status'       => 'nullable|in:Open,In Progress,Closed'
        ]);

        // Set the client_id from the auth user
        $validated['client_id'] = Auth::user()->id;

        // Create the local job post. The job_id is auto-generated.
        $job = LocalJob::create($validated);

        return response()->json($job, 201);
    }

    // Update an existing job post
    public function update(Request $request, $id)
    {
        $job = LocalJob::findOrFail($id);

        // Validate update data
        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'description'  => 'sometimes|required|string',
            'category'     => 'sometimes|required|in:Photography,Tutoring,Cooking',
            'location'     => 'sometimes|required|string|max:255',
            'payment_type' => 'sometimes|required|in:Fixed,Hourly',
            'budget'       => 'sometimes|required|numeric',
            'status'       => 'sometimes|required|in:Open,In Progress,Closed'
        ]);

        $job->update($validated);

        return response()->json($job);
    }

    // Delete a job post
    public function destroy($id)
    {
        $job = LocalJob::findOrFail($id);
        $job->delete();

        return response()->json(['message' => 'Job deleted successfully']);
    }
}

