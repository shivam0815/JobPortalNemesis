// src/pages/JobDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BadgeIndianRupee,
  Briefcase,
  Clock,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Building2,
  Bell,
} from "lucide-react";
import { api } from "../lib/api";

type Job = {
  id: number | string;
  company_name?: string | null;
  title?: string;
  location?: string;
  job_type?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  total_experience?: string | null;
  description?: string;
  desc?: string;
};

type ApplyForm = {
  full_name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;

  current_city: string;
  state: string;
  pincode: string;
  current_address: string;

  department_role: string;
  preferred_job_location: string;
  employment_type: "Full-time" | "Part-time" | "Internship" | "Work from Home";

  highest_qualification: "10th" | "12th" | "Diploma" | "Graduate" | "Post Graduate";
  course_stream: string;
  passing_year: string;
  university_board: string;

  total_experience: "Fresher" | "0-1 Year" | "1-3 Years" | "3+ Years";
  current_company: string;
  current_designation: string;
  current_salary_ctc: string;
  expected_salary: string;
  notice_period: "Immediate" | "15 Days" | "30 Days" | "60 Days" | "";

  key_skills_text: string;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;

  declaration_accepted: boolean;
  privacy_policy_accepted: boolean;
  consent_contact: boolean;

  cover_letter: string;
};

const card = "rounded-3xl border border-white/12 bg-white/6 shadow-card";
const soft = "rounded-3xl border border-white/10 bg-white/5";

const input =
  "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const select =
  "h-11 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";
const textarea =
  "min-h-[110px] w-full rounded-2xl bg-white border border-white/20 px-4 py-3 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25 resize-y";

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
    return a || b || "—";
  }
  return "—";
};

const parseSkills = (text: string) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

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

