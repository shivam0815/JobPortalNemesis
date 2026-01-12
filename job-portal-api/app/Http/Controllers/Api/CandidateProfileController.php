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

        // If profile not created yet, return empty defaults
        if (!$candidate) {
            return response()->json([
                'phone' => $user->phone ?? '',
                'city' => '',
                'resume_path' => null,
            ]);
        }

        return response()->json([
            'phone' => $candidate->phone ?? ($user->phone ?? ''),
            'city' => $candidate->city ?? ($candidate->current_city ?? ''),
            'resume_path' => $candidate->resume_path ?? null,
        ]);
    }

    // POST /api/candidate/profile  (multipart/form-data)
    public function upsert(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'phone'  => ['required', 'string', 'max:30'],
            'city'   => ['required', 'string', 'max:100'],
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB
        ]);

        $candidate = Candidate::firstOrCreate(
            ['user_id' => $user->id],
            [
                'phone' => $data['phone'],
                'city'  => $data['city'],
            ]
        );

        $update = [
            'phone' => $data['phone'],
            'city'  => $data['city'],
        ];

        // If you also have current_city column, keep in sync (safe)
        if ($candidate->getConnection()
            ->getSchemaBuilder()
            ->hasColumn($candidate->getTable(), 'current_city')
        ) {
            $update['current_city'] = $data['city'];
        }

        if ($request->hasFile('resume')) {
            $path = $request->file('resume')->store('resumes', 'public');
            $update['resume_path'] = $path;
        }

        $candidate->update($update);

        return response()->json([
            'message' => 'Profile updated',
            'profile' => [
                'phone' => $candidate->phone,
                'city' => $candidate->city,
                'resume_path' => $candidate->resume_path,
            ],
        ], 200);
    }
}
