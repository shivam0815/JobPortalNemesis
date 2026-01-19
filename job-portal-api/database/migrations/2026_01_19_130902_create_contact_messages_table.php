<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('phone', 20)->nullable();
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');

            // admin workflow
            $table->enum('status', ['new', 'read', 'replied', 'closed'])->default('new');
            $table->timestamp('read_at')->nullable();

            $table->ipAddress('ip')->nullable();
            $table->string('user_agent', 512)->nullable();

            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