export default function JobDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // ✅ follow state
  const [myFollows, setMyFollows] = useState<string[]>([]);
  const [followBusy, setFollowBusy] = useState(false);

  const [f, setF] = useState<ApplyForm>({
    full_name: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",

    current_city: "",
    state: "",
    pincode: "",
    current_address: "",

    department_role: "",
    preferred_job_location: "",
    employment_type: "Full-time",

    highest_qualification: "Graduate",
    course_stream: "",
    passing_year: "",
    university_board: "",

    total_experience: "Fresher",
    current_company: "",
    current_designation: "",
    current_salary_ctc: "",
    expected_salary: "",
    notice_period: "",

    key_skills_text: "",
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",

    declaration_accepted: false,
    privacy_policy_accepted: false,
    consent_contact: false,

    cover_letter: "",
  });

  const isLoggedIn = () => {
    try {
      // adapt if you use different storage
      return !!localStorage.getItem("jp_token") || !!localStorage.getItem("token") || !!localStorage.getItem("auth_token");
    } catch {
      return false;
    }
  };

  // ✅ Load my follows once (if auth)
  useEffect(() => {
    (async () => {
      if (!isLoggedIn()) return;
      try {
        const res = await api.get("/company/follows");
        setMyFollows(Array.isArray(res.data) ? res.data : []);
      } catch {
        setMyFollows([]);
      }
    })();
  }, []);

  const toggleFollow = async (companyName: string) => {
    const name = (companyName || "").trim();
    if (!name) return;

    if (!isLoggedIn()) {
      nav("/auth");
      return;
    }

    const followed = myFollows.includes(name);
    setFollowBusy(true);

    // optimistic
    setMyFollows((p) => (followed ? p.filter((x) => x !== name) : [...p, name]));

    try {
      if (followed) {
        await api.post("/company/unfollow", { company_name: name });
      } else {
        await api.post("/company/follow", { company_name: name });
      }
    } catch {
      // revert
      setMyFollows((p) => (followed ? [...p, name] : p.filter((x) => x !== name)));
    } finally {
      setFollowBusy(false);
    }
  };

  // ✅ Load job
  useEffect(() => {
    (async () => {
      if (!id) return;

      try {
        setErrMsg(null);
        setLoading(true);

        const res = await api.get(`/jobs/${id}`);
        setJob(res.data ?? null);

        const loc = res.data?.location ?? "";
        if (loc) setF((p) => ({ ...p, preferred_job_location: loc }));
      } catch (e) {
        console.log("JOB DETAILS API ERROR:", e);
        setErrMsg("Job not found / failed to load");
        setJob(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const ui = useMemo(() => {
    const j = job;
    if (!j) return null;
    const company = (j.company_name || "").trim() || "Confidential Employer";
    return {
      title: j.title ?? "Untitled Job",
      company,
      type: j.job_type ?? "—",
      exp: j.total_experience ?? "—",
      salary: salaryLabel(j),
      location: j.location ?? "—",
      desc: j.description ?? j.desc ?? "",
    };
  }, [job]);

  const completion = useMemo(() => {
    const checks = [
      !!f.full_name.trim(),
      !!f.phone.trim(),
      !!f.email.trim(),
      !!f.dob.trim(),
      !!f.current_city.trim(),
      !!f.state.trim(),
      !!f.pincode.trim(),
      !!f.current_address.trim(),
      !!resumeFile,
      !!f.declaration_accepted,
      !!f.privacy_policy_accepted,
      !!f.consent_contact,
    ];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return { score };
  }, [f, resumeFile]);

  const canSubmit = !!id && !submitting && !applied && completion.score === 100;

  const submitApplication = async () => {
    if (!id) return;
    setFormMsg(null);

    if (!resumeFile) return setFormMsg("Resume required (PDF/DOC/DOCX).");
    if (!f.declaration_accepted || !f.privacy_policy_accepted || !f.consent_contact) {
      return setFormMsg("Please accept all consent checkboxes.");
    }

    try {
      setSubmitting(true);

      const fd = new FormData();

      fd.append("full_name", f.full_name);
      fd.append("phone", f.phone);
      fd.append("email", f.email);
      fd.append("dob", f.dob);
      if (f.gender) fd.append("gender", f.gender);

      fd.append("current_city", f.current_city);
      fd.append("state", f.state);
      fd.append("pincode", f.pincode);
      fd.append("current_address", f.current_address);

      if (f.department_role) fd.append("department_role", f.department_role);
      if (f.preferred_job_location) fd.append("preferred_job_location", f.preferred_job_location);
      fd.append("employment_type", f.employment_type);

      fd.append("highest_qualification", f.highest_qualification);
      if (f.course_stream) fd.append("course_stream", f.course_stream);
      if (f.passing_year) fd.append("passing_year", f.passing_year);
      if (f.university_board) fd.append("university_board", f.university_board);

      fd.append("total_experience", f.total_experience);
      if (f.current_company) fd.append("current_company", f.current_company);
      if (f.current_designation) fd.append("current_designation", f.current_designation);
      if (f.current_salary_ctc.trim()) fd.append("current_salary_ctc", f.current_salary_ctc.trim());
      if (f.expected_salary.trim()) fd.append("expected_salary", f.expected_salary.trim());
      if (f.notice_period) fd.append("notice_period", f.notice_period);

      const skills = parseSkills(f.key_skills_text);
      skills.forEach((s, i) => fd.append(`key_skills[${i}]`, s));

      if (f.portfolio_url) fd.append("portfolio_url", f.portfolio_url);
      if (f.linkedin_url) fd.append("linkedin_url", f.linkedin_url);
      if (f.github_url) fd.append("github_url", f.github_url);

      fd.append("declaration_accepted", f.declaration_accepted ? "1" : "0");
      fd.append("privacy_policy_accepted", f.privacy_policy_accepted ? "1" : "0");
      fd.append("consent_contact", f.consent_contact ? "1" : "0");

      if (f.cover_letter.trim()) fd.append("cover_letter", f.cover_letter.trim());

      fd.append("resume", resumeFile);

      await api.post(`/jobs/${id}/apply`, fd, { headers: { "Content-Type": "multipart/form-data" } });

      setApplied(true);
      setFormMsg("Application submitted successfully");
    } catch (e: any) {
      console.log("APPLY ERROR:", e);
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        e?.message ||
        "Failed to apply";
      setFormMsg(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container-x py-10">
        <div className={card + " p-6 md:p-8"}>
          <div className="text-white/75">Loading…</div>
        </div>
      </main>
    );
  }

  if (errMsg || !ui) {
    return (
      <main className="container-x py-10">
        <div className={card + " p-6 md:p-8"}>
          <Link to="/jobs" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft size={18} /> Back to Jobs
          </Link>
          <div className="mt-6 rounded-2xl border border-white/12 bg-white/5 p-6 text-white/80">
            {errMsg ?? "No job data"}
          </div>
        </div>
      </main>
    );
  }

  const companyIsReal = ui.company !== "Confidential Employer";
  const isFollowing = companyIsReal && myFollows.includes(ui.company);

  return (
    <main className="container-x py-10">
      <div className="grid gap-6">
        <section className={card + " p-6 md:p-8"}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <button onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                  <ArrowLeft size={18} /> Back
                </button>

                <div className="hidden md:flex items-center gap-2 text-xs text-white/70">
                  <ShieldCheck size={16} className="opacity-80" />
                  Secure application • No spam
                </div>
              </div>

              <h1 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight">{ui.title}</h1>

              <p className="mt-1 text-white/85 font-semibold">{ui.company}</p>

              <p className="text-white/70 mt-1 text-sm md:text-base">
                Fill details once, apply fast. Track status in Candidate Dashboard.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Chip tone="neutral">
                  <Building2 size={14} /> {ui.company}
                </Chip>
                <Chip tone="neutral">
                  <Briefcase size={14} /> {ui.type}
                </Chip>
                <Chip tone="neutral">
                  <BadgeIndianRupee size={14} /> {ui.salary}
                </Chip>
                <Chip tone="neutral">
                  <MapPin size={14} /> {ui.location}
                </Chip>
                <Chip tone="neutral">
                  <Clock size={14} /> {ui.exp}
                </Chip>

                <Chip tone={completion.score === 100 ? "good" : "warn"}>
                  {completion.score === 100 ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {completion.score}% form complete
                </Chip>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {companyIsReal ? (
                <button
                  onClick={() => toggleFollow(ui.company)}
                  disabled={followBusy}
                  className={
                    "px-5 py-3 rounded-full font-extrabold transition inline-flex items-center justify-center gap-2 " +
                    (isFollowing
                      ? "bg-white/10 border border-white/12 text-white hover:bg-white/12"
                      : "bg-white text-[#061433] hover:opacity-95") +
                    (followBusy ? " opacity-70 cursor-not-allowed" : "")
                  }
                  title={isFollowing ? "You will get alerts when this company posts jobs" : "Follow to get job alerts"}
                >
                  <Bell size={18} />
                  {followBusy ? "..." : isFollowing ? "Following" : "Follow"}
                </button>
              ) : null}

              <Link
                to="/candidate"
                className="px-5 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold inline-flex items-center justify-center gap-2"
              >
                My Dashboard <ArrowRight size={18} />
              </Link>

              <button
                onClick={submitApplication}
                disabled={!canSubmit}
                className={
                  "px-5 py-3 rounded-full font-extrabold transition inline-flex items-center justify-center gap-2 " +
                  (!canSubmit
                    ? "bg-white/10 border border-white/12 text-white/70 cursor-not-allowed"
                    : "bg-white text-[#061433] hover:opacity-95")
                }
              >
                {submitting ? "Submitting..." : applied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>

          {formMsg ? (
            <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/90">
              <span className="inline-flex items-center gap-2">
                {applied ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {formMsg}
              </span>
            </div>
          ) : null}
        </section>

        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-6">
          <section className={card + " p-6"}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Job Details</div>
                <div className="text-sm text-white/65 mt-1">Read carefully before applying.</div>
              </div>
              <Chip tone="neutral">
                <FileText size={14} /> Open
              </Chip>
            </div>

            <div className="mt-5 grid md:grid-cols-2 gap-3">
              {[
                ["Company", ui.company],
                ["Job Type", ui.type],
                ["Experience", ui.exp],
                ["Salary", ui.salary],
                ["Location", ui.location],
              ].map(([k, v]) => (
                <div key={k} className={soft + " px-4 py-3"}>
                  <div className="text-white/65 text-[11px] tracking-wide">{k}</div>
                  <div className="font-semibold">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl bg-white/5 border border-white/12 p-5">
              <div className="font-extrabold">Job Description</div>
              <p className="text-white/75 text-sm mt-2 leading-relaxed">{ui.desc || "—"}</p>
            </div>

            <div className="mt-5 rounded-3xl bg-white/5 border border-white/12 p-5 text-sm text-white/75">
              Tip: Profile + Resume complete = higher shortlist chances.
            </div>
          </section>

          <aside className="lg:sticky lg:top-6">
            <section className={card + " p-6"}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold">Apply Form</div>
                  <div className="text-sm text-white/65 mt-1">Required fields are marked *</div>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                  <UploadCloud size={18} className="text-white/85" />
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <div className={soft + " p-5"}>
                  <div className="text-[11px] font-extrabold tracking-[0.18em] text-white/75 uppercase">Personal</div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <input
                      className={input}
                      placeholder="Full Name *"
                      value={f.full_name}
                      onChange={(e) => setF((p) => ({ ...p, full_name: e.target.value }))}
                    />
                    <input
                      className={input}
                      placeholder="Mobile Number *"
                      value={f.phone}
                      onChange={(e) => setF((p) => ({ ...p, phone: e.target.value.replace(/[^\d+]/g, "") }))}
                    />
                  </div>

                  <div className="mt-3">
                    <input
                      className={input}
                      placeholder="Email ID *"
                      value={f.email}
                      onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <input className={input} type="date" value={f.dob} onChange={(e) => setF((p) => ({ ...p, dob: e.target.value }))} />
                    <select className={input} value={f.gender} onChange={(e) => setF((p) => ({ ...p, gender: e.target.value }))}>
                      <option value="">Gender (optional)</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className={soft + " p-5"}>
                  <div className="text-[11px] font-extrabold tracking-[0.18em] text-white/75 uppercase">Address</div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <input className={input} placeholder="Current City *" value={f.current_city} onChange={(e) => setF((p) => ({ ...p, current_city: e.target.value }))} />
                    <input className={input} placeholder="State *" value={f.state} onChange={(e) => setF((p) => ({ ...p, state: e.target.value }))} />
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <input className={input} placeholder="Pincode *" value={f.pincode} onChange={(e) => setF((p) => ({ ...p, pincode: e.target.value.replace(/[^\d]/g, "") }))} />
                    <input className={input} placeholder="Preferred Job Location (optional)" value={f.preferred_job_location} onChange={(e) => setF((p) => ({ ...p, preferred_job_location: e.target.value }))} />
                  </div>

                  <div className="mt-3">
                    <input className={input} placeholder="Current Address *" value={f.current_address} onChange={(e) => setF((p) => ({ ...p, current_address: e.target.value }))} />
                  </div>
                </div>

                <div className={soft + " p-5"}>
                  <div className="text-[11px] font-extrabold tracking-[0.18em] text-white/75 uppercase">Preferences</div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <input className={input} placeholder="Department / Role (optional)" value={f.department_role} onChange={(e) => setF((p) => ({ ...p, department_role: e.target.value }))} />

                    <div className="relative">
                      <select
                        className={select}
                        value={f.employment_type}
                        onChange={(e) => setF((p) => ({ ...p, employment_type: e.target.value as ApplyForm["employment_type"] }))}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Work from Home">Work from Home</option>
                      </select>
                      <Briefcase className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                    </div>
                  </div>
                </div>

                <div className={soft + " p-5"}>
                  <div className="text-[11px] font-extrabold tracking-[0.18em] text-white/75 uppercase">Skills</div>

                  <div className="mt-3">
                    <input className={input} placeholder="Key Skills (comma separated) (optional)" value={f.key_skills_text} onChange={(e) => setF((p) => ({ ...p, key_skills_text: e.target.value }))} />
                  </div>

                  <div className="mt-3">
                    <textarea className={textarea} placeholder="Cover Letter (optional)" value={f.cover_letter} onChange={(e) => setF((p) => ({ ...p, cover_letter: e.target.value }))} />
                  </div>
                </div>

                <div className={soft + " p-5"}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-extrabold tracking-[0.18em] text-white/75 uppercase">Resume *</div>
                      <div className="text-xs text-white/70 mt-1">PDF/DOC/DOCX • max 5MB</div>
                    </div>
                    <Chip tone={resumeFile ? "good" : "warn"}>
                      {resumeFile ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                      {resumeFile ? "Selected" : "Required"}
                    </Chip>
                  </div>

                  <input
                    className="mt-3 block w-full text-sm text-white/85 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-[#061433] file:font-semibold hover:file:opacity-95"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  />

                  {resumeFile ? (
                    <div className="mt-2 text-xs text-white/75">
                      Selected: <span className="text-white/95 font-medium">{resumeFile.name}</span>
                    </div>
                  ) : null}
                </div>

                <div className={soft + " p-5 space-y-2 text-sm"}>
                  <div className="text-[11px] font-extrabold tracking-[0.18em] text-white/75 uppercase">Consent *</div>

                  <label className="flex items-start gap-2">
                    <input className="mt-1" type="checkbox" checked={f.declaration_accepted} onChange={(e) => setF((p) => ({ ...p, declaration_accepted: e.target.checked }))} />
                    <span className="text-white/90">I confirm the above information is true</span>
                  </label>

                  <label className="flex items-start gap-2">
                    <input className="mt-1" type="checkbox" checked={f.privacy_policy_accepted} onChange={(e) => setF((p) => ({ ...p, privacy_policy_accepted: e.target.checked }))} />
                    <span className="text-white/90">I accept Privacy Policy</span>
                  </label>

                  <label className="flex items-start gap-2">
                    <input className="mt-1" type="checkbox" checked={f.consent_contact} onChange={(e) => setF((p) => ({ ...p, consent_contact: e.target.checked }))} />
                    <span className="text-white/90">Consent to contact (Call/WhatsApp/Email)</span>
                  </label>
                </div>

                <button
                  onClick={submitApplication}
                  disabled={!canSubmit}
                  className={
                    "h-11 rounded-full font-extrabold transition w-full " +
                    (!canSubmit ? "bg-white/10 border border-white/12 text-white/70 cursor-not-allowed" : "bg-white text-[#061433] hover:opacity-95")
                  }
                >
                  {submitting ? "Submitting..." : applied ? "Applied" : "Submit Application"}
                </button>

                <div className="text-xs text-white/65">
                  Note: Skills will be saved as: {parseSkills(f.key_skills_text).slice(0, 5).join(", ") || "—"}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
