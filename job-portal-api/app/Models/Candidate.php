<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',

        // ✅ basic (existing)
        'phone',
        'city',
        'resume_path',

        // ✅ Personal
        'full_name',
        'email',
        'dob',
        'gender',

        // ✅ Address
        'current_city',
        'state',
        'pincode',
        'current_address',

        // ✅ Job preferences
        'preferred_job_location',
        'employment_type',

        // ✅ Education
        'highest_qualification',
        'course_stream',
        'passing_year',
        'university_board',

        // ✅ Experience
        'total_experience',
        'current_company',
        'current_designation',
        'current_salary_ctc',
        'expected_salary',
        'notice_period',

        // ✅ Skills
        'key_skills',

        // ✅ Links
        'portfolio_url',
        'linkedin_url',
        'github_url',

        // ✅ Consent
        'declaration_accepted',
        'privacy_policy_accepted',
        'consent_contact',

        // ✅ Future
        'video_resume_path',
        'referral_code',
        'preferred_interview_slot',
        'auto_offer_letter_eligible',
    ];

    protected $casts = [
        'dob' => 'date',
        'key_skills' => 'array',
        'declaration_accepted' => 'boolean',
        'privacy_policy_accepted' => 'boolean',
        'consent_contact' => 'boolean',
        'auto_offer_letter_eligible' => 'boolean',
        'current_salary_ctc' => 'integer',
        'expected_salary' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
