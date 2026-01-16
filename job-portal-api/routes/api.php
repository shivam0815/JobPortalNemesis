<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\CandidateApplicationController;
use App\Http\Controllers\Api\CandidateProfileController;

// ✅ Admin Controllers
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminUsersController;
use App\Http\Controllers\Api\Admin\AdminJobsController;
use App\Http\Controllers\Api\Admin\AdminApplicationsController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/ping', fn () => response()->json(['message' => 'API working']));

Route::post('/auth/google', [AuthController::class, 'google']);

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/suggestions', [JobController::class, 'suggestions']);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {

    // ✅ Admin login (public)
    Route::post('/auth/login', [AdminAuthController::class, 'login']);

    // ✅ Admin protected
    Route::middleware(['is_admin'])->group(function () {

        Route::get('/auth/me', [AdminAuthController::class, 'me']);
        Route::post('/auth/logout', [AdminAuthController::class, 'logout']);

        // Dashboard summary cards
        Route::get('/dashboard/summary', [AdminDashboardController::class, 'summary']);

        // Customers (Candidates)
        Route::get('/customers', [AdminUsersController::class, 'customers']);

        // Employees (Employers)
        Route::get('/employees', [AdminUsersController::class, 'employees']);

        // Single user detail (any role)
        Route::get('/users/{id}', [AdminUsersController::class, 'show']);

        // Jobs
        Route::get('/jobs', [AdminJobsController::class, 'index']);
        Route::get('/jobs/{id}', [AdminJobsController::class, 'show']);
        Route::patch('/jobs/{id}/active', [AdminJobsController::class, 'setActive']); // { is_active: true/false }

        // Applications
        Route::get('/applications', [AdminApplicationsController::class, 'index']);
        Route::get('/applications/{id}', [AdminApplicationsController::class, 'show']);
        Route::patch('/applications/{id}/status', [AdminApplicationsController::class, 'setStatus']); // { status: "shortlisted" }
    });
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // ✅ frontend expects: POST /api/auth/set-role
    Route::post('/auth/set-role', [AuthController::class, 'selectRole']);

    // Candidate Profile
    Route::get('/candidate/profile', [CandidateProfileController::class, 'show']);
    Route::post('/candidate/profile', [CandidateProfileController::class, 'upsert']);

    // Employer
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs/{job}/applications', [ApplicationController::class, 'index']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

    // Candidate
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
    Route::get('/candidate/applications', [CandidateApplicationController::class, 'index']);

    // Logout (all roles)
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
