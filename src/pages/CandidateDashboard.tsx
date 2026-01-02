import { Link } from "react-router-dom";
import { UploadCloud, CheckCircle2 } from "lucide-react";

const applied = [
  { title: "HR Executive", city: "Delhi", status: "Applied" },
  { title: "Customer Care Associate", city: "Noida", status: "Selected" },
  { title: "Banking Sales Officer", city: "Mumbai", status: "Rejected" },
];

export default function CandidateDashboard() {
  return (
    <main className="container-x py-10">
      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 rounded-3xl border border-white/12 bg-white/5 shadow-card p-6">
          <h2 className="text-xl font-extrabold">Candidate Profile</h2>
          <p className="text-white/70 text-sm mt-1">Signup/Login (Mobile + Email) • Resume upload</p>

          <div className="mt-4 grid gap-3">
            <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Full Name" />
            <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Mobile Number" />
            <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Email" />
            <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="City" />

            <div className="rounded-2xl bg-white/8 border border-white/12 p-4 text-sm text-white/75">
              <div className="flex items-center gap-2 font-semibold text-white">
                <UploadCloud size={18} /> Resume Upload (UI)
              </div>
              <div className="text-xs text-white/70 mt-1">PDF/DOC • drag-drop / choose file</div>
            </div>

            <button className="h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition">
              Save Profile
            </button>

            <Link
              to="/jobs"
              className="h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold grid place-items-center"
            >
              Browse Jobs
            </Link>
          </div>
        </section>

        <section className="lg:col-span-2 rounded-3xl border border-white/12 bg-white/5 shadow-card p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">My Applications</h2>
              <p className="text-white/70 text-sm mt-1">Check application status here.</p>
            </div>
            <div className="text-sm text-white/70">{applied.length} applications</div>
          </div>

          <div className="mt-4 space-y-3">
            {applied.map((a) => (
              <div key={a.title} className="rounded-3xl bg-white/5 border border-white/12 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{a.title}</div>
                  <div className="text-sm text-white/70">{a.city}</div>
                </div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/12 text-sm">
                  <CheckCircle2 size={16} /> {a.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
