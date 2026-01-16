<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminUsersController extends Controller
{
    private function baseUserQuery(Request $request, string $role)
    {
        $q = trim((string) $request->query('q', ''));
        $query = User::where('role', $role);

        if ($q !== '') {
            $query->where(function($w) use ($q) {
                $w->where('name', 'like', "%$q%")
                  ->orWhere('email', 'like', "%$q%")
                  ->orWhere('phone', 'like', "%$q%");
            });
        }

        return $query;
    }

    public function customers(Request $request)
    {
        $limit = (int) $request->query('limit', 20);
        return response()->json(
            $this->baseUserQuery($request, 'candidate')->latest()->paginate($limit)
        );
    }

    public function employees(Request $request)
    {
        $limit = (int) $request->query('limit', 20);
        return response()->json(
            $this->baseUserQuery($request, 'employer')->latest()->paginate($limit)
        );
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['user' => $user]);
    }
}
