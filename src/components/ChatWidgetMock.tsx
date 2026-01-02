import { MessageCircle, UserPlus } from "lucide-react";

export default function ChatWidgetMock() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold">Community</h3>
          <p className="text-white/75 mt-1 text-sm">Group chat rooms + follow company (UI ready).</p>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center">
          <MessageCircle size={18} />
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-white/6 border border-white/10 p-4">
        <div className="text-sm font-semibold">Follow Nemesis Group</div>
        <p className="text-white/70 text-sm mt-1">
          Get job alerts, updates, and interview notifications.
        </p>
        <button className="mt-3 w-full h-11 rounded-full bg-white text-[#0B2B6B] font-semibold inline-flex items-center justify-center gap-2">
          <UserPlus size={16} /> Follow Company
        </button>
      </div>

      <div className="mt-4 rounded-3xl bg-white/6 border border-white/10 p-4">
        <div className="text-sm font-semibold">Chat Rooms</div>
        <div className="mt-3 space-y-2">
          {["General Jobs", "Interview Tips", "HR Announcements"].map((r) => (
            <button key={r} className="w-full text-left px-4 py-3 rounded-2xl bg-white/6 hover:bg-white/8 border border-white/10 transition">
              {r}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
