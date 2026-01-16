import React, { useMemo, useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Download,
  Users,
  Briefcase,
  Building2,
  ClipboardList,
  ShieldCheck,
  Settings,
  LifeBuoy,
  BarChart3,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

type TabKey = "overview" | "candidates" | "employees" | "jobs" | "applications" | "reports" | "support" | "settings";

type Candidate = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  exp: string;
  preferredRole: string;
  expectedSalary: string;
  profileStatus: "Complete" | "Incomplete";
  verification: "Pending" | "Verified" | "Rejected";
  lastActive: string;
};

type Employee = {
  id: string;
  name: string;
  role: "Super Admin" | "Admin" | "Manager" | "Recruiter" | "Support";
  phone: string;
  email: string;
  assignedCompanies: number;
  assignedJobs: number;
  hiresThisMonth: number;
  conversion: string;
  status: "Active" | "Inactive";
  lastLogin: string;
};

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  exp: string;
  salary: string;
  status: "Draft" | "Live" | "Paused" | "Closed";
  postedBy: string;
  postedAt: string;
  applications: number;
  shortlisted: number;
};

type Application = {
  id: string;
  candidate: string;
  job: string;
  company: string;
  stage: "Applied" | "Shortlisted" | "Interview" | "Offer" | "Hired" | "Rejected";
  source: string;
  appliedAt: string;
  updatedAt: string;
};

