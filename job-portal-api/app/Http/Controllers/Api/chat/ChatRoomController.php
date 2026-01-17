<?php

namespace App\Http\Controllers\Api\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatRoom;
use App\Models\ChatRoomMember;
use Illuminate\Http\Request;

class ChatRoomController extends Controller
{
    public function index(Request $request)
    {
        $domain = $request->query('domain');

        $q = ChatRoom::query()->orderBy('name');

        if ($domain) $q->where('domain_key', $domain);

        return response()->json($q->get());
    }

    public function join(Request $request, ChatRoom $room)
    {
        ChatRoomMember::firstOrCreate(
            ['room_id' => $room->id, 'user_id' => $request->user()->id],
            ['role' => 'member']
        );

        return response()->json(['ok' => true]);
    }
}
