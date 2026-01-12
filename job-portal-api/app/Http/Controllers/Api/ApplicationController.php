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
        $user = $request->user(); // ✅ logged-in candidate user

        // ✅ Validate all fields (as per your list)
        $data = $request->validate([
            // 1) Personal Details (mandatory)
            'full_name' => ['required', 'string', 'max:255'],
            'phone'     => ['required', 'string', 'max:30'],
            'email'     => ['required', 'email', 'max:255'],
            'dob'       => ['required', 'date'],
            'gender'    => ['nullable', 'string', 'max:20'],

            // 2) Address Details (mandatory)
            'current_city'    => ['required', 'string', 'max:100'],
            'state'           => ['required', 'string', 'max:100'],
            'pincode'         => ['required', 'string', 'max:10'],
            'current_address' => ['required', 'string', 'max:255'],

            // 3) Job Preferences (mandatory/important)
            'department_role'        => ['nullable', 'string', 'max:255'],
            'preferred_job_location' => ['nullable', 'string', 'max:150'],
            'employment_type'        => [
                'required', 'string', 'max:50',
                Rule::in(['Full-time', 'Part-time', 'Internship', 'Work from Home'])
            ],

            // 4) Education (mandatory)
            'highest_qualification' => [
                'required', 'string', 'max:50',
                Rule::in(['10th', '12th', 'Diploma', 'Graduate', 'Post Graduate'])
            ],
            'course_stream'    => ['nullable', 'string', 'max:150'],
            'passing_year'     => ['nullable', 'string', 'max:10'],
            'university_board' => ['nullable', 'string', 'max:200'],

            // 5) Experience (mandatory)
            'total_experience' => [
                'required', 'string', 'max:20',
                Rule::in(['Fresher', '0-1 Year', '1-3 Years', '3+ Years'])
            ],
            'current_company'     => ['nullable', 'string', 'max:200'],
            'current_designation' => ['nullable', 'string', 'max:200'],
            'current_salary_ctc'  => ['nullable', 'integer'],
            'expected_salary'     => ['nullable', 'integer'],
            'notice_period'       => [
                'nullable', 'string', 'max:20',
                Rule::in(['Immediate', '15 Days', '30 Days', '60 Days'])
            ],

            // 6) Skills & Resume
            'key_skills'    => ['nullable', 'array'],
            'portfolio_url' => ['nullable', 'string', 'max:500'],
            'linkedin_url'  => ['nullable', 'string', 'max:500'],
            'github_url'    => ['nullable', 'string', 'max:500'],

            // 7) Consent (mandatory)
            'declaration_accepted'     => ['required', 'boolean'],
            'privacy_policy_accepted'  => ['required', 'boolean'],
            'consent_contact'          => ['required', 'boolean'],

            // Optional
            'cover_letter' => ['nullable', 'string'],

            // Resume file (mandatory)
            'resume' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB
        ]);

        // ✅ Must accept all consents
        if (
            empty($data['declaration_accepted']) ||
            empty($data['privacy_policy_accepted']) ||
            empty($data['consent_contact'])
        ) {
            return response()->json(['message' => 'Consent is required'], 422);
        }

        // ✅ Prevent duplicate application for same job by same user (candidate_id = user_id)
        if (
            Application::where('job_id', $job->id)
                ->where('candidate_id', $user->id)
                ->exists()
        ) {
            return response()->json([
                'message' => 'You have already applied for this job'
            ], 409);
        }

        // ✅ Candidate Profile create/update (requires candidates.user_id column)
        // If your candidates table DOES NOT have user_id,
        // you must add it via migration before using this.
        $candidate = Candidate::firstOrCreate(
            ['user_id' => $user->id],
            ['phone' => $data['phone'], 'city' => $data['current_city']]
        );

        // ✅ Resume upload
        $resumePath = $request->file('resume')->store('resumes', 'public');

        // ✅ Update candidate profile
        $candidate->update([
            'full_name' => $data['full_name'],
            'phone'     => $data['phone'],
            'email'     => $data['email'],
            'dob'       => $data['dob'],
            'gender'    => $data['gender'] ?? null,

            'city'            => $data['current_city'], // keep old column if exists
            'current_city'    => $data['current_city'],
            'state'           => $data['state'],
            'pincode'         => $data['pincode'],
            'current_address' => $data['current_address'],

            'preferred_job_location' => $data['preferred_job_location'] ?? null,
            'employment_type'        => $data['employment_type'],

            'highest_qualification' => $data['highest_qualification'],
            'course_stream'         => $data['course_stream'] ?? null,
            'passing_year'          => $data['passing_year'] ?? null,
            'university_board'      => $data['university_board'] ?? null,

            'total_experience'     => $data['total_experience'],
            'current_company'      => $data['current_company'] ?? null,
            'current_designation'  => $data['current_designation'] ?? null,
            'current_salary_ctc'   => $data['current_salary_ctc'] ?? null,
            'expected_salary'      => $data['expected_salary'] ?? null,
            'notice_period'        => $data['notice_period'] ?? null,

            'key_skills'    => $data['key_skills'] ?? [],
            'portfolio_url' => $data['portfolio_url'] ?? null,
            'linkedin_url'  => $data['linkedin_url'] ?? null,
            'github_url'    => $data['github_url'] ?? null,

            'declaration_accepted'    => $data['declaration_accepted'],
            'privacy_policy_accepted' => $data['privacy_policy_accepted'],
            'consent_contact'         => $data['consent_contact'],

            'resume_path' => $resumePath,
        ]);

        // ✅ Create Application
        $application = Application::create([
            'job_id' => $job->id,

            // IMPORTANT: here candidate_id is user_id (simple approach)
            'candidate_id' => $user->id,

            // store snapshot info (optional but useful)
            'applied_job_title' => $job->title ?? null,
            'department_role'   => $data['department_role'] ?? null,

            'cover_letter' => $data['cover_letter'] ?? null,
            'resume_url'   => $resumePath,

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
    public function index(Job $job)
    {
        $applications = $job->applications()
            ->with(['candidate:id,name,email'])
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
        $data = $request->validate([
            'status' => ['required', Rule::in(['shortlisted', 'rejected', 'hired'])]
        ]);

        $application->update([
            'status' => $data['status']
        ]);

        return response()->json([
            'message' => 'Application status updated',
            'application' => $application->fresh()
        ]);
    }
}
