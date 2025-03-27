<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class PaymentHistory extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'amount',
        'sender_id',
        'receiver_id',
        'project_id',
        'status',
        'payment_type',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

}
