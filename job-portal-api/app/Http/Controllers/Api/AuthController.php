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
use App\Models\EmailOtp;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

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


public function requestEmailOtp(Request $request)
{
    $data = $request->validate([
        'email' => ['required', 'email', 'max:255'],
    ]);

    $email = strtolower(trim($data['email']));

    $otp = (string) random_int(100000, 999999);
    $minutes = 10;

    EmailOtp::updateOrCreate(
        ['email' => $email],
        [
            'otp_hash' => Hash::make($otp),
            'expires_at' => Carbon::now()->addMinutes($minutes),
            'attempts' => 0,
            'verified_at' => null,
        ]
    );

    Mail::to($email)->send(new OtpMail($otp, $minutes));

    return response()->json([
        'ok' => true,
        'message' => 'OTP sent',
    ]);
}



public function verifyEmailOtp(Request $request)
{
    $data = $request->validate([
        'email' => ['required', 'email', 'max:255'],
        'otp' => ['required', 'digits:6'],
    ]);

    $email = strtolower(trim($data['email']));
    $row = EmailOtp::where('email', $email)->first();

    if (!$row) return response()->json(['message' => 'OTP not found'], 404);
    if ($row->verified_at) return response()->json(['message' => 'OTP already verified'], 400);
    if (Carbon::now()->gt($row->expires_at)) return response()->json(['message' => 'OTP expired'], 400);
    if ($row->attempts >= 5) return response()->json(['message' => 'Too many attempts'], 429);

    // count attempt
    $row->attempts = $row->attempts + 1;
    $row->save();

    if (!Hash::check($data['otp'], $row->otp_hash)) {
        return response()->json(['message' => 'Invalid OTP'], 400);
    }

    $row->verified_at = Carbon::now();
    $row->save();

    // simple signed otp token (valid for set-password step)
    $otpToken = hash_hmac(
        'sha256',
        $email . '|' . $row->verified_at->timestamp,
        config('app.key')
    );

    return response()->json([
        'ok' => true,
        'otp_verified' => true,
        'otp_token' => $otpToken,
    ]);
}



public function setPasswordAfterOtp(Request $request)
{
    $data = $request->validate([
        'email' => ['required', 'email', 'max:255'],
        'password' => ['required', 'string', 'min:8'],
        'role' => ['required', Rule::in(['candidate', 'employer'])],
        'name' => ['nullable', 'string', 'max:255'],
    ]);

    $email = strtolower(trim($data['email']));
    $otpToken = $request->bearerToken();

    if (!$otpToken) {
        return response()->json(['message' => 'OTP token missing'], 401);
    }

    $row = EmailOtp::where('email', $email)->first();
    if (!$row || !$row->verified_at) {
        return response()->json(['message' => 'OTP not verified'], 400);
    }

    // otp token validate (allow only within 15 minutes of verification)
    $expected = hash_hmac(
        'sha256',
        $email . '|' . $row->verified_at->timestamp,
        config('app.key')
    );

    if (!hash_equals($expected, $otpToken)) {
        return response()->json(['message' => 'Invalid OTP token'], 401);
    }

    if (Carbon::now()->diffInMinutes($row->verified_at) > 15) {
        return response()->json(['message' => 'OTP token expired'], 401);
    }

    // create or update user
    $user = User::where('email', $email)->first();

    if ($user && $user->google_id && empty($user->password)) {
        // if you ever make password nullable for google-only, block here.
        // currently you set random password, so this block might not hit.
    }

    if (!$user) {
        $user = User::create([
            'name' => $data['name'] ?: 'User',
            'email' => $email,
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'email_verified_at' => Carbon::now(),
        ]);
    } else {
        // update password + role if missing
        $user->password = Hash::make($data['password']);
        if (!$user->role) $user->role = $data['role'];
        if (!$user->email_verified_at) $user->email_verified_at = Carbon::now();
        if (!empty($data['name']) && empty($user->name)) $user->name = $data['name'];
        $user->save();
    }

    // create profile if not exists
    if ($user->role === 'candidate') {
        Candidate::firstOrCreate(['user_id' => $user->id]);
    } else if ($user->role === 'employer') {
        Employer::firstOrCreate(['user_id' => $user->id]);
    }

    // consume otp row (optional)
    $row->delete();

    $token = $user->createToken('api')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
        'role' => $user->role,
    ]);
}



public function loginWithPassword(Request $request)
{
    $data = $request->validate([
        'email' => ['required', 'email', 'max:255'],
        'password' => ['required', 'string'],
    ]);

    $email = strtolower(trim($data['email']));
    $user = User::where('email', $email)->first();

    if (!$user) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // if user signed up with google and you want to block password login until they set password:
    // if ($user->google_id && empty($user->password)) return response()->json(['message' => 'Use Google login'], 400);

    if (!Hash::check($data['password'], $user->password ?? '')) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('api')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
        'role' => $user->role,
    ]);
}




}
