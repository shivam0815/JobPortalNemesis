import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, UploadCloud, ArrowRight } from "lucide-react";
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

const statCard =
  "rounded-3xl bg-white/6 border border-white/12 p-5";
const ctaCard =
  "rounded-3xl bg-white/6 border border-white/12 p-5";

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

        // ✅ both are protected routes (Sanctum token required in api instance)
        const [pRes, aRes] = await Promise.all([
          api.get("/candidate/profile"),
          api.get("/candidate/applications"),
        ]);

        setProfile(pRes.data ?? null);

        const aData = aRes.data;
        const list = Array.isArray(aData) ? aData : (aData?.data ?? []);
        setApps(Array.isArray(list) ? list : []);
      } catch (e: any) {
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

  const { profilePercent, resumeStatus, applicationsCount } = useMemo(() => {
    const p = profile || {};

    // profile completeness (basic heuristic; adjust as you like)
    const checks = [
      !!(p.phone && String(p.phone).trim()),
      !!(p.city && String(p.city).trim()),
      !!(p.resume_path && String(p.resume_path).trim()),
    ];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);

    return {
      profilePercent: `${score}%`,
      resumeStatus: p.resume_path ? "Uploaded" : "Pending",
      applicationsCount: String(apps.length),
    };
  }, [profile, apps]);

  return (
    <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-white/70 mt-1">
            Apply jobs, track status, and get basic WhatsApp/Email alerts.
          </p>
        </div>

        <div className="flex gap-3">
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

      {msg && (
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
          {msg}
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className={statCard}>
          <div className="text-sm text-white/70">Profile Complete</div>
          <div className="text-3xl font-extrabold mt-1">
            {loading ? "…" : profilePercent}
          </div>
        </div>

        <div className={statCard}>
          <div className="text-sm text-white/70">Resume Uploaded</div>
          <div className="text-3xl font-extrabold mt-1">
            {loading ? "…" : resumeStatus}
          </div>
        </div>

        <div className={statCard}>
          <div className="text-sm text-white/70">Applications</div>
          <div className="text-3xl font-extrabold mt-1">
            {loading ? "…" : applicationsCount}
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className={ctaCard}>
          <div className="flex items-center gap-2 font-extrabold">
            <UploadCloud size={18} /> Resume Upload
          </div>
          <p className="text-sm text-white/75 mt-1">
            PDF/DOC upload karke 1-click apply possible.
          </p>

          <Link
            to="/candidate/profile"
            className="mt-4 inline-flex px-4 py-2 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 transition"
          >
            {profile?.resume_path ? "Update Resume" : "Upload Now"}
          </Link>
        </div>

        <div className={ctaCard}>
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
      </div>
    </div>
  );
}
