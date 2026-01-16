<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;

class AdminApplicationsController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status'); // string
        $jobId = $request->query('job_id');
        $candidateId = $request->query('candidate_id');
        $limit = (int) $request->query('limit', 20);

        $query = Application::query()
            ->with(['candidate:id,name,email,phone,role', 'job:id,title,location,company_name,employer_id,is_active']);

        if ($status) $query->where('status', $status);
        if ($jobId) $query->where('job_id', $jobId);
        if ($candidateId) $query->where('candidate_id', $candidateId);

        return response()->json($query->latest()->paginate($limit));
    }

    public function show($id)
    {
        $app = Application::with([
            'candidate:id,name,email,phone,role',
            'job'
        ])->findOrFail($id);

        return response()->json(['application' => $app]);
    }

    public function setStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => ['required','string','max:50'],
        ]);

        $app = Application::findOrFail($id);
        $app->status = $data['status'];
        $app->save();

        return response()->json(['message' => 'Updated', 'application' => $app]);
    }
}
