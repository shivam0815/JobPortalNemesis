<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name'    => ['required', 'string', 'max:120'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'email'   => ['required', 'email', 'max:180'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string', 'min:5', 'max:5000'],
        ]);

        if ($v->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $v->errors(),
            ], 422);
        }

        $msg = ContactMessage::create([
            'name'       => $request->name,
            'phone'      => $request->phone,
            'email'      => $request->email,
            'subject'    => $request->subject,
            'message'    => $request->message,
            'status'     => 'new',
            'ip'         => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 512),
        ]);

        return response()->json([
            'message' => 'Message submitted successfully',
            'data' => [
                'id' => $msg->id,
                'status' => $msg->status,
                'created_at' => $msg->created_at,
            ],
        ], 201);
    }
}
