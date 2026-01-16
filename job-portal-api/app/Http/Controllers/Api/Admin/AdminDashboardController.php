<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;

class AdminDashboardController extends Controller
{
    public function summary()
    {
        $today = Carbon::today();

        return response()->json([
            'totals' => [
                'customers' => User::where('role','candidate')->count(),
                'employees' => User::where('role','employer')->count(),
                'jobs' => Job::count(),
                'active_jobs' => Job::where('is_active', true)->count(),
                'applications' => Application::count(),
            ],
            'today' => [
                'new_customers' => User::where('role','candidate')->whereDate('created_at', $today)->count(),
                'new_employees' => User::where('role','employer')->whereDate('created_at', $today)->count(),
                'new_jobs' => Job::whereDate('created_at', $today)->count(),
                'new_applications' => Application::whereDate('created_at', $today)->count(),
            ]
        ]);
    }
}
