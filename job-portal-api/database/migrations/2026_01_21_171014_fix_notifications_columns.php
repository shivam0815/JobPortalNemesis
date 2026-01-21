<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // ✅ add missing columns for new system
            if (!Schema::hasColumn('notifications', 'body')) {
                $table->text('body')->nullable()->after('title');
            }
            if (!Schema::hasColumn('notifications', 'link')) {
                $table->string('link')->nullable()->after('body');
            }
            if (!Schema::hasColumn('notifications', 'read_at')) {
                $table->timestamp('read_at')->nullable()->after('link');
            }

            // ✅ optional: ensure 'type' exists
            if (!Schema::hasColumn('notifications', 'type')) {
                $table->string('type')->default('job_posted')->after('user_id');
            }
        });

        // ✅ If old column exists and you want to map it:
        // if 'is_read' exists, convert it to read_at
        if (Schema::hasColumn('notifications', 'is_read')) {
            Schema::table('notifications', function (Blueprint $table) {
                // nothing here, just to avoid schema builder nesting issues
            });

            // convert old is_read=1 to read_at = now() (one-time)
            \DB::table('notifications')
                ->where('is_read', 1)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications', 'read_at')) $table->dropColumn('read_at');
            if (Schema::hasColumn('notifications', 'link')) $table->dropColumn('link');
            if (Schema::hasColumn('notifications', 'body')) $table->dropColumn('body');
            // type drop optional
        });
    }
};
