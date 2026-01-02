import { Link } from "react-router-dom";
import { CheckCircle2, UploadCloud, ArrowRight } from "lucide-react";

export default function CandidateHome() {
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

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {[
          ["Profile Complete", "80%"],
          ["Resume Uploaded", "Pending"],
          ["Applications", "3"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-3xl bg-white/6 border border-white/12 p-5">
            <div className="text-sm text-white/70">{k}</div>
            <div className="text-3xl font-extrabold mt-1">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white/6 border border-white/12 p-5">
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
            Upload Now
          </Link>
        </div>

        <div className="rounded-3xl bg-white/6 border border-white/12 p-5">
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
