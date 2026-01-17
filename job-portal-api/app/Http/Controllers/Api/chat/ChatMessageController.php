<?php

namespace App\Http\Controllers\Api\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Models\ChatRoomMember;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    public function index(Request $request, ChatRoom $room)
    {
        $isMember = ChatRoomMember::where('room_id', $room->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if (!$isMember) return response()->json(['message' => 'Not a room member'], 403);

        $messages = ChatMessage::where('room_id', $room->id)
            ->with('user:id,name,avatar')
            ->orderByDesc('id')
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json($messages);
    }

    public function store(Request $request, ChatRoom $room)
    {
        $request->validate(['body' => 'required|string|max:2000']);

        $isMember = ChatRoomMember::where('room_id', $room->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if (!$isMember) return response()->json(['message' => 'Not a room member'], 403);

        $msg = ChatMessage::create([
            'room_id' => $room->id,
            'user_id' => $request->user()->id,
            'body' => $request->body,
        ]);

        return response()->json($msg->load('user:id,name,avatar'), 201);
    }
}
