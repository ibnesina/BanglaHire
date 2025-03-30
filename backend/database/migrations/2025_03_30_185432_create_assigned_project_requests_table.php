<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('assigned_project_requests', function (Blueprint $table) {
            $table->id('request_id'); // Primary Key (auto-incrementing integer)
            $table->unsignedBigInteger('project_id'); // Foreign Key, references projects table (assumed integer)
            $table->uuid('client_id'); // Foreign Key, references clients table (client_id)
            $table->uuid('freelancer_id'); // Foreign Key, references freelancers table (freelancer_id)
            $table->decimal('amount', 10, 2); // Amount from the project table for the specific project
            $table->timestamp('request_date')->useCurrent();
            $table->enum('status', ['Pending', 'Accepted', 'Rejected', 'Expired'])->default('Pending');
            $table->text('message')->nullable(); // Optional additional details from the client
            $table->timestamp('freelancer_response_date')->nullable();
            $table->unsignedBigInteger('assigned_project_id')->nullable(); // Filled if request is accepted
            $table->timestamps();
            
            $table->foreign('project_id')
                  ->references('id')
                  ->on('projects')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('client_id')
                  ->references('client_id')
                  ->on('clients')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('freelancer_id')
                  ->references('freelancer_id')
                  ->on('freelancers')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('assigned_project_id')
                  ->references('id')
                  ->on('assigned_projects')
                  ->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::dropIfExists('assigned_project_requests');
    }
};
