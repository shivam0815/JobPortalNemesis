<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->string('applied_job_title', 255)->nullable()->after('candidate_id');
            $table->string('department_role', 255)->nullable()->after('applied_job_title');
        });
    }

    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['applied_job_title', 'department_role']);
        });
    }
};
