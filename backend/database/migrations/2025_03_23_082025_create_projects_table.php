<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            // Project ID (Primary Key) – auto-increment (not UUID)
            $table->bigIncrements('id');
            
            // Foreign key for client (UUID)
            $table->uuid('client_id');

            // New: Foreign key for selected category
            $table->unsignedBigInteger('category_id');

            $table->string('title');
            $table->text('description')->nullable();

            // Store required skills as JSON (instead of a comma-separated text string)
            $table->json('required_skills')->nullable();

            $table->decimal('budget', 10, 2)->default(0.00);

            // Status: Open, In Progress, Closed
            $table->enum('status', ['Open', 'Assigned', 'Submitted', 'Closed'])->default('Open');

            // Nullable assigned freelancer ID (UUID)
            $table->uuid('assigned_freelancer_id')->nullable();

            // Store file path or filename
            $table->string('file')->nullable();

            $table->timestamps();
        });

        // Define foreign key constraints
        Schema::table('projects', function (Blueprint $table) {
            $table->foreign('client_id')
                  ->references('client_id')
                  ->on('clients')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('assigned_freelancer_id')
                  ->references('freelancer_id')
                  ->on('freelancers')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();

            $table->foreign('category_id')
                  ->references('id')
                  ->on('categories')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
        });
    }

    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropForeign(['assigned_freelancer_id']);
            $table->dropForeign(['category_id']);
        });

        Schema::dropIfExists('projects');
    }
};
