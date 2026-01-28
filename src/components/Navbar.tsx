import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Building2,
  User,
  ChevronDown,
  Info,
  LogOut,
  Bell,
} from "lucide-react";
import { api } from "../lib/api";

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

type Role = "candidate" | "employer";
type AuthUser = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: Role;
  avatar?: string | null;
};

type Notif = {
  id: number;
  user_id?: number;
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
  read_at?: string | null;
  created_at: string;
  updated_at?: string;
};

function readAuth() {
  const token = localStorage.getItem("jp_token");
  const userRaw = localStorage.getItem("jp_user");
  if (!token || !userRaw) return { token: null, user: null as AuthUser | null };
  try {
    return { token, user: JSON.parse(userRaw) as AuthUser };
  } catch {
    return { token: null, user: null as AuthUser | null };
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);

  // ✅ auth state
  const [{ token, user }, setAuthState] = useState(() => readAuth());
  const isAuthed = Boolean(token && user);

  // ✅ notifications
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // ✅ profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const nav = useNavigate();
  const { pathname } = useLocation();

  const svcRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);

  // ✅ keep auth reactive
  useEffect(() => {
    const refresh = () => setAuthState(readAuth());
    refresh();
  }, []);

  // refresh auth on route change
  useEffect(() => {
    setAuthState(readAuth());
  }, [pathname]);

  // listen to storage changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "jp_token" || e.key === "jp_user" || e.key === "jp_role") {
        setAuthState(readAuth());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ Global: close menus on route change + scroll top
  useEffect(() => {
    setOpen(false);
    setSvcOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  // close dropdown on outside click / esc
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;

      // ✅ Mobile menu ke andar click ho to dropdown close mat karo
      if (mobilePanelRef.current?.contains(target)) return;

      // ✅ Desktop dropdown outside click close
      if (svcRef.current && !svcRef.current.contains(target)) setSvcOpen(false);
      if (notifRef.current && !notifRef.current.contains(target))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(target))
        setProfileOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSvcOpen(false);
        setNotifOpen(false);
        setOpen(false);
        setProfileOpen(false);
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

    requestAnimationFrame(() => {
      nav(`/services/${slug}`);
      window.scrollTo(0, 0);
    });
  };

  const goByRole = (r?: string | null) => {
    if (r === "employer") nav("/employer", { replace: true });
    else nav("/candidate", { replace: true });
  };

  // 🔁 React to login / logout instantly (custom event if you dispatch it)
  useEffect(() => {
    const onAuthChange = () => setAuthState(readAuth());
    window.addEventListener("auth-changed" as any, onAuthChange);
    return () => window.removeEventListener("auth-changed" as any, onAuthChange);
  }, []);

  // ✅ Load notifications
  const loadNotifs = async () => {
    if (!isAuthed) {
      setNotifs([]);
      return;
    }
    try {
      const res = await api.get("/notifications");
      setNotifs(Array.isArray(res.data) ? res.data : []);
    } catch {
      // ignore
    }
  };

  // ✅ Poll notifications when authed
  useEffect(() => {
    if (!isAuthed) return;

    loadNotifs(); // first load
    const t = setInterval(loadNotifs, 25000);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, pathname]);

  const openNotif = async (n: Notif) => {
    try {
      await api.post("/notifications/mark-read", { id: n.id });
    } catch {}

    // optimistic remove
    setNotifs((p) => p.filter((x) => x.id !== n.id));

    if (n.link) nav(n.link);
  };

  const dismissNotif = async (n: Notif) => {
    try {
      await api.post("/notifications/mark-read", { id: n.id });
    } catch {}
    setNotifs((p) => p.filter((x) => x.id !== n.id));
  };

  const logout = () => {
    localStorage.removeItem("jp_token");
    localStorage.removeItem("jp_user");
    localStorage.removeItem("jp_role");
    setAuthState({ token: null, user: null });
    setNotifs([]);
    setNotifOpen(false);
    setProfileOpen(false);
    setOpen(false);
    nav("/auth", { replace: true });
  };

  const unreadCount = notifs.filter((n) => !n.read_at).length || notifs.length;

  return (
    <header className="sticky top-0 z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-[#0B4FA8]/70 backdrop-blur border-b border-white/10" />
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-20 bg-white/10 blur-3xl opacity-30" />

        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="leading-tight">
              <div className="font-extrabold tracking-wide">NEMESIS GROUP</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/jobs" className={navClass}>
              Jobs
            </NavLink>

            <NavLink to="/about" className={navClass}>
              About
            </NavLink>

            {/* Services Dropdown */}
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

            <NavLink to="/employer" className={navClass}>
              Employers
            </NavLink>
            <NavLink to="/candidate" className={navClass}>
              Candidates
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthed ? (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition text-sm font-semibold inline-flex items-center gap-2"
              >
                <User size={16} />
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {/* 🔔 Notifications */}
                <div ref={notifRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setNotifOpen((v) => !v)}
                    className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 hover:bg-white/12 transition grid place-items-center relative"
                    aria-label="notifications"
                    aria-expanded={notifOpen}
                    title="Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-white text-[#083B7E] text-[11px] font-extrabold grid place-items-center border border-white/30">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-96 max-w-[92vw] rounded-2xl bg-[#0B4FA8] border border-white/12 shadow-card overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <div className="text-sm font-extrabold text-white">
                          Notifications
                        </div>
                        <button
                          onClick={() => setNotifOpen(false)}
                          className="h-8 w-8 rounded-xl bg-white/10 border border-white/12 grid place-items-center hover:bg-white/12"
                          aria-label="close notifications"
                          title="Close"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="max-h-[420px] overflow-auto">
                        {notifs.length === 0 ? (
                          <div className="px-4 py-10 text-center text-sm text-white/70">
                            No new notifications
                          </div>
                        ) : (
                          notifs.map((n) => (
                            <button
                              key={n.id}
                              onClick={() => {
                                setNotifOpen(false);
                                openNotif(n);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-white/10 transition border-b border-white/10 last:border-b-0"
                              title={n.body || n.title}
                            >
                              <div className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-white/80 shrink-0" />
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-white truncate">
                                    {n.title}
                                  </div>
                                  {n.body ? (
                                    <div className="text-xs text-white/70 line-clamp-2">
                                      {n.body}
                                    </div>
                                  ) : null}
                                  <div className="mt-1 text-[11px] text-white/55">
                                    {new Date(n.created_at).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      <div className="p-3 border-t border-white/10 flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await api.post("/notifications/mark-all-read");
                            } catch {}
                            setNotifs([]);
                            setNotifOpen(false);
                          }}
                          className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/12 text-white text-sm font-semibold hover:bg-white/12 transition"
                        >
                          Mark all read
                        </button>

                        <Link
                          to="/jobs"
                          onClick={() => setNotifOpen(false)}
                          className="px-4 py-2 rounded-xl bg-white text-[#083B7E] font-extrabold text-sm hover:opacity-95 transition"
                        >
                          View Jobs
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* 👤 Profile */}
                <div ref={profileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((v) => !v)}
                    className="px-3 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition text-sm font-semibold inline-flex items-center gap-2"
                    aria-expanded={profileOpen}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="h-6 w-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User size={16} />
                    )}
                    <span className="max-w-[140px] truncate">
                      {user?.name || "Account"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={profileOpen ? "rotate-180 transition" : "transition"}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0B4FA8] border border-white/12 shadow-card overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="text-sm font-semibold text-white">
                          {user?.name}
                        </div>
                        <div className="text-xs text-white/70 truncate">
                          {user?.email}
                        </div>
                        <div className="mt-1 text-[11px] text-white/60">
                          Role: {user?.role || "—"}
                        </div>
                      </div>

                      <div className="p-2 grid gap-2">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            goByRole(user?.role || null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-sm text-white/90 transition"
                        >
                          Go to Dashboard →
                        </button>

                        <button
                          onClick={logout}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-sm text-white/90 transition inline-flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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

              <Link
                onClick={() => setOpen(false)}
                to="/about"
                className="px-4 py-3 rounded-2xl bg-white/8 border border-white/12 inline-flex items-center gap-2"
              >
                <Info size={18} />
                About
              </Link>

              {/* ✅ Mobile Notifications (simple) */}
              {isAuthed && (
                <button
                  onClick={() => {
                    setOpen(false);
                    nav("/jobs");
                  }}
                  className="px-4 py-3 rounded-2xl bg-white/8 border border-white/12 inline-flex items-center justify-between"
                >
                  <span className="inline-flex items-center gap-2">
                    <Bell size={18} /> Notifications
                  </span>
                  {unreadCount > 0 ? (
                    <span className="h-6 min-w-[24px] px-2 rounded-full bg-white text-[#083B7E] text-xs font-extrabold grid place-items-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  ) : null}
                </button>
              )}

              {/* Mobile Services list */}
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

              {!isAuthed ? (
                <Link
                  onClick={() => setOpen(false)}
                  to="/auth"
                  className="px-4 py-3 rounded-2xl bg-white text-[#083B7E] font-extrabold"
                >
                  Login / Signup
                </Link>
              ) : (
                <button
                  onClick={logout}
                  className="px-4 py-3 rounded-2xl bg-white text-[#083B7E] font-extrabold inline-flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
