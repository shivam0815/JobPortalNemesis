<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {

    Route::post('/auth/google', [AuthController::class, 'google']);

    Route::post('/select-role', [AuthController::class, 'selectRole'])
        ->middleware('auth:sanctum');

});
