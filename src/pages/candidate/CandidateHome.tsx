// src/pages/candidate/CandidateHome.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  Bell,
  Sparkles,
  FileText,
  BadgeCheck,
  MapPin,
  Phone,
} from "lucide-react";
import { api } from "../../lib/api";

type CandidateProfile = {
  phone?: string;
  city?: string;
  resume_path?: string | null;
};

type ApiApplication = {
  id: number | string;
  status?: "applied" | "shortlisted" | "rejected" | "hired" | string;
};

const card =
  "rounded-3xl border border-white/12 bg-white/6 shadow-card";
const soft =
  "rounded-3xl border border-white/10 bg-white/5";

const Chip = ({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn";
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

const Stat = ({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: any;
  hint?: string;
}) => (
  <div className={card + " p-5"}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-xs font-extrabold tracking-[0.22em] text-white/55">
          {label}
        </div>
        <div className="mt-2 text-3xl font-extrabold">{value}</div>
        {hint ? <div className="mt-1 text-sm text-white/65">{hint}</div> : null}
      </div>
      <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
        <Icon size={18} />
      </div>
    </div>
  </div>
);

const StepRow = ({
  done,
  title,
  desc,
  action,
  Icon,
}: {
  done: boolean;
  title: string;
  desc: string;
  action: React.ReactNode;
  Icon: any;
}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/6 p-5">
    <div className="flex items-start gap-3 min-w-0">
      <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/12 grid place-items-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="font-extrabold">{title}</div>
          {done ? (
            <Chip tone="good">
              <BadgeCheck size={14} /> Done
            </Chip>
          ) : (
            <Chip tone="warn">
              <Sparkles size={14} /> Pending
            </Chip>
          )}
        </div>
        <div className="text-sm text-white/70 mt-1">{desc}</div>
      </div>
    </div>

    <div className="shrink-0">{action}</div>
  </div>
);

export default function CandidateHome() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [apps, setApps] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setMsg(null);
        setLoading(true);

        const [pRes, aRes] = await Promise.all([
          api.get("/candidate/profile"),
          api.get("/candidate/applications"),
        ]);

        setProfile(pRes.data ?? null);

        const aData = aRes.data;
        const list = Array.isArray(aData) ? aData : aData?.data ?? [];
        setApps(Array.isArray(list) ? list : []);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log("CANDIDATE HOME ERROR:", e);
        setProfile(null);
        setApps([]);
        setMsg(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const {
    profilePercent,
    resumeUploaded,
    applicationsCount,
    cityOk,
    phoneOk,
  } = useMemo(() => {
    const p = profile || {};
    const phoneOk = !!(p.phone && String(p.phone).trim());
    const cityOk = !!(p.city && String(p.city).trim());
    const resumeOk = !!(p.resume_path && String(p.resume_path).trim());

    const checks = [phoneOk, cityOk, resumeOk];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);

    return {
      profilePercent: loading ? "…" : `${score}%`,
      resumeUploaded: resumeOk,
      applicationsCount: loading ? "…" : String(apps.length),
      phoneOk,
      cityOk,
    };
  }, [profile, apps, loading]);

  return (
    <div className="grid gap-5">
      {/* HERO (WorkIndia-like) */}
      <div className="rounded-3xl border border-white/12 bg-white/6 shadow-card p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm">
              <Bell size={16} />
              Candidate Dashboard
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Get hired faster with a complete profile
            </h1>
            <p className="text-white/70 mt-1 text-sm md:text-base">
              Step-based flow like WorkIndia: Profile → Resume → Apply → Track
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Chip tone={resumeUploaded ? "good" : "warn"}>
                <FileText size={14} /> Resume: {loading ? "…" : resumeUploaded ? "Uploaded" : "Pending"}
              </Chip>
              <Chip tone={phoneOk ? "good" : "warn"}>
                <Phone size={14} /> Phone: {loading ? "…" : phoneOk ? "Added" : "Missing"}
              </Chip>
              <Chip tone={cityOk ? "good" : "warn"}>
                <MapPin size={14} /> City: {loading ? "…" : cityOk ? "Added" : "Missing"}
              </Chip>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/jobs"
              className="px-5 py-3 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 transition"
            >
              Browse Jobs <ArrowRight size={18} className="inline -mt-0.5 ml-1" />
            </Link>
            <Link
              to="/candidate/profile"
              className="px-5 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold"
            >
              Update Profile
            </Link>
          </div>
        </div>

        {msg ? (
          <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
            {msg}
          </div>
        ) : null}
      </div>

      {/* STATS ROW */}
      <div className="grid md:grid-cols-3 gap-4">
        <Stat
          label="PROFILE COMPLETE"
          value={profilePercent}
          icon={Sparkles}
          hint="Higher score → more calls"
        />
        <Stat
          label="RESUME"
          value={loading ? "…" : resumeUploaded ? "Uploaded" : "Pending"}
          icon={UploadCloud}
          hint="PDF/DOC recommended"
        />
        <Stat
          label="APPLICATIONS"
          value={applicationsCount}
          icon={CheckCircle2}
          hint="Track status instantly"
        />
      </div>

      {/* NEXT STEPS (WorkIndia-style checklist) */}
      <div className={card + " p-6 md:p-7"}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg md:text-xl font-extrabold">Next Steps</div>
            <div className="text-sm text-white/65 mt-1">
              Complete these to apply faster and get shortlisted more.
            </div>
          </div>
          <Chip tone={profilePercent === "100%" ? "good" : "warn"}>
            <Sparkles size={14} /> {profilePercent}
          </Chip>
        </div>

        <div className="mt-5 grid gap-3">
          <StepRow
            done={phoneOk && cityOk}
            title="Complete Profile"
            desc="Add phone & city so employers can contact you."
            Icon={BadgeCheck}
            action={
              <Link
                to="/candidate/profile"
                className="inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold"
              >
                Update
              </Link>
            }
          />

          <StepRow
            done={resumeUploaded}
            title="Upload Resume"
            desc="Resume upload enables faster shortlisting."
            Icon={UploadCloud}
            action={
              <Link
                to="/candidate/profile"
                className="inline-flex px-4 py-2 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 transition"
              >
                {resumeUploaded ? "Update Resume" : "Upload Now"}
              </Link>
            }
          />

          <StepRow
            done={apps.length > 0}
            title="Apply to Jobs"
            desc="Apply daily to improve chances (recommended 5–10)."
            Icon={ArrowRight}
            action={
              <Link
                to="/jobs"
                className="inline-flex px-4 py-2 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 transition"
              >
                Browse Jobs
              </Link>
            }
          />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={soft + " p-5"}>
          <div className="flex items-center gap-2 font-extrabold">
            <CheckCircle2 size={18} /> Application Tracking
          </div>
          <p className="text-sm text-white/75 mt-1">
            Selected / Rejected / In Review – sab yahi dikhega.
          </p>

          <Link
            to="/candidate/applications"
            className="mt-4 inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold"
          >
            View Applications
          </Link>
        </div>

        <div className={soft + " p-5"}>
          <div className="flex items-center gap-2 font-extrabold">
            <UploadCloud size={18} /> Resume / Profile Improvement
          </div>
          <p className="text-sm text-white/75 mt-1">
            Resume + profile completion increases shortlisting chances.
          </p>

          <Link
            to="/candidate/profile"
            className="mt-4 inline-flex px-4 py-2 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 transition"
          >
            Improve Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
