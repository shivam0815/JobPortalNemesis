<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /api/notifications
    public function index(Request $request)
    {
        $list = Notification::where('user_id', $request->user()->id)
            ->orderByDesc('id')
            ->limit(50)
            ->get();

        return response()->json($list);
    }

    // PATCH /api/notifications/{id}/read
    public function markRead(Request $request, $id)
    {
        $n = Notification::where('user_id', $request->user()->id)->findOrFail($id);
        $n->is_read = true;
        $n->save();

        return response()->json(['message' => 'ok']);
    }

    // PATCH /api/notifications/read-all
    public function readAll(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'ok']);
    }
}
