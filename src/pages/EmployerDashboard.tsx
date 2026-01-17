// src/pages/EmployerDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Briefcase,
  Users,
  BadgeCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  MapPin,
  IndianRupee,
  ShieldCheck,
  X,
  Plus,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api } from "../lib/api";
import type { User } from "../lib/authStorage";

/**
 * ✅ WHY APPLICANTS NOT SHOWING?
 * Your current EmployerDashboard uses MOCK applicants:
 *   const [applicants, setApplicants] = useState([{...},{...}])
 * So backend applications never load.
 *
 * This updated file:
 * 1) Fetches employer jobs
 * 2) Lets employer select a job
 * 3) Loads applications from: GET /api/jobs/{jobId}/applications
 * 4) Updates status via: PATCH /api/applications/{applicationId}/status
 */

/* ───────────────────────────────── Types ───────────────────────────────── */

type Tab = "overview" | "company" | "jobs" | "applicants";

type ApplicantStatusUI = "Applied" | "Selected" | "Rejected" | "Hired";
type ApplicantStatusAPI = "applied" | "shortlisted" | "rejected" | "hired";

type JobItem = {
  id: number | string;
  title?: string;
  location?: string;
  job_type?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  total_experience?: string | null;
};

type ApplicationRow = {
  id: number | string;
  status?: ApplicantStatusAPI | string;
  created_at?: string;

  applied_job_title?: string | null;
  department_role?: string | null;
  cover_letter?: string | null;
  resume_url?: string | null;

  candidate_id?: number | string;

  candidate?: {
    id?: number | string;
    name?: string;
    email?: string;
  } | null;

  job?: {
    id?: number | string;
    title?: string;
    location?: string;
  } | null;
};

type ApplicantRowUI = {
  applicationId: string;
  name: string;
  email?: string;
  city: string;
  role: string;
  status: ApplicantStatusUI;
  resumeUrl?: string | null;
  createdAt?: string;
};

const statusMeta: Record<
  ApplicantStatusUI,
  { pill: string; icon: LucideIcon; row: string; dot: string }
> = {
  Applied: {
    pill: "bg-white/10 border-white/15 text-white",
    icon: Clock,
    row: "bg-white/6 border-white/10",
    dot: "bg-white/70",
  },
  Selected: {
    pill: "bg-emerald-500/15 border-emerald-300/25 text-emerald-50",
    icon: CheckCircle2,
    row: "bg-emerald-500/8 border-emerald-300/18",
    dot: "bg-emerald-300",
  },
  Rejected: {
    pill: "bg-rose-500/12 border-rose-300/20 text-rose-50",
    icon: XCircle,
    row: "bg-rose-500/7 border-rose-300/16",
    dot: "bg-rose-300",
  },
  Hired: {
    pill: "bg-sky-500/12 border-sky-300/20 text-sky-50",
    icon: CheckCircle2,
    row: "bg-sky-500/7 border-sky-300/16",
    dot: "bg-sky-300",
  },
};

/* ───────────────────────────────── Small helpers ───────────────────────────────── */

const uiStatusFromApi = (s?: string): ApplicantStatusUI => {
  const v = (s || "").toLowerCase();
  if (v === "shortlisted") return "Selected";
  if (v === "rejected") return "Rejected";
  if (v === "hired") return "Hired";
  return "Applied";
};

const apiStatusFromUi = (s: ApplicantStatusUI): ApplicantStatusAPI => {
  if (s === "Selected") return "shortlisted";
  if (s === "Rejected") return "rejected";
  if (s === "Hired") return "hired";
  return "applied";
};

const fmtMoney = (n?: number | null) => {
  if (n == null) return "";
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return String(n);
  }
};

const jobSalaryLabel = (j: JobItem) => {
  const a = j.salary_min != null ? `₹${fmtMoney(j.salary_min)}` : "";
  const b = j.salary_max != null ? `₹${fmtMoney(j.salary_max)}` : "";
  if (a && b) return `${a} - ${b}`;
  return a || b || "—";
};

const buildPublicFileUrl = (path?: string | null) => {
  if (!path) return null;

  // if backend already returns full url
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base =
    (import.meta as any)?.env?.VITE_API_URL ||
    (import.meta as any)?.env?.VITE_API_BASE ||
    "http://127.0.0.1:8000";

  // Laravel public disk served at /storage/...
  return `${String(base).replace(/\/$/, "")}/storage/${String(path).replace(
    /^\/?/,
    ""
  )}`;
};

