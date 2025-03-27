<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasUlids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id', 'type', 'email', 'password', 'name', 'profile_picture', 'google_id', 'payment_phone', 'balance', 'payment_history_id', 'nationality'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function freelancer()
    {
        return $this->hasOne(\App\Models\Freelancer::class, 'freelancer_id', 'id');
    }

    public function client()
    {
        return $this->hasOne(\App\Models\Client::class, 'client_id', 'id');
    }

    public function admin()
    {
        return $this->hasOne(\App\Models\Admin::class, 'admin_id', 'id');
    }

}
