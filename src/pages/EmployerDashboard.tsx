import { useMemo, useState } from "react";
import {
  Building2,
  Briefcase,
  Users,
  FileText,
  BadgeCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

type ApplicantStatus = "Applied" | "Selected" | "Rejected";

type Applicant = {
  name: string;
  city: string;
  role: string;
  status: ApplicantStatus;
};

const statusMeta: Record<
  ApplicantStatus,
  { pill: string; icon: any; row: string }
> = {
  Applied: {
    pill: "bg-white/10 border-white/15 text-white",
    icon: Clock,
    row: "bg-white/6 border-white/10",
  },
  Selected: {
    pill: "bg-emerald-500/15 border-emerald-300/25 text-emerald-50",
    icon: CheckCircle2,
    row: "bg-emerald-500/8 border-emerald-300/18",
  },
  Rejected: {
    pill: "bg-rose-500/12 border-rose-300/20 text-rose-50",
    icon: XCircle,
    row: "bg-rose-500/7 border-rose-300/16",
  },
};

const inputBase =
  "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const selectBase =
  "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const textareaBase =
  "min-h-[120px] w-full rounded-2xl bg-white border border-white/20 px-4 py-3 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";

export default function EmployerDashboard() {
  // UI state only (backend later)
  const [company, setCompany] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
  });

  const [job, setJob] = useState({
    title: "",
    type: "WFH",
    exp: "Fresher",
    salary: "",
    location: "",
    desc: "",
  });

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApplicantStatus>(
    "All"
  );

  const [applicants, setApplicants] = useState<Applicant[]>([
    { name: "Uzair Ahmad", city: "Delhi", role: "HR Executive", status: "Applied" },
    { name: "Rafiq Sheikh", city: "Noida", role: "Customer Care", status: "Selected" },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applicants.filter((a) => {
      const hit =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q);
      const st = statusFilter === "All" || a.status === statusFilter;
      return hit && st;
    });
  }, [applicants, query, statusFilter]);

  const counts = useMemo(() => {
    const c = { Applied: 0, Selected: 0, Rejected: 0 };
    applicants.forEach((a) => (c[a.status] += 1));
    return c;
  }, [applicants]);

  const updateStatus = (name: string, next: ApplicantStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a.name === name ? { ...a, status: next } : a))
    );
  };

  return (
    <main className="container-x py-10">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm">
              <Building2 size={16} />
              Employer / HR Dashboard
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Manage company profile, post jobs & track applicants
            </h1>
            <p className="text-white/70 mt-1">
              Professional workflow: Profile → Job Post → Resume View → Status Update.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ["Applied", counts.Applied],
                ["Selected", counts.Selected],
                ["Rejected", counts.Rejected],
              ] as const
            ).map(([k, v]) => (
              <div
                key={k}
                className="rounded-3xl bg-white/8 border border-white/12 px-4 py-3"
              >
                <div className="text-xs text-white/70">{k}</div>
                <div className="text-2xl font-extrabold mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top forms */}
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        {/* Company profile */}
        <section className="rounded-3xl border border-white/10 bg-white/6 p-6 md:p-7 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                <Building2 size={18} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Company Profile</h2>
                <p className="text-white/70 text-sm">
                  Show trust to candidates & improve response rate.
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-white/85">
              <BadgeCheck size={14} /> Verified (UI)
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            <input
              className={inputBase}
              placeholder="Company Name"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
            <input
              className={inputBase}
              placeholder="HR / Contact Person"
              value={company.contact}
              onChange={(e) =>
                setCompany({ ...company, contact: e.target.value })
              }
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                className={inputBase}
                placeholder="Email"
                value={company.email}
                onChange={(e) =>
                  setCompany({ ...company, email: e.target.value })
                }
              />
              <input
                className={inputBase}
                placeholder="Phone"
                value={company.phone}
                onChange={(e) =>
                  setCompany({ ...company, phone: e.target.value })
                }
              />
            </div>

            <button className="h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition">
              Save Profile (UI)
            </button>
          </div>
        </section>

        {/* Post a job */}
        <section className="rounded-3xl border border-white/10 bg-white/6 p-6 md:p-7 shadow-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
              <Briefcase size={18} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Post a Job</h2>
              <p className="text-white/70 text-sm">
                Publish and start receiving applications instantly.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <input
              className={inputBase}
              placeholder="Job Title"
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <select
                className={selectBase}
                value={job.type}
                onChange={(e) => setJob({ ...job, type: e.target.value })}
              >
                <option value="WFH">Job Type: WFH</option>
                <option value="Office">Job Type: Office</option>
              </select>

              <select
                className={selectBase}
                value={job.exp}
                onChange={(e) => setJob({ ...job, exp: e.target.value })}
              >
                <option value="Fresher">Experience: Fresher</option>
                <option value="Experienced">Experience: Experienced</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                className={inputBase}
                placeholder="Salary (e.g. 18,000 - 25,000)"
                value={job.salary}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
              />
              <input
                className={inputBase}
                placeholder="Location"
                value={job.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
              />
            </div>

            <textarea
              className={textareaBase}
              placeholder="Job Description"
              value={job.desc}
              onChange={(e) => setJob({ ...job, desc: e.target.value })}
            />

            <button className="h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition">
              Publish Job (UI)
            </button>

            <div className="text-xs text-white/65">
              Note: UI only. Backend integration later.
            </div>
          </div>
        </section>
      </div>

      {/* Applicants */}
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/6 p-6 md:p-7 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">
                Applicants <span className="text-white/70">(Resume View + Status Update)</span>
              </h2>
              <p className="text-white/70 text-sm mt-1">
                Search applicants, view resume and update selection status.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, city, role..."
                className="h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
              />
            </div>

            <div className="relative sm:w-52">
              <Filter className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
              >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-3xl bg-white/6 border border-white/10 p-6 text-white/80">
              No applicants found.
            </div>
          )}

          {filtered.map((a) => {
            const meta = statusMeta[a.status];
            const PillIcon = meta.icon;

            return (
              <div
                key={a.name}
                className={`rounded-3xl border p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 ${meta.row}`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-extrabold">{a.name}</div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${meta.pill}`}
                    >
                      <PillIcon size={14} />
                      {a.status}
                    </span>
                  </div>
                  <div className="text-sm text-white/75 mt-1">
                    {a.city} • {a.role}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  <button className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition inline-flex items-center gap-2">
                    <Eye size={16} />
                    View Resume
                  </button>

                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.name, e.target.value as ApplicantStatus)}
                    className="px-4 py-2 rounded-full bg-white border border-white/20 text-sm text-[#061433] outline-none"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button className="px-4 py-2 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition inline-flex items-center gap-2">
                    <FileText size={16} />
                    Update (UI)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
