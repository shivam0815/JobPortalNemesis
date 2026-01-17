<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompanyFollow;
use Illuminate\Http\Request;

class CompanyFollowController extends Controller
{
    // POST /api/company/follow  { company_name }
    public function follow(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
        ]);

        $name = trim(preg_replace('/\s+/', ' ', $data['company_name']));

        CompanyFollow::firstOrCreate([
            'user_id' => $request->user()->id,
            'company_name' => $name,
        ]);

        return response()->json(['message' => 'followed']);
    }

    // POST /api/company/unfollow  { company_name }
    public function unfollow(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
        ]);

        $name = trim(preg_replace('/\s+/', ' ', $data['company_name']));

        CompanyFollow::where('user_id', $request->user()->id)
            ->where('company_name', $name)
            ->delete();

        return response()->json(['message' => 'unfollowed']);
    }

    // GET /api/company/follows  (current user)
    public function myFollows(Request $request)
    {
        $list = CompanyFollow::where('user_id', $request->user()->id)
            ->orderByDesc('id')
            ->pluck('company_name');

        return response()->json($list);
    }
}
