<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications', 'message') && !Schema::hasColumn('notifications', 'body')) {
                $table->renameColumn('message', 'body');
            }
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications', 'body') && !Schema::hasColumn('notifications', 'message')) {
                $table->renameColumn('body', 'message');
            }
        });
    }
};
