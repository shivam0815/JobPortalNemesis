<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;   // ✅ REQUIRED
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function index(Request $request)
    {
        $field = (string) $request->query('field', '');
        if ($field !== 'job_title') {
            return response()->json([]);
        }

        $q = trim((string) $request->query('q', ''));
        $limit = min((int) $request->query('limit', 20), 50);

        $qNorm = Str::of($q)
            ->lower()
            ->replaceMatches('/\s+/', ' ')
            ->trim()
            ->toString();

        if ($qNorm === '') {
            return response()->json(
                DB::table('job_titles')
                    ->orderBy('title_norm')
                    ->limit($limit)
                    ->pluck('title')
            );
        }

        $starts = DB::table('job_titles')
            ->where('title_norm', 'like', $qNorm . '%')
            ->orderBy('title_norm')
            ->limit($limit)
            ->pluck('title')
            ->toArray();

        $remaining = $limit - count($starts);
        if ($remaining <= 0) {
            return response()->json($starts);
        }

        $contains = DB::table('job_titles')
            ->where('title_norm', 'like', '%' . $qNorm . '%')
            ->whereNotIn('title', $starts)
            ->orderBy('title_norm')
            ->limit($remaining)
            ->pluck('title')
            ->toArray();

        return response()->json(array_values(array_merge($starts, $contains)));
    }
}
