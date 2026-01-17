import api from "./api";

export type ChatRoom = {
  id: number;
  name: string;
  domain_key: string;
};

export type ChatUser = {
  id: number;
  name: string;
  avatar?: string | null;
};

export type ChatMessage = {
  id: number;
  room_id: number;
  body: string;
  created_at?: string;
  user: ChatUser;
};

export async function listRooms(domain?: string) {
  const { data } = await api.get<ChatRoom[]>("/chat/rooms", {
    params: domain ? { domain } : {},
  });
  return data;
}

export async function joinRoom(roomId: number) {
  await api.post(`/chat/rooms/${roomId}/join`);
}

export async function fetchMessages(roomId: number) {
  const { data } = await api.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`);
  return data;
}

export async function sendMessage(roomId: number, body: string) {
  const { data } = await api.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, { body });
  return data;
}
