<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {

            // PDF extra fields
            $table->string('job_area', 255)->nullable()->after('location');

            $table->string('total_experience', 50)->nullable()->after('job_area'); // e.g. "0-1", "2-5"
            $table->integer('monthly_inhand_salary')->nullable()->after('total_experience'); // actual in-hand

            $table->boolean('bonus')->default(false)->after('monthly_inhand_salary');

            $table->string('skills_text', 1000)->nullable()->after('bonus'); // store as comma separated text
            $table->string('age', 50)->nullable()->after('skills_text');

            $table->string('preferred_language', 100)->nullable()->after('age');
            $table->string('assets', 255)->nullable()->after('preferred_language');

            $table->string('degree_specialisation', 255)->nullable()->after('assets');
            $table->string('certification', 255)->nullable()->after('degree_specialisation');
            $table->string('preferred_industry', 255)->nullable()->after('certification');

            $table->string('job_timings', 255)->nullable()->after('preferred_industry');
            $table->string('interview_details', 500)->nullable()->after('job_timings');

            // company/contact details (PDF)
            $table->string('company_name', 255)->nullable()->after('interview_details');
            $table->string('contact_person_name', 255)->nullable()->after('company_name');
            $table->string('contact_phone', 30)->nullable()->after('contact_person_name');
            $table->string('contact_email', 255)->nullable()->after('contact_phone');

            $table->string('contact_person_profile', 50)->nullable()->after('contact_email'); // HR/Owner/Recruiter...
            $table->string('org_size', 50)->nullable()->after('contact_person_profile'); // 1-10, 11-50...
            $table->string('fill_urgency', 50)->nullable()->after('org_size'); // Immediately/7 days...
            $table->string('hiring_frequency', 50)->nullable()->after('fill_urgency'); // every month...

            $table->text('job_address')->nullable()->after('hiring_frequency');

            // optional: for suggestions later (not required now)
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn([
                'job_area',
                'total_experience',
                'monthly_inhand_salary',
                'bonus',
                'skills_text',
                'age',
                'preferred_language',
                'assets',
                'degree_specialisation',
                'certification',
                'preferred_industry',
                'job_timings',
                'interview_details',
                'company_name',
                'contact_person_name',
                'contact_phone',
                'contact_email',
                'contact_person_profile',
                'org_size',
                'fill_urgency',
                'hiring_frequency',
                'job_address',
            ]);
        });
    }
};
