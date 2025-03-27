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
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Http;


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
        // Sanctum Token: After successfully authenticating, we generate a Sanctum token for the user, which they can use for subsequent API requests.
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

    // Google login
    // This still uses Socialite to redirect the user to Google for authentication.
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }


    // Handle Google callback (manually handle the OAuth code exchange) 
    // Instead of directly calling Socialite's user() method, we manually handle the authorization code (code), and use it to request an access token and user data from Google’s API.
    // After receiving the user data, we check if the user exists in the database. If not, we create the user and associate them with the correct role (Freelancer, Client, Admin).
    public function handleGoogleCallback(Request $request)
    {
        try {
            \Log::info('Google OAuth Callback Data:', request()->all());
            
            // Step 1: Exchange the authorization code for an access token
            $code = $request->get('code');
            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => env('GOOGLE_CLIENT_ID'),
                'client_secret' => env('GOOGLE_CLIENT_SECRET'),
                'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
                'grant_type' => 'authorization_code',
            ]);
    
            if ($response->failed()) {
                \Log::error('Failed to get access token', ['error' => $response->body()]);
                return response()->json(['error' => 'Unable to login with Google'], 500);
            }
    
            $tokens = $response->json();
            $accessToken = $tokens['access_token'];
    
            \Log::info('Google Tokens:', ['accessToken' => $accessToken]);
    
            // Step 2: Retrieve user information using the access token
            $userResponse = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v3/userinfo');
    
            if ($userResponse->failed()) {
                \Log::error('Failed to fetch user info', ['error' => $userResponse->body()]);
                return response()->json(['error' => 'Unable to fetch user data'], 500);
            }
    
            $googleUser = $userResponse->json();
            \Log::info('Google User Data:', ['googleUser' => $googleUser]);
    
            // Step 3: Retrieve the role passed from frontend (either 'Client' or 'Freelancer')
            $role = session()->get('role', 'No Role'); // Default to 'No Role' if not found
            // $role = 'Freelancer';
            // $role = 'Client';
            // $role = 'Admin';
            
            /*
                // When user clicks on the Freelancer button
                document.getElementById("freelancer-btn").onclick = function() {
                    // Save the selected role (Freelancer in this case)
                    sessionStorage.setItem('role', 'Freelancer');
                    // Redirect to Google OAuth
                    window.location.href = "url";  // or use the Google redirect URL
                };

                // When user clicks on the Client button
                document.getElementById("client-btn").onclick = function() {
                    // Save the selected role (Client in this case)
                    sessionStorage.setItem('role', 'Client');
                    // Redirect to Google OAuth
                    window.location.href = "url";  // or use the Google redirect URL
                };

            */
    
            \Log::info('Role Received:', ['role' => $role]);
    
            // Validate the role
            $validRoles = ['Freelancer', 'Client','Admin'];
            if (!in_array($role, $validRoles)) {
                \Log::error('Invalid role provided', ['role' => $role]);
                return response()->json(['error' => 'Invalid role'], 400);
            }
    
            // Step 4: Check if the user already exists by Google ID or email
            $user = User::where('google_id', $googleUser['sub'])->orWhere('email', $googleUser['email'])->first();
    
            if (!$user) {
                // Create the user if not exists
                $user = User::create([
                    'id'        => (string) Str::uuid(),
                    'name'      => $googleUser['name'],
                    'email'     => $googleUser['email'],
                    'google_id' => $googleUser['sub'],
                    'password'  => '', // No password needed for Google login
                    'type'      => $role, // Use the selected role ('Freelancer' or 'Client')
                ]);
    
                // Create associated role record
                if ($user->type === 'Freelancer') {
                    Freelancer::create(['freelancer_id' => $user->id]);
                } elseif ($user->type === 'Client') {
                    Client::create(['client_id' => $user->id]);
                } elseif ($user->type === 'Admin') {
                    Admin::create(['admin_id' => $user->id]);
                }
            }
    
            // Step 5: Log the user in
            Auth::login($user);
    
            // Step 6: Create a Sanctum token for the logged-in user
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'user'  => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            \Log::error('Google login error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Unable to login with Google'], 500);
        }
    }
    
    
    
    
    
    
    
    

    

}
