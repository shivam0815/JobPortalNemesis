import { useEffect, useMemo, useState } from "react";
import JobCard from "../components/JobCard";
import CompanyCard from "../components/CompanyCard";
import { api } from "../lib/api"; // ✅ use same api as EmployerDashboard

interface Job {
  id: number | string;
  title?: string;
  location?: string;

  // backend fields
  job_type?: string; // "WFH" | "Office"
  salary_min?: number | null;
  salary_max?: number | null;

  // optional extras
  total_experience?: string | null;

  description?: string; // backend uses "description"
  desc?: string;        // old mock uses "desc"
  type?: string;        // old mock uses "type"
  exp?: string;         // old mock uses "exp"
  salary?: string;      // old mock uses "salary"
}

const topCompanies = [
  { name: "Nemesis Group", industry: "HR Services", location: "All India", verified: true },
  { name: "Partner HR Solutions", industry: "Staffing", location: "Delhi", verified: true },
  { name: "Tech Hiring Desk", industry: "IT Staffing", location: "Bangalore", verified: false },
];

// helpers to make UI compatible with backend
const fmtMoney = (n?: number | null) => {
  if (n === null || n === undefined) return "";
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return String(n);
  }
};

const salaryLabel = (j: Job) => {
  // if backend provides min/max
  if (j.salary_min != null || j.salary_max != null) {
    const a = j.salary_min != null ? `₹${fmtMoney(j.salary_min)}` : "";
    const b = j.salary_max != null ? `₹${fmtMoney(j.salary_max)}` : "";
    if (a && b) return `${a} - ${b}`;
    return a || b || "";
  }
  // fallback
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

  useEffect(() => {
    (async () => {
      try {
        setErrMsg(null);
        setLoading(true);

        // optional ping (can remove)
        await api.get("/ping");

        const res = await api.get("/jobs");
        const data = res.data;
        const list = Array.isArray(data) ? data : (data?.data ?? []);
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

      // Experience filter: since backend exp is "total_experience" string, we keep simple:
      // - if dropdown used with "Fresher/Experienced" it won't match; so set dropdown values to All only,
      //   or map your backend value accordingly.
      const eLabel = expLabel(j);
      const okE = exp === "All" ? true : eLabel === exp;

      return okQ && okT && okE;
    });
  }, [jobs, q, jobType, exp]);

  return (
    <main className="container-x py-10">
      <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Jobs</h1>
            <p className="text-white/75 mt-1">
              Apply, track application status, follow companies.
              {!loading && (
                <span className="ml-2 text-white/60 text-sm">(Live API)</span>
              )}
            </p>
            {errMsg && <div className="mt-2 text-sm text-rose-200">{errMsg}</div>}
          </div>

          <div className="grid sm:grid-cols-3 gap-3 w-full md:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jobs, city, keyword..."
              className="h-11 w-full rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25"
            />

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="h-11 rounded-2xl bg-black/8 border border-white/12 px-4 text-sm outline-none"
            >
              <option value="All">All</option>
              <option value="WFH">WFH</option>
              <option value="Office">Office</option>
            </select>

            {/* Backend exp is not Fresher/Experienced by default.
                Keep filter simple (All) or change options based on your stored values. */}
            <select
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none"
            >
              <option value="All">All</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-extrabold">Recommended Jobs</h2>
              <div className="text-sm text-white/70">
                {loading ? "Loading..." : `${filtered.length} results`}
              </div>
            </div>

            <div className="mt-4 grid lg:grid-cols-1 gap-4">
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
                      // normalize for JobCard compatibility
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

          <aside className="lg:col-span-1">
            <h2 className="text-xl font-extrabold">Top Companies</h2>
            <p className="text-sm text-white/70 mt-1">Follow for job alerts & updates.</p>
            <div className="mt-4 space-y-3">
              {topCompanies.map((c) => (
                <CompanyCard key={c.name} company={c} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
