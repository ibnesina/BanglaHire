<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Freelancer;
use App\Models\Client;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;


class AuthController extends Controller
{
    // Register a new user
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'type'     => 'required|in:Admin,Freelancer,Client',
        ]);

        // Create the user record
        $user = User::create([
            'id'       => (string) Str::uuid(),
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'type'     => $request->type,
        ]);

        // Automatically create the associated role record using the user id as a foreign key
        switch ($user->type) {
            case 'Freelancer':
                Freelancer::create([
                    'freelancer_id' => $user->id,
                    // Optionally, set default values for other freelancer fields here.
                ]);
                break;

            case 'Client':
                Client::create([
                    'client_id' => $user->id,
                    // Optionally, set default values for other client fields here.
                ]);
                break;

            case 'Admin':
                Admin::create([
                    'admin_id' => $user->id,
                    // Optionally, set default values for other admin fields here.
                ]);
                break;
        }

        // Create a Sanctum token for API authentication
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login the user and return their info along with the associated role data.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Load the associated role data based on the user's type.
        $roleData = null;
        if ($user->type === 'Freelancer') {
            $roleData = $user->freelancer;  // retrieves the Freelancer record
        } elseif ($user->type === 'Client') {
            $roleData = $user->client;      // retrieves the Client record
        } elseif ($user->type === 'Admin') {
            $roleData = $user->admin;       // retrieves the Admin record
        }

        return response()->json([
            'message'   => 'Login successful',
            'user'      => $user,
            'role_data' => $roleData,
            'token'     => $token,
        ]);
    }

    // Logout user
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }
}
