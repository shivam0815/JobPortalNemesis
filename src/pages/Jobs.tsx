// src/pages/Jobs.tsx
import { useEffect, useMemo, useState } from "react";
import JobCard from "../components/JobCard";
import CompanyCard from "../components/CompanyCard";
import { api } from "../lib/api";

interface Job {
  id: number | string;
  title?: string;
  location?: string;
  job_type?: string; // "WFH" | "Office"
  salary_min?: number | null;
  salary_max?: number | null;
  total_experience?: string | null;
  description?: string;
  desc?: string;
  type?: string;
  exp?: string;
  salary?: string;
}



const fmtMoney = (n?: number | null) => {
  if (n === null || n === undefined) return "";
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return String(n);
  }
};

const salaryLabel = (j: Job) => {
  if (j.salary_min != null || j.salary_max != null) {
    const a = j.salary_min != null ? `₹${fmtMoney(j.salary_min)}` : "";
    const b = j.salary_max != null ? `₹${fmtMoney(j.salary_max)}` : "";
    if (a && b) return `${a} - ${b}`;
    return a || b || "";
  }
  return j.salary || "";
};

const jobTypeLabel = (j: Job) => j.job_type || j.type || "WFH";
const expLabel = (j: Job) => j.total_experience || j.exp || "All";

export default function Jobs() {
  const [q, setQ] = useState("");
  const [jobType, setJobType] = useState("All");
  const [exp, setExp] = useState("All");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // mobile: collapse companies by default
  const [showCompanies, setShowCompanies] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setErrMsg(null);
        setLoading(true);

        // remove ping later if not needed
        await api.get("/ping");

        const res = await api.get("/jobs");
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setJobs(Array.isArray(list) ? list : []);
      } catch (e) {
        console.log("JOBS API ERROR:", e);
        setErrMsg("Failed to load jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return jobs.filter((j) => {
      const title = (j.title ?? "").toLowerCase();
      const loc = (j.location ?? "").toLowerCase();
      const desc = (j.description ?? j.desc ?? "").toLowerCase();
      const okQ = !qq || `${title} ${loc} ${desc}`.includes(qq);

      const jt = jobTypeLabel(j);
      const okT = jobType === "All" ? true : jt === jobType;

      const eLabel = expLabel(j);
      const okE = exp === "All" ? true : eLabel === exp;

      return okQ && okT && okE;
    });
  }, [jobs, q, jobType, exp]);

  return (
    <main className="container-x py-5 md:py-10">
      <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card overflow-hidden">
        {/* Header (compact) */}
        <div className="p-4 sm:p-6 md:p-8 pb-3 md:pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Jobs
              </h1>
              <p className="text-white/70 mt-1 text-sm sm:text-base">
                Apply and track your application status.
                {!loading && <span className="ml-2 text-white/50 text-xs">(Live)</span>}
              </p>
              {errMsg && <div className="mt-2 text-sm text-rose-200">{errMsg}</div>}
            </div>

            {/* Optional CTA - keep small */}
            <button className="shrink-0 h-10 px-4 rounded-2xl bg-white text-[#061433] text-sm font-semibold shadow-sm hover:opacity-95">
              Apply Now
            </button>
          </div>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-[72px] z-10 px-4 sm:px-6 md:px-8 pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur p-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search job, city, keyword…"
                className="h-11 w-full rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25"
              />

              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="h-11 w-full rounded-2xl bg-black/10 border border-white/12 px-4 text-sm outline-none"
              >
                <option value="All">All Types</option>
                <option value="WFH">WFH</option>
                <option value="Office">Office</option>
              </select>

              <select
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                className="h-11 w-full rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none"
              >
                <option value="All">All Experience</option>
              </select>
            </div>

            
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {/* Jobs FIRST (important fix for your screenshot) */}
            <section className="lg:col-span-2 order-1">
              <div className="flex items-end justify-between">
                <h2 className="text-lg sm:text-xl font-extrabold">Recommended Jobs</h2>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                {loading ? (
                  <div className="text-white/70">Loading jobs…</div>
                ) : filtered.length === 0 ? (
                  <div className="rounded-2xl border border-white/12 bg-white/5 p-6 text-white/75">
                    No jobs found.
                  </div>
                ) : (
                  filtered.map((j) => (
                    <JobCard
                      key={String(j.id)}
                      job={{
                        ...j,
                        type: jobTypeLabel(j),
                        exp: expLabel(j),
                        salary: salaryLabel(j),
                        desc: j.desc ?? j.description ?? "",
                      }}
                    />
                  ))
                )}
              </div>
            </section>

            
          </div>
        </div>
      </div>
    </main>
  );
}
