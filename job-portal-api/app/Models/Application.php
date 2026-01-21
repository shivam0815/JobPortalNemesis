<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Job;
use App\Models\Candidate;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'candidate_id',
        'applied_job_title',
        'department_role',
        'interested_titles', // ✅
        'cover_letter',
        'resume_url',
        'status',
    ];

    protected $casts = [
        'interested_titles' => 'array', // ✅
    ];

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    public function candidateProfile()
    {
        return $this->hasOne(Candidate::class, 'user_id', 'candidate_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
