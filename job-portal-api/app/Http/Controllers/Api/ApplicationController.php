<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApplicationController extends Controller
{
    /**
     * Candidate applies to a job (FULL PROFILE + RESUME UPLOAD)
     *
     * Route: POST /api/jobs/{job}/apply (auth:sanctum)
     * Content-Type: multipart/form-data
     * Fields:
     *  - Candidate Profile fields (saved in candidates table)
     *  - resume file (pdf/doc/docx)
     *  - cover_letter (optional)
     */
   public function apply(Request $request, Job $job)
{
    $user = $request->user();

    // ✅ only candidate can apply
if (($user->role ?? null) !== 'candidate') {
    return response()->json(['message' => 'Only candidates can apply'], 403);
}

// ✅ job must be active (optional but recommended)
if (property_exists($job, 'is_active') && !$job->is_active) {
    return response()->json(['message' => 'Job is not active'], 404);
}


    $data = $request->validate([
        'full_name' => ['required', 'string', 'max:255'],
        'phone'     => ['required', 'string', 'max:30'],
        'email'     => ['required', 'email', 'max:255'],
        'dob'       => ['required', 'date'],
        'gender'    => ['nullable', 'string', 'max:20'],

        'current_city'    => ['required', 'string', 'max:100'],
        'state'           => ['required', 'string', 'max:100'],
        'pincode'         => ['required', 'string', 'max:10'],
        'current_address' => ['required', 'string', 'max:255'],

        'department_role'        => ['nullable', 'string', 'max:255'],
        'preferred_job_location' => ['nullable', 'string', 'max:150'],
        'employment_type'        => [
            'required', 'string', 'max:50',
            Rule::in(['Full-time', 'Part-time', 'Internship', 'Work from Home'])
        ],

        'highest_qualification' => [
            'required', 'string', 'max:50',
            Rule::in(['10th', '12th', 'Diploma', 'Graduate', 'Post Graduate'])
        ],
        'course_stream'    => ['nullable', 'string', 'max:150'],
        'passing_year'     => ['nullable', 'string', 'max:10'],
        'university_board' => ['nullable', 'string', 'max:200'],

        'total_experience' => [
            'required', 'string', 'max:20',
            Rule::in(['Fresher', '0-1 Year', '1-3 Years', '3+ Years'])
        ],
        'current_company'     => ['nullable', 'string', 'max:200'],
        'current_designation' => ['nullable', 'string', 'max:200'],
        'current_salary_ctc'  => ['nullable', 'integer'],
        'expected_salary'     => ['nullable', 'integer'],
        'notice_period'       => ['nullable', 'string', 'max:20', Rule::in(['Immediate', '15 Days', '30 Days', '60 Days'])],

        'key_skills'    => ['nullable', 'array'],
        'portfolio_url' => ['nullable', 'string', 'max:500'],
        'linkedin_url'  => ['nullable', 'string', 'max:500'],
        'github_url'    => ['nullable', 'string', 'max:500'],

        'declaration_accepted'    => ['required', 'boolean'],
        'privacy_policy_accepted' => ['required', 'boolean'],
        'consent_contact'         => ['required', 'boolean'],

        'cover_letter' => ['nullable', 'string'],

        'resume' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
    ]);

    if (
        empty($data['declaration_accepted']) ||
        empty($data['privacy_policy_accepted']) ||
        empty($data['consent_contact'])
    ) {
        return response()->json(['message' => 'Consent is required'], 422);
    }

    $already = Application::where('job_id', $job->id)
        ->where('candidate_id', $user->id)
        ->exists();

    if ($already) {
        return response()->json(['message' => 'You have already applied for this job'], 409);
    }

    // ✅ phone users table me save hoga
    $user->forceFill([
        'phone' => $data['phone'],
    ])->save();

    $resumePath = $request->file('resume')->store('resumes', 'public');

    $candidate = Candidate::firstOrCreate(
        ['user_id' => $user->id],
        [
            'full_name' => $data['full_name'],
            'email' => $data['email'],
        ]
    );

    $update = [
        'full_name' => $data['full_name'],
        'email' => $data['email'],
        'dob' => $data['dob'],
        'gender' => $data['gender'] ?? null,

        'current_city' => $data['current_city'],
        'state' => $data['state'],
        'pincode' => $data['pincode'],
        'current_address' => $data['current_address'],

        'preferred_job_location' => $data['preferred_job_location'] ?? null,
        'employment_type' => $data['employment_type'],

        'highest_qualification' => $data['highest_qualification'],
        'course_stream' => $data['course_stream'] ?? null,
        'passing_year' => $data['passing_year'] ?? null,
        'university_board' => $data['university_board'] ?? null,

        'total_experience' => $data['total_experience'],
        'current_company' => $data['current_company'] ?? null,
        'current_designation' => $data['current_designation'] ?? null,
        'current_salary_ctc' => $data['current_salary_ctc'] ?? null,
        'expected_salary' => $data['expected_salary'] ?? null,
        'notice_period' => $data['notice_period'] ?? null,

        'key_skills' => $data['key_skills'] ?? [],
        'portfolio_url' => $data['portfolio_url'] ?? null,
        'linkedin_url' => $data['linkedin_url'] ?? null,
        'github_url' => $data['github_url'] ?? null,

        'declaration_accepted' => (bool) $data['declaration_accepted'],
        'privacy_policy_accepted' => (bool) $data['privacy_policy_accepted'],
        'consent_contact' => (bool) $data['consent_contact'],
    ];

    // ✅ resume column detect karke save karega
    $table = $candidate->getTable();
    $schema = $candidate->getConnection()->getSchemaBuilder();

    if ($schema->hasColumn($table, 'resume_path')) {
        $update['resume_path'] = $resumePath;
    } elseif ($schema->hasColumn($table, 'video_resume_path')) {
        $update['video_resume_path'] = $resumePath;
    }

    $candidate->update($update);

    $application = Application::create([
        'job_id' => $job->id,
        'candidate_id' => $user->id,
        'applied_job_title' => $job->title ?? null,
        'department_role' => $data['department_role'] ?? null,
        'cover_letter' => $data['cover_letter'] ?? null,
        'resume_url' => $resumePath,
        'status' => 'applied',
    ]);

    return response()->json([
        'message' => 'Applied successfully',
        'application' => $application,
    ], 201);
}


    /**
     * Employer views applications for a specific job
     * Route: GET /api/jobs/{job}/applications
     */
public function index(Request $request, Job $job)
{
    $user = $request->user();

    // ✅ only employer/admin can view applications
    if (!in_array($user->role ?? null, ['employer', 'admin'], true)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    // ✅ employer can only view his own job's applications
    if (($user->role ?? null) === 'employer' && (int)$job->employer_id !== (int)$user->id) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $applications = $job->applications()
        ->with([
            // Application->candidate() should belongTo(User::class, 'candidate_id')
            'candidate:id,name,email,role',
            // If you have candidateProfile relation on Application model, keep it. Else remove.
            // 'candidateProfile:user_id,current_city',
            'job:id,title,location,employer_id'
        ])
        ->latest()
        ->get();

    return response()->json($applications);
}



    /**
     * Employer updates application status
     * Route: PATCH /api/applications/{application}/status
     */
    public function updateStatus(Request $request, Application $application)
{
    $user = $request->user();

    // ✅ only employer/admin can update
    if (!in_array($user->role ?? null, ['employer', 'admin'], true)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    // ✅ employer can only update applications of his own jobs
    if (($user->role ?? null) === 'employer') {
        $job = Job::find($application->job_id);
        if (!$job || (int)$job->employer_id !== (int)$user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
    }

    $data = $request->validate([
        'status' => ['required', Rule::in(['shortlisted', 'rejected', 'hired'])]
    ]);

    $application->update(['status' => $data['status']]);

    return response()->json([
        'message' => 'Application status updated',
        'application' => $application->fresh()
    ]);
}

}