const pill = (text: string, tone: "neutral" | "good" | "bad" | "warn") => {
  const toneCls =
    tone === "good"
      ? "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20"
      : tone === "bad"
      ? "bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/20"
      : tone === "warn"
      ? "bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/20"
      : "bg-white/5 text-white/80 ring-1 ring-white/10";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${toneCls}`}>{text}</span>;
};

const IconStat = ({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-sm text-white/70">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
        {sub ? <div className="mt-1 text-xs text-white/50">{sub}</div> : null}
      </div>
      <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
        <Icon className="h-5 w-5 text-white/80" />
      </div>
    </div>
  </div>
);

const TableShell = ({ title, right, children }: any) => (
  <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
    <div className="overflow-auto">{children}</div>
  </div>
);

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [q, setQ] = useState("");
  const [openDetail, setOpenDetail] = useState<{ type: "candidate" | "employee" | "job" | "application"; id: string } | null>(null);

  // demo data (replace with API)
  const candidates: Candidate[] = [
    {
      id: "C-10291",
      name: "Aman Verma",
      phone: "+91 9xxxx xxxxx",
      email: "aman@example.com",
      city: "Noida",
      exp: "2 yrs",
      preferredRole: "Sales Executive",
      expectedSalary: "₹22k–₹28k",
      profileStatus: "Complete",
      verification: "Verified",
      lastActive: "Jan 14, 2026",
    },
    {
      id: "C-10292",
      name: "Riya Sharma",
      phone: "+91 8xxxx xxxxx",
      email: "riya@example.com",
      city: "Delhi",
      exp: "Fresher",
      preferredRole: "Customer Support",
      expectedSalary: "₹18k–₹22k",
      profileStatus: "Incomplete",
      verification: "Pending",
      lastActive: "Jan 13, 2026",
    },
  ];

  const employees: Employee[] = [
    {
      id: "E-2201",
      name: "Bhavesh Kothari",
      role: "Super Admin",
      phone: "+91 93xxx xxxxx",
      email: "admin@nemesis.com",
      assignedCompanies: 24,
      assignedJobs: 38,
      hiresThisMonth: 12,
      conversion: "18%",
      status: "Active",
      lastLogin: "Jan 14, 2026 12:40",
    },
    {
      id: "E-2202",
      name: "Neha Singh",
      role: "Recruiter",
      phone: "+91 7xxxx xxxxx",
      email: "neha@nemesis.com",
      assignedCompanies: 7,
      assignedJobs: 14,
      hiresThisMonth: 4,
      conversion: "11%",
      status: "Active",
      lastLogin: "Jan 14, 2026 11:05",
    },
  ];

  const jobs: Job[] = [
    {
      id: "J-5520",
      title: "Warehouse Supervisor",
      company: "ABC Logistics",
      location: "Gurugram",
      jobType: "Full-time",
      exp: "2–4 yrs",
      salary: "₹25k–₹35k",
      status: "Live",
      postedBy: "Neha Singh",
      postedAt: "Jan 12, 2026",
      applications: 86,
      shortlisted: 14,
    },
    {
      id: "J-5521",
      title: "Telecaller",
      company: "Zen CRM",
      location: "Noida",
      jobType: "Full-time",
      exp: "0–1 yrs",
      salary: "₹18k–₹24k",
      status: "Draft",
      postedBy: "Bhavesh Kothari",
      postedAt: "Jan 14, 2026",
      applications: 0,
      shortlisted: 0,
    },
  ];

  const applications: Application[] = [
    {
      id: "A-90011",
      candidate: "Aman Verma",
      job: "Warehouse Supervisor",
      company: "ABC Logistics",
      stage: "Interview",
      source: "Website",
      appliedAt: "Jan 12, 2026",
      updatedAt: "Jan 14, 2026",
    },
    {
      id: "A-90012",
      candidate: "Riya Sharma",
      job: "Telecaller",
      company: "Zen CRM",
      stage: "Applied",
      source: "Walk-in",
      appliedAt: "Jan 14, 2026",
      updatedAt: "Jan 14, 2026",
    },
  ];

  const filteredCandidates = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return candidates;
    return candidates.filter((x) => [x.id, x.name, x.phone, x.email, x.city, x.preferredRole].some((v) => v.toLowerCase().includes(s)));
  }, [q]);

  const filteredEmployees = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return employees;
    return employees.filter((x) => [x.id, x.name, x.role, x.phone, x.email].some((v) => String(v).toLowerCase().includes(s)));
  }, [q]);

  const filteredJobs = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return jobs;
    return jobs.filter((x) => [x.id, x.title, x.company, x.location, x.status].some((v) => String(v).toLowerCase().includes(s)));
  }, [q]);

  const filteredApps = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return applications;
    return applications.filter((x) => [x.id, x.candidate, x.job, x.company, x.stage, x.source].some((v) => v.toLowerCase().includes(s)));
  }, [q]);

  const StatTone = (v: string) => v === "Verified" || v === "Live" || v === "Active" || v === "Hired";

  const sidebar = [
    { key: "overview", label: "Dashboard", icon: BarChart3 },
    { key: "candidates", label: "Candidates", icon: Users },
    { key: "employees", label: "Employees", icon: ShieldCheck },
    { key: "jobs", label: "Jobs", icon: Briefcase },
    { key: "applications", label: "Applications", icon: ClipboardList },
    { key: "reports", label: "Reports", icon: Building2 },
    { key: "support", label: "Support", icon: LifeBuoy },
    { key: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#0b1020] to-[#070a14] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1020]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/15 grid place-items-center font-semibold">N</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Nemesis Admin</div>
              <div className="text-xs text-white/60">Job Portal Control Center</div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2 w-[520px]">
            <div className="flex items-center gap-2 w-full rounded-2xl bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <Search className="h-4 w-4 text-white/60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search candidates, employees, jobs, companies…"
                className="w-full bg-transparent outline-none text-sm placeholder:text-white/35"
              />
              <button className="inline-flex items-center gap-1 rounded-xl bg-white/5 ring-1 ring-white/10 px-2 py-1 text-xs text-white/80">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </button>
            </div>
          </div>

          <button className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
            <Bell className="h-5 w-5 text-white/80" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="rounded-xl bg-white text-black px-3 py-2 text-sm inline-flex items-center gap-2 font-medium">
              <Plus className="h-4 w-4" />
              Create Job
            </button>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-2">
            {sidebar.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={[
                    "w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                    active ? "bg-white/10 ring-1 ring-white/15" : "hover:bg-white/5",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 text-white/80" />
                  <span className="text-white/90">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
            <div className="text-xs text-white/60">Quick Controls</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-xs">Add Employee</button>
              <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-xs">Verify Docs</button>
              <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-xs">Templates</button>
              <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-xs">Audit Logs</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <IconStat icon={Users} label="Candidates" value="12,480" sub="New: 128 (7d)" />
            <IconStat icon={ShieldCheck} label="Employees" value="42" sub="Active: 39" />
            <IconStat icon={Briefcase} label="Active Jobs" value="218" sub="Draft: 16" />
            <IconStat icon={ClipboardList} label="Applications" value="3,902" sub="Today: 96" />
          </div>

          {/* Content per tab */}
          {tab === "overview" ? (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <TableShell
                  title="Recent Applications (Mandatory)"
                  right={
                    <>
                      <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs">View all</button>
                    </>
                  }
                >
                  <table className="min-w-full text-sm">
                    <thead className="text-white/60">
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3">ID</th>
                        <th className="text-left px-4 py-3">Candidate</th>
                        <th className="text-left px-4 py-3">Job</th>
                        <th className="text-left px-4 py-3">Stage</th>
                        <th className="text-left px-4 py-3">Updated</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredApps.slice(0, 6).map((a) => (
                        <tr key={a.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 text-white/80">{a.id}</td>
                          <td className="px-4 py-3">{a.candidate}</td>
                          <td className="px-4 py-3 text-white/80">{a.job}</td>
                          <td className="px-4 py-3">
                            {pill(
                              a.stage,
                              a.stage === "Hired" ? "good" : a.stage === "Rejected" ? "bad" : a.stage === "Interview" ? "warn" : "neutral"
                            )}
                          </td>
                          <td className="px-4 py-3 text-white/60">{a.updatedAt}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setOpenDetail({ type: "application", id: a.id })}
                              className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2"
                              aria-label="Open"
                            >
                              <MoreVertical className="h-4 w-4 text-white/70" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>

                <TableShell title="Live Jobs (Mandatory)" right={<button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs">Manage</button>}>
                  <table className="min-w-full text-sm">
                    <thead className="text-white/60">
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3">Job</th>
                        <th className="text-left px-4 py-3">Company</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-left px-4 py-3">Apps</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredJobs.filter((j) => j.status === "Live").slice(0, 6).map((j) => (
                        <tr key={j.id} className="hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="font-medium">{j.title}</div>
                            <div className="text-xs text-white/60">{j.location} • {j.salary}</div>
                          </td>
                          <td className="px-4 py-3 text-white/80">{j.company}</td>
                          <td className="px-4 py-3">{pill(j.status, "good")}</td>
                          <td className="px-4 py-3 text-white/80">{j.applications}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => setOpenDetail({ type: "job", id: j.id })} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
                              <MoreVertical className="h-4 w-4 text-white/70" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredJobs.filter((j) => j.status === "Live").length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center text-white/50">No live jobs.</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </TableShell>
              </div>

              <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <div className="text-sm font-medium">Mandatory Alerts</div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                      <Clock className="h-4 w-4 text-amber-200 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">Pending Verifications</div>
                        <div className="text-xs text-white/60">Candidates with documents pending review.</div>
                      </div>
                      <div className="ml-auto">{pill("12", "warn")}</div>
                    </div>
                    <div className="flex items-start gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                      <XCircle className="h-4 w-4 text-rose-200 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">Duplicate Profiles</div>
                        <div className="text-xs text-white/60">Same phone/email detected.</div>
                      </div>
                      <div className="ml-auto">{pill("3", "bad")}</div>
                    </div>
                    <div className="flex items-start gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-200 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">Interviews Today</div>
                        <div className="text-xs text-white/60">Scheduled interviews requiring confirmations.</div>
                      </div>
                      <div className="ml-auto">{pill("8", "good")}</div>
                    </div>
                  </div>
                </div>

                <TableShell title="Employees (Mandatory)" right={<button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs">Add</button>}>
                  <table className="min-w-full text-sm">
                    <thead className="text-white/60">
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3">Employee</th>
                        <th className="text-left px-4 py-3">Role</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredEmployees.slice(0, 6).map((e) => (
                        <tr key={e.id} className="hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="font-medium">{e.name}</div>
                            <div className="text-xs text-white/60">{e.email}</div>
                          </td>
                          <td className="px-4 py-3 text-white/80">{e.role}</td>
                          <td className="px-4 py-3">
                            {pill(e.status, e.status === "Active" ? "good" : "neutral")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => setOpenDetail({ type: "employee", id: e.id })} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
                              <MoreVertical className="h-4 w-4 text-white/70" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </div>
            </div>
          ) : null}

          {tab === "candidates" ? (
            <TableShell
              title="Candidates (Mandatory Table)"
              right={
                <>
                  <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs">Bulk Actions</button>
                  <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs">Import CSV</button>
                </>
              }
            >
              <table className="min-w-full text-sm">
                <thead className="text-white/60">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3">ID</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">City</th>
                    <th className="text-left px-4 py-3">Experience</th>
                    <th className="text-left px-4 py-3">Preferred Role</th>
                    <th className="text-left px-4 py-3">Expected</th>
                    <th className="text-left px-4 py-3">Profile</th>
                    <th className="text-left px-4 py-3">Verification</th>
                    <th className="text-left px-4 py-3">Last Active</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-white/80">{c.id}</td>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-white/70">
                        <div>{c.phone}</div>
                        <div className="text-xs text-white/50">{c.email}</div>
                      </td>
                      <td className="px-4 py-3 text-white/80">{c.city}</td>
                      <td className="px-4 py-3 text-white/80">{c.exp}</td>
                      <td className="px-4 py-3 text-white/80">{c.preferredRole}</td>
                      <td className="px-4 py-3 text-white/80">{c.expectedSalary}</td>
                      <td className="px-4 py-3">{pill(c.profileStatus, c.profileStatus === "Complete" ? "good" : "warn")}</td>
                      <td className="px-4 py-3">
                        {pill(
                          c.verification,
                          c.verification === "Verified" ? "good" : c.verification === "Rejected" ? "bad" : "warn"
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/60">{c.lastActive}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setOpenDetail({ type: "candidate", id: c.id })} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
                          <MoreVertical className="h-4 w-4 text-white/70" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          ) : null}

          {tab === "employees" ? (
            <TableShell title="Employees (Mandatory Table)" right={<button className="rounded-xl bg-white text-black px-3 py-1.5 text-xs font-medium">Add Employee</button>}>
              <table className="min-w-full text-sm">
                <thead className="text-white/60">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3">ID</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">Assigned</th>
                    <th className="text-left px-4 py-3">Performance</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Last Login</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEmployees.map((e) => (
                    <tr key={e.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-white/80">{e.id}</td>
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3">{pill(e.role, "neutral")}</td>
                      <td className="px-4 py-3 text-white/70">
                        <div>{e.phone}</div>
                        <div className="text-xs text-white/50">{e.email}</div>
                      </td>
                      <td className="px-4 py-3 text-white/80">{e.assignedCompanies} Co • {e.assignedJobs} Jobs</td>
                      <td className="px-4 py-3 text-white/80">{e.hiresThisMonth} hires • {e.conversion}</td>
                      <td className="px-4 py-3">{pill(e.status, e.status === "Active" ? "good" : "warn")}</td>
                      <td className="px-4 py-3 text-white/60">{e.lastLogin}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setOpenDetail({ type: "employee", id: e.id })} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
                          <MoreVertical className="h-4 w-4 text-white/70" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          ) : null}

          {tab === "jobs" ? (
            <TableShell title="Jobs (Mandatory Table)" right={<button className="rounded-xl bg-white text-black px-3 py-1.5 text-xs font-medium">Create Job</button>}>
              <table className="min-w-full text-sm">
                <thead className="text-white/60">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3">Job</th>
                    <th className="text-left px-4 py-3">Company</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Exp</th>
                    <th className="text-left px-4 py-3">Salary</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Posted</th>
                    <th className="text-left px-4 py-3">Apps</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="font-medium">{j.title}</div>
                        <div className="text-xs text-white/60">{j.id}</div>
                      </td>
                      <td className="px-4 py-3 text-white/80">{j.company}</td>
                      <td className="px-4 py-3 text-white/80">{j.location}</td>
                      <td className="px-4 py-3 text-white/80">{j.jobType}</td>
                      <td className="px-4 py-3 text-white/80">{j.exp}</td>
                      <td className="px-4 py-3 text-white/80">{j.salary}</td>
                      <td className="px-4 py-3">
                        {pill(
                          j.status,
                          j.status === "Live" ? "good" : j.status === "Closed" ? "bad" : j.status === "Paused" ? "warn" : "neutral"
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/60">{j.postedAt} • {j.postedBy}</td>
                      <td className="px-4 py-3 text-white/80">{j.applications} / {j.shortlisted}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setOpenDetail({ type: "job", id: j.id })} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
                          <MoreVertical className="h-4 w-4 text-white/70" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          ) : null}

          {tab === "applications" ? (
            <TableShell title="Applications (Mandatory Table)" right={<button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs">Bulk Stage Update</button>}>
              <table className="min-w-full text-sm">
                <thead className="text-white/60">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3">ID</th>
                    <th className="text-left px-4 py-3">Candidate</th>
                    <th className="text-left px-4 py-3">Job</th>
                    <th className="text-left px-4 py-3">Company</th>
                    <th className="text-left px-4 py-3">Stage</th>
                    <th className="text-left px-4 py-3">Source</th>
                    <th className="text-left px-4 py-3">Applied</th>
                    <th className="text-left px-4 py-3">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredApps.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-white/80">{a.id}</td>
                      <td className="px-4 py-3 font-medium">{a.candidate}</td>
                      <td className="px-4 py-3 text-white/80">{a.job}</td>
                      <td className="px-4 py-3 text-white/80">{a.company}</td>
                      <td className="px-4 py-3">
                        {pill(
                          a.stage,
                          a.stage === "Hired" ? "good" : a.stage === "Rejected" ? "bad" : a.stage === "Interview" ? "warn" : "neutral"
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/80">{a.source}</td>
                      <td className="px-4 py-3 text-white/60">{a.appliedAt}</td>
                      <td className="px-4 py-3 text-white/60">{a.updatedAt}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setOpenDetail({ type: "application", id: a.id })} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
                          <MoreVertical className="h-4 w-4 text-white/70" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          ) : null}
        </main>
      </div>

      {/* Detail Drawer (mandatory UX pattern) */}
      {openDetail ? (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenDetail(null)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-[#0b1020] border-l border-white/10 p-4 overflow-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/60">Details</div>
                <div className="text-lg font-semibold">{openDetail.type.toUpperCase()} • {openDetail.id}</div>
                <div className="mt-2 text-xs text-white/50">
                  Mandatory: Overview • Notes • Documents • Timeline • Audit Log
                </div>
              </div>
              <button className="rounded-xl bg-white/5 ring-1 ring-white/10 p-2" onClick={() => setOpenDetail(null)}>
                <XCircle className="h-5 w-5 text-white/70" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-xl bg-white text-black px-3 py-2 text-sm font-medium">Primary Action</button>
              <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm">Secondary</button>
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm font-medium">Overview</div>
              <div className="mt-2 text-sm text-white/70">
                Replace this with API-driven fields. Include: status, owner, createdAt, updatedAt, linked job/company/candidate, verification.
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm font-medium">Notes (with audit)</div>
              <textarea className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-sm outline-none placeholder:text-white/40" placeholder="Add admin notes, @assign, interview feedback…" />
              <div className="mt-2 flex gap-2">
                <button className="rounded-xl bg-white text-black px-3 py-2 text-xs font-medium">Save Note</button>
                <button className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-xs">Attach File</button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm font-medium">Timeline & Audit Log</div>
              <div className="mt-2 space-y-2 text-sm text-white/70">
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">Jan 14, 2026 • Stage changed by Admin</div>
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">Jan 13, 2026 • Document uploaded by Candidate</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
