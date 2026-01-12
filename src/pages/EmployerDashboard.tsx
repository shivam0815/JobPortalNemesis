// src/pages/EmployerDashboard.tsx
import { useMemo, useState, useEffect } from "react";
import { api } from "../lib/api";
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
  Sparkles,
  MapPin,
  IndianRupee,
  ShieldCheck,
  X,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User } from "../lib/authStorage";
import type { LucideIcon } from "lucide-react";

type ApplicantStatus = "Applied" | "Selected" | "Rejected";

type Applicant = {
  name: string;
  city: string;
  role: string;
  status: ApplicantStatus;
};

const statusMeta: Record<
  ApplicantStatus,
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
};

const inputBase =
  "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const selectBase =
  "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const textareaBase =
  "min-h-[120px] w-full rounded-2xl bg-white border border-white/20 px-4 py-3 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";

type Tab = "overview" | "company" | "jobs" | "applicants";

const makeEmptyJob = () => ({
  title: "",
  type: "WFH",
  exp: "Fresher",
  salary: "",
  location: "",
  desc: "",

  // ✅ extra fields (PDF)
  job_area: "",
  total_experience: "",
  monthly_inhand_salary: "", // string input -> number in payload
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

  // company/contact (optional)
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

export default function EmployerDashboard() {
  const nav = useNavigate();

  // 🔐 ROLE GUARD
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

  const [tab, setTab] = useState<Tab>("overview");

  // UI state only
  const [company, setCompany] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
  });

  const [job, setJob] = useState(makeEmptyJob);

  // ✅ suggestions state
  const [titleSug, setTitleSug] = useState<string[]>([]);
  const [locSug, setLocSug] = useState<string[]>([]);
  const [areaSug, setAreaSug] = useState<string[]>([]);

  // ✅ skills UI
  const [skillInput, setSkillInput] = useState("");

  // ✅ API state
  const [posting, setPosting] = useState(false);
  const [postMsg, setPostMsg] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApplicantStatus>("All");

  const [applicants, setApplicants] = useState<Applicant[]>([
    { name: "Uzair Ahmad", city: "Delhi", role: "HR Executive", status: "Applied" },
    { name: "Rafiq Sheikh", city: "Noida", role: "Customer Care", status: "Selected" },
  ]);

  // ✅ Optional: auto-fill job contact fields from company profile (UI)
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

  // ✅ suggestions fetch (debounced)
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
    const c: Record<ApplicantStatus, number> = { Applied: 0, Selected: 0, Rejected: 0 };
    applicants.forEach((a) => (c[a.status] += 1));
    return c;
  }, [applicants]);

  const updateStatus = (name: string, next: ApplicantStatus) => {
    setApplicants((prev) => prev.map((a) => (a.name === name ? { ...a, status: next } : a)));
  };

  const kpis = useMemo(() => {
    const total = applicants.length;
    const selectedRate = total ? Math.round((counts.Selected / total) * 100) : 0;
    return [
      { label: "Total Applicants", value: total, icon: Users },
      { label: "Applied", value: counts.Applied, icon: Clock },
      { label: "Selected", value: counts.Selected, icon: CheckCircle2 },
      { label: "Selection Rate", value: `${selectedRate}%`, icon: Sparkles },
    ] as const;
  }, [applicants.length, counts]);

  // ✅ Publish job -> Backend
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

      // ✅ extra fields
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

    try {
      setPosting(true);
      await api.post("/jobs", payload);

      setPostMsg("✅ Job published successfully");
      setJob(makeEmptyJob());
      setSkillInput("");
      setTab("overview");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("PUBLISH ERROR:", err);
      const message = err instanceof Error ? err.message : "❌ Failed to publish job";
      setPostMsg(message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className="container-x py-10">
      {/* Sticky Header */}
      <div className="sticky top-3 z-20">
        <div className="rounded-3xl border border-white/10 bg-white/8 backdrop-blur shadow-card px-5 py-4 md:px-6 md:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm">
                <Building2 size={16} />
                Employer / HR Dashboard
              </div>

              <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
                Manage hiring in one place
              </h1>

              <p className="text-white/70 mt-1 text-sm md:text-base">
                Profile → Post Job → View Resumes → Update Status
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                onClick={() => setTab("jobs")}
                className="h-11 px-5 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
              >
                Post a Job
              </button>
              <button
                onClick={() => setTab("applicants")}
                className="h-11 px-5 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold"
              >
                View Applicants
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["overview", "Overview"],
                ["company", "Company Profile"],
                ["jobs", "Post Job"],
                ["applicants", "Applicants"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={
                  "px-4 py-2 rounded-full text-sm border transition " +
                  (tab === k
                    ? "bg-white text-[#061433] border-transparent"
                    : "bg-white/8 border-white/12 hover:bg-white/10")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-3xl border border-white/10 bg-white/6 shadow-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-white/70">{k.label}</div>
              <div className="h-9 w-9 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                <k.icon size={16} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold">{k.value}</div>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="mt-6 grid gap-6">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <section className="rounded-3xl border border-white/10 bg-white/6 p-6 md:p-7 shadow-card">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold">Quick Actions</h2>
                <p className="text-white/70 text-sm mt-1">
                  Complete your profile, publish a job and start screening applicants.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-white/85">
                <BadgeCheck size={14} /> Verified (UI)
              </span>
            </div>

            <div className="mt-5 grid md:grid-cols-3 gap-4">
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
                  onClick={() => setTab("company")}
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
                  onClick={() => setTab("jobs")}
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
                  onClick={() => setTab("applicants")}
                  className="mt-4 w-full h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold"
                >
                  Open Applicants
                </button>
              </div>
            </div>
          </section>
        )}

        {/* COMPANY PROFILE */}
        {tab === "company" && (
          <section className="rounded-3xl border border-white/10 bg-white/6 p-6 md:p-7 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">Company Profile</h2>
                  <p className="text-white/70 text-sm">This appears on job posts to build credibility.</p>
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
                <button className="h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition w-full sm:w-auto px-6">
                  Save Profile (UI)
                </button>
                <button
                  onClick={() => setTab("overview")}
                  className="h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold w-full sm:w-auto px-6"
                >
                  Back
                </button>
              </div>
            </div>
          </section>
        )}

        {/* POST JOB */}
        {tab === "jobs" && (
          <section className="rounded-3xl border border-white/10 bg-white/6 p-6 md:p-7 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">Post a Job</h2>
                  <p className="text-white/70 text-sm mt-1">
                    Create a high-quality job post to attract better candidates.
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-white/85">
                <ShieldCheck size={14} /> Secure posting
              </span>
            </div>

            {postMsg && (
              <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
                {postMsg}
              </div>
            )}

            <div className="mt-6 grid gap-4">
              {/* Job Title (suggestions) */}
              <div>
                <label className="text-sm font-semibold text-white/85">Job Title</label>
                <p className="text-xs text-white/60 mt-0.5">
                  Example: Customer Care Executive, HR Executive, Telecaller
                </p>
                <input
                  className={inputBase + " mt-2"}
                  placeholder="Enter job title"
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-white/85">Job Type</label>
                  <select
                    className={selectBase + " mt-2"}
                    value={job.type}
                    onChange={(e) => setJob({ ...job, type: e.target.value })}
                  >
                    <option value="WFH">Work from Home (WFH)</option>
                    <option value="Office">Office / Onsite</option>
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-white/85">Salary Range</label>
                  <p className="text-xs text-white/60 mt-0.5">Monthly range (₹)</p>

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
                  <p className="text-xs text-white/60 mt-0.5">
                    City or Area (for WFH you can write Remote)
                  </p>

                  <div className="relative mt-2">
                    <MapPin className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                    <input
                      className="h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
                      placeholder="e.g. Noida / Remote"
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

              {/* ✅ Job Area + monthly inhand + bonus */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-white/85">Job Area</label>
                  <p className="text-xs text-white/60 mt-0.5">
                    Example: Sector 62, Nehru Place, Karol Bagh
                  </p>
                  <input
                    className={inputBase + " mt-2"}
                    placeholder="Enter job area"
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
                  <label className="text-sm font-semibold text-white/85">Monthly In-hand Salary (₹)</label>
                  <p className="text-xs text-white/60 mt-0.5">Optional</p>
                  <div className="relative mt-2">
                    <IndianRupee className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                    <input
                      className="h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
                      placeholder="e.g. 22000"
                      value={job.monthly_inhand_salary}
                      onChange={(e) =>
                        setJob({ ...job, monthly_inhand_salary: e.target.value.replace(/[^\d]/g, "") })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-white/85">Total Experience</label>
                  <p className="text-xs text-white/60 mt-0.5">Optional</p>
                  <input
                    className={inputBase + " mt-2"}
                    placeholder="e.g. 0-1 years / 2-5 years"
                    value={job.total_experience}
                    onChange={(e) => setJob({ ...job, total_experience: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-white/85">Bonus</label>
                  <p className="text-xs text-white/60 mt-0.5">Optional</p>
                  <select
                    className={selectBase + " mt-2"}
                    value={job.bonus}
                    onChange={(e) => setJob({ ...job, bonus: e.target.value as "Yes" | "No" })}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              {/* ✅ Skills chips (stored as array) */}
              <div>
                <label className="text-sm font-semibold text-white/85">Skills</label>
                <p className="text-xs text-white/60 mt-0.5">Add skills like Excel, Busy, Tally</p>

                <div className="mt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    className={inputBase}
                    placeholder="Type a skill and press Add"
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
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                {job.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm text-white/90"
                      >
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} className="opacity-80 hover:opacity-100">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="text-sm font-semibold text-white/85">Job Description</label>
                <p className="text-xs text-white/60 mt-0.5">
                  Add responsibilities, timings, incentives, skills, and interview process.
                </p>
                <textarea
                  className={textareaBase + " mt-2"}
                  placeholder="Write job details..."
                  value={job.desc}
                  onChange={(e) => setJob({ ...job, desc: e.target.value })}
                />
                <div className="mt-2 text-xs text-white/60">
                  Tip: Clear salary + location + shift timing increases applications.
                </div>
              </div>

              {/* ✅ More optional fields */}
              <div className="rounded-3xl bg-white/6 border border-white/10 p-5">
                <div className="font-extrabold">More Details (Optional)</div>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <input
                    className={inputBase}
                    placeholder="Age (e.g. 18-30)"
                    value={job.age}
                    onChange={(e) => setJob({ ...job, age: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Preferred Language (e.g. Hindi/English)"
                    value={job.preferred_language}
                    onChange={(e) => setJob({ ...job, preferred_language: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Assets (e.g. Bike, Laptop)"
                    value={job.assets}
                    onChange={(e) => setJob({ ...job, assets: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Preferred Industry"
                    value={job.preferred_industry}
                    onChange={(e) => setJob({ ...job, preferred_industry: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Degree & Specialisation"
                    value={job.degree_specialisation}
                    onChange={(e) => setJob({ ...job, degree_specialisation: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Certification"
                    value={job.certification}
                    onChange={(e) => setJob({ ...job, certification: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Job Timings"
                    value={job.job_timings}
                    onChange={(e) => setJob({ ...job, job_timings: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Interview Details"
                    value={job.interview_details}
                    onChange={(e) => setJob({ ...job, interview_details: e.target.value })}
                  />
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <input
                    className={inputBase}
                    placeholder="Contact Person Profile (e.g. HR)"
                    value={job.contact_person_profile}
                    onChange={(e) => setJob({ ...job, contact_person_profile: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Organization Size (e.g. 11-50)"
                    value={job.org_size}
                    onChange={(e) => setJob({ ...job, org_size: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="How soon to fill (e.g. Immediately)"
                    value={job.fill_urgency}
                    onChange={(e) => setJob({ ...job, fill_urgency: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Hiring Frequency (e.g. Monthly)"
                    value={job.hiring_frequency}
                    onChange={(e) => setJob({ ...job, hiring_frequency: e.target.value })}
                  />
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <input
                    className={inputBase}
                    placeholder="Company Name (auto from profile)"
                    value={job.company_name}
                    onChange={(e) => setJob({ ...job, company_name: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Contact Person Name (auto from profile)"
                    value={job.contact_person_name}
                    onChange={(e) => setJob({ ...job, contact_person_name: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Contact Phone (auto from profile)"
                    value={job.contact_phone}
                    onChange={(e) => setJob({ ...job, contact_phone: e.target.value })}
                  />
                  <input
                    className={inputBase}
                    placeholder="Contact Email (auto from profile)"
                    value={job.contact_email}
                    onChange={(e) => setJob({ ...job, contact_email: e.target.value })}
                  />
                </div>

                <textarea
                  className={textareaBase + " mt-4"}
                  placeholder="Job Address"
                  value={job.job_address}
                  onChange={(e) => setJob({ ...job, job_address: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={publishJob}
                  disabled={posting}
                  className={
                    "h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition w-full sm:w-auto px-7 " +
                    (posting ? "opacity-60 cursor-not-allowed" : "")
                  }
                >
                  {posting ? "Publishing..." : "Publish Job"}
                </button>

                <button
                  onClick={() => {
                    setJob(makeEmptyJob());
                    setSkillInput("");
                  }}
                  className="h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold w-full sm:w-auto px-7"
                >
                  Clear
                </button>
              </div>

              <div className="rounded-2xl bg-white/6 border border-white/10 p-4 text-sm text-white/75">
                Your job post will be visible to candidates after submission.
              </div>
            </div>
          </section>
        )}

        {/* APPLICANTS */}
        {tab === "applicants" && (
          <section className="rounded-3xl border border-white/10 bg-white/6 p-6 md:p-7 shadow-card">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                  <Users size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">
                    Applicants <span className="text-white/70">(Resume + Status)</span>
                  </h2>
                  <p className="text-white/70 text-sm mt-1">Search and update applicant status.</p>
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
                    onChange={(e) => setStatusFilter(e.target.value as "All" | ApplicantStatus)}
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
                <div className="rounded-3xl bg-white/6 border border-white/10 p-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold">No applicants found</div>
                      <div className="text-white/70 text-sm mt-1">
                        Try removing filters or publish a job to receive applications.
                      </div>
                    </div>
                  </div>
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
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
        )}
      </div>
    </main>
  );
}
