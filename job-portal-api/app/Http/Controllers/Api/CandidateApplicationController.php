<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;

class CandidateApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user(); // Sanctum auth user

        if (!$user || $user->role !== 'candidate') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // ✅ candidate_id is users.id (as per applications migration)
        $applications = Application::query()
            ->where('candidate_id', $user->id)
            ->with(['job:id,title,location,job_type,salary_min,salary_max,total_experience'])
            ->latest()
            ->get();

        return response()->json($applications);
    }
}
