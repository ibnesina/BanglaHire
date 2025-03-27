<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payment_histories', function (Blueprint $table) {
            // Transaction ID (Primary Key)
            $table->bigIncrements('id');

            // Total payment amount
            $table->decimal('amount', 10, 2);

            // Sender and Receiver IDs (references User Table; assumed UUIDs)
            $table->uuid('sender_id');
            $table->uuid('receiver_id');

            // Nullable project ID (references projects table)
            $table->unsignedBigInteger('project_id')->nullable();

            // Status of the transaction (Enum: Pending, Completed, Failed, Refunded)
            $table->enum('status', ['Pending', 'Completed', 'Failed', 'Refunded'])->default('Pending');

            // Payment type (Enum: Direct, Hourly, Fixed-Price, Escrow)
            $table->enum('payment_type', ['Direct', 'Hourly', 'Fixed-Price', 'Escrow']);

            $table->timestamps();
        });

        // Foreign key constraints
        Schema::table('payment_histories', function (Blueprint $table) {
            $table->foreign('sender_id')
                  ->references('id')
                  ->on('users')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('receiver_id')
                  ->references('id')
                  ->on('users')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();

            $table->foreign('project_id')
                  ->references('id')
                  ->on('projects')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
        });
    }

    public function down()
    {
        Schema::table('payment_histories', function (Blueprint $table) {
            $table->dropForeign(['sender_id']);
            $table->dropForeign(['receiver_id']);
            $table->dropForeign(['project_id']);
        });

        Schema::dropIfExists('payment_histories');
    }
};
