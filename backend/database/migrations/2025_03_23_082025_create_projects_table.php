<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            // Project ID (Primary Key) -> not UUID
            $table->bigIncrements('id');

            // UUID for client (references Clients table which has 'client_id')
            $table->uuid('client_id');
            $table->string('title');
            $table->text('description')->nullable();

            // You can store skills either as text or JSON. If JSON:
            // $table->json('required_skills')->nullable();
            // If text-based (like comma-separated):
            $table->text('required_skills')->nullable();

            $table->decimal('budget', 10, 2)->default(0.00);

            // status enum: Open, In Progress, Closed
            $table->enum('status', ['Open', 'In Progress', 'Closed'])->default('Open');

            // Nullable assigned freelancer ID (UUID, references freelancers table which has 'freelancer_id')
            $table->uuid('assigned_freelancer_id')->nullable();

            // Store file path or filename if it exists
            $table->string('file')->nullable();

            $table->timestamps();
        });

        // Add any foreign key constraints after the table is created
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
        });
    }

    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropForeign(['assigned_freelancer_id']);
        });

        Schema::dropIfExists('projects');
    }
};
