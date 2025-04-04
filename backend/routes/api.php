<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AssignedProjectController;
use App\Http\Controllers\API\AssignedProjectRequestController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BiddingController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\FreelancerController;
use App\Http\Controllers\API\LocalJobController;
use App\Http\Controllers\API\PaymentHistoryController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ReviewController;

// Public Routes

// Registration & Login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Forgot & Reset Password
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Email Verification Route
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'emailVerification'])->middleware('signed')->name('verification.verify');
Route::get('/reset-password/{token}', function (Request $request, $token) {
    return response()->json([
        'message' => 'Password reset link is valid. Use the token to reset your password via your client application.',
        'token'   => $token,
        'email'   => $request->query('email')
    ]);
})->name('password.reset');

// // Redirect to Google for authentication
// Route::get('login/google', [AuthController::class, 'redirectToGoogle']);

// // Callback route to handle Google response
// Route::get('login/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::middleware(['web'])->group(function () {
    Route::get('login/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('login/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// // Route to redirect to Google
// Route::get('login/google', [AuthController::class, 'redirectToGoogle'])->name('login.google');

// // Route to handle the Google OAuth callback
// Route::get('login/google/callback', [AuthController::class, 'handleGoogleCallback']);


// Freelancer section
Route::get('/freelancers', [FreelancerController::class, 'index']);
Route::get('/freelancers/{id}', [FreelancerController::class, 'show']);

// Client section
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/clients/{id}', [ClientController::class, 'show']);

// Projects section
Route::get('/projects', [ProjectController::class, 'index']);         
Route::get('/projects/{id}', [ProjectController::class, 'show']);

// Local Jobs section
Route::get('/local-jobs', [LocalJobController::class, 'index']);
Route::get('/local-jobs/{id}', [LocalJobController::class, 'show']);


// Protected Routes
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Assigned Projects routes (visible to all authenticated users)
    Route::get('/assignments', [AssignedProjectController::class, 'index']);
    Route::get('/assignments/{id}', [AssignedProjectController::class, 'show']);

    // Reviews routes
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/{id}', [ReviewController::class, 'show']);

    // Admin-only routes
    Route::middleware('role:Admin')->group(function () {
        // Profile
        Route::get('/admin-dashboard', function () {
            return response()->json(['message' => 'Welcome, Admin']);
        });
        Route::get('/admins', [AdminController::class, 'index']);
        Route::get('/admins/{id}', [AdminController::class, 'show']);

        // update the admin record
        Route::put('/admins', [AdminController::class, 'storeOrUpdate']);

        // Delete an admin record
        Route::delete('/admins/{id}', [AdminController::class, 'destroy']);

        // Update stats for a specific admin
        Route::put('/admins/{id}/update-stats', [AdminController::class, 'updateStats']);

        // Freelancer and Client Control
        Route::put('/freelancers/{id}/update-stats', [FreelancerController::class, 'updateStats']);
        Route::put('/clients/{id}/update-stats', [ClientController::class, 'updateStats']);

        // Payment History endpoints
        Route::get('/payments', [PaymentHistoryController::class, 'index']);
        Route::get('/payments/{id}', [PaymentHistoryController::class, 'show']);
        // Note: We no longer use PaymentHistoryController::store because payment records are auto-created on assignment completion.
        Route::put('/payments/{id}', [PaymentHistoryController::class, 'update']);
        Route::delete('/payments/{id}', [PaymentHistoryController::class, 'destroy']);
    });

    // Freelancer-only routes
    Route::middleware('role:Freelancer')->group(function () {
        // Profile
        Route::get('/freelancer-dashboard', function () {
            return response()->json(['message' => 'Welcome, Freelancer']);
        });
        Route::put('/freelancers', [FreelancerController::class, 'store']);
        Route::delete('/freelancers/{id}', [FreelancerController::class, 'destroy']);

        // Projects
        Route::post('projects/{projectId}/apply', [BiddingController::class, 'store']);

        // Fetch reviews by freelancer ID for profile views
        Route::get('/freelancer-reviews', [ReviewController::class, 'getByFreelancer']);

        // Endpoints to get payments for authenticated freelancers
        Route::get('/freelancer-payments', [PaymentHistoryController::class, 'getFreelancerPayments'])->middleware('role:Freelancer');

        // Project Request creation
        Route::get('project-requests', [AssignedProjectRequestController::class, 'index']);
        Route::patch('project-requests/{id}', [AssignedProjectRequestController::class, 'update']);
        Route::get('project-requests/{id}', [AssignedProjectRequestController::class, 'show']);
    });

    // Client-only routes
    Route::middleware('role:Client')->group(function () {
        // Profile
        Route::get('/client-dashboard', function () {
            return response()->json(['message' => 'Welcome, Client']);
        });
        Route::put('/clients', [ClientController::class, 'store']);
        Route::delete('/clients/{id}', [ClientController::class, 'destroy']);

        // Projects
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{id}', [ProjectController::class, 'update']);
        Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

        // Only clients can create, update, or delete assignments (project assignment is done by the client who created the project)
        Route::post('/assignments', [AssignedProjectController::class, 'store']);
        Route::put('/assignments/{id}', [AssignedProjectController::class, 'update']);
        Route::delete('/assignments/{id}', [AssignedProjectController::class, 'destroy']);

        // Only clients can submit, update, or delete reviews after a project is completed
        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::put('/reviews/{id}', [ReviewController::class, 'update']);
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

        // Fetch reviews by client ID for profile views
        Route::get('/client-reviews', [ReviewController::class, 'getByClient']);
    
        // Endpoints to get payments for authenticated clients
        Route::get('/client-payments', [PaymentHistoryController::class, 'getClientPayments'])->middleware('role:Client');

        // Local Jobs section
        Route::post('/local-jobs', [LocalJobController::class, 'store']);
        Route::put('/local-jobs/{id}', [LocalJobController::class, 'update']);
        Route::delete('/local-jobs/{id}', [LocalJobController::class, 'destroy']);

        // Project Request creation
        Route::post('project-requests', [AssignedProjectRequestController::class, 'store']);
    });






});