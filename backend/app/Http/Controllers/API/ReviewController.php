<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AssignedProject;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // List all reviews
    public function index()
    {
        $reviews = Review::with(['project', 'client', 'freelancer'])->get();
        return response()->json($reviews, 200);
    }

    // Show a single review by ID
    public function show($id)
    {
        $review = Review::with(['project', 'client', 'freelancer'])->findOrFail($id);
        return response()->json($review, 200);
    }

    // Create a new review (only clients can create reviews after a project is completed)
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'rating'     => 'required|integer|min:1|max:5',
            'text'       => 'required|string',
        ]);

        // Find the assignment for this project for the authenticated client
        $assignment = AssignedProject::where('project_id', $validatedData['project_id'])
            ->where('client_id', Auth::user()->id)
            ->first();

        if (!$assignment) {
            return response()->json(['error' => 'No assignment found for this project with your client id.'], 404);
        }

        // Optionally, ensure that the project is marked as Completed before reviewing
        if ($assignment->status !== 'Completed') {
            return response()->json(['error' => 'Project is not completed yet. You can only review after completion.'], 400);
        }

        // Set freelancer_id from the assignment and client_id from the authenticated user
        $validatedData['freelancer_id'] = $assignment->freelancer_id;
        $validatedData['client_id'] = Auth::user()->id;

        $review = Review::create($validatedData);

        // Optionally, update the assignment to reference the review
        $assignment->review_id = $review->id;
        $assignment->save();

        return response()->json($review, 201);
    }

    // Update an existing review
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validatedData = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'text'   => 'sometimes|string',
        ]);

        $review->update($validatedData);

        return response()->json($review, 200);
    }

    // Delete a review
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review deleted'], 200);
    }

    public function getByClient()
    {
        // Get the authenticated client's ID from the logged-in user.
        $clientId = Auth::user()->id;
        $reviews = Review::where('client_id', $clientId)->get();
        return response()->json($reviews, 200);
    }

    public function getByFreelancer()
    {
        // Get the authenticated freelancer's ID from the logged-in user.
        $freelancerId = Auth::user()->id;
        $reviews = Review::where('freelancer_id', $freelancerId)->get();
        return response()->json($reviews, 200);
    }
}