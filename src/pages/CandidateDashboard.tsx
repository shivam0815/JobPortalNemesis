// src/pages/candidate/CandidateDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  Sparkles,
  Search,
  Filter,
  MapPin,
  Phone,
  FileText,
  ArrowRight,
  AlertTriangle,
  Bell,
  Check,
  ExternalLink,
} from "lucide-react";
import { api } from "../lib/api";
import type { User } from "../lib/authStorage";

type AppStatus = "applied" | "shortlisted" | "rejected" | "hired";

type ApplicationItem = {
  id: number | string;
  status: AppStatus;
  created_at?: string;

  job?: {
    id: number | string;
    title?: string;
    location?: string;
  };

  applied_job_title?: string | null;
};

type ProfileForm = {
  phone: string;
  city: string;
  resume_path?: string | null;
};

type UiStatus = "Applied" | "Selected" | "Rejected" | "Hired";

type NotificationItem = {
  id: number | string;
  title: string;
  message: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
  data?: {
    job_id?: number | string;
    company_name?: string;
  } | null;
};

const card = "rounded-3xl border border-white/12 bg-white/6 shadow-card";
const soft = "rounded-3xl border border-white/10 bg-white/5";

const input =
  "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const fileInput =
  "mt-3 block w-full text-sm text-white/80 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-[#061433] file:font-semibold hover:file:opacity-95";
const select =
  "h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";

const statusLabel = (s: AppStatus): UiStatus => {
  if (s === "shortlisted") return "Selected";
  if (s === "rejected") return "Rejected";
  if (s === "hired") return "Hired";
  return "Applied";
};

const statusMeta: Record<UiStatus, { pill: string; row: string; icon: any; dot: string }> = {
  Applied: {
    pill: "bg-white/10 border-white/15 text-white",
    row: "bg-white/6 border-white/10",
    icon: Clock,
    dot: "bg-white/70",
  },
  Selected: {
    pill: "bg-emerald-500/15 border-emerald-300/25 text-emerald-50",
    row: "bg-emerald-500/8 border-emerald-300/18",
    icon: CheckCircle2,
    dot: "bg-emerald-300",
  },
  Hired: {
    pill: "bg-emerald-500/18 border-emerald-300/28 text-emerald-50",
    row: "bg-emerald-500/10 border-emerald-300/18",
    icon: Sparkles,
    dot: "bg-emerald-300",
  },
  Rejected: {
    pill: "bg-rose-500/12 border-rose-300/20 text-rose-50",
    row: "bg-rose-500/7 border-rose-300/16",
    icon: XCircle,
    dot: "bg-rose-300",
  },
};

