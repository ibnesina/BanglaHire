<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Create or update an Admin record.
     * Multiple users can be Admin, so each user with type="Admin" can have a row in `admins`.
     */
    public function storeOrUpdate(Request $request)
    {
        $request->validate([
            'department' => 'nullable|string|max:255',
            'role_level' => 'nullable|string|max:255',
            'is_super_admin' => 'nullable|boolean',
        ]);

        $user = Auth::user();

        // Ensure this user is actually an Admin
        // (Our system has only 1 role, but multiple users can have it)
        if ($user->type !== 'Admin') {
            return response()->json(['message' => 'Unauthorized. Only Admin users can do this.'], 403);
        }

        // Update or create the admin record for this user
        $admin = Admin::updateOrCreate(
            ['admin_id' => $user->id],
            $request->only(['department', 'role_level', 'is_super_admin'])
        );

        return response()->json([
            'message' => 'Admin record updated successfully.',
            'admin'   => $admin
        ]);
    }

    /**
     * Retrieve a single Admin record by ID.
     */
    public function show($id)
    {
        // e.g. /api/admins/{id}
        $admin = Admin::with('user')->findOrFail($id);
        return response()->json($admin);
    }

    /**
     * Retrieve all Admin records (all users with type="Admin").
     */
    public function index()
    {
        $admins = Admin::with('user')->get();
        return response()->json($admins);
    }

    /**
     * Delete an Admin record by ID.
     */
    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();

        return response()->json(['message' => 'Admin record deleted successfully.']);
    }

    /**
     * Example method: Update or retrieve platform-wide stats (optional).
     */
    public function updateStats(Request $request, $id)
    {
        // For demonstration, we can do real queries to count users, projects, etc.
        // Then store them in the `admins` table or just return them.

        $admin = Admin::findOrFail($id);
        // Example pseudo-code:
        // $admin->total_users = User::count();
        // $admin->last_updated = now();
        // $admin->save();

        return response()->json(['message' => 'Admin stats updated successfully.']);
    }
}
