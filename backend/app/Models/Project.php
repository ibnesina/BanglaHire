<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Project extends Model
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'client_id',
        'category_id',
        'title',
        'description',
        'required_skills',
        'budget',
        'status',
        'assigned_freelancer_id',
        'file',
    ];

    // Cast required_skills as an array for automatic JSON (de)serialization.
    protected $casts = [
        'required_skills' => 'array',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }

    public function assignedFreelancer()
    {
        return $this->belongsTo(Freelancer::class, 'assigned_freelancer_id', 'freelancer_id');
    }
    
    public function category()
    {
        return $this->belongsTo(\App\Models\Category::class, 'category_id');
    }

    public function biddings()
    {
        return $this->hasMany(Bidding::class);
    }
}

