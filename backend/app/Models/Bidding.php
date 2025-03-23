<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Bidding extends Model
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'project_id',
        'freelancer_id',
        'cover_letter',
        'bidding_amount',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function freelancer()
    {
        return $this->belongsTo(Freelancer::class, 'freelancer_id', 'freelancer_id');
    }
}
