<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            // Review ID (Primary Key)
            $table->bigIncrements('id');

            // Freelancer ID (UUID, references freelancers table)
            $table->uuid('freelancer_id');

            // Client ID (UUID, references clients table)
            $table->uuid('client_id');

            // Rating (Integer between 1-5)
            $table->unsignedTinyInteger('rating');

            // Review text
            $table->text('text');

            // Project ID (Foreign key, references projects table)
            $table->unsignedBigInteger('project_id');

            $table->timestamps();

            // Foreign key constraints
            $table->foreign('freelancer_id')
                  ->references('freelancer_id')
                  ->on('freelancers')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('client_id')
                  ->references('client_id')
                  ->on('clients')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('project_id')
                  ->references('id')
                  ->on('projects')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
