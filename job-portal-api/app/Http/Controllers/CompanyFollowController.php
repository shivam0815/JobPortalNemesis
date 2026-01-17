<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyFollow;
use Illuminate\Http\Request;

class CompanyFollowController extends Controller
{
    // Follow a company
    public function follow(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
        ]);

        $user = Auth::user();

        CompanyFollow::firstOrCreate([
            'user_id' => $user->id,
            'company_name' => $data['company_name'],
        ]);

        return response()->json([
            'message' => 'Company followed',
        ]);
    }

    // Unfollow a company
    public function unfollow(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
        ]);

        $user = Auth::user();

        CompanyFollow::where('user_id', $user->id)
            ->where('company_name', $data['company_name'])
            ->delete();

        return response()->json([
            'message' => 'Company unfollowed',
        ]);
    }

    // Get followed companies (for candidate)
    public function myFollows()
    {
        $user = Auth::user();

        $companies = CompanyFollow::where('user_id', $user->id)
            ->pluck('company_name');

        return response()->json($companies);
    }
}
