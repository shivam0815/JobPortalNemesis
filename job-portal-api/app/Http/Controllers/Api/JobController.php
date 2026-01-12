<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use App\Models\Suggestion;

class JobController extends Controller
{
    public function store(Request $request)
{
    $data = $request->validate([
        'employer_id' => 'required|exists:users,id',

        'title'       => 'required|string|max:255',
        'description' => 'required|string',
        'location'    => 'required|string|max:255',

        'job_type'    => 'nullable|string|max:50',
        'salary_min'  => 'nullable|integer',
        'salary_max'  => 'nullable|integer',

        // PDF fields
        'job_area'    => 'nullable|string|max:255',
        'total_experience' => 'nullable|string|max:50',
        'monthly_inhand_salary' => 'nullable|integer',
        'bonus' => 'nullable|boolean',

        // ✅ skills JSON array
        'skills' => 'nullable|array',
        'skills.*' => 'string|max:50',

        'age' => 'nullable|string|max:50',
        'preferred_language' => 'nullable|string|max:100',
        'assets' => 'nullable|string|max:255',

        'degree_specialisation' => 'nullable|string|max:255',
        'certification' => 'nullable|string|max:255',
        'preferred_industry' => 'nullable|string|max:255',

        'job_timings' => 'nullable|string|max:255',
        'interview_details' => 'nullable|string|max:500',

        'company_name' => 'nullable|string|max:255',
        'contact_person_name' => 'nullable|string|max:255',
        'contact_phone' => 'nullable|string|max:30',
        'contact_email' => 'nullable|email|max:255',

        'contact_person_profile' => 'nullable|string|max:50',
        'org_size' => 'nullable|string|max:50',
        'fill_urgency' => 'nullable|string|max:50',
        'hiring_frequency' => 'nullable|string|max:50',

        'job_address' => 'nullable|string',
    ]);

    if (!array_key_exists('bonus', $data) || $data['bonus'] === null) {
        $data['bonus'] = false;
    }

    $job = Job::create($data);
// ✅ store global suggestions (shared)
$this->saveSuggestion('job_title', $data['title'] ?? null, null);
$this->saveSuggestion('job_location', $data['location'] ?? null, null);
$this->saveSuggestion('job_area', $data['job_area'] ?? null, null);

    return response()->json([
        'message' => 'Job created successfully',
        'job' => $job,
    ], 201);
}


    public function index()
    {
        $jobs = Job::where('is_active', true)->latest()->get();
        return response()->json($jobs);
    }

    public function show($id)
    {
        $job = Job::where('is_active', true)->findOrFail($id);
        return response()->json($job);
    }

private function saveSuggestion(string $field, ?string $value, ?int $tenantId = null): void
{
    $v = trim((string) $value);
    if ($v === '') return;

    // normalize extra spaces
    $v = preg_replace('/\s+/', ' ', $v);

    $row = Suggestion::where('field', $field)
        ->where('value', $v)
        ->where('tenant_id', $tenantId)
        ->first();

    if ($row) {
        $row->increment('hits');
        $row->last_used_at = now();
        $row->save();
    } else {
        Suggestion::create([
            'field' => $field,
            'value' => $v,
            'tenant_id' => $tenantId, // keep null for global shared suggestions
            'hits' => 1,
            'last_used_at' => now(),
        ]);
    }
}

public function suggestions(Request $request)
{
    $field = trim((string) $request->query('field', ''));
    $q = trim((string) $request->query('q', ''));
    $limit = (int) $request->query('limit', 10);

    if ($field === '') {
        return response()->json(['message' => 'field is required'], 422);
    }

    $allowed = ['job_title', 'job_location', 'job_area'];
    if (!in_array($field, $allowed, true)) {
        return response()->json(['message' => 'invalid field'], 422);
    }

    $limit = max(1, min($limit, 20));

    // GLOBAL suggestions (tenant_id = NULL)
    $query = Suggestion::query()
        ->where('field', $field)
        ->whereNull('tenant_id');

    if ($q !== '') {
        $query->where('value', 'like', $q . '%');
    }

    $values = $query->orderByDesc('hits')
        ->orderByDesc('last_used_at')
        ->limit($limit)
        ->pluck('value');

    return response()->json($values);
}





}
