<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('local_jobs', function (Blueprint $table) {
            $table->id('job_id');
            $table->uuid('client_id');
            $table->foreign('client_id')->references('client_id')->on('clients')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->enum('category', ['Photography', 'Tutoring', 'Cooking']);
            $table->string('location');
            $table->enum('payment_type', ['Fixed', 'Hourly']);
            $table->decimal('budget', 10, 2);
            $table->enum('status', ['Open', 'In Progress', 'Closed'])->default('Open');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('local_jobs');
    }
};
