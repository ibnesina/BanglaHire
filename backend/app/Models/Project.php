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
        'title',
        'description',
        'required_skills',
        'budget',
        'status',
        'assigned_freelancer_id',
        'file',
    ];

    // If 'required_skills' is stored as JSON in the DB, 
    // you can cast it automatically:
    // protected $casts = [
    //     'required_skills' => 'array',
    // ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }

    public function assignedFreelancer()
    {
        return $this->belongsTo(Freelancer::class, 'assigned_freelancer_id', 'freelancer_id');
    }

    public function biddings()
    {
        return $this->hasMany(Bidding::class);
    }
}

