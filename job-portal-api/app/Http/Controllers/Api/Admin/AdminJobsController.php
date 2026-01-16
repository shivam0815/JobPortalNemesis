<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\User;

class AdminJobsController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $isActive = $request->query('is_active'); // true/false/null
        $employerId = $request->query('employer_id');
        $limit = (int) $request->query('limit', 20);

        $query = Job::query();

        if ($q !== '') {
            $query->where(function($w) use ($q) {
                $w->where('title', 'like', "%$q%")
                  ->orWhere('location', 'like', "%$q%")
                  ->orWhere('company_name', 'like', "%$q%");
            });
        }

        if (!is_null($isActive)) {
            $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
        }

        if ($employerId) {
            $query->where('employer_id', $employerId);
        }

        // include applications count
        $query->withCount('applications');

        return response()->json($query->latest()->paginate($limit));
    }

    public function show($id)
    {
        $job = Job::withCount('applications')->findOrFail($id);

        // employer basic info (optional)
        $employer = null;
        if ($job->employer_id) {
            $employer = User::select('id','name','email','phone','role')->find($job->employer_id);
        }

        return response()->json([
            'job' => $job,
            'employer' => $employer
        ]);
    }

    public function setActive(Request $request, $id)
    {
        $data = $request->validate([
            'is_active' => ['required','boolean'],
        ]);

        $job = Job::findOrFail($id);
        $job->is_active = $data['is_active'];
        $job->save();

        return response()->json(['message' => 'Updated', 'job' => $job]);
    }
}
