// src/pages/ChatRoomPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import {
  listRooms,
  joinRoom,
  fetchMessages,
  sendMessage,
  type ChatRoom,
  type ChatMessage,
} from "../lib/chatApi";

export default function ChatRoomPage() {
  const nav = useNavigate();
  const { roomId } = useParams();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeId, setActiveId] = useState<string | number | null>(roomId || null);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);

  // TODO: real auth user id
  const MY_ID = 0;

  const activeRoom = useMemo(
    () => rooms.find((r) => String(r.id) === String(activeId)) || null,
    [rooms, activeId]
  );

  const isNearBottom = () => {
    const el = listRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 80;
  };

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // Load rooms
  useEffect(() => {
    (async () => {
      try {
        setLoadingRooms(true);
        const data = await listRooms();
        setRooms(data || []);
      } finally {
        setLoadingRooms(false);
      }
    })();
  }, []);

  // Sync active room with URL
  useEffect(() => {
    if (roomId) setActiveId(roomId);
  }, [roomId]);

  // If no roomId, set first room as default
  useEffect(() => {
    if (roomId) return;
    if (!rooms.length) return;
    setActiveId(rooms[0].id);
  }, [roomId, rooms]);

  // Join + fetch messages when active changes
  useEffect(() => {
    if (!activeRoom?.id) return;

    (async () => {
      try {
        setLoadingMsgs(true);
        const wasAtBottom = isNearBottom();

        await joinRoom(activeRoom.id);
        const msgs = await fetchMessages(activeRoom.id);
        setMessages(msgs || []);

        requestAnimationFrame(() => {
          if (wasAtBottom) scrollToBottom();
        });
      } finally {
        setLoadingMsgs(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoom?.id]);

  // Keep bottom on new messages only if already at bottom
  useEffect(() => {
    if (!messages.length) return;
    if (!isNearBottom()) return;
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  async function onSend() {
    const body = text.trim();
    if (!activeRoom?.id || !body) return;

    setText("");

    const tempId = Date.now();
    setMessages((p) => [
      ...p,
      { id: tempId, room_id: activeRoom.id, body, user: { id: MY_ID, name: "You" } } as any,
    ]);

    requestAnimationFrame(scrollToBottom);

    try {
      const saved = await sendMessage(activeRoom.id, body);
      setMessages((p) => p.map((m) => (m.id === tempId ? saved : m)));
    } catch {
      setMessages((p) => p.filter((m) => m.id !== tempId));
    }
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#1F4F8F] px-4 md:px-8 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 min-w-0">
        {/* Rooms */}
        <aside className="rounded-3xl border border-white/10 bg-white/6 p-4 min-w-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => nav(-1)}
              className="inline-flex items-center gap-2 text-white/85 text-sm font-semibold hover:text-white"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="text-white/80 text-sm font-extrabold">Rooms</div>
          </div>

          <div className="mt-4 space-y-2">
            {loadingRooms ? (
              <div className="text-white/70 text-sm">Loading rooms...</div>
            ) : rooms.length === 0 ? (
              <div className="text-white/70 text-sm">No rooms.</div>
            ) : (
              rooms.map((r) => {
                const isActive = String(r.id) === String(activeId);
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveId(r.id);
                      nav(`/chat/${r.id}`);
                    }}
                    className={
                      "w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between " +
                      (isActive
                        ? "bg-white text-[#061433] border-transparent"
                        : "bg-white/6 hover:bg-white/8 border-white/10 text-white")
                    }
                  >
                    <span className={isActive ? "font-extrabold" : "font-semibold"}>{r.name}</span>
                    <MessageCircle size={16} className={isActive ? "opacity-100" : "opacity-70"} />
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat */}
        <section className="rounded-3xl border border-white/10 bg-white/6 overflow-hidden flex flex-col min-w-0">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="text-white font-extrabold text-lg truncate">
              {activeRoom?.name || "Chat"}
            </div>
            <div className="text-white/70 text-xs">
              {loadingMsgs ? "Loading..." : "You are in this room"}
            </div>
          </div>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-2 max-h-[70vh] lg:max-h-none"
          >
            {!loadingMsgs && messages.length === 0 ? (
              <div className="text-white/70 text-sm">No messages yet.</div>
            ) : (
              messages.map((m) => {
                const mine = (m.user?.id ?? -1) === MY_ID || m.user?.name === "You";
                return (
                  <div key={m.id} className={"flex " + (mine ? "justify-end" : "justify-start")}>
                    <div className="max-w-[85%]">
                      {!mine && (
                        <div className="text-[11px] text-white/65 mb-1 px-1">
                          {m.user?.name || "User"}
                        </div>
                      )}
                      <div
                        className={
                          "rounded-2xl px-3 py-2 text-sm border " +
                          (mine
                            ? "bg-white text-[#061433] border-transparent"
                            : "bg-black/10 text-white/85 border-white/10")
                        }
                      >
                        {m.body}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend();
              }}
              placeholder="Type a message..."
              className="flex-1 h-11 rounded-full bg-white/10 border border-white/12 px-4 text-sm text-white outline-none placeholder:text-white/50"
            />
            <button
              onClick={onSend}
              className="h-11 w-11 rounded-full bg-white text-[#0B2B6B] grid place-items-center hover:opacity-95 transition"
              aria-label="Send"
              title="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
