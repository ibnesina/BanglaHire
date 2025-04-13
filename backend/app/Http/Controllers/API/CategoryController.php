<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Freelancer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of all categories.
     */
    public function index()
    {
        // Return all categories. Skills will be returned as a JSON array.
        $categories = Category::all();
        return response()->json($categories, 200);
    }

     /**
     * GET /categories/{id}/skills
     * Returns the skills array for the specified category.
     */
    public function getCategorySkills($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Assuming Category model casts 'skills' as an array, otherwise decode manually.
        return response()->json($category->skills ?? []);
    }

    /**
     * Returns a list of categories with:
     *  - name
     *  - skill_count (how many skills are in this category)
     *  - avg_rating (average rating across all freelancers who belong to this category)
     */
    public function categoriesWithMetrics()
    {
        // 1. Fetch all categories
        $categories = Category::all();

        // 2. Transform each category to include additional info: skill_count & avg_rating
        $categories->transform(function ($category) {
            // (A) Count how many skills exist in the JSON array
            $skillCount = is_array($category->skills) ? count($category->skills) : 0;

            // (B) Find all freelancers for this category,
            //     each with an average rating from their reviews.
            $freelancers = Freelancer::where('category_id', $category->id)
                ->withAvg('reviews', 'rating')
                ->get();

            // (C) Calculate the overall average rating for the category
            //     i.e., the average of each freelancer’s reviews_avg_rating.
            $avgRating = 0;
            if ($freelancers->count() > 0) {
                // Eloquent’s ->withAvg() populates a 'reviews_avg_rating' attribute on each Freelancer model
                // We simply average those
                $avgRating = $freelancers->average('reviews_avg_rating') ?? 0;
            }

            // (D) Attach custom fields to the category object
            $category->skill_count = $skillCount;
            $category->avg_rating  = round($avgRating, 1); // optional rounding

            return $category;
        });

        // Return the enriched categories
        return response()->json($categories, 200);
    }

    /**
     * Display the specified category.
     */
    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json($category, 200);
    }

    /**
     * Store a newly created category.
     * Only accessible by admin users.
     */
    public function store(Request $request)
    {
        // Ensure that only admin users are authorized.
        if (Auth::user()->type !== 'Admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate the incoming request.
        $validator = Validator::make($request->all(), [
            'name'   => 'required|unique:categories,name|max:255',
            'skills' => 'sometimes|array'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create the category, defaulting skills to an empty array if not provided.
        $category = Category::create([
            'name'   => $request->input('name'),
            'skills' => $request->input('skills', [])
        ]);

        return response()->json($category, 201);
    }

    /**
     * Update an existing category.
     * Only accessible by admin users.
     */
    public function update(Request $request, $id)
    {
        // Check admin access.
        if (Auth::user()->type !== 'Admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Validate the incoming update data.
        $validator = Validator::make($request->all(), [
            'name'   => 'required|unique:categories,name,' . $category->id . '|max:255',
            'skills' => 'sometimes|array'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Update the category information.
        $category->update([
            'name'   => $request->input('name'),
            'skills' => $request->input('skills', $category->skills)
        ]);

        return response()->json($category, 200);
    }

    /**
     * Delete a category.
     * Only accessible by admin users.
     */
    public function destroy($id)
    {
        if (Auth::user()->type !== 'Admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}
