<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    // GET /api/active-companies
    public function activeCompanies(Request $request)
    {
        // company_name null/empty skip
        $rows = Job::query()
            ->select('company_name', DB::raw('COUNT(*) as jobs_count'))
            ->where('is_active', true)
            ->whereNotNull('company_name')
            ->where('company_name', '!=', '')
            ->groupBy('company_name')
            ->orderByDesc('jobs_count')
            ->limit(12)
            ->get()
            ->map(fn ($r) => [
                'company_name' => $r->company_name,
                'jobs_count' => (int) $r->jobs_count,
            ]);

        return response()->json($rows);
    }
}
