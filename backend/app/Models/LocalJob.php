<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class LocalJob extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'local_jobs';
    protected $primaryKey = 'job_id';

    protected $fillable = [
        'client_id',
        'title',
        'description',
        'category',
        'location',
        'payment_type',
        'budget',
        'status'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }
}
