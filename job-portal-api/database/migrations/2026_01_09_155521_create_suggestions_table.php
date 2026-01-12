<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('suggestions', function (Blueprint $table) {
            $table->id();

            // job_title | job_location | job_area
            $table->string('field', 50);
            $table->string('value', 191);

            // optional scope (future): company_id / employer_id
            $table->unsignedBigInteger('tenant_id')->nullable();

            $table->unsignedInteger('hits')->default(1);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            $table->unique(['field', 'value', 'tenant_id'], 'uniq_field_value_tenant');
            $table->index(['field', 'hits']);
            $table->index(['field', 'value']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suggestions');
    }
};
