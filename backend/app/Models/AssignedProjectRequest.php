<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class AssignedProjectRequest extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'assigned_project_requests';
    protected $primaryKey = 'request_id';

    protected $fillable = [
        'project_id',
        'client_id',
        'freelancer_id',
        'amount',
        'request_date',
        'status',
        'message',
        'freelancer_response_date',
        'assigned_project_id'
    ];

    // Relationship to the Project model
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    // Relationship to the Client model (using client_id)
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }

    // Relationship to the Freelancer model (using freelancer_id)
    public function freelancer()
    {
        return $this->belongsTo(Freelancer::class, 'freelancer_id', 'freelancer_id');
    }

    // Relationship to the AssignedProject model (if accepted)
    public function assignedProject()
    {
        return $this->belongsTo(AssignedProject::class, 'assigned_project_id');
    }
}
