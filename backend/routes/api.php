<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BiddingController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\FreelancerController;
use App\Http\Controllers\API\ProjectController;
use Illuminate\Support\Facades\Route;

// Public Routes

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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
    });
});