// src/components/ChatWidgetMock.tsx
// Product-ready Community card with subtle float + shine + "shuffle" room highlight.
// No backend changes. Drop-in replace.

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, UserPlus, Sparkles, ArrowRight } from "lucide-react";

const rooms = ["General Jobs", "Interview Tips", "HR Announcements", "Freshers Help"];

export default function ChatWidgetMock() {
  const [active, setActive] = useState(0);

  // auto-shuffle highlight (every 2.5s)
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % rooms.length), 2500);
    return () => clearInterval(t);
  }, []);

  const activeRoom = useMemo(() => rooms[active], [active]);

  return (
    <aside className="relative rounded-3xl border border-white/10 bg-white/6 p-6 shadow-card community-float overflow-hidden">
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

      {/* follow card */}
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

      {/* room shuffle */}
      <div className="relative mt-4 rounded-3xl bg-white/6 border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold">Chat Rooms</div>
          <div className="text-xs text-white/70">
            Active: <span className="text-white font-semibold">{activeRoom}</span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {rooms.map((r, idx) => {
            const isActive = idx === active;
            return (
              <button
                key={r}
                onMouseEnter={() => setActive(idx)}
                className={
                  "w-full text-left px-4 py-3 rounded-2xl border transition flex items-center justify-between " +
                  (isActive
                    ? "bg-white text-[#061433] border-transparent room-pop"
                    : "bg-white/6 hover:bg-white/8 border-white/10")
                }
              >
                <span className={isActive ? "font-extrabold" : "font-semibold"}>{r}</span>
                <span className={isActive ? "opacity-100" : "opacity-0"} aria-hidden>
                  <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 text-xs text-white/65">
          Tip: Join “Interview Tips” for daily short guidance.
        </div>
      </div>

      {/* inline CSS animations (no tailwind config required) */}
      <style>{`
        .community-float{
          animation: commFloat 6s ease-in-out infinite;
        }
        @keyframes commFloat{
          0%,100%{ transform: translateY(0); }
          50%{ transform: translateY(-6px); }
        }

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
          .community-float, .community-shine, .room-pop{ animation: none !important; }
        }
      `}</style>
    </aside>
  );
}
