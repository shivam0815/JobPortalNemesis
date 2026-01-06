import { useMemo, useState } from "react";
import JobCard from "../components/JobCard";
import CompanyCard from "../components/CompanyCard";

const mockJobs = [
  { id: "1", title: "HR Executive", type: "Office", exp: "Fresher", salary: "₹18k - ₹25k", location: "Delhi", desc: "HR ops, onboarding, documentation, coordination." },
  { id: "2", title: "Customer Care Associate", type: "WFH", exp: "Experienced", salary: "₹22k - ₹32k", location: "Noida", desc: "Calls, CRM updates, escalation handling." },
  { id: "3", title: "Banking Sales Officer", type: "Office", exp: "Experienced", salary: "₹25k - ₹45k", location: "Mumbai", desc: "Sales, lead closure, relationship management." },
];

const topCompanies = [
  { name: "Nemesis Group", industry: "HR Services", location: "All India", verified: true },
  { name: "Partner HR Solutions", industry: "Staffing", location: "Delhi", verified: true },
  { name: "Tech Hiring Desk", industry: "IT Staffing", location: "Bangalore", verified: false },
];

export default function Jobs() {
  const [q, setQ] = useState("");
  const [jobType, setJobType] = useState("All");
  const [exp, setExp] = useState("All");

  const filtered = useMemo(() => {
    return mockJobs.filter((j) => {
      const okQ = (j.title + j.location + j.desc).toLowerCase().includes(q.toLowerCase());
      const okT = jobType === "All" ? true : j.type === jobType;
      const okE = exp === "All" ? true : j.exp === exp;
      return okQ && okT && okE;
    });
  }, [q, jobType, exp]);

  return (
    <main className="container-x py-10">
      <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Jobs</h1>
            <p className="text-white/75 mt-1">Apply, track application status, follow companies.</p>
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
              <option>All</option>
              <option>WFH</option>
              <option>Office</option>
            </select>
            <select
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none"
            >
              <option>All</option>
              <option>Fresher</option>
              <option>Experienced</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-extrabold">Recommended Jobs</h2>
              <div className="text-sm text-white/70">{filtered.length} results</div>
            </div>
            <div className="mt-4 grid lg:grid-cols-1 gap-4">
              {filtered.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
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
