<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\Notification;


class ApplicationController extends Controller
{
    
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

            // ✅ Interested categories (pick 1–4) coming from backend suggestions(job_title)
            'interested_titles' => ['nullable', 'array', 'min:1', 'max:4'],
            'interested_titles.*' => ['string', 'max:120'],

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

        // ✅ validate interested_titles against suggestions table
       // ✅ validate interested_titles against suggestions table (SOFT validation)
// - If suggestions are not configured yet, do NOT block apply.
// - If some titles are invalid, just keep the valid ones.
if (!empty($data['interested_titles'])) {
    $valid = DB::table('suggestions')
        ->where('field', 'job_title')
        ->whereIn('value', $data['interested_titles'])
        ->pluck('value')
        ->toArray();

    // If suggestions table has entries but none matched, you can either:
// 1) allow empty (recommended for production stability)
    $data['interested_titles'] = array_values(array_unique($valid));

// 2) (Optional stricter) if suggestions exist and user sent invalid, then block
//    but only if suggestions table actually has job_title configured:
// $hasJobTitleSuggestions = DB::table('suggestions')->where('field','job_title')->exists();
// if ($hasJobTitleSuggestions && count($valid) !== count($data['interested_titles'])) {
//     return response()->json(['message' => 'Invalid job category selected'], 422);
// }
}


        // ✅ Consent must be accepted
        if (
            empty($data['declaration_accepted']) ||
            empty($data['privacy_policy_accepted']) ||
            empty($data['consent_contact'])
        ) {
            return response()->json(['message' => 'Consent is required'], 422);
        }

        // ✅ prevent duplicate apply
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

        // ✅ store resume
        $resumePath = $request->file('resume')->store('resumes', 'public');

        // ✅ candidate row create/update
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

        // ✅ create application
        $application = Application::create([
            'job_id' => $job->id,
            'candidate_id' => $user->id,
            'applied_job_title' => $job->title ?? null,
            'department_role' => $data['department_role'] ?? null,

            // ✅ save interested categories
            'interested_titles' => $data['interested_titles'] ?? [],

            'cover_letter' => $data['cover_letter'] ?? null,
            'resume_url' => $resumePath,
            'status' => 'applied',
        ]);
Notification::create([
            'user_id' => $job->employer_id,
            'type'    => 'new_application',
            'title'   => 'New application received',
            'body'    => ($user->name ?? ($candidate->full_name ?? 'A candidate')) . ' applied for "' . ($job->title ?? 'a job') . '"',
            'link'    => '/employer',
            'read_at' => null,
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
                'candidate:id,name,email,role',
                'job:id,title,location,employer_id'
            ])
            ->latest()
            ->get();

        return response()->json($applications);
    }

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

        $oldStatus = $application->status;
        $newStatus = $data['status'];

        $application->update(['status' => $newStatus]);

        // 🔔 Notify candidate on status change (Naukri-style)
        if ($oldStatus !== $newStatus) {
            $job = Job::select('id', 'title')->find($application->job_id);

            $label = match ($newStatus) {
                'shortlisted' => 'Shortlisted',
                'rejected'    => 'Rejected',
                'hired'       => 'Hired',
                default       => ucfirst($newStatus),
            };

            Notification::create([
                'user_id' => $application->candidate_id, // ✅ candidate user id
                'type'    => 'application_status',
                'title'   => 'Application ' . $label,
                'body'    => 'Your application for "' . ($job->title ?? 'a job') . '" is now ' . strtolower($label) . '.',
                // ✅ candidate should land where they can see status
                'link'    => '/candidate/applications',
                'read_at' => null,
            ]);
        }

        return response()->json([
            'message' => 'Application status updated',
            'application' => $application->fresh()
        ]);
    }

    public function markViewed(Request $request, Application $application)
{
    $user = $request->user();

    // ✅ only employer/admin can mark viewed
    if (!in_array($user->role ?? null, ['employer', 'admin'], true)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    // ✅ employer can only view applications of his own jobs
    if (($user->role ?? null) === 'employer') {
        $job = Job::find($application->job_id);
        if (!$job || (int) $job->employer_id !== (int) $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
    } else {
        $job = Job::find($application->job_id);
    }

    // ✅ only first time: set viewed_at + send notification
    if (!$application->viewed_at) {
        $application->update(['viewed_at' => now()]);

        Notification::create([
            'user_id' => $application->candidate_id,
            'type'    => 'application_viewed',
            'title'   => 'Employer viewed your application',
            'body'    => 'Your application for "' . ($job->title ?? 'a job') . '" was viewed.',
            'link'    => '/candidate/applications',
            'read_at' => null,
        ]);
    }

    return response()->json(['ok' => true, 'viewed_at' => $application->viewed_at]);
}

}
