<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyFollow extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
    ];
}
