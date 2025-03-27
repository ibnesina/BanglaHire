<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AssignedProjectController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BiddingController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\FreelancerController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ReviewController;
use Illuminate\Support\Facades\Route;

// Public Routes

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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
Route::get('/projects', [ProjectController::class, 'index']);         // public
Route::get('/projects/{id}', [ProjectController::class, 'show']);     // public


// Protected Routes
Route::middleware(['auth:sanctum'])->group(function () {
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
    });






});