const makeEmptyJob = () => ({
  title: "",
  type: "WFH",
  exp: "Fresher",
  salary: "",
  location: "",
  desc: "",

  job_area: "",
  total_experience: "",
  monthly_inhand_salary: "",
  bonus: "No" as "Yes" | "No",
  skills: [] as string[],

  age: "",
  preferred_language: "",
  assets: "",
  degree_specialisation: "",
  certification: "",
  preferred_industry: "",
  job_timings: "",
  interview_details: "",

  company_name: "",
  contact_person_name: "",
  contact_phone: "",
  contact_email: "",
  contact_person_profile: "",
  org_size: "",
  fill_urgency: "",
  hiring_frequency: "",
  job_address: "",
});

/* ───────────────────────────────── UI components ───────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="container-x py-8">{children}</main>;
}

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "bad";
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-500/15 border-emerald-300/25 text-emerald-50"
      : tone === "bad"
      ? "bg-rose-500/12 border-rose-300/20 text-rose-50"
      : "bg-white/10 border-white/15 text-white";
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${cls}`}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string | number;
  Icon: any;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-white/70">{label}</div>
        <div className="h-9 w-9 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/6 shadow-card overflow-hidden">
      <div className="p-5 md:p-6 border-b border-white/10 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg md:text-xl font-extrabold">{title}</div>
          {subtitle ? (
            <div className="text-sm text-white/65 mt-1">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function SideItem({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full text-left px-4 py-3 rounded-2xl border transition font-semibold " +
        (active
          ? "bg-white text-[#061433] border-transparent"
          : "bg-white/6 border-white/10 hover:bg-white/10 text-white/85")
      }
    >
      {label}
    </button>
  );
}

function Accordion({
  title,
  desc,
  children,
  defaultOpen = true,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="rounded-3xl border border-white/10 bg-white/6 overflow-hidden"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-3">
        <div>
          <div className="font-extrabold">{title}</div>
          {desc ? <div className="text-sm text-white/65 mt-1">{desc}</div> : null}
        </div>
        <div className="text-white/60 text-sm">Expand</div>
      </summary>
      <div className="p-5 pt-0">{children}</div>
    </details>
  );
}

/* ───────────────────────────────── Main ───────────────────────────────── */

