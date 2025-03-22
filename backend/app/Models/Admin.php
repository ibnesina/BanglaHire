<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Model
{
    use HasApiTokens, HasFactory;
    
    protected $table = 'admins'; // By default, Laravel would guess "admins" anyway
    protected $primaryKey = 'admin_id';
    public $incrementing = false;  // If using UUID for user IDs
    protected $keyType = 'string';

    protected $fillable = [
        'admin_id',
        'department',
        'role_level',
        'is_super_admin',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'admin_id', 'id');
    }
}
