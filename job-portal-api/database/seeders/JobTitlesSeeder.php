<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JobTitlesSeeder extends Seeder
{
    public function run(): void
    {
        $path = storage_path('app/job_titles_from_pdf.json');

        if (!file_exists($path)) {
            $this->command?->error("Missing file: {$path}");
            return;
        }

        $titles = json_decode(file_get_contents($path), true) ?? [];
        $now = now();

        foreach ($titles as $t) {
            $title = trim((string) $t);
            if ($title === '') continue;

            $norm = Str::of($title)
                ->lower()
                ->replaceMatches('/\s+/', ' ')
                ->trim()
                ->toString();

            DB::table('job_titles')->updateOrInsert(
                ['title_norm' => $norm],
                [
                    'title' => $title,
                    'source' => 'pdf_v1',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        $this->command?->info("Imported ".count($titles)." titles into job_titles");
    }
}
