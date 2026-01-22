<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('job_titles', function (Blueprint $table) {
      $table->id();
      $table->string('title');
      $table->string('title_norm')->unique();
      $table->string('source')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void {
    Schema::dropIfExists('job_titles');
  }
};
