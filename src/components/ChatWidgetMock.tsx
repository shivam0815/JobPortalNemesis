// src/components/ChatWidgetMock.tsx
// Product-ready Community card (NO floating movement).
// Shine + room highlight retained.
// ✅ Backend connected: rooms, join, messages, send.

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, UserPlus, Sparkles, ArrowRight, Send } from "lucide-react";
import {
  listRooms,
  joinRoom,
  fetchMessages,
  sendMessage,
  type ChatRoom,
  type ChatMessage,
} from "../lib/chatApi";

export default function ChatWidgetMock() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  const tRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const activeRoom = useMemo(() => rooms[activeIdx] || null, [rooms, activeIdx]);
  const activeRoomName = useMemo(
    () => activeRoom?.name || (loadingRooms ? "Loading..." : "No rooms"),
    [activeRoom, loadingRooms]
  );

  // Load rooms once
  useEffect(() => {
    (async () => {
      try {
        setLoadingRooms(true);
        const data = await listRooms(); // optionally: listRooms("jobs")
        setRooms(data);
        setActiveIdx(0);
      } finally {
        setLoadingRooms(false);
      }
    })();
  }, []);

  // Auto-shuffle highlight (every 2.5s) ONLY if rooms loaded
  useEffect(() => {
    if (!rooms.length) return;

    if (tRef.current) window.clearInterval(tRef.current);
    tRef.current = window.setInterval(() => {
      setActiveIdx((p) => (p + 1) % rooms.length);
    }, 2500);

    return () => {
      if (tRef.current) window.clearInterval(tRef.current);
    };
  }, [rooms.length]);

  // When active room changes: join + fetch messages
  useEffect(() => {
    if (!activeRoom) return;

    (async () => {
      try {
        setLoadingMsgs(true);
        await joinRoom(activeRoom.id);
        const msgs = await fetchMessages(activeRoom.id);
        setMessages(msgs);
      } finally {
        setLoadingMsgs(false);
      }
    })();
  }, [activeRoom?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function onSend() {
    const body = text.trim();
    if (!activeRoom || !body) return;

    setText("");

    // optimistic temp message
    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        room_id: activeRoom.id,
        body,
        user: { id: 0, name: "You" },
      } as ChatMessage,
    ]);

    try {
      const saved = await sendMessage(activeRoom.id, body);
      setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
    } catch (e) {
      // rollback if fail
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  }

  return (
    <aside className="relative rounded-3xl border border-white/10 bg-white/6 p-6 shadow-card overflow-hidden">
      {/* shine sweep */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl community-shine" />

      {/* header */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-xs text-white/85">
            <Sparkles size={14} /> Community
          </div>
          <h3 className="mt-2 text-xl font-extrabold">Join Groups & Get Alerts</h3>
          <p className="text-white/75 mt-1 text-sm">
            Follow companies, get job updates, and chat in rooms.
          </p>
        </div>

        <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
          <MessageCircle size={18} />
        </div>
      </div>

      {/* follow card (UI kept) */}
      <div className="relative mt-5 rounded-3xl bg-white/6 border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-extrabold">Follow Nemesis Group</div>
            <p className="text-white/70 text-sm mt-1">
              Get job alerts, updates, and interview notifications.
            </p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/12 text-white/85">
            <Sparkles size={14} /> Live
          </span>
        </div>

        <button className="mt-3 w-full h-11 rounded-full bg-white text-[#0B2B6B] font-extrabold inline-flex items-center justify-center gap-2 hover:opacity-95 transition">
          <UserPlus size={16} /> Follow Company
        </button>
      </div>

      {/* room shuffle + messages */}
      <div className="relative mt-4 rounded-3xl bg-white/6 border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold">Chat Rooms</div>
          <div className="text-xs text-white/70">
            Active: <span className="text-white font-semibold">{activeRoomName}</span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {loadingRooms ? (
            <div className="text-sm text-white/70">Loading rooms...</div>
          ) : (
            rooms.map((r, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={r.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                  className={
                    "w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between " +
                    (isActive
                      ? "bg-white text-[#061433] border-transparent room-pop"
                      : "bg-white/6 hover:bg-white/8 border-white/10")
                  }
                >
                  <span className={isActive ? "font-extrabold" : "font-semibold"}>{r.name}</span>
                  <span className={isActive ? "opacity-100" : "opacity-0"} aria-hidden>
                    <ArrowRight size={16} />
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-3 text-xs text-white/65">
          Tip: Join “Interview Tips” for daily short guidance.
        </div>

        {/* messages panel */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 overflow-hidden">
          <div className="px-3 py-2 text-xs text-white/70 border-b border-white/10">
            {loadingMsgs ? "Loading messages..." : "Messages (last 50)"}
          </div>

          <div className="max-h-52 overflow-y-auto px-3 py-2 space-y-2">
            {!loadingMsgs && messages.length === 0 ? (
              <div className="text-sm text-white/70">No messages yet. Say hi 👋</div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="text-sm">
                  <span className="text-white/85 font-semibold">{m.user?.name || "User"}:</span>{" "}
                  <span className="text-white/80">{m.body}</span>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* send box */}
          <div className="p-3 border-t border-white/10 flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend();
              }}
              placeholder="Type a message..."
              className="flex-1 h-10 rounded-full bg-white/10 border border-white/12 px-4 text-sm text-white outline-none placeholder:text-white/50"
            />
            <button
              onClick={onSend}
              className="h-10 w-10 rounded-full bg-white text-[#0B2B6B] grid place-items-center hover:opacity-95 transition"
              aria-label="Send"
              title="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* inline CSS (float removed) */}
      <style>{`
        .community-shine{
          background: linear-gradient(
            120deg,
            transparent 35%,
            rgba(255,255,255,0.10),
            transparent 65%
          );
          transform: translateX(-120%);
          animation: commShine 6s linear infinite;
        }
        @keyframes commShine{
          0%{ transform: translateX(-120%); }
          100%{ transform: translateX(120%); }
        }

        .room-pop{
          animation: roomPop 420ms ease-out;
        }
        @keyframes roomPop{
          0%{ transform: translateY(6px); opacity: .5; }
          100%{ transform: translateY(0); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce){
          .community-shine, .room-pop{ animation: none !important; }
        }
      `}</style>
    </aside>
  );
}
