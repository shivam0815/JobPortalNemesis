// src/components/ChatWidgetMock.tsx
// Proper 2-pane chat UI (Rooms sidebar + Chat panel) — mobile-first (always visible)
// ✅ Stops auto-shuffle after user interaction
// ✅ Safe autoscroll (no page jump)
// ✅ Mobile: stacked layout, vh-based heights, no clipping

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Sparkles, ArrowRight, Send } from "lucide-react";
import {
  listRooms,
  joinRoom,
  fetchMessages,
  sendMessage,
  type ChatRoom,
  type ChatMessage,
} from "../lib/chatApi";
import { useNavigate } from "react-router-dom";

export default function ChatWidgetMock() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
const navigate = useNavigate();

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  // --- refs
  const tRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // stop auto-shuffle after user touches the widget
  const userInteractedRef = useRef(false);

  // TODO: replace with real auth id if available
  const MY_ID = 0;

  const activeRoom = useMemo(() => rooms[activeIdx] || null, [rooms, activeIdx]);

  const activeRoomName = useMemo(() => {
    if (loadingRooms) return "Loading...";
    return activeRoom?.name || "No rooms";
  }, [activeRoom, loadingRooms]);

  const markUserInteracted = () => {
    userInteractedRef.current = true;
    if (tRef.current) window.clearInterval(tRef.current);
    tRef.current = null;
  };

  const isNearBottom = () => {
    const el = listRef.current;
    if (!el) return true;
    const threshold = 70;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    const el = listRef.current;
    if (!el) return;
    if (behavior === "smooth") el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    else el.scrollTop = el.scrollHeight;
  };

  // Load rooms once
  useEffect(() => {
    (async () => {
      try {
        setLoadingRooms(true);
        const data = await listRooms();
        setRooms(data || []);
        setActiveIdx(0);
      } finally {
        setLoadingRooms(false);
      }
    })();
  }, []);

  // Auto-shuffle highlight (2.5s) only if user not interacted
  useEffect(() => {
    if (!rooms.length) return;
    if (userInteractedRef.current) return;

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
    if (!activeRoom?.id) return;

    (async () => {
      try {
        setLoadingMsgs(true);

        const wasAtBottom = isNearBottom();

        await joinRoom(activeRoom.id);
        const msgs = await fetchMessages(activeRoom.id);
        setMessages(msgs || []);

        requestAnimationFrame(() => {
          if (wasAtBottom) scrollToBottom("auto");
        });
      } finally {
        setLoadingMsgs(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoom?.id]);

  // On new messages: keep at bottom only if already near bottom
  useEffect(() => {
    if (!messages.length) return;
    if (!isNearBottom()) return;
    scrollToBottom("auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  async function onSend() {
    const body = text.trim();
    if (!activeRoom?.id || !body) return;

    markUserInteracted();
    setText("");

    const tempId = Date.now();
    const optimistic: ChatMessage = {
      id: tempId,
      room_id: activeRoom.id,
      body,
      user: { id: MY_ID, name: "You" },
    } as ChatMessage;

    setMessages((prev) => [...prev, optimistic]);
    requestAnimationFrame(() => scrollToBottom("auto"));

    try {
      const saved = await sendMessage(activeRoom.id, body);
      setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  }

  return (
    <aside
      className="relative w-full rounded-3xl border border-white/10 bg-white/6 p-5 shadow-card overflow-hidden"
      onMouseDown={markUserInteracted}
      onTouchStart={markUserInteracted}
      onFocusCapture={markUserInteracted}
    >
      <span className="pointer-events-none absolute inset-0 rounded-3xl community-shine" />

      {/* header */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-xs text-white/85">
            <Sparkles size={14} /> Community Chat
          </div>
          <h3 className="mt-2 text-xl font-extrabold">Chat Rooms</h3>
          <p className="text-white/75 mt-1 text-sm">Join a room and chat with others.</p>
        </div>

        <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
          <MessageCircle size={18} />
        </div>
      </div>

      {/* IMPORTANT: mobile-first stack; desktop split */}
<div className="relative mt-4 grid grid-cols-1 2xl:grid-cols-[260px_1fr] gap-3 min-w-0">

        {/* rooms */}
        <div className="rounded-3xl bg-white/6 border border-white/10 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold">Rooms</div>
            <div className="text-[11px] text-white/70 truncate">
              Active: <span className="text-white font-semibold">{activeRoomName}</span>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {loadingRooms ? (
              <div className="text-sm text-white/70 px-2 py-2">Loading rooms...</div>
            ) : rooms.length === 0 ? (
              <div className="text-sm text-white/70 px-2 py-2">No rooms found.</div>
            ) : (
              rooms.map((r, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={r.id}
                    onMouseEnter={() => {
                      markUserInteracted();
                      setActiveIdx(idx);
                    }}
                    onClick={() => {
  markUserInteracted();
  setActiveIdx(idx);
  navigate(`/chat/${r.id}`);
}}

                    className={
                      "w-full text-left px-3 py-2.5 rounded-2xl border transition flex items-center justify-between " +
                      (isActive
                        ? "bg-white text-[#061433] border-transparent room-pop"
                        : "bg-white/6 hover:bg-white/8 border-white/10")
                    }
                  >
                    <span className={isActive ? "font-extrabold" : "font-semibold"}>
                      {r.name}
                    </span>
                    <span className={isActive ? "opacity-100" : "opacity-0"} aria-hidden>
                      <ArrowRight size={16} />
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-3 text-xs text-white/65 px-1">
            Tip: Join “Interview Tips” for daily short guidance.
          </div>
        </div>

        {/* chat */}
        <div className="rounded-3xl bg-white/6 border border-white/10 overflow-hidden flex flex-col min-h-[440px] md:min-h-0">
          {/* header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-sm font-extrabold truncate">{activeRoomName}</div>
              <div className="text-[11px] text-white/65">
                {loadingMsgs ? "Loading messages..." : "Messages (last 50)"}
              </div>
            </div>

            <div className="h-9 w-9 rounded-2xl bg-black/10 border border-white/10 grid place-items-center">
              <MessageCircle size={16} />
            </div>
          </div>

          {/* messages - vh based for mobile */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-2 max-h-[55vh] md:max-h-[360px]"
            onScroll={markUserInteracted}
          >
            {!loadingMsgs && messages.length === 0 ? (
              <div className="text-sm text-white/70">No messages yet. Say hi 👋</div>
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
                          "rounded-2xl px-3 py-2 text-sm leading-relaxed border " +
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

          {/* composer */}
          <div className="p-3 border-t border-white/10 flex items-center gap-2">
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
        </div>
      </div>

      <style>{`
        .community-shine{
          background: linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.10), transparent 65%);
          transform: translateX(-120%);
          animation: commShine 6s linear infinite;
          will-change: transform;
        }
        @keyframes commShine{
          0%{ transform: translateX(-120%); }
          100%{ transform: translateX(120%); }
        }
        .room-pop{ animation: roomPop 220ms ease-out; }
        @keyframes roomPop{
          0%{ transform: translateY(3px); opacity: .7; }
          100%{ transform: translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce){
          .community-shine, .room-pop{ animation: none !important; }
        }
      `}</style>
    </aside>
  );
}
