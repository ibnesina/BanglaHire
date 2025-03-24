<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class AssignedProject extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'project_id',
        'client_id',
        'freelancer_id',
        'assigned_date',
        'status',
        'deadline',
        'payment_amount',
        'payment_status',
        'completion_date',
        'review_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }

    public function freelancer()
    {
        return $this->belongsTo(Freelancer::class, 'freelancer_id', 'freelancer_id');
    }

    public function review()
    {
        return $this->belongsTo(Review::class);
    }

}
