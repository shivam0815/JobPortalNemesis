<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company_follows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // candidate
            $table->string('company_name');
            $table->timestamps();

            $table->unique(['user_id', 'company_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_follows');
    }
};
