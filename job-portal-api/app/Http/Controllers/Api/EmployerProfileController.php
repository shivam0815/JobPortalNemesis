<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployerProfileController extends Controller
{
    /**
     * GET employer company profile
     */
    public function show()
    {
        $user = Auth::user();

        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'company_name' => $user->company_name,
            'company_email' => $user->company_email,
            'company_phone' => $user->company_phone,
            'company_hr_name' => $user->company_hr_name,
        ]);
    }

    /**
     * UPDATE employer company profile
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_email' => 'nullable|email|max:255',
            'company_phone' => 'nullable|string|max:30',
            'company_hr_name' => 'nullable|string|max:255',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Company profile updated successfully',
            'data' => $data,
        ]);
    }
}
