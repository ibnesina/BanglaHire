<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('withdraw_requests', function (Blueprint $table) {
            // UUID primary key
            $table->uuid('id')->primary()->default(DB::raw('(UUID())')); // :contentReference[oaicite:1]{index=1}
            // Link to user
            $table->foreignUuid('user_id')
                  ->constrained()
                  ->onDelete('cascade'); // :contentReference[oaicite:2]{index=2}
            // Requested amount
            $table->decimal('amount', 10, 2);
            // Chosen gateway: stripe, sslcommerz, bkash...
            $table->enum('gateway', ['stripe', 'sslcommerz', 'bkash']);
            // JSON payload for gateway-specific details (e.g. account no, reference)
            $table->json('payment_details');
            // Status: pending, approved, rejected
            $table->enum('status', ['pending', 'approved', 'rejected'])
                  ->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('withdraw_requests');
    }
};

