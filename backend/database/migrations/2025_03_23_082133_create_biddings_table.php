<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('biddings', function (Blueprint $table) {
            // Bidding ID (Primary Key) -> not UUID
            $table->bigIncrements('id');

            // Foreign key to projects table
            $table->unsignedBigInteger('project_id');

            // Freelancer ID (UUID, references freelancers table which has 'freelancer_id')
            $table->uuid('freelancer_id');

            $table->text('cover_letter')->nullable();
            $table->decimal('bidding_amount', 10, 2)->default(0.00);

            $table->timestamps();
        });

        // Add foreign keys
        Schema::table('biddings', function (Blueprint $table) {
            $table->foreign('project_id')
                  ->references('id')
                  ->on('projects')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('freelancer_id')
                  ->references('freelancer_id')
                  ->on('freelancers')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
        });
    }

    public function down()
    {
        Schema::table('biddings', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['freelancer_id']);
        });

        Schema::dropIfExists('biddings');
    }
};
