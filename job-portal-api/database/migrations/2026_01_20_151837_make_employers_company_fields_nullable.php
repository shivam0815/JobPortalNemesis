<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employers', function (Blueprint $table) {
            $table->string('company_name')->nullable()->change();
            $table->string('company_email')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('employers', function (Blueprint $table) {
            $table->string('company_name')->nullable(false)->change();
            $table->string('company_email')->nullable(false)->change();
        });
    }
};
