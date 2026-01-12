<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('candidates', function (Blueprint $table) {

    // ✅ Personal
    $table->string('full_name', 255)->nullable();
    $table->string('email', 255)->nullable();
    $table->date('dob')->nullable();
    $table->string('gender', 20)->nullable();

    // ✅ Address
    $table->string('current_city', 100)->nullable();
    $table->string('state', 100)->nullable();
    $table->string('pincode', 10)->nullable();
    $table->string('current_address', 255)->nullable();

    // ✅ Job preferences
    $table->string('preferred_job_location', 150)->nullable();
    $table->string('employment_type', 50)->nullable();

    // ✅ Education
    $table->string('highest_qualification', 50)->nullable();
    $table->string('course_stream', 150)->nullable();
    $table->string('passing_year', 10)->nullable();
    $table->string('university_board', 200)->nullable();

    // ✅ Experience
    $table->string('total_experience', 20)->nullable();
    $table->string('current_company', 200)->nullable();
    $table->string('current_designation', 200)->nullable();
    $table->integer('current_salary_ctc')->nullable();
    $table->integer('expected_salary')->nullable();
    $table->string('notice_period', 20)->nullable();

    // ✅ Skills
    $table->json('key_skills')->nullable();

    // ✅ Links
    $table->string('portfolio_url', 500)->nullable();
    $table->string('linkedin_url', 500)->nullable();
    $table->string('github_url', 500)->nullable();

    // ✅ Consent
    $table->boolean('declaration_accepted')->default(false);
    $table->boolean('privacy_policy_accepted')->default(false);
    $table->boolean('consent_contact')->default(false);

    // ✅ Future
    $table->string('video_resume_path', 500)->nullable();
    $table->string('referral_code', 50)->nullable();
    $table->string('preferred_interview_slot', 100)->nullable();
    $table->boolean('auto_offer_letter_eligible')->default(false);
});

    }

    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropColumn([
                'full_name','email','dob','gender',
                'current_city','state','pincode','current_address',
                'preferred_job_location','employment_type',
                'highest_qualification','course_stream','passing_year','university_board',
                'total_experience','current_company','current_designation','current_salary_ctc','expected_salary','notice_period',
                'key_skills','portfolio_url','linkedin_url','github_url',
                'declaration_accepted','privacy_policy_accepted','consent_contact',
                'video_resume_path','referral_code','preferred_interview_slot','auto_offer_letter_eligible',
            ]);
        });
    }
};
