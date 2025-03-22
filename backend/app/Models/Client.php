<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Client extends Model
{
    use HasFactory, HasApiTokens;

    //
    // Using the 'client_id' as the primary key, not incrementing.
    protected $primaryKey = 'client_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'client_id',
        'company_name',
        'payment_method_verified',
    ];

    // Relationship to the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'client_id', 'id');
    }
}
