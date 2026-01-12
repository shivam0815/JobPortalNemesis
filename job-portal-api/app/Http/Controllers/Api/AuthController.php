<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Candidate;
use App\Models\Employer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function google(Request $request)
    {
        Log::info('[AUTH][GOOGLE] Request received', [
            'ip' => $request->ip(),
        ]);

        $request->validate([
            'google_token' => 'required|string',
        ]);

        Log::info('[AUTH][GOOGLE] Token received');

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->google_token,
        ]);

        if (!$response->ok()) {
            Log::warning('[AUTH][GOOGLE] Invalid Google token', [
                'response' => $response->body(),
            ]);

            return response()->json(['message' => 'Invalid Google token'], 401);
        }

        $googleUser = $response->json();

        // ✅ Validate token belongs to your Google OAuth client
        $googleClientId = config('services.google.client_id');

        if (empty($googleUser['aud']) || $googleUser['aud'] !== $googleClientId) {
            Log::warning('[AUTH][GOOGLE] Invalid audience', [
                'aud' => $googleUser['aud'] ?? null,
            ]);
            return response()->json(['message' => 'Invalid Google token audience'], 401);
        }

        if (
            empty($googleUser['iss']) ||
            !in_array($googleUser['iss'], ['accounts.google.com', 'https://accounts.google.com'], true)
        ) {
            Log::warning('[AUTH][GOOGLE] Invalid issuer', [
                'iss' => $googleUser['iss'] ?? null,
            ]);
            return response()->json(['message' => 'Invalid Google token issuer'], 401);
        }

        if (empty($googleUser['email']) || ($googleUser['email_verified'] ?? 'false') !== 'true') {
            Log::warning('[AUTH][GOOGLE] Email not verified', [
                'email_verified' => $googleUser['email_verified'] ?? null,
            ]);
            return response()->json(['message' => 'Google email not verified'], 401);
        }

        Log::info('[AUTH][GOOGLE] Google token verified', [
            'email' => $googleUser['email'] ?? null,
            'sub'   => $googleUser['sub'] ?? null,
        ]);

        $user = User::where('email', $googleUser['email'])->first();

        if (!$user) {
            $user = User::create([
                'name'      => $googleUser['name'] ?? '',
                'email'     => $googleUser['email'],
                'google_id' => $googleUser['sub'] ?? null,
                'avatar'    => $googleUser['picture'] ?? null,

                // ✅ OPTION B: Set a random password so DB insert won't fail
                'password'  => Hash::make(Str::random(32)),
            ]);

            Log::info('[AUTH][GOOGLE] New user created', [
                'user_id' => $user->id,
                'email'   => $user->email,
            ]);
        } else {
            $user->update([
                // keep existing google_id/avatar if already set
                'google_id' => $user->google_id ?: ($googleUser['sub'] ?? null),
                'avatar'    => $user->avatar ?: ($googleUser['picture'] ?? null),
            ]);

            Log::info('[AUTH][GOOGLE] Existing user logged in', [
                'user_id' => $user->id,
                'email'   => $user->email,
                'role'    => $user->role,
            ]);
        }

        // Role not selected yet
        if (!$user->role) {
            $token = $user->createToken('api')->plainTextToken;

            Log::info('[AUTH][GOOGLE] Role missing, temp token issued', [
                'user_id' => $user->id,
            ]);

            return response()->json([
                'needs_role' => true,
                'token'      => $token,
                'user'       => $user,
            ]);
        }

        // Role already exists
        $token = $user->createToken('api')->plainTextToken;

        Log::info('[AUTH][GOOGLE] Login successful', [
            'user_id' => $user->id,
            'role'    => $user->role,
        ]);

        return response()->json([
            'token' => $token,
            'user'  => $user,
            'role'  => $user->role,
        ]);
    }

    public function selectRole(Request $request)
    {
        Log::info('[AUTH][ROLE] Role selection request', [
            'auth_user_id' => optional($request->user())->id,
        ]);

        $request->validate([
            'role' => ['required', Rule::in(['candidate', 'employer'])],
        ]);

        $user = $request->user();

        if (!$user) {
            Log::warning('[AUTH][ROLE] Unauthorized role request');
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($user->role) {
            Log::warning('[AUTH][ROLE] Role already set', [
                'user_id' => $user->id,
                'role'    => $user->role,
            ]);

            return response()->json(['message' => 'Role already selected'], 400);
        }

        $user->role = $request->role;
        $user->save();

        Log::info('[AUTH][ROLE] Role saved', [
            'user_id' => $user->id,
            'role'    => $user->role,
        ]);

        if ($request->role === 'candidate') {
            Candidate::create(['user_id' => $user->id]);
            Log::info('[AUTH][ROLE] Candidate profile created', ['user_id' => $user->id]);
        }

        if ($request->role === 'employer') {
            Employer::create(['user_id' => $user->id]);
            Log::info('[AUTH][ROLE] Employer profile created', ['user_id' => $user->id]);
        }

        // Token rotation (optional: delete old token if you want)
        $token = $user->createToken('api')->plainTextToken;

        Log::info('[AUTH][ROLE] Role selection complete', [
            'user_id' => $user->id,
            'new_token_issued' => true,
        ]);

        return response()->json([
            'message' => 'Role set successfully',
            'token'   => $token,
            'user'    => $user,
            'role'    => $user->role,
        ]);
    }
}
