<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('assigned_projects', function (Blueprint $table) {
            // Primary Key ID
            $table->bigIncrements('id');

            // Project ID (Foreign Key)
            $table->unsignedBigInteger('project_id');

            // Client ID (UUID, references clients table)
            $table->uuid('client_id');

            // Freelancer ID (UUID, references freelancers table)
            $table->uuid('freelancer_id');

            // Assigned Date (timestamp)
            $table->timestamp('assigned_date')->useCurrent();

            // Status enum: Assigned, In Progress, Completed, Canceled
            $table->enum('status', ['Assigned', 'In Progress', 'Completed', 'Canceled'])->default('Assigned');

            // Deadline (date)
            $table->date('deadline');

            // Payment Amount
            $table->decimal('payment_amount', 10, 2)->default(0.00);

            // Payment Status enum: Pending, Released, Disputed
            $table->enum('payment_status', ['Pending', 'Released', 'Disputed'])->default('Pending');

            // Completion Date (nullable)
            $table->date('completion_date')->nullable();

            // Review ID (Foreign Key, nullable as review may not exist at first)
            $table->unsignedBigInteger('review_id')->nullable();

            $table->timestamps();

            // Foreign key constraints
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

            $table->foreign('review_id')
                  ->references('id')
                  ->on('reviews')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('assigned_projects', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['client_id']);
            $table->dropForeign(['freelancer_id']);
            $table->dropForeign(['review_id']);
        });
        Schema::dropIfExists('assigned_projects');
    }
};
