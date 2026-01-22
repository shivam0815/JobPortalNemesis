<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\CandidateApplicationController;
use App\Http\Controllers\Api\CandidateProfileController;
use App\Http\Controllers\Api\CompanyFollowController;
use App\Http\Controllers\Api\Chat\ChatRoomController;
use App\Http\Controllers\Api\Chat\ChatMessageController;
use App\Http\Controllers\Api\SuggestionController;

// ✅ Admin Controllers
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminUsersController;
use App\Http\Controllers\Api\Admin\AdminJobsController;
use App\Http\Controllers\Api\Admin\AdminApplicationsController;
use App\Http\Controllers\Api\EmployerProfileController;
use App\Http\Controllers\Api\HomeController;

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\Admin\AdminContactMessageController;
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/ping', fn () => response()->json(['message' => 'API working']));
Route::get('/active-companies', [JobController::class, 'activeCompanies']);
Route::get('/active-companies', [HomeController::class, 'activeCompanies']);
Route::post('/auth/google', [AuthController::class, 'google']);
Route::post('/contact', [ContactMessageController::class, 'store']);

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/suggestions', [SuggestionController::class, 'index']);

// Email OTP Auth (public)
Route::post('/auth/email/request-otp', [AuthController::class, 'requestEmailOtp']);
Route::post('/auth/email/verify-otp', [AuthController::class, 'verifyEmailOtp']);
Route::post('/auth/email/set-password', [AuthController::class, 'setPasswordAfterOtp']);
Route::post('/auth/login', [AuthController::class, 'loginWithPassword']);

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
// Contact Messages (Admin)
Route::get('/contact-messages', [AdminContactMessageController::class, 'index']);
Route::get('/contact-messages/{id}', [AdminContactMessageController::class, 'show']);
Route::patch('/contact-messages/{id}/status', [AdminContactMessageController::class, 'updateStatus']);
Route::delete('/contact-messages/{id}', [AdminContactMessageController::class, 'destroy']);

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
Route::get('/employer/jobs', [JobController::class, 'myJobs']);

    // Candidate Profile
    Route::get('/candidate/profile', [CandidateProfileController::class, 'show']);
    Route::post('/candidate/profile', [CandidateProfileController::class, 'upsert']);
    // Follow company
Route::post('/company/follow', [CompanyFollowController::class, 'follow']);
Route::post('/company/unfollow', [CompanyFollowController::class, 'unfollow']);
Route::get('/company/follows', [CompanyFollowController::class, 'myFollows']);

    // Employer
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs/{job}/applications', [ApplicationController::class, 'index']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);
// Employer company profile
Route::get('/employer/profile', [EmployerProfileController::class, 'show']);
Route::post('/employer/profile', [EmployerProfileController::class, 'update']);

    // Candidate
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
    Route::get('/candidate/applications', [CandidateApplicationController::class, 'index']);

Route::post('/company/follow', [CompanyFollowController::class, 'follow']);
Route::post('/company/unfollow', [CompanyFollowController::class, 'unfollow']);
Route::get('/company/follows', [CompanyFollowController::class, 'myFollows']);

 Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);

Route::get('/chat/rooms', [ChatRoomController::class, 'index']);
Route::post('/chat/rooms/{room}/join', [ChatRoomController::class, 'join']);
Route::get('/chat/rooms/{room}/messages', [ChatMessageController::class, 'index']);
Route::post('/chat/rooms/{room}/messages', [ChatMessageController::class, 'store']);


    // Logout (all roles)
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
