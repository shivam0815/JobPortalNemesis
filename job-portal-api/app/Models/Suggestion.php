<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suggestion extends Model
{
    protected $fillable = [
        'field',
        'value',
        'tenant_id',
        'hits',
        'last_used_at',
    ];
}
