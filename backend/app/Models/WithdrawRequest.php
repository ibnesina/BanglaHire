<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class WithdrawRequest extends Model
{
    use HasUlids, HasApiTokens;

    // Use string (UUID) keys
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'amount',
        'gateway',
        'payment_details',
        'status',
    ];

    protected $casts = [
        'payment_details' => 'array',
        'amount'          => 'decimal:2',
    ];

    // Relationship: a withdraw belongs to a user :contentReference[oaicite:3]{index=3}
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
