<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
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
