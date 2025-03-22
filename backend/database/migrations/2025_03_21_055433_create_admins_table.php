<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            // Each admin row corresponds to one user with type="Admin"
            $table->uuid('admin_id')->primary(); // or bigInteger if your users table uses autoincrement
            $table->string('department')->nullable();
            $table->string('role_level')->nullable();   // e.g., "Super Admin", "Support Admin", etc.
            $table->boolean('is_super_admin')->default(false);

            $table->timestamps();

            // If you'd like to add analytics fields, place them here:
            // $table->integer('total_users')->nullable();
            // $table->integer('total_projects')->nullable();
            // ...
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