export default function EmployerDashboard() {
  const nav = useNavigate();

  // ROLE GUARD
  useEffect(() => {
    const raw = localStorage.getItem("jp_user");
    if (!raw) {
      nav("/auth", { replace: true });
      return;
    }

    let user: User | null = null;
    try {
      user = JSON.parse(raw);
    } catch {
      nav("/auth", { replace: true });
      return;
    }

    if (user?.role !== "employer") {
      nav("/candidate", { replace: true });
    }
  }, [nav]);



  const inputBase =
    "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
  const selectBase =
    "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
  const textareaBase =
    "min-h-[120px] w-full rounded-2xl bg-white border border-white/20 px-4 py-3 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";

  const [tab, setTab] = useState<Tab>("overview");

  // UI state only
  const [company, setCompany] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
  });

  const [job, setJob] = useState(makeEmptyJob);

  // suggestions state
  const [titleSug, setTitleSug] = useState<string[]>([]);
  const [locSug, setLocSug] = useState<string[]>([]);
  const [areaSug, setAreaSug] = useState<string[]>([]);

  // skills UI
  const [skillInput, setSkillInput] = useState("");

  // job publish API
  const [posting, setPosting] = useState(false);
  const [postMsg, setPostMsg] = useState<string | null>(null);

  // applicants API
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [applications, setApplications] = useState<ApplicantRowUI[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsMsg, setAppsMsg] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | ApplicantStatusUI>("All");

  // auto-fill job contact fields from company profile (UI)
  useEffect(() => {
    setJob((p) => ({
      ...p,
      company_name: p.company_name || company.name,
      contact_person_name: p.contact_person_name || company.contact,
      contact_email: p.contact_email || company.email,
      contact_phone: p.contact_phone || company.phone,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company.name, company.contact, company.email, company.phone]);

  // suggestions fetch (debounced)
  useEffect(() => {
    const t = setTimeout(async () => {
      const q = job.title.trim();
      if (!q) return setTitleSug([]);
      try {
        const { data } = await api.get("/suggestions", {
          params: { field: "job_title", q, limit: 8 },
        });
        setTitleSug(Array.isArray(data) ? data : []);
      } catch {
        setTitleSug([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [job.title]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = job.location.trim();
      if (!q) return setLocSug([]);
      try {
        const { data } = await api.get("/suggestions", {
          params: { field: "job_location", q, limit: 8 },
        });
        setLocSug(Array.isArray(data) ? data : []);
      } catch {
        setLocSug([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [job.location]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = job.job_area.trim();
      if (!q) return setAreaSug([]);
      try {
        const { data } = await api.get("/suggestions", {
          params: { field: "job_area", q, limit: 8 },
        });
        setAreaSug(Array.isArray(data) ? data : []);
      } catch {
        setAreaSug([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [job.job_area]);

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (job.skills.some((s) => s.toLowerCase() === v.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setJob((p) => ({ ...p, skills: [...p.skills, v] }));
    setSkillInput("");
  };

  const removeSkill = (v: string) => {
    setJob((p) => ({ ...p, skills: p.skills.filter((s) => s !== v) }));
  };



// 🔹 Load company profile from backend
useEffect(() => {
  (async () => {
    try {
      const res = await api.get("/employer/profile");

      if (res.data) {
        setCompany({
          name: res.data.company_name || "",
          contact: res.data.company_hr_name || "",
          email: res.data.company_email || "",
          phone: res.data.company_phone || "",
        });
      }
    } catch (e) {
      console.log("No company profile found yet");
    }
  })();
}, []);



  /* ─────────────────────────── Fetch employer jobs ─────────────────────────── */

  const fetchEmployerJobs = async () => {
    const user = JSON.parse(localStorage.getItem("jp_user") || "null") as User | null;
    const employer_id = user?.id;
    if (!employer_id) return;

    setJobsLoading(true);
    try {
      // Try common endpoints (one of these should exist in your backend)
      // 1) /employer/jobs
      // 2) /jobs?employer_id=...
      let res: any = null;

      try {
        res = await api.get("/employer/jobs");
      } catch {
        res = await api.get("/jobs", { params: { employer_id } });
      }

      const data = res?.data;
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      const normalized: JobItem[] = (Array.isArray(list) ? list : []).map((j: any) => ({
        id: j.id,
        title: j.title,
        location: j.location,
        job_type: j.job_type,
        salary_min: j.salary_min ?? null,
        salary_max: j.salary_max ?? null,
        total_experience: j.total_experience ?? null,
      }));

      setJobs(normalized);

      // auto-select first job if not selected
      if (!selectedJobId && normalized.length > 0) {
        setSelectedJobId(String(normalized[0].id));
      }
    } catch (e) {
      console.log("FETCH JOBS ERROR:", e);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  // fetch jobs when opening applicants tab
  useEffect(() => {
    if (tab === "applicants") fetchEmployerJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  /* ─────────────────────────── Fetch applications for selected job ─────────────────────────── */

  const fetchApplicants = async (jobId: string) => {
    if (!jobId) return;

    setAppsLoading(true);
    setAppsMsg(null);

    try {
      const res = await api.get(`/jobs/${jobId}/applications`);
      const data = res.data;
      const list = Array.isArray(data) ? data : (data?.data ?? []);

      const mapped: ApplicantRowUI[] = (Array.isArray(list) ? list : []).map(
        (a: ApplicationRow) => {
          const name =
            a.candidate?.name ||
            a.applied_job_title || // fallback (not ideal)
            `Candidate #${String(a.candidate_id ?? "") || "—"}`;

          return {
            applicationId: String(a.id),
            name,
            email: a.candidate?.email || undefined,
            city: a.job?.location || "—",
            role: a.department_role || a.job?.title || "—",
            status: uiStatusFromApi(a.status),
            resumeUrl: buildPublicFileUrl(a.resume_url),
            createdAt: a.created_at,
          };
        }
      );

      setApplications(mapped);
    } catch (e: any) {
      console.log("FETCH APPS ERROR:", e);
      setApplications([]);
      setAppsMsg(e?.response?.data?.message || "Failed to load applicants");
    } finally {
      setAppsLoading(false);
    }
  };

  // refetch when selected job changes (on applicants tab)
  useEffect(() => {
    if (tab !== "applicants") return;
    if (!selectedJobId) return;
    fetchApplicants(selectedJobId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, selectedJobId]);

  const updateApplicationStatus = async (
    applicationId: string,
    next: ApplicantStatusUI
  ) => {
    // optimistic UI
    setApplications((prev) =>
      prev.map((r) =>
        r.applicationId === applicationId ? { ...r, status: next } : r
      )
    );

    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: apiStatusFromUi(next),
      });
    } catch (e) {
      console.log("UPDATE STATUS ERROR:", e);
      // revert by refetch
      if (selectedJobId) fetchApplicants(selectedJobId);
    }
  };

  /* ─────────────────────────── KPI from loaded apps ─────────────────────────── */

  const counts = useMemo(() => {
    const c: Record<ApplicantStatusUI, number> = {
      Applied: 0,
      Selected: 0,
      Rejected: 0,
      Hired: 0,
    };
    applications.forEach((a) => (c[a.status] += 1));
    return c;
  }, [applications]);

  const kpis = useMemo(() => {
    const total = applications.length;
    const selectedRate = total ? Math.round((counts.Selected / total) * 100) : 0;
    return [
      { label: "Total Applicants", value: total, icon: Users },
      { label: "Applied", value: counts.Applied, icon: Clock },
      { label: "Selected", value: counts.Selected, icon: CheckCircle2 },
      { label: "Selection Rate", value: `${selectedRate}%`, icon: Sparkles },
    ] as const;
  }, [applications.length, counts]);

  const filteredApplicants = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      const hit =
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.city || "").toLowerCase().includes(q) ||
        (a.role || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q);
      const st = statusFilter === "All" || a.status === statusFilter;
      return hit && st;
    });
  }, [applications, query, statusFilter]);

  /* ─────────────────────────── Publish job (same as your code) ─────────────────────────── */

  const publishJob = async () => {
    setPostMsg(null);

    if (!job.title.trim()) return setPostMsg("Job title required");
    if (!job.location.trim()) return setPostMsg("Location required");
    if (!job.desc.trim()) return setPostMsg("Description required");

    const nums = (job.salary || "").match(/\d+/g)?.map(Number) || [];
    const salary_min = nums[0] ?? null;
    const salary_max = nums[1] ?? null;

    const user = JSON.parse(localStorage.getItem("jp_user") || "null");
    const employer_id = user?.id;
    if (!employer_id) return setPostMsg("Employer not logged in");

    const payload = {
      employer_id,
      title: job.title,
      description: job.desc,
      location: job.location,
      job_type: job.type,
      salary_min,
      salary_max,

      job_area: job.job_area || null,
      total_experience: job.total_experience || null,
      monthly_inhand_salary: job.monthly_inhand_salary
        ? Number(job.monthly_inhand_salary)
        : null,
      bonus: job.bonus === "Yes",
      skills: job.skills,

      age: job.age || null,
      preferred_language: job.preferred_language || null,
      assets: job.assets || null,
      degree_specialisation: job.degree_specialisation || null,
      certification: job.certification || null,
      preferred_industry: job.preferred_industry || null,
      job_timings: job.job_timings || null,
      interview_details: job.interview_details || null,

      company_name: job.company_name || null,
      contact_person_name: job.contact_person_name || null,
      contact_phone: job.contact_phone || null,
      contact_email: job.contact_email || null,
      contact_person_profile: job.contact_person_profile || null,
      org_size: job.org_size || null,
      fill_urgency: job.fill_urgency || null,
      hiring_frequency: job.hiring_frequency || null,
      job_address: job.job_address || null,
    };
  console.log(payload);
    try {
      setPosting(true);
      await api.post("/jobs", payload);

      setPostMsg("✅ Job published successfully");
      setJob(makeEmptyJob());
      setSkillInput("");
      setTab("overview");
    } catch (err) {
       const e = err as any;
         console.log("========== JOB PUBLISH ERROR ==========");
  console.log("STATUS:", e?.response?.status);
  console.log("DATA:", e?.response?.data);
  console.log("ERRORS:", e?.response?.data?.errors);
  console.log("FULL ERROR:", e);
  console.log("======================================");
      console.log("PUBLISH ERROR:", err);
      const message = err instanceof Error ? err.message : "❌ Failed to publish job";
      setPostMsg(message);
    } finally {
      setPosting(false);
    }
  };

  /* ───────────────────────────────── Render ───────────────────────────────── */

  return (
    <Shell>
      {/* TOP HEADER */}
      <TopHeader
        onPostJob={() => setTab("jobs")}
        onViewApplicants={() => setTab("applicants")}
      />

      {/* KPI */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} Icon={k.icon} />
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid lg:grid-cols-[280px_1fr] gap-5">
        <Sidebar tab={tab} setTab={setTab} />

        <div className="space-y-5">
          {tab === "overview" && (
            <OverviewPanel
              onCompany={() => setTab("company")}
              onJobs={() => setTab("jobs")}
              onApplicants={() => setTab("applicants")}
            />
          )}

          {tab === "company" && (
            <CompanyPanel
              company={company}
              setCompany={setCompany}
              onBack={() => setTab("overview")}
              inputBase={inputBase}
            />
          )}

          {tab === "jobs" && (
            <PostJobPanel
              job={job}
              setJob={setJob}
              inputBase={inputBase}
              selectBase={selectBase}
              textareaBase={textareaBase}
              titleSug={titleSug}
              locSug={locSug}
              areaSug={areaSug}
              skillInput={skillInput}
              setSkillInput={setSkillInput}
              addSkill={addSkill}
              removeSkill={removeSkill}
              posting={posting}
              postMsg={postMsg}
              publishJob={publishJob}
              clearJob={() => {
                setJob(makeEmptyJob());
                setSkillInput("");
              }}
            />
          )}

          {tab === "applicants" && (
            <ApplicantsPanel
              jobs={jobs}
              jobsLoading={jobsLoading}
              selectedJobId={selectedJobId}
              setSelectedJobId={setSelectedJobId}
              appsLoading={appsLoading}
              appsMsg={appsMsg}
              applicants={filteredApplicants}
              totalApplicants={applications.length}
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              updateStatus={updateApplicationStatus}
            />
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ───────────────────────────────── Subcomponents ───────────────────────────────── */

function TopHeader({
  onPostJob,
  onViewApplicants,
}: {
  onPostJob: () => void;
  onViewApplicants: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 backdrop-blur shadow-card p-5 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm">
            <Building2 size={16} />
            Employer Dashboard
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
            Post jobs, manage applicants, hire faster
          </h1>
          <p className="text-white/70 mt-1 text-sm md:text-base">
            Profile → Job → Applicants → Status
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onPostJob}
            className="h-11 px-5 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
          >
            Post a Job
          </button>
          <button
            onClick={onViewApplicants}
            className="h-11 px-5 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold"
          >
            View Applicants
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4 h-fit lg:sticky lg:top-6">
      <div className="text-xs font-extrabold tracking-[0.22em] text-white/55 px-2">
        NAVIGATION
      </div>
      <div className="mt-3 space-y-2">
        <SideItem active={tab === "overview"} label="Overview" onClick={() => setTab("overview")} />
        <SideItem active={tab === "company"} label="Company Profile" onClick={() => setTab("company")} />
        <SideItem active={tab === "jobs"} label="Post a Job" onClick={() => setTab("jobs")} />
        <SideItem active={tab === "applicants"} label="Applicants" onClick={() => setTab("applicants")} />
      </div>

      <div className="mt-4 rounded-3xl bg-white/6 border border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold">Profile Status</div>
          <Chip tone="good">
            <BadgeCheck size={14} /> Verified (UI)
          </Chip>
        </div>
        <div className="text-xs text-white/65 mt-2">
          Complete profile + add job details for higher application rate.
        </div>
      </div>
    </aside>
  );
}

function OverviewPanel({
  onCompany,
  onJobs,
  onApplicants,
}: {
  onCompany: () => void;
  onJobs: () => void;
  onApplicants: () => void;
}) {
  return (
    <Panel
      title="Quick Actions"
      subtitle="Recommended steps to start hiring."
      right={
        <Chip tone="neutral">
          <ShieldCheck size={14} /> Secure
        </Chip>
      }
    >
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white/6 border border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
              <Building2 size={18} />
            </div>
            <div>
              <div className="font-extrabold">Company Profile</div>
              <div className="text-white/70 text-sm">Build trust for better applicants.</div>
            </div>
          </div>
          <button
            onClick={onCompany}
            className="mt-4 w-full h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold"
          >
            Update Profile
          </button>
        </div>

        <div className="rounded-3xl bg-white/6 border border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
              <Briefcase size={18} />
            </div>
            <div>
              <div className="font-extrabold">Post a Job</div>
              <div className="text-white/70 text-sm">Publish in under a minute.</div>
            </div>
          </div>
          <button
            onClick={onJobs}
            className="mt-4 w-full h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
          >
            Create Job
          </button>
        </div>

        <div className="rounded-3xl bg-white/6 border border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
              <Users size={18} />
            </div>
            <div>
              <div className="font-extrabold">Applicants</div>
              <div className="text-white/70 text-sm">Review resumes & update status.</div>
            </div>
          </div>
          <button
            onClick={onApplicants}
            className="mt-4 w-full h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold"
          >
            Open Applicants
          </button>
        </div>
      </div>
    </Panel>
  );
}

function CompanyPanel({
  company,
  setCompany,
  onBack,
  inputBase,
}: {
  company: { name: string; contact: string; email: string; phone: string };
  setCompany: (v: any) => void;
  onBack: () => void;
  inputBase: string;
}) {
  return (
    <Panel
      title="Company Profile"
      subtitle="This appears on job posts to build credibility."
      right={
        <Chip tone="good">
          <BadgeCheck size={14} /> Verified (UI)
        </Chip>
      }
    >
      <div className="grid gap-3">
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
          onChange={(e) => setCompany({ ...company, contact: e.target.value })}
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className={inputBase}
            placeholder="Email"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
          />
          <input
            className={inputBase}
            placeholder="Phone"
            value={company.phone}
            onChange={(e) => setCompany({ ...company, phone: e.target.value })}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
  onClick={async () => {
    try {
      await api.post("/employer/profile", {
        company_name: company.name,
        company_hr_name: company.contact,
        company_email: company.email,
        company_phone: company.phone,
      });

      alert("Company profile saved");
    } catch (e) {
      alert("Failed to save company profile");
      console.log(e);
    }
  }}
  className="h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition px-6"
>
  Save Profile
</button>

          <button
            onClick={onBack}
            className="h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold px-6"
          >
            Back
          </button>
        </div>
      </div>
    </Panel>
  );
}

function PostJobPanel({
  job,
  setJob,
  inputBase,
  selectBase,
  textareaBase,
  titleSug,
  locSug,
  areaSug,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
  posting,
  postMsg,
  publishJob,
  clearJob,
}: {
  job: any;
  setJob: (v: any) => void;
  inputBase: string;
  selectBase: string;
  textareaBase: string;
  titleSug: string[];
  locSug: string[];
  areaSug: string[];
  skillInput: string;
  setSkillInput: (v: string) => void;
  addSkill: () => void;
  removeSkill: (v: string) => void;
  posting: boolean;
  postMsg: string | null;
  publishJob: () => void;
  clearJob: () => void;
}) {
  return (
    <Panel
      title="Post a Job"
      subtitle="Step-wise sections for faster completion."
      right={
        <Chip tone="neutral">
          <ShieldCheck size={14} /> Secure posting
        </Chip>
      }
    >
      {postMsg ? (
        <div className="mb-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
          {postMsg}
        </div>
      ) : null}

      <div className="space-y-4">
        <Accordion title="1) Basic Details" desc="Job title, type and experience.">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-semibold text-white/85">Job Title</label>
              <input
                className={inputBase + " mt-2"}
                placeholder="Customer Care Executive / HR Executive"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                list="jobTitleList"
              />
              <datalist id="jobTitleList">
                {titleSug.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
<div className="mt-4">
  <label className="text-sm font-semibold text-white/85">Company Name</label>
  <input
    className={inputBase + " mt-2"}
    value={job.company_name}
    placeholder="Company name"
    onChange={(e) => setJob({ ...job, company_name: e.target.value })}
  />
</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-white/85">Job Type</label>
                <select
                  className={selectBase + " mt-2"}
                  value={job.type}
                  onChange={(e) => setJob({ ...job, type: e.target.value })}
                >
                  <option value="WFH">Work from Home</option>
                  <option value="Office">Onsite / Office</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-white/85">Experience</label>
                <select
                  className={selectBase + " mt-2"}
                  value={job.exp}
                  onChange={(e) => setJob({ ...job, exp: e.target.value })}
                >
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion title="2) Salary & Location" desc="Higher clarity → more applications.">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-white/85">Salary Range</label>
              <div className="relative mt-2">
                <IndianRupee className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                <input
                  className="h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
                  placeholder="e.g. 18,000 - 25,000"
                  value={job.salary}
                  onChange={(e) => setJob({ ...job, salary: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-white/85">Location</label>
              <div className="relative mt-2">
                <MapPin className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                <input
                  className="h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
                  placeholder="Noida / Remote"
                  value={job.location}
                  onChange={(e) => setJob({ ...job, location: e.target.value })}
                  list="jobLocationList"
                />
                <datalist id="jobLocationList">
                  {locSug.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-white/85">Job Area</label>
              <input
                className={inputBase + " mt-2"}
                placeholder="Sector 62 / Karol Bagh"
                value={job.job_area}
                onChange={(e) => setJob({ ...job, job_area: e.target.value })}
                list="jobAreaList"
              />
              <datalist id="jobAreaList">
                {areaSug.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-sm font-semibold text-white/85">
                Monthly In-hand Salary (₹)
              </label>
              <div className="relative mt-2">
                <IndianRupee className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                <input
                  className="h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
                  placeholder="e.g. 22000"
                  value={job.monthly_inhand_salary}
                  onChange={(e) =>
                    setJob({
                      ...job,
                      monthly_inhand_salary: e.target.value.replace(/[^\d]/g, ""),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion title="3) Skills" desc="Add 3–8 skills for better matching.">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className={inputBase}
              placeholder="Excel, Tally, Telecalling..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={addSkill}
              className="h-11 px-4 rounded-2xl bg-white text-[#061433] font-extrabold hover:opacity-95 transition inline-flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {job.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((s: string) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm text-white/90"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="opacity-80 hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Accordion>

        <Accordion title="4) Job Description" desc="Clear description increases applicants.">
          <textarea
            className={textareaBase}
            placeholder="Responsibilities, timings, incentives, interview process..."
            value={job.desc}
            onChange={(e) => setJob({ ...job, desc: e.target.value })}
          />
          <div className="mt-2 text-xs text-white/60">
            Tip: Salary + location + shift timing = higher conversion.
          </div>
        </Accordion>

        <Accordion title="5) More Details (Optional)" desc="Can be skipped.">
          <div className="grid sm:grid-cols-2 gap-4">
            <input className={inputBase} placeholder="Age (e.g. 18-30)" value={job.age} onChange={(e) => setJob({ ...job, age: e.target.value })} />
            <input className={inputBase} placeholder="Preferred Language" value={job.preferred_language} onChange={(e) => setJob({ ...job, preferred_language: e.target.value })} />
            <input className={inputBase} placeholder="Assets (Bike/Laptop)" value={job.assets} onChange={(e) => setJob({ ...job, assets: e.target.value })} />
            <input className={inputBase} placeholder="Preferred Industry" value={job.preferred_industry} onChange={(e) => setJob({ ...job, preferred_industry: e.target.value })} />
            <input className={inputBase} placeholder="Degree & Specialisation" value={job.degree_specialisation} onChange={(e) => setJob({ ...job, degree_specialisation: e.target.value })} />
            <input className={inputBase} placeholder="Certification" value={job.certification} onChange={(e) => setJob({ ...job, certification: e.target.value })} />
            <input className={inputBase} placeholder="Job Timings" value={job.job_timings} onChange={(e) => setJob({ ...job, job_timings: e.target.value })} />
            <input className={inputBase} placeholder="Interview Details" value={job.interview_details} onChange={(e) => setJob({ ...job, interview_details: e.target.value })} />
          </div>
        </Accordion>

        <div className="rounded-3xl border border-white/10 bg-white/6 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-sm text-white/70">
            Publish when ready. You can edit later (if you add edit flow).
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={publishJob}
              disabled={posting}
              className={
                "h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition px-7 " +
                (posting ? "opacity-60 cursor-not-allowed" : "")
              }
            >
              {posting ? "Publishing..." : "Publish Job"}
            </button>

            <button
              onClick={clearJob}
              className="h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold px-7"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ApplicantsPanel({
  jobs,
  jobsLoading,
  selectedJobId,
  setSelectedJobId,
  appsLoading,
  appsMsg,
  applicants,
  totalApplicants,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  updateStatus,
}: {
  jobs: JobItem[];
  jobsLoading: boolean;
  selectedJobId: string;
  setSelectedJobId: (v: string) => void;
  appsLoading: boolean;
  appsMsg: string | null;
  applicants: ApplicantRowUI[];
  totalApplicants: number;
  query: string;
  setQuery: (v: string) => void;
  statusFilter: "All" | ApplicantStatusUI;
  setStatusFilter: (v: "All" | ApplicantStatusUI) => void;
  updateStatus: (applicationId: string, next: ApplicantStatusUI) => void;
}) {
  return (
    <Panel
      title="Applicants"
      subtitle="Select a job → view applicants."
      right={
        <Chip tone="neutral">
          <Users size={14} /> {totalApplicants} Total
        </Chip>
      }
    >
      {/* Job selector */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs font-extrabold tracking-[0.18em] text-white/55">
            SELECT JOB
          </div>

          <div className="mt-2">
            {jobsLoading ? (
              <div className="text-sm text-white/70">Loading jobs…</div>
            ) : jobs.length === 0 ? (
              <div className="text-sm text-white/70">
                No jobs found. Post a job first.
              </div>
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
              >
                {jobs.map((j) => (
                  <option key={String(j.id)} value={String(j.id)}>
                    {(j.title || "Untitled")} • {(j.location || "—")} • {jobSalaryLabel(j)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs font-extrabold tracking-[0.18em] text-white/55">
            FILTERS
          </div>

          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative w-full">
              <Search className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, city, role..."
                className="h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
              />
            </div>

            <div className="relative w-full sm:w-[220px]">
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
                <option value="Hired">Hired</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {appsMsg ? (
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
          {appsMsg}
        </div>
      ) : null}

      {/* Table */}
      <div className="mt-4 overflow-auto rounded-3xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="p-3 text-left">Candidate</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {appsLoading ? (
              <tr>
                <td className="p-4 text-white/70" colSpan={5}>
                  Loading applicants…
                </td>
              </tr>
            ) : applicants.length === 0 ? (
              <tr>
                <td className="p-4 text-white/70" colSpan={5}>
                  No applicants found for this job.
                </td>
              </tr>
            ) : (
              applicants.map((a) => {
                const meta = statusMeta[a.status];
                const PillIcon = meta.icon;

                const tone =
                  a.status === "Selected" || a.status === "Hired"
                    ? "good"
                    : a.status === "Rejected"
                    ? "bad"
                    : "neutral";

                return (
                  <tr key={a.applicationId} className="border-t border-white/10">
                    <td className="p-3">
                      <div className="font-semibold">{a.name}</div>
                      {a.email ? (
                        <div className="text-xs text-white/65">{a.email}</div>
                      ) : null}
                    </td>
                    <td className="p-3">{a.city}</td>
                    <td className="p-3">{a.role}</td>
                    <td className="p-3">
                      <Chip tone={tone}>
                        <PillIcon size={14} /> {a.status}
                      </Chip>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap items-center">
                        {a.resumeUrl ? (
                          <a
                            href={a.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition inline-flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View Resume
                          </a>
                        ) : (
                          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 inline-flex items-center gap-2">
                            <Eye size={16} />
                            No Resume
                          </span>
                        )}

                        <select
                          value={a.status}
                          onChange={(e) =>
                            updateStatus(
                              a.applicationId,
                              e.target.value as ApplicantStatusUI
                            )
                          }
                          className="px-4 py-2 rounded-full bg-white border border-white/20 text-sm text-[#061433] outline-none"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>

                        <button
                          type="button"
                          className="px-4 py-2 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition inline-flex items-center gap-2"
                        >
                          <FileText size={16} />
                          Notes (UI)
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
