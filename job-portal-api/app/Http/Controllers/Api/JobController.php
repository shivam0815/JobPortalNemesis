<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use App\Models\Suggestion;
use App\Models\CompanyFollow;
use App\Models\Notification;

class JobController extends Controller
{
    public function store(Request $request)
{
    $data = $request->validate([


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
$user = $request->user();

// ✅ enforce employer identity
$data['employer_id'] = $user->id;

// ✅ auto-fill company_name from employer profile if missing
if (!isset($data['company_name']) || trim((string)$data['company_name']) === '') {
    $data['company_name'] = $user->company_name;
}

    $job = Job::create($data);
$company = trim((string) ($job->company_name ?? ''));

if ($company !== '') {
    $followers = CompanyFollow::where('company_name', $company)->pluck('user_id');

    if ($followers->count() > 0) {
        $rows = [];

        foreach ($followers as $uid) {
            $rows[] = [
                'user_id' => $uid,
                'type' => 'job_posted',
                'title' => 'New Job Posted',
                'body'  => $company . ' posted: ' . ($job->title ?? 'New opening'),
                'link'  => '/jobs/' . $job->id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // bulk insert (fast)
        Notification::insert($rows);
    }
}


// ✅ store global suggestions (shared)
$this->saveSuggestion('job_title', $data['title'] ?? null, null);
$this->saveSuggestion('job_location', $data['location'] ?? null, null);
$this->saveSuggestion('job_area', $data['job_area'] ?? null, null);

    return response()->json([
        'message' => 'Job created successfully',
        'job' => $job,
    ], 201);
}


   public function index(Request $request)
{
    $q    = trim((string) $request->query('q', ''));
    $city = trim((string) $request->query('city', ''));
    $exp  = trim((string) $request->query('exp', 'All'));
    $mode = trim((string) $request->query('mode', 'All'));

    $jobs = Job::query()
        ->where('is_active', true)

        ->when($q !== '', function ($query) use ($q) {
            $query->where(function ($qq) use ($q) {
                $qq->where('title', 'like', "%{$q}%")
                   ->orWhere('company_name', 'like', "%{$q}%")
                   ->orWhereJsonContains('skills', $q);
            });
        })

        ->when($city !== '', fn ($query) =>
            $query->where('location', 'like', "%{$city}%")
        )

        ->when($exp !== 'All', function ($query) use ($exp) {
            if ($exp === 'Fresher') {
                $query->where(function ($q) {
                    $q->whereNull('total_experience')
                      ->orWhere('total_experience', '0')
                      ->orWhere('total_experience', '0-1');
                });
            }

            if ($exp === 'Experienced') {
                $query->where(function ($q) {
                    $q->whereNotNull('total_experience')
                      ->whereNotIn('total_experience', ['0', '0-1']);
                });
            }
        })

        ->when($mode !== 'All', function ($query) use ($mode) {
            if ($mode === 'WFH') {
                $query->where(function ($q) {
                    $q->where('job_type', 'like', '%WFH%')
                      ->orWhere('job_type', 'like', '%Remote%');
                });
            }

            if ($mode === 'Office') {
                $query->where('job_type', 'like', '%Office%');
            }
        })

        ->latest()
        ->paginate(12);

    return response()->json($jobs);
}


    public function show($id)
    {
        $job = Job::where('is_active', true)->findOrFail($id);
        return response()->json($job);
    }



// GET active hiring companies
public function activeCompanies()
{
    $companies = Job::where('is_active', true)
        ->whereNotNull('company_name')
        ->select('company_name')
        ->selectRaw('COUNT(*) as jobs_count')
        ->groupBy('company_name')
        ->orderByDesc('jobs_count')
        ->limit(10)
        ->get();

    return response()->json($companies);
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


public function myJobs(Request $request)
{
    $user = $request->user();

    if (!$user || $user->role !== 'employer') {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $jobs = Job::query()
        ->where('employer_id', $user->id)
        ->latest()
        ->get([
            'id',
            'title',
            'location',
            'job_type',
            'salary_min',
            'salary_max',
            'total_experience',
        ]);

    return response()->json($jobs);
}





}
