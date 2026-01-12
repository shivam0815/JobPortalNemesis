import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";

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

const label = (s?: string) => {
  const v = (s || "").toLowerCase();
  if (v === "shortlisted") return "Selected";
  if (v === "hired") return "Hired";
  if (v === "rejected") return "Rejected";
  return "Applied";
};

const badgeClass = (s?: string) => {
  const v = (s || "").toLowerCase();
  if (v === "shortlisted" || v === "hired") return "bg-white text-[#083B7E]";
  if (v === "rejected") return "bg-white/10 border border-white/12 text-white/85";
  return "bg-white/10 border border-white/12 text-white/85";
};

export default function CandidateApplications() {
  const [apps, setApps] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setMsg(null);
        setLoading(true);

        // ✅ Protected route: requires Sanctum token in your api instance
        const res = await api.get("/candidate/applications");

        const data = res.data;
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        setApps(Array.isArray(list) ? list : []);
      } catch (e: any) {
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

  const total = apps.length;

  const rows = useMemo(() => {
    return apps.map((a) => ({
      key: String(a.id),
      title: a.job?.title ?? "Untitled Job",
      city: a.job?.location ?? "—",
      status: label(a.status),
      rawStatus: a.status ?? "applied",
    }));
  }, [apps]);

  return (
    <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Applications
          </h1>
          <p className="text-white/70 mt-1">Track your application status.</p>
        </div>
        <div className="text-sm text-white/70">
          {loading ? "Loading..." : `${total} total`}
        </div>
      </div>

      {msg && (
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
          {msg}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-3xl bg-white/6 border border-white/12 p-4 text-white/75">
            Loading applications…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl bg-white/6 border border-white/12 p-6 text-white/75">
            No applications yet.
          </div>
        ) : (
          rows.map((a) => (
            <div
              key={a.key}
              className="rounded-3xl bg-white/6 border border-white/12 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <div className="font-extrabold">{a.title}</div>
                <div className="text-sm text-white/70">{a.city}</div>
              </div>

              <span
                className={
                  "px-4 py-2 rounded-full text-sm font-semibold " +
                  badgeClass(a.rawStatus)
                }
              >
                {a.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
