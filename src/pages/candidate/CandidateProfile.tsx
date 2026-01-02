import { UploadCloud } from "lucide-react";

export default function CandidateProfile() {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Profile</h1>
      <p className="text-white/70 mt-1">Candidate details + Resume upload (UI).</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="grid gap-3">
          <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Full Name" />
          <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Mobile Number" />
          <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Email" />
          <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="City" />
        </div>

        <div className="rounded-3xl bg-white/6 border border-white/12 p-5">
          <div className="flex items-center gap-2 font-extrabold">
            <UploadCloud size={18} /> Resume Upload
          </div>
          <p className="text-sm text-white/75 mt-1">
            PDF/DOC allowed. Upload once and apply quickly.
          </p>

          <div className="mt-4 rounded-2xl bg-white/8 border border-white/12 p-4 text-sm text-white/80">
            Drag & drop resume here (UI)
          </div>

          <button className="mt-4 w-full h-11 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 transition">
            Save Profile
          </button>

          <div className="text-xs text-white/65 mt-3">
            Note: Notifications basic (Email/WhatsApp) status update ke baad.
          </div>
        </div>
      </div>
    </div>
  );
}
