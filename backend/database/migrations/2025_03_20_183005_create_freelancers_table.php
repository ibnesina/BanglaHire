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
        Schema::create('freelancers', function (Blueprint $table) {
            // Primary Key that is also a foreign key to users.id (assumes UUIDs)
            $table->uuid('freelancer_id')->primary();
            $table->text('bio')->nullable();
            $table->json('skills')->nullable(); // Store skills as JSON array
            $table->text('experiences')->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->json('certifications')->nullable(); // Store certification links as JSON array
            $table->string('portfolio_link')->nullable();
            $table->timestamps();

            // Note: Calculated fields are not stored in the table. They will be computed dynamically:
            /*
             * Prototype for analytics (to be calculated in the controller):
             * - total_earnings: Decimal, sum of all completed project payments
             * - average_rating: Decimal, calculated from Reviews Table
             * - total_bids_placed: Integer, number of bids submitted
             * - bid_success_rate: Decimal, percentage of awarded bids
             * - completed_projects: Integer, number of successfully completed projects
             * - active_projects: Integer, ongoing projects assigned
             * - client_feedback_score: Decimal, calculated based on reviews and ratings
             * - last_updated: Timestamp, records when the analytics data was last refreshed
             */
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freelancers');
    }
};
