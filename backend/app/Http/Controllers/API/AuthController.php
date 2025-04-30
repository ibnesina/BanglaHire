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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class AuthController extends Controller
{
    // Register a new user with email verification
    public function register(Request $request) {
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

        // Create the associated role record
        switch ($user->type) {
            case 'Freelancer':
                Freelancer::create([
                    'freelancer_id' => $user->id,
                ]);
                break;
            case 'Client':
                Client::create([
                    'client_id' => $user->id,
                ]);
                break;
            case 'Admin':
                Admin::create([
                    'admin_id' => $user->id,
                ]);
                break;
            default:
                // You can throw an exception, log an error, or handle it as needed
                throw new \InvalidArgumentException("Invalid user type: {$user->type}");
        
        }


        // Send the email verification notification
        $user->sendEmailVerificationNotification();

        // Create a Sanctum token for API authentication
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'    => $user,
            'token'   => $token,
            'message' => 'Registration successful. Please check your email to verify your account.',
        ], 201);
    }

    // Email Verification
    public function emailVerification($id, $hash)
    {
        $user = User::findOrFail($id);

        $expected = hash_hmac(
            'sha256',
            $user->getEmailForVerification(),
            config('app.key')
        );

        if (! hash_equals($expected, (string) $hash)) {
            return redirect()
                ->away(config('app.frontend_url')
                . '/email-verification?error=Invalid verification link.');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()
                ->away(config('app.frontend_url')
                . '/email-verification?message=Email already verified.');
        }

        $user->markEmailAsVerified();

        return redirect()
            ->away(config('app.frontend_url')
            . '/email-verification?message=Email verified successfully.');
    }


    // Login the user and return their info along with associated role data
    public function login(Request $request) {
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

        // Check if the user's email is verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Please verify your email address before logging in.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Load the associated role data based on the user's type
        // $roleData = null;
        // if ($user->type === 'Freelancer') {
        //     $roleData = $user->freelancer;
        // } elseif ($user->type === 'Client') {
        //     $roleData = $user->client;
        // } elseif ($user->type === 'Admin') {
        //     $roleData = $user->admin;
        // }

        return response()->json([
            'message'   => 'Login successful',
            'user'      => $user,
            // 'role_data' => $roleData,
            'token'     => $token,
        ]);
    }

    
    // Return the user data based on the token provided in the Authorization header
    public function me(Request $request)
    {
        return $request->user();
    }

    private const EMAIL_VALIDATION_RULE = 'required|email|exists:users,email';
    // Send a password reset link to the user's email
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => self::EMAIL_VALIDATION_RULE,
        ]);

        // Send the password reset link via the Password broker
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent!'], 200);
        }

        return response()->json(['error' => 'Unable to send reset link'], 500);
    }

    // Change password from link
    public function passwordChange(Request $request)
    {
        $request->validate([
            'token'                 => 'required',
            'email'                 => self::EMAIL_VALIDATION_RULE,
            'password'              => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successful'], 200);
        }

        return response()->json(['error' => 'Password reset failed'], 500);
    }

    // Reset the password using the reset token
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'        => self::EMAIL_VALIDATION_RULE,
            'old_password' => 'required|string',
            'password'     => 'required|string|min:8|confirmed',
        ]);
    
        // Fetch the user by email
        $user = User::where('email', $request->email)->first();
    
        // Verify the provided old password
        if (! Hash::check($request->old_password, $user->password)) {
            return response()->json(['error' => 'Old password does not match.'], 422);
        }
    
        // Check if the new password is the same as the old one
        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'The new password cannot be the same as the old password.'
            ], 422);
        }
    
        // Update the user's password
        $user->password = Hash::make($request->password);
        $user->save();
    
        return response()->json(['message' => 'Password updated successfully'], 200);
        
    }

    // Logout user by revoking Sanctum tokens
    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }

    // Google login
    // Redirect the user to Google for authentication.
    public function redirectToGoogle()
    {
        // Build Google OAuth URL (adjust scopes and parameters as needed)
        $query = http_build_query([
            'client_id'     => env('GOOGLE_CLIENT_ID'),
            'redirect_uri'  => env('GOOGLE_REDIRECT_URI'),
            'response_type' => 'code',
            'scope'         => 'openid profile email',
        ]);
        return redirect()->away('https://accounts.google.com/o/oauth2/auth?' . $query);
    }

    // Handle the Google OAuth callback.
    public function handleGoogleCallback(Request $request)
    {
        $result = null;

        try {
            Log::info('Google OAuth Callback Data:', $request->all());

            // Step 1: Exchange the authorization code for an access token.
            $code = $request->get('code');
            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'code'          => $code,
                'client_id'     => env('GOOGLE_CLIENT_ID'),
                'client_secret' => env('GOOGLE_CLIENT_SECRET'),
                'redirect_uri'  => env('GOOGLE_REDIRECT_URI'),
                'grant_type'    => 'authorization_code',
            ]);

            if ($response->failed()) {
                Log::error('Failed to get access token', ['error' => $response->body()]);
                $result = response()->json(['error' => 'Unable to login with Google'], 500);
            } else {
                $tokens = $response->json();
                $accessToken = $tokens['access_token'];
                Log::info('Google Tokens:', ['accessToken' => $accessToken]);

                // Step 2: Retrieve user information using the access token.
                $userResponse = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v3/userinfo');
                if ($userResponse->failed()) {
                    Log::error('Failed to fetch user info', ['error' => $userResponse->body()]);
                    $result = response()->json(['error' => 'Unable to fetch user data'], 500);
                } else {
                    $googleUser = $userResponse->json();
                    Log::info('Google User Data:', ['googleUser' => $googleUser]);

                    // Step 3: Check if the user exists by Google ID or email.
                    $user = User::where('google_id', $googleUser['sub'])
                                ->orWhere('email', $googleUser['email'])
                                ->first();

                    if (!$user) {
                        // If the user does not exist, store the Google user data in session and redirect to role selection.
                        session([
                            'google_user'  => $googleUser,
                            'access_token' => $accessToken
                        ]);
                        $result = redirect()->route('role.selection');
                    } else {
                        // If the user exists, log them in and return the authentication token.
                        Auth::login($user);
                        $token = $user->createToken('auth_token')->plainTextToken;
                        $result = response()->json([
                            'user'  => $user,
                            'token' => $token,
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Google login error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $result = response()->json(['error' => 'Unable to login with Google'], 500);
        }

        return $result;
    }


    // Show the role selection response.
    // Since this is API-only, we return JSON that instructs the frontend to display a role selection UI.
    public function showRoleSelection()
    {
        return response()->json([
            'message' => 'Please select your role',
            'roles'   => ['Freelancer', 'Client', 'Admin']
        ]);
    }

    // Complete registration with the selected role.
    public function completeRegistration(Request $request)
    {
        $validatedData = $request->validate([
            'role' => 'required|in:Freelancer,Client,Admin',
        ]);

        $googleUser = session('google_user');

        if (!$googleUser) {
            return response()->json(['error' => 'Google user data not found. Please login again.'], 400);
        }

        // Create the user with the selected role.
        $user = User::create([
            'id'        => (string) Str::uuid(),
            'name'      => $googleUser['name'],
            'email'     => $googleUser['email'],
            'google_id' => $googleUser['sub'],
            'password'  => '', // No password needed for Google login.
            'type'      => $validatedData['role'],
        ]);

        // Create the associated role record.
        if ($validatedData['role'] === 'Freelancer') {
            Freelancer::create(['freelancer_id' => $user->id]);
        } elseif ($validatedData['role'] === 'Client') {
            Client::create(['client_id' => $user->id]);
        } elseif ($validatedData['role'] === 'Admin') {
            Admin::create(['admin_id' => $user->id]);
        }

        Auth::login($user);
        session()->forget(['google_user', 'access_token']);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

}
