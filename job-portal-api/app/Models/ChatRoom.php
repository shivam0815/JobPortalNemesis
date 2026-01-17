<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    protected $fillable = ['name','domain_key','description','created_by'];

    public function members()
    {
        return $this->hasMany(ChatRoomMember::class, 'room_id');
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'room_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
