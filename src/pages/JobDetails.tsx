// src/pages/JobDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BadgeIndianRupee,
  Briefcase,
  Clock,
  UploadCloud,
  ShieldCheck,
} from "lucide-react";
import { api } from "../lib/api";

type Job = {
  id: number | string;
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
  dob: string; // YYYY-MM-DD
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

/* ─────────────────────────────────────────────
   ✅ PRO UI field styles (high contrast on blue)
────────────────────────────────────────────── */
const baseField =
  "w-full h-11 rounded-2xl px-4 text-[14px] " +
  "bg-white/12 border border-white/18 text-white placeholder-white/55 " +
  "shadow-[0_8px_22px_rgba(0,0,0,0.18)] " +
  "focus:outline-none focus:border-white/35 focus:bg-white/14 focus:ring-2 focus:ring-white/12 " +
  "transition";

const input = baseField;

const select =
  baseField +
  " appearance-none pr-10 " +
  " [&>option]:text-slate-900 [&>option]:bg-white";

const textarea =
  "w-full min-h-[110px] rounded-2xl px-4 py-3 text-[14px] " +
  "bg-white/12 border border-white/18 text-white placeholder-white/55 " +
  "shadow-[0_8px_22px_rgba(0,0,0,0.18)] " +
  "focus:outline-none focus:border-white/35 focus:bg-white/14 focus:ring-2 focus:ring-white/12 " +
  "transition resize-y";

const sectionTitle = "text-[11px] font-semibold tracking-[0.12em] text-white/75 uppercase";
const sectionWrap = "rounded-2xl border border-white/12 bg-white/6 p-4 sm:p-5";
const label = "text-xs text-white/70 mb-1";

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

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);

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

    return {
      title: j.title ?? "Untitled Job",
      type: j.job_type ?? "—",
      exp: j.total_experience ?? "—",
      salary: salaryLabel(j),
      location: j.location ?? "—",
      desc: j.description ?? j.desc ?? "",
    };
  }, [job]);

  const canSubmit =
    !!id &&
    !submitting &&
    !applied &&
    f.full_name.trim() &&
    f.phone.trim() &&
    f.email.trim() &&
    f.dob.trim() &&
    f.current_city.trim() &&
    f.state.trim() &&
    f.pincode.trim() &&
    f.current_address.trim() &&
    !!resumeFile &&
    f.declaration_accepted &&
    f.privacy_policy_accepted &&
    f.consent_contact;

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

      await api.post(`/jobs/${id}/apply`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplied(true);
      setFormMsg("✅ Application submitted successfully");
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

  return (
    <main className="container-x py-10">
      {/* outer shell */}
      <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft size={18} /> Back to Jobs
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs text-white/70">
            <ShieldCheck size={16} className="opacity-80" />
            Secure application • No spam
          </div>
        </div>

        {loading ? (
          <div className="mt-6 text-white/75">Loading…</div>
        ) : errMsg || !ui ? (
          <div className="mt-6 rounded-2xl border border-white/12 bg-white/5 p-6 text-white/80">
            {errMsg ?? "No job data"}
          </div>
        ) : (
          <div className="mt-5 flex flex-col lg:flex-row lg:items-start gap-6">
            {/* LEFT: JOB */}
            <div className="flex-1 min-w-0">
              {/* Title card */}
              <div className="rounded-3xl border border-white/12 bg-white/6 p-6 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.20)]">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{ui.title}</h1>

                <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/80">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/12 px-3 py-1.5">
                    <Briefcase size={16} /> {ui.type}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/12 px-3 py-1.5">
                    <BadgeIndianRupee size={16} /> {ui.salary}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/12 px-3 py-1.5">
                    <MapPin size={16} /> {ui.location}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/12 px-3 py-1.5">
                    <Clock size={16} /> {ui.exp}
                  </span>
                </div>
              </div>

              {/* Description + meta */}
              <div className="mt-5 rounded-3xl bg-white/5 border border-white/12 p-5 md:p-6">
                <div className="font-extrabold text-lg">Job Description</div>
                <p className="text-white/75 text-sm mt-2 leading-relaxed">
                  {ui.desc || "—"}
                </p>

                <div className="mt-5 grid md:grid-cols-2 gap-3 text-sm">
                  {[
                    ["Job Title", ui.title],
                    ["Job Type", ui.type],
                    ["Experience", ui.exp],
                    ["Salary", ui.salary],
                    ["Location", ui.location],
                    ["Status", "Open"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-2xl bg-white/6 border border-white/12 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                    >
                      <div className="text-white/65 text-[11px] tracking-wide">{k}</div>
                      <div className="font-semibold">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: APPLY */}
            <aside className="lg:w-[460px] w-full lg:sticky lg:top-6">
              <div className="rounded-3xl bg-white/6 border border-white/14 p-6 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-extrabold">Apply Now</div>
                    <p className="text-white/75 text-sm mt-1">
                      Fill details + upload resume. Track status in your dashboard.
                    </p>
                  </div>
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 border border-white/12">
                    <UploadCloud size={18} className="text-white/85" />
                  </div>
                </div>

                {formMsg && (
                  <div className="mt-4 rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-sm text-white/90">
                    {formMsg}
                  </div>
                )}

                <div className="mt-5 grid gap-4">
                  {/* PERSONAL */}
                  <div className={sectionWrap}>
                    <div className={sectionTitle}>Personal details</div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Full Name *</div>
                        <input
                          className={input}
                          placeholder="Enter full name"
                          value={f.full_name}
                          onChange={(e) => setF((p) => ({ ...p, full_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className={label}>Mobile Number *</div>
                        <input
                          className={input}
                          placeholder="Enter mobile number"
                          value={f.phone}
                          onChange={(e) => setF((p) => ({ ...p, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className={label}>Email ID *</div>
                      <input
                        className={input}
                        placeholder="Enter email"
                        value={f.email}
                        onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Date of Birth *</div>
                        <input
                          className={input}
                          type="date"
                          value={f.dob}
                          onChange={(e) => setF((p) => ({ ...p, dob: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className={label}>Gender (optional)</div>
                        <select
                          className={select}
                          value={f.gender}
                          onChange={(e) => setF((p) => ({ ...p, gender: e.target.value }))}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className={sectionWrap}>
                    <div className={sectionTitle}>Address</div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Current City *</div>
                        <input
                          className={input}
                          placeholder="City"
                          value={f.current_city}
                          onChange={(e) => setF((p) => ({ ...p, current_city: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className={label}>State *</div>
                        <input
                          className={input}
                          placeholder="State"
                          value={f.state}
                          onChange={(e) => setF((p) => ({ ...p, state: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Pincode *</div>
                        <input
                          className={input}
                          placeholder="Pincode"
                          value={f.pincode}
                          onChange={(e) => setF((p) => ({ ...p, pincode: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className={label}>Preferred Job Location (optional)</div>
                        <input
                          className={input}
                          placeholder="Preferred location"
                          value={f.preferred_job_location}
                          onChange={(e) =>
                            setF((p) => ({ ...p, preferred_job_location: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className={label}>Current Address *</div>
                      <input
                        className={input}
                        placeholder="House no, street, area"
                        value={f.current_address}
                        onChange={(e) => setF((p) => ({ ...p, current_address: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* JOB PREFS */}
                  <div className={sectionWrap}>
                    <div className={sectionTitle}>Job preferences</div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Department / Role (optional)</div>
                        <input
                          className={input}
                          placeholder="Eg: Customer Support"
                          value={f.department_role}
                          onChange={(e) => setF((p) => ({ ...p, department_role: e.target.value }))}
                        />
                      </div>

                      <div>
                        <div className={label}>Employment Type</div>
                        <select
                          className={select}
                          value={f.employment_type}
                          onChange={(e) =>
                            setF((p) => ({
                              ...p,
                              employment_type: e.target.value as ApplyForm["employment_type"],
                            }))
                          }
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Work from Home">Work from Home</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* EDUCATION */}
                  <div className={sectionWrap}>
                    <div className={sectionTitle}>Education</div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Highest Qualification</div>
                        <select
                          className={select}
                          value={f.highest_qualification}
                          onChange={(e) =>
                            setF((p) => ({
                              ...p,
                              highest_qualification:
                                e.target.value as ApplyForm["highest_qualification"],
                            }))
                          }
                        >
                          <option value="10th">10th</option>
                          <option value="12th">12th</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Post Graduate">Post Graduate</option>
                        </select>
                      </div>

                      <div>
                        <div className={label}>Course / Stream (optional)</div>
                        <input
                          className={input}
                          placeholder="Eg: B.Com, BA, B.Tech"
                          value={f.course_stream}
                          onChange={(e) => setF((p) => ({ ...p, course_stream: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Passing Year (optional)</div>
                        <input
                          className={input}
                          placeholder="Eg: 2024"
                          value={f.passing_year}
                          onChange={(e) => setF((p) => ({ ...p, passing_year: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className={label}>University / Board (optional)</div>
                        <input
                          className={input}
                          placeholder="University / Board"
                          value={f.university_board}
                          onChange={(e) =>
                            setF((p) => ({ ...p, university_board: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* EXPERIENCE */}
                  <div className={sectionWrap}>
                    <div className={sectionTitle}>Experience</div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Total Experience</div>
                        <select
                          className={select}
                          value={f.total_experience}
                          onChange={(e) =>
                            setF((p) => ({
                              ...p,
                              total_experience: e.target.value as ApplyForm["total_experience"],
                            }))
                          }
                        >
                          <option value="Fresher">Fresher</option>
                          <option value="0-1 Year">0–1 Year</option>
                          <option value="1-3 Years">1–3 Years</option>
                          <option value="3+ Years">3+ Years</option>
                        </select>
                      </div>

                      <div>
                        <div className={label}>Notice Period (optional)</div>
                        <select
                          className={select}
                          value={f.notice_period}
                          onChange={(e) =>
                            setF((p) => ({
                              ...p,
                              notice_period: e.target.value as ApplyForm["notice_period"],
                            }))
                          }
                        >
                          <option value="">Select</option>
                          <option value="Immediate">Immediate</option>
                          <option value="15 Days">15 Days</option>
                          <option value="30 Days">30 Days</option>
                          <option value="60 Days">60 Days</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Current Company (optional)</div>
                        <input
                          className={input}
                          placeholder="Company name"
                          value={f.current_company}
                          onChange={(e) =>
                            setF((p) => ({ ...p, current_company: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <div className={label}>Current Designation (optional)</div>
                        <input
                          className={input}
                          placeholder="Designation"
                          value={f.current_designation}
                          onChange={(e) =>
                            setF((p) => ({ ...p, current_designation: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>Current Salary (CTC) (optional)</div>
                        <input
                          className={input}
                          placeholder="Eg: 300000"
                          value={f.current_salary_ctc}
                          onChange={(e) =>
                            setF((p) => ({ ...p, current_salary_ctc: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <div className={label}>Expected Salary (optional)</div>
                        <input
                          className={input}
                          placeholder="Eg: 400000"
                          value={f.expected_salary}
                          onChange={(e) => setF((p) => ({ ...p, expected_salary: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SKILLS / LINKS */}
                  <div className={sectionWrap}>
                    <div className={sectionTitle}>Skills & links</div>

                    <div className="mt-3">
                      <div className={label}>Key Skills (comma separated) (optional)</div>
                      <input
                        className={input}
                        placeholder="Eg: Calling, CRM, Excel"
                        value={f.key_skills_text}
                        onChange={(e) => setF((p) => ({ ...p, key_skills_text: e.target.value }))}
                      />
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className={label}>LinkedIn URL (optional)</div>
                        <input
                          className={input}
                          placeholder="https://linkedin.com/in/..."
                          value={f.linkedin_url}
                          onChange={(e) => setF((p) => ({ ...p, linkedin_url: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className={label}>GitHub URL (optional)</div>
                        <input
                          className={input}
                          placeholder="https://github.com/..."
                          value={f.github_url}
                          onChange={(e) => setF((p) => ({ ...p, github_url: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className={label}>Portfolio URL (optional)</div>
                      <input
                        className={input}
                        placeholder="https://..."
                        value={f.portfolio_url}
                        onChange={(e) => setF((p) => ({ ...p, portfolio_url: e.target.value }))}
                      />
                    </div>

                    <div className="mt-3">
                      <div className={label}>Cover Letter (optional)</div>
                      <textarea
                        className={textarea}
                        placeholder="Write a short cover letter..."
                        value={f.cover_letter}
                        onChange={(e) => setF((p) => ({ ...p, cover_letter: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* RESUME */}
                  <div className="rounded-2xl border border-white/12 bg-white/6 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className={sectionTitle}>Resume upload</div>
                        <div className="text-xs text-white/70 mt-1">PDF/DOC/DOCX • max 5MB</div>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 flex items-center justify-center">
                        <UploadCloud size={18} className="text-white/85" />
                      </div>
                    </div>

                    <input
                      className="mt-3 block w-full text-sm text-white/85 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-[#061433] file:font-semibold hover:file:opacity-95"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    />

                    {resumeFile && (
                      <div className="mt-2 text-xs text-white/75">
                        Selected: <span className="text-white/95 font-medium">{resumeFile.name}</span>
                      </div>
                    )}
                  </div>

                  {/* CONSENT */}
                  <div className="rounded-2xl border border-white/12 bg-white/6 p-4 sm:p-5 space-y-2 text-sm">
                    <div className={sectionTitle}>Consent</div>

                    <label className="flex items-start gap-2">
                      <input
                        className="mt-1"
                        type="checkbox"
                        checked={f.declaration_accepted}
                        onChange={(e) => setF((p) => ({ ...p, declaration_accepted: e.target.checked }))}
                      />
                      <span className="text-white/90">I confirm the above information is true *</span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                        className="mt-1"
                        type="checkbox"
                        checked={f.privacy_policy_accepted}
                        onChange={(e) => setF((p) => ({ ...p, privacy_policy_accepted: e.target.checked }))}
                      />
                      <span className="text-white/90">I accept Privacy Policy *</span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                        className="mt-1"
                        type="checkbox"
                        checked={f.consent_contact}
                        onChange={(e) => setF((p) => ({ ...p, consent_contact: e.target.checked }))}
                      />
                      <span className="text-white/90">Consent to contact (Call/WhatsApp/Email) *</span>
                    </label>
                  </div>

                  <button
                    onClick={submitApplication}
                    disabled={!canSubmit}
                    className={
                      "h-11 rounded-full font-semibold transition w-full " +
                      (!canSubmit
                        ? "bg-white/10 border border-white/12 text-white/70 cursor-not-allowed"
                        : "bg-white text-[#061433] hover:opacity-95 shadow-[0_14px_40px_rgba(0,0,0,0.25)]")
                    }
                  >
                    {submitting ? "Submitting..." : applied ? "Applied" : "Submit Application"}
                  </button>

                  <div className="text-xs text-white/65">
                    Note: Notifications can be triggered after status update.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
