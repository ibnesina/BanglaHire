<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Freelancer extends Model
{
    use HasFactory, HasApiTokens;

    // Set the primary key field and its type
    protected $primaryKey = 'freelancer_id';
    public $incrementing = false; // Using UUID, not auto-increment
    protected $keyType = 'string';

    protected $fillable = [
        'freelancer_id',
        'bio',
        'category_id',
        'skills',
        'experiences',
        'hourly_rate',
        'certifications',
        'portfolio_link',
    ];

    // If you store JSON arrays in 'skills' or 'certifications', cast them.
    protected $casts = [
        'skills'         => 'array',
        'certifications' => 'array',
    ];

    /**
     * Relationship to the User model
     * freelancer_id (in this table) references id (in users table)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'freelancer_id', 'id');
    }

    /**
     * Relationship: a freelancer belongs to a category.
     * This allows you to retrieve the category details and its available skills.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
