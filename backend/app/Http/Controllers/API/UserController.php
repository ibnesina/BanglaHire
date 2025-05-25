<?php

// app/Http/Controllers/API/UserController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        try {
            // Get distinct user IDs from messages where logged-in user is sender or receiver
            $chatUserIds = DB::table('messages')
                ->selectRaw('DISTINCT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as user_id', [$userId])
                ->where('sender_id', $userId)
                ->orWhere('receiver_id', $userId)
                ->pluck('user_id');

            // Fetch users info for those IDs
            $users = User::whereIn('id', $chatUserIds)->get(['id', 'name']);

            return response()->json($users);
        } catch (\Exception $e) {
            \Log::error('Error fetching chatted users: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch chatted users'], 500);
        }
    }
}
