<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;

class CandidateProfileController extends Controller
{
    // GET /api/candidate/profile
    public function show(Request $request)
    {
        $user = $request->user();

        $candidate = Candidate::where('user_id', $user->id)->first();

        // If profile not created yet, return defaults
        if (!$candidate) {
            return response()->json([
                'phone' => $user->phone ?? '',
                'city' => '',
                'resume_path' => null,
            ]);
        }

        return response()->json([
            'phone' => $user->phone ?? '',
            'city' => $candidate->current_city ?? '',
            'resume_path' => $candidate->resume_path ?? ($candidate->video_resume_path ?? null),
        ]);
    }

    // POST /api/candidate/profile (multipart/form-data)
    public function upsert(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'phone'  => ['required', 'string', 'max:30'],
            'city'   => ['required', 'string', 'max:100'],
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB
        ]);

        // ✅ phone USERS table me save hoga
        $user->forceFill(['phone' => $data['phone']])->save();

        // ✅ Candidate row ensure (do NOT use phone/city columns, they don't exist)
        $candidate = Candidate::firstOrCreate(
            ['user_id' => $user->id],
            [
                'full_name' => $user->name ?? '',
                'email' => $user->email ?? '',
                'current_city' => $data['city'],
            ]
        );

        // ✅ only existing columns
        $update = [
            'current_city' => $data['city'],
        ];

        // ✅ Resume upload (resume_path agar hai to use, warna video_resume_path)
        if ($request->hasFile('resume')) {
            $path = $request->file('resume')->store('resumes', 'public');

            $table = $candidate->getTable();
            $schema = $candidate->getConnection()->getSchemaBuilder();

            if ($schema->hasColumn($table, 'resume_path')) {
                $update['resume_path'] = $path;
            } elseif ($schema->hasColumn($table, 'video_resume_path')) {
                $update['video_resume_path'] = $path;
            }
        }

        $candidate->update($update);

        return response()->json([
            'message' => 'Profile updated',
            'profile' => [
                'phone' => $user->phone ?? '',
                'city' => $candidate->current_city ?? '',
                'resume_path' => $candidate->resume_path ?? ($candidate->video_resume_path ?? null),
            ],
        ], 200);
    }
}