const Chip = ({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn";
  children: React.ReactNode;
}) => {
  const cls =
    tone === "good"
      ? "bg-emerald-500/15 border-emerald-300/25 text-emerald-50"
      : tone === "warn"
      ? "bg-amber-500/15 border-amber-300/25 text-amber-50"
      : "bg-white/10 border-white/15 text-white";
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-extrabold ${cls}`}>
      {children}
    </span>
  );
};

export default function CandidateDashboard() {
  const nav = useNavigate();

  const [profile, setProfile] = useState<ProfileForm>({
    phone: "",
    city: "",
    resume_path: null,
  });
  const [resume, setResume] = useState<File | null>(null);

  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [msg, setMsg] = useState<string | null>(null);
  const [msgTone, setMsgTone] = useState<"good" | "warn" | "neutral">("neutral");
  const [saving, setSaving] = useState(false);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | UiStatus>("All");

  // ✅ Notifications
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [notifsBusy, setNotifsBusy] = useState(false);

  // ✅ role guard + load profile + load applications + notifications
  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        const raw = localStorage.getItem("jp_user");
        if (!raw) {
          nav("/auth", { replace: true });
          return;
        }

        const user = JSON.parse(raw) as User;
        if (user?.role !== "candidate") {
          nav("/employer", { replace: true });
          return;
        }

        // profile
        try {
          const p = await api.get("/candidate/profile");
          if (!alive) return;
          setProfile({
            phone: p.data?.phone ?? "",
            city: p.data?.city ?? "",
            resume_path: p.data?.resume_path ?? null,
          });
        } catch {
          // ignore
        } finally {
          if (alive) setLoadingProfile(false);
        }

        // applications
        try {
          const res = await api.get("/candidate/applications");
          if (!alive) return;
          const data = res.data;
          const list = Array.isArray(data) ? data : data?.data ?? [];
          setApps(Array.isArray(list) ? list : []);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log("CANDIDATE APPLICATIONS ERROR:", e);
          if (alive) setApps([]);
        } finally {
          if (alive) setLoadingApps(false);
        }

        // notifications
        try {
          const n = await api.get("/notifications");
          if (!alive) return;
          const data = n.data;
          const list = Array.isArray(data) ? data : data?.data ?? [];
          setNotifs(Array.isArray(list) ? list : []);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log("NOTIFICATIONS ERROR:", e);
          if (alive) setNotifs([]);
        } finally {
          if (alive) setLoadingNotifs(false);
        }
      } catch {
        if (alive) nav("/auth", { replace: true });
      }
    };

    init();
    return () => {
      alive = false;
    };
  }, [nav]);

  const completion = useMemo(() => {
    const phoneOk = !!profile.phone.trim();
    const cityOk = !!profile.city.trim();
    const resumeOk = !!profile.resume_path || !!resume;
    const score = Math.round((((phoneOk ? 1 : 0) + (cityOk ? 1 : 0) + (resumeOk ? 1 : 0)) / 3) * 100);
    return { phoneOk, cityOk, resumeOk, score };
  }, [profile.phone, profile.city, profile.resume_path, resume]);

  const unreadCount = useMemo(() => notifs.filter((n) => !n.is_read).length, [notifs]);

  const saveProfile = async () => {
    setMsg(null);
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("phone", profile.phone);
      fd.append("city", profile.city);
      if (resume) fd.append("resume", resume);

      await api.post("/candidate/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("Profile updated");
      setMsgTone("good");

      if (resume) setProfile((p) => ({ ...p, resume_path: "uploaded" }));
      setResume(null);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log("SAVE PROFILE ERROR:", e);
      setMsg(e?.response?.data?.message || "Failed to save profile");
      setMsgTone("warn");
    } finally {
      setSaving(false);
    }
  };

  const markAllRead = async () => {
    setNotifsBusy(true);
    try {
      await api.post("/notifications/mark-all-read");
      setNotifs((p) => p.map((x) => ({ ...x, is_read: true })));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("MARK ALL READ ERROR:", e);
    } finally {
      setNotifsBusy(false);
    }
  };

  const openNotification = async (n: NotificationItem) => {
    const id = n.id;
    const jobId = n.data?.job_id;

    // optimistic mark read
    setNotifs((p) => p.map((x) => (String(x.id) === String(id) ? { ...x, is_read: true } : x)));

    try {
      await api.post(`/notifications/${id}/read`);
    } catch {
      // ignore
    }

    if (jobId) nav(`/jobs/${jobId}`);
  };

  const rows = useMemo(() => {
    return apps.map((a) => {
      const title = a.job?.title ?? a.applied_job_title ?? "Untitled Job";
      const city = a.job?.location ?? "—";
      const ui = statusLabel(a.status);
      return {
        key: String(a.id),
        jobId: a.job?.id ?? null,
        title,
        city,
        status: ui,
        rawStatus: a.status,
        createdAt: a.created_at ? new Date(a.created_at) : null,
      };
    });
  }, [apps]);

  const counts = useMemo(() => {
    const c: Record<UiStatus, number> = { Applied: 0, Selected: 0, Rejected: 0, Hired: 0 };
    rows.forEach((r) => (c[r.status] += 1));
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const hit = !q || r.title.toLowerCase().includes(q) || r.city.toLowerCase().includes(q);
      const st = statusFilter === "All" || r.status === statusFilter;
      return hit && st;
    });
  }, [rows, query, statusFilter]);

  return (
    <main className="container-x py-10">
      <div className="grid gap-6">
        {/* HERO */}
        <section className={card + " p-6 md:p-8"}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm">
                <Briefcase size={16} />
                Candidate Dashboard
              </div>

              <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
                Apply, track and get shortlisted faster
              </h1>

              <p className="text-white/70 mt-1 text-sm md:text-base">
                Complete profile → upload resume → apply daily → track status.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Chip tone={completion.score === 100 ? "good" : "warn"}>
                  {completion.score === 100 ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {completion.score}% complete
                </Chip>
                <Chip tone={completion.resumeOk ? "good" : "warn"}>
                  <UploadCloud size={14} /> Resume: {loadingProfile ? "…" : completion.resumeOk ? "Ready" : "Pending"}
                </Chip>
                <Chip tone={completion.phoneOk ? "good" : "warn"}>
                  <Phone size={14} /> Phone: {loadingProfile ? "…" : completion.phoneOk ? "Added" : "Missing"}
                </Chip>
                <Chip tone={completion.cityOk ? "good" : "warn"}>
                  <MapPin size={14} /> City: {loadingProfile ? "…" : completion.cityOk ? "Added" : "Missing"}
                </Chip>
                <Chip tone={unreadCount ? "warn" : "good"}>
                  <Bell size={14} /> Alerts: {loadingNotifs ? "…" : unreadCount ? `${unreadCount} new` : "None"}
                </Chip>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/jobs"
                className="px-5 py-3 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 transition inline-flex items-center justify-center gap-2"
              >
                Browse Jobs <ArrowRight size={18} />
              </Link>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-5 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>

          {msg ? (
            <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/90">
              <span className="inline-flex items-center gap-2">
                {msgTone === "good" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {msg}
              </span>
            </div>
          ) : null}
        </section>

        {/* TOP STATS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
            <div className="text-xs text-white/70">Applied</div>
            <div className="mt-1 text-2xl font-extrabold">{loadingApps ? "…" : counts.Applied}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
            <div className="text-xs text-white/70">Selected</div>
            <div className="mt-1 text-2xl font-extrabold">{loadingApps ? "…" : counts.Selected}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
            <div className="text-xs text-white/70">Rejected</div>
            <div className="mt-1 text-2xl font-extrabold">{loadingApps ? "…" : counts.Rejected}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
            <div className="text-xs text-white/70">Hired</div>
            <div className="mt-1 text-2xl font-extrabold">{loadingApps ? "…" : counts.Hired}</div>
          </div>
        </section>

        {/* GRID: LEFT (PROFILE + NOTIFS) + RIGHT (APPLICATIONS) */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
          {/* LEFT: PROFILE + NOTIFICATIONS */}
          <div className="grid gap-6">
            {/* PROFILE CARD */}
            <section className={card + " p-6"}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold">Profile & Resume</div>
                  <div className="text-sm text-white/65 mt-1">Keep details updated to get calls.</div>
                </div>

                <Chip tone={completion.score === 100 ? "good" : "warn"}>
                  <FileText size={14} /> {completion.score}%
                </Chip>
              </div>

              <div className="mt-5 grid gap-3">
                <div>
                  <div className="text-sm font-semibold text-white/85">Mobile Number</div>
                  <input
                    className={input + " mt-2"}
                    placeholder="e.g. 9876543210"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value.replace(/[^\d+]/g, "") }))}
                    disabled={loadingProfile}
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-white/85">City</div>
                  <input
                    className={input + " mt-2"}
                    placeholder="e.g. Noida"
                    value={profile.city}
                    onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                    disabled={loadingProfile}
                  />
                </div>

                <div className={soft + " p-5"}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-extrabold">
                      <UploadCloud size={18} /> Resume
                    </div>
                    <Chip tone={completion.resumeOk ? "good" : "warn"}>
                      {completion.resumeOk ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                      {completion.resumeOk ? "Ready" : "Pending"}
                    </Chip>
                  </div>

                  <div className="text-xs text-white/70 mt-2">PDF/DOC/DOCX • max 5MB</div>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                    className={fileInput}
                  />

                  {resume ? (
                    <div className="mt-2 text-xs text-white/70">
                      Selected: <span className="text-white/90">{resume.name}</span>
                    </div>
                  ) : null}
                </div>

                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>

                <Link
                  to="/jobs"
                  className="h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold grid place-items-center"
                >
                  Browse Jobs
                </Link>
              </div>
            </section>

            {/* NOTIFICATIONS CARD */}
            <section className={card + " p-6"}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold">Job Alerts</div>
                  <div className="text-sm text-white/65 mt-1">New jobs from companies you follow.</div>
                </div>

                <button
                  onClick={markAllRead}
                  disabled={notifsBusy || loadingNotifs || unreadCount === 0}
                  className="px-3 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition text-xs font-extrabold disabled:opacity-50 inline-flex items-center gap-2"
                  title="Mark all as read"
                >
                  <Check size={16} />
                  Mark all
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {loadingNotifs ? (
                  <div className="rounded-2xl border border-white/12 bg-white/5 p-4 text-white/75">
                    Loading alerts…
                  </div>
                ) : notifs.length === 0 ? (
                  <div className="rounded-2xl border border-white/12 bg-white/5 p-4 text-white/75">
                    No alerts yet. Follow companies from a Job Details page.
                  </div>
                ) : (
                  notifs.slice(0, 10).map((n) => {
                    const unread = !n.is_read;
                    const jobId = n.data?.job_id;
                    const when = n.created_at ? new Date(n.created_at).toLocaleString() : "";

                    return (
                      <button
                        key={String(n.id)}
                        onClick={() => openNotification(n)}
                        className={
                          "w-full text-left rounded-2xl border p-4 transition " +
                          (unread ? "bg-white/10 border-white/15 hover:bg-white/12" : "bg-white/5 border-white/10 hover:bg-white/8")
                        }
                        title={jobId ? "Open job" : "Mark read"}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={"h-2 w-2 rounded-full " + (unread ? "bg-amber-300" : "bg-white/30")} />
                              <div className="font-extrabold text-white truncate">{n.title}</div>
                            </div>
                            <div className="text-sm text-white/75 mt-1 line-clamp-2">{n.message}</div>
                            {when ? <div className="text-xs text-white/55 mt-2">{when}</div> : null}
                          </div>

                          {jobId ? (
                            <span className="shrink-0 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10 border border-white/12 text-white/80">
                              <ExternalLink size={14} /> Open
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {notifs.length > 10 ? (
                <div className="mt-3 text-xs text-white/65">Showing latest 10 alerts.</div>
              ) : null}
            </section>
          </div>

          {/* RIGHT: APPLICATIONS */}
          <section className={card + " p-6"}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold">My Applications</div>
                <div className="text-sm text-white/65 mt-1">Status is updated by employer.</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                  <input
                    className={input.replace("px-4", "pl-11 pr-4")}
                    placeholder="Search job title or city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="relative sm:w-56">
                  <Filter className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "All" | UiStatus)}
                    className={select}
                  >
                    <option value="All">All Status</option>
                    <option value="Applied">Applied</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {loadingApps ? (
                <div className="rounded-3xl bg-white/6 border border-white/12 p-4 text-white/75">
                  Loading applications…
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-3xl bg-white/6 border border-white/12 p-6 text-white/75">
                  No applications found.{" "}
                  <Link className="underline" to="/jobs">
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                filtered.map((a) => {
                  const meta = statusMeta[a.status];
                  const Icon = meta.icon;

                  return (
                    <div
                      key={a.key}
                      className={`rounded-3xl border p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 ${meta.row}`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                          <div className="font-extrabold truncate max-w-[560px]">{a.title}</div>

                          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${meta.pill}`}>
                            <Icon size={14} />
                            {a.status}
                          </span>
                        </div>

                        <div className="text-sm text-white/75 mt-1">
                          {a.city}
                          {a.createdAt ? <span className="text-white/60"> • {a.createdAt.toLocaleDateString()}</span> : null}
                        </div>

                        {a.jobId ? (
                          <Link to={`/jobs/${a.jobId}`} className="text-xs text-white/70 underline mt-1 inline-flex items-center gap-1.5">
                            View job <ArrowRight size={14} />
                          </Link>
                        ) : null}
                      </div>

                      <div className="shrink-0">
                        <Link
                          to="/jobs"
                          className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold inline-flex items-center gap-2"
                        >
                          Apply More <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
