<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'subject',
        'message',
        'status',
        'read_at',
        'ip',
        'user_agent',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];
}
