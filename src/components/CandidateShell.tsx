import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, User2, ClipboardList } from "lucide-react";

const itemClass = ({ isActive }: any) =>
  "flex items-center gap-3 px-4 py-3 rounded-2xl border transition " +
  (isActive
    ? "bg-white text-[#083B7E] border-transparent"
    : "bg-white/8 border-white/12 text-white/85 hover:bg-white/10 hover:text-white");

export default function CandidateShell() {
  return (
    <main className="container-x py-10">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 rounded-3xl border border-white/12 bg-white/5 shadow-card p-5">
          <div className="font-extrabold text-lg">Candidate Panel</div>
          <div className="text-sm text-white/70 mt-1">Profile • Resume • Applications</div>

          <nav className="mt-5 grid gap-2">
            <NavLink to="/candidate" end className={itemClass}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/candidate/profile" className={itemClass}>
              <User2 size={18} /> Profile
            </NavLink>
            <NavLink to="/candidate/applications" className={itemClass}>
              <ClipboardList size={18} /> Applications
            </NavLink>
          </nav>

          <div className="mt-6 rounded-3xl bg-white/6 border border-white/12 p-4">
            <div className="text-sm font-semibold">Tip</div>
            <div className="text-sm text-white/75 mt-1">
              Upload resume for fastest result
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="lg:col-span-3">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
