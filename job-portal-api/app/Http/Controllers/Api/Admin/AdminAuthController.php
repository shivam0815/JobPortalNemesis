<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required','email'],
            'password' => ['required','string'],
        ]);

        $adminEmails = config('admin.emails');
        $adminPassword = config('admin.password');

        if (!in_array($data['email'], $adminEmails, true) || $data['password'] !== $adminPassword) {
            return response()->json(['message' => 'Invalid admin credentials'], 401);
        }

        // ✅ token to return
        $plain = bin2hex(random_bytes(32));
        $hashed = hash('sha256', $plain);

        // ✅ insert FULL required fields (no mass-assignment problems)
        DB::table('personal_access_tokens')->insert([
            'tokenable_type' => 'admin',
            'tokenable_id'   => 0,
            'name'           => 'admin-token',
            'token'          => $hashed,
            'abilities'      => json_encode(['admin']),
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);

        return response()->json([
            'token' => $plain,
            'admin' => [
                'email' => $data['email'],
                'role' => 'admin',
            ],
        ]);
    }

    public function me()
    {
        return response()->json(['admin' => ['role' => 'admin']]);
    }

    public function logout(Request $request)
    {
        $plain = $request->bearerToken();
        if (!$plain) return response()->json(['message' => 'Logged out']);

        $pat = PersonalAccessToken::findToken($plain);
        $pat?->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
