<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\CandidateApplicationController;
use App\Http\Controllers\Api\CandidateProfileController;

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
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // ✅ frontend expects: POST /api/auth/set-role
    Route::post('/auth/set-role', [AuthController::class, 'selectRole']);
Route::get('/candidate/profile', [CandidateProfileController::class, 'show']);
    Route::post('/candidate/profile', [CandidateProfileController::class, 'upsert']);
    // Employer
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs/{job}/applications', [ApplicationController::class, 'index']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

    // Candidate
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
    Route::get('/candidate/applications', [CandidateApplicationController::class, 'index']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
