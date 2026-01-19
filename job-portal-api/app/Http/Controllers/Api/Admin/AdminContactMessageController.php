<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class AdminContactMessageController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status'); // new/read/replied/closed
        $q = $request->query('q'); // search
        $perPage = (int) ($request->query('limit', 20));
        $perPage = max(5, min($perPage, 100));

        $query = ContactMessage::query()->latest('id');

        if ($status) {
            $query->where('status', $status);
        }

        if ($q) {
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                  ->orWhere('email', 'like', "%{$q}%")
                  ->orWhere('phone', 'like', "%{$q}%")
                  ->orWhere('subject', 'like', "%{$q}%")
                  ->orWhere('message', 'like', "%{$q}%");
            });
        }

        $data = $query->paginate($perPage);

        return response()->json([
            'message' => 'ok',
            'data' => $data->items(),
            'meta' => [
                'page' => $data->currentPage(),
                'totalPages' => $data->lastPage(),
                'total' => $data->total(),
                'limit' => $data->perPage(),
            ]
        ]);
    }

    public function show($id)
    {
        $msg = ContactMessage::findOrFail($id);

        // auto mark as read when opened
        if ($msg->status === 'new') {
            $msg->status = 'read';
            $msg->read_at = now();
            $msg->save();
        }

        return response()->json(['message' => 'ok', 'data' => $msg]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => ['required', 'in:new,read,replied,closed'],
        ]);

        $msg = ContactMessage::findOrFail($id);
        $msg->status = $request->status;

        if ($request->status !== 'new' && !$msg->read_at) {
            $msg->read_at = now();
        }

        $msg->save();

        return response()->json(['message' => 'updated', 'data' => $msg]);
    }

    public function destroy($id)
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->delete();

        return response()->json(['message' => 'deleted']);
    }
}
