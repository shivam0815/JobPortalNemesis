<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
        'employer_id',
        'title',
        'description',
        'location',
        'job_area',
        'job_type',
        'salary_min',
        'salary_max',
        'monthly_inhand_salary',
        'bonus',
        'skills',
        'total_experience',
        'age',
        'preferred_language',
        'assets',
        'degree_specialisation',
        'certification',
        'preferred_industry',
        'job_timings',
        'interview_details',
        'company_name',
        'contact_person_name',
        'contact_phone',
        'contact_email',
        'contact_person_profile',
        'org_size',
        'fill_urgency',
        'hiring_frequency',
        'job_address',
        'is_active',
        'company_name',
    'company_email',
    'company_phone',
    'company_hr_name',
    ];

    protected $casts = [
        'skills' => 'array',
        'bonus' => 'boolean',
        'monthly_inhand_salary' => 'integer',
        'salary_min' => 'integer',
        'salary_max' => 'integer',
    ];

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
