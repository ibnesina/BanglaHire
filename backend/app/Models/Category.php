<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // Allow mass assignment for name and skills.
    protected $fillable = ['name', 'skills'];

    // Automatically cast the skills JSON to an array.
    protected $casts = [
        'skills' => 'array',
    ];
}
