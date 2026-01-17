<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('role');
            $table->string('company_email')->nullable()->after('company_name');
            $table->string('company_phone')->nullable()->after('company_email');
            $table->string('company_hr_name')->nullable()->after('company_phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'company_name',
                'company_email',
                'company_phone',
                'company_hr_name',
            ]);
        });
    }
};
