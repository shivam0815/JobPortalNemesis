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

        // ✅ add these (so they don't stay NULL)
        'applied_job_title',
        'department_role',

        'cover_letter',
        'resume_url',
        'status',
    ];

    // candidate_id = users.id
    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    // candidates.user_id = users.id (candidate profile table)
    public function candidateProfile()
    {
        return $this->hasOne(Candidate::class, 'user_id', 'candidate_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
