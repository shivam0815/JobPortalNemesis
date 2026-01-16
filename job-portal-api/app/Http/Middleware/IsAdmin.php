<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $plain = $request->bearerToken();
        if (!$plain) return response()->json(['message' => 'Unauthenticated'], 401);

        $pat = PersonalAccessToken::findToken($plain);

        if (!$pat || !in_array('admin', $pat->abilities ?? [])) {
            return response()->json(['message' => 'Admin only'], 403);
        }

        return $next($request);
    }
}
