// src/pages/candidate/CandidateApplications.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type ApiApplication = {
  id: number | string;
  status?: "applied" | "shortlisted" | "rejected" | "hired" | string;
  created_at?: string;
  job?: {
    id: number | string;
    title?: string;
    location?: string;
  };
};

type UiStatus = "Applied" | "Selected" | "Rejected" | "Hired";

const statusLabel = (s?: string): UiStatus => {
  const v = (s || "").toLowerCase();
  if (v === "shortlisted") return "Selected";
  if (v === "hired") return "Hired";
  if (v === "rejected") return "Rejected";
  return "Applied";
};

const statusMeta: Record<
  UiStatus,
  { pill: string; row: string; icon: any; dot: string }
> = {
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

const card = "rounded-3xl border border-white/12 bg-white/6 shadow-card";
const input =
  "h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const select =
  "h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";

export default function CandidateApplications() {
  const [apps, setApps] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | UiStatus>("All");

  useEffect(() => {
    (async () => {
      try {
        setMsg(null);
        setLoading(true);

        const res = await api.get("/candidate/applications");
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setApps(Array.isArray(list) ? list : []);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log("CANDIDATE APPS ERROR:", e);
        setApps([]);
        setMsg(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rows = useMemo(() => {
    return apps.map((a) => {
      const ui = statusLabel(a.status);
      return {
        key: String(a.id),
        title: a.job?.title ?? "Untitled Job",
        city: a.job?.location ?? "—",
        status: ui,
        rawStatus: a.status ?? "applied",
        createdAt: a.created_at ? new Date(a.created_at) : null,
      };
    });
  }, [apps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const hit =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q);
      const st = statusFilter === "All" || r.status === statusFilter;
      return hit && st;
    });
  }, [rows, query, statusFilter]);

  const total = rows.length;

  const counts = useMemo(() => {
    const c: Record<UiStatus, number> = {
      Applied: 0,
      Selected: 0,
      Rejected: 0,
      Hired: 0,
    };
    rows.forEach((r) => (c[r.status] += 1));
    return c;
  }, [rows]);

  return (
    <div className="grid gap-5">
      {/* HERO */}
      <div className={card + " p-6 md:p-8"}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm">
              <Briefcase size={16} />
              My Applications
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Track your application status
            </h1>
            <p className="text-white/70 mt-1 text-sm md:text-base">
              WorkIndia-style: search, filter and see status in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/jobs"
              className="px-5 py-3 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 transition"
            >
              Apply More Jobs <ArrowRight size={18} className="inline -mt-0.5 ml-1" />
            </Link>

            <div className="text-sm text-white/70 sm:self-center">
              {loading ? "Loading..." : `${total} total`}
            </div>
          </div>
        </div>

        {msg ? (
          <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
            {msg}
          </div>
        ) : null}
      </div>

      {/* STATUS STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
          <div className="text-xs text-white/70">Applied</div>
          <div className="mt-1 text-2xl font-extrabold">{loading ? "…" : counts.Applied}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
          <div className="text-xs text-white/70">Selected</div>
          <div className="mt-1 text-2xl font-extrabold">{loading ? "…" : counts.Selected}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
          <div className="text-xs text-white/70">Rejected</div>
          <div className="mt-1 text-2xl font-extrabold">{loading ? "…" : counts.Rejected}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
          <div className="text-xs text-white/70">Hired</div>
          <div className="mt-1 text-2xl font-extrabold">{loading ? "…" : counts.Hired}</div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className={card + " p-5"}>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-[420px]">
            <Search className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job title or city..."
              className={input}
            />
          </div>

          <div className="relative w-full lg:w-[260px]">
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

      {/* LIST */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-3xl bg-white/6 border border-white/12 p-4 text-white/75">
            Loading applications…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl bg-white/6 border border-white/12 p-6 text-white/75">
            No applications found.
          </div>
        ) : (
          filtered.map((r) => {
            const meta = statusMeta[r.status];
            const Icon = meta.icon;

            return (
              <div
                key={r.key}
                className={`rounded-3xl border p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 ${meta.row}`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    <div className="font-extrabold truncate max-w-[520px]">
                      {r.title}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${meta.pill}`}
                    >
                      <Icon size={14} />
                      {r.status}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} /> {r.city}
                    </span>
                    {r.createdAt ? (
                      <span className="inline-flex items-center gap-1.5 text-white/65">
                        <Clock size={14} /> {r.createdAt.toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    to="/jobs"
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold inline-flex items-center gap-2"
                  >
                    Browse Jobs <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
