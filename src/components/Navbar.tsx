import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Menu,
  X,
  Building2,
  User,
  ChevronDown,
  Info,
} from "lucide-react";

const navClass = ({ isActive }: any) =>
  "px-3 py-2 rounded-full text-sm transition " +
  (isActive
    ? "bg-white/15 text-white"
    : "text-white/85 hover:text-white hover:bg-white/10");

const services = [
  ["Payroll Services", "payroll"],
  ["IT Staffing", "it-staffing"],
  ["Staffing Solutions", "staffing-solutions"],
  ["Recruitment", "recruitment"],
  ["Training & Development", "training-development"],
  ["HR Consulting", "hr-consulting"],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();

  const svcRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);

  // ✅ Global: close menus on route change + scroll top
  useEffect(() => {
    setOpen(false);
    setSvcOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  // close dropdown on outside click / esc
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      // services dropdown (desktop)
      if (svcRef.current && !svcRef.current.contains(e.target as Node)) {
        setSvcOpen(false);
      }
      // mobile panel
      if (open && mobilePanelRef.current && !mobilePanelRef.current.contains(e.target as Node)) {
        // click outside closes mobile menu
        const target = e.target as Node;
     
        if (target) setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSvcOpen(false);
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goService = (slug: string) => {
    setSvcOpen(false);
    setOpen(false);
    nav(`/services/${slug}`);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="relative">
        {/* premium blur bar + subtle glow */}
        <div className="absolute inset-0 bg-[#0B4FA8]/70 backdrop-blur border-b border-white/10" />
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-20 bg-white/10 blur-3xl opacity-30" />

        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-2xl bg-white/12 border border-white/12 grid place-items-center group-hover:bg-white/15 transition">
              <Briefcase size={18} />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold tracking-wide">Nemesis Group</div>
              <div className="text-[11px] text-white/70 -mt-0.5">
                HR • Staffing • Compliance
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/jobs" className={navClass}>
              Jobs
            </NavLink>

            {/* ✅ NEW: About */}
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>

            {/* ✅ Services Dropdown */}
            <div ref={svcRef} className="relative">
              <button
                type="button"
                onClick={() => setSvcOpen((v) => !v)}
                className={
                  "px-3 py-2 rounded-full text-sm transition inline-flex items-center gap-1 " +
                  (svcOpen
                    ? "bg-white/15 text-white"
                    : "text-white/85 hover:text-white hover:bg-white/10")
                }
                aria-haspopup="menu"
                aria-expanded={svcOpen}
              >
                Services{" "}
                <ChevronDown
                  size={16}
                  className={svcOpen ? "rotate-180 transition" : "transition"}
                />
              </button>

              {svcOpen && (
                <div
                  className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#0B4FA8] border border-white/12 shadow-card overflow-hidden"
                  role="menu"
                >
                  <div className="px-4 py-3 text-xs text-white/70 border-b border-white/10">
                    HR Services • All Over India
                  </div>

                  <div className="py-2">
                    {services.map(([label, slug]) => (
                      <button
                        key={slug}
                        onClick={() => goService(slug)}
                        className="w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition flex items-center justify-between"
                        role="menuitem"
                      >
                        <span>{label}</span>
                        <span className="text-xs text-white/50">→</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 border-t border-white/10 grid gap-2">
                    <Link
                      to="/services"
                      onClick={() => setSvcOpen(false)}
                      className="block text-center px-4 py-2 rounded-xl bg-white/10 border border-white/12 text-white font-extrabold text-sm hover:bg-white/12 transition"
                    >
                      All Services
                    </Link>

                    <Link
                      to="/jobs"
                      onClick={() => setSvcOpen(false)}
                      className="block text-center px-4 py-2 rounded-xl bg-white text-[#083B7E] font-extrabold text-sm hover:opacity-95 transition"
                    >
                      View Jobs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Professional portals */}
            <NavLink to="/employer" className={navClass}>
              Employers
            </NavLink>
            <NavLink to="/candidate" className={navClass}>
              Candidates
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/auth"
              className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition text-sm font-semibold inline-flex items-center gap-2"
            >
              <User size={16} />
              Login
            </Link>

            <Link
              to="/employer"
              className="px-4 py-2 rounded-full bg-white text-[#083B7E] font-extrabold text-sm hover:opacity-95 transition inline-flex items-center gap-2"
            >
              <Building2 size={16} />
              Post a Job
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center"
            aria-label="menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-b border-white/10 bg-[#0B4FA8]/80 backdrop-blur">
            <div
              ref={mobilePanelRef}
              className="mx-auto w-full max-w-7xl px-4 md:px-6 py-3 grid gap-2"
            >
              <Link
                onClick={() => setOpen(false)}
                to="/jobs"
                className="px-4 py-3 rounded-2xl bg-white/8 border border-white/12"
              >
                Jobs
              </Link>

              {/* ✅ NEW: About (mobile) */}
              <Link
                onClick={() => setOpen(false)}
                to="/about"
                className="px-4 py-3 rounded-2xl bg-white/8 border border-white/12 inline-flex items-center gap-2"
              >
                <Info size={18} />
                About
              </Link>

              {/* ✅ Mobile Services list */}
              <div className="rounded-2xl bg-white/6 border border-white/12 overflow-hidden">
                <button
                  onClick={() => setSvcOpen((v) => !v)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <span className="font-semibold">Services</span>
                  <ChevronDown
                    size={18}
                    className={svcOpen ? "rotate-180 transition" : "transition"}
                  />
                </button>

                {svcOpen && (
                  <div className="border-t border-white/10">
                    {services.map(([label, slug]) => (
                      <button
                        key={slug}
                        onClick={() => goService(slug)}
                        className="w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition flex items-center justify-between"
                      >
                        <span>{label}</span>
                        <span className="text-xs text-white/50">→</span>
                      </button>
                    ))}
                    <Link
                      to="/services"
                      onClick={() => {
                        setSvcOpen(false);
                        setOpen(false);
                      }}
                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition"
                    >
                      All Services →
                    </Link>
                  </div>
                )}
              </div>

              <Link
                onClick={() => setOpen(false)}
                to="/candidate"
                className="px-4 py-3 rounded-2xl bg-white/8 border border-white/12"
              >
                Candidates
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to="/employer"
                className="px-4 py-3 rounded-2xl bg-white/8 border border-white/12"
              >
                Employers
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to="/auth"
                className="px-4 py-3 rounded-2xl bg-white text-[#083B7E] font-extrabold"
              >
                Login / Signup
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
