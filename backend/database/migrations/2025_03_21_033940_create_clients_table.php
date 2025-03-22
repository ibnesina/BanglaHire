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
        Schema::create('clients', function (Blueprint $table) {
            // Primary key that is also a foreign key to users.id (assuming UUIDs in your users table)
            $table->uuid('client_id')->primary();
            $table->string('company_name')->nullable();
            $table->boolean('payment_method_verified')->default(false);
            $table->timestamps();

            /*
             * Prototype for analytics (to be calculated in the controller or via related tables):
             * - posted_projects_id: (Foreign key references Projects Table)
             * - total_spending: Decimal, sum of all payments made
             * - average_freelancer_rating_given: Decimal, from Reviews Table
             * - total_projects_posted: Integer, number of projects created
             * - completed_projects: Integer, number of projects successfully finished
             * - active_projects: Integer, ongoing projects
             * - freelancer_performance_score: Decimal, average rating of hired freelancers
             */
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
