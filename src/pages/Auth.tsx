import { useState } from "react";
import { Phone, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

type Tab = "candidate" | "employer" | "admin";

export default function Auth() {
  const [tab, setTab] = useState<Tab>("candidate");
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <main className="container-x py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Login / Signup</h1>
            <p className="text-white/75 mt-1">Candidate • Employer/HR • Admin</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode("login")}
              className={
                "px-4 py-2 rounded-full text-sm border transition " +
                (mode === "login" ? "bg-white text-[#061433] border-transparent" : "bg-white/8 border-white/12 hover:bg-white/10")
              }
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={
                "px-4 py-2 rounded-full text-sm border transition " +
                (mode === "signup" ? "bg-white text-[#061433] border-transparent" : "bg-white/8 border-white/12 hover:bg-white/10")
              }
            >
              Signup
            </button>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-2">
          {[
            ["candidate", "Candidate"],
            ["employer", "Employer / HR"],
            ["admin", "Admin"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k as Tab)}
              className={
                "h-11 rounded-2xl border text-sm font-semibold transition " +
                (tab === k ? "bg-white text-[#061433] border-transparent" : "bg-white/8 border-white/12 hover:bg-white/10")
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3">
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 text-white/70" size={18} />
            <input
              className="h-12 w-full rounded-2xl bg-white/8 border border-white/12 pl-11 pr-4 text-sm outline-none focus:border-white/25"
              placeholder="Mobile Number"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-white/70" size={18} />
            <input
              className="h-12 w-full rounded-2xl bg-white/8 border border-white/12 pl-11 pr-4 text-sm outline-none focus:border-white/25"
              placeholder="Email"
            />
          </div>

          {/* Only show password for Admin/Employer (optional), candidate can be OTP */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-white/70" size={18} />
            <input
              className="h-12 w-full rounded-2xl bg-white/8 border border-white/12 pl-11 pr-4 text-sm outline-none focus:border-white/25"
              placeholder={tab === "candidate" ? "OTP (Optional UI)" : "Password (UI)"}
            />
          </div>

          <button className="h-12 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition">
            {mode === "login" ? "Continue" : "Create Account"}
          </button>

          <div className="rounded-3xl bg-white/5 border border-white/12 p-4 text-sm text-white/75">
            After login:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Candidate: profile + resume upload + apply + status</li>
              <li>Employer/HR: company profile + post jobs + view resumes + update status</li>
              <li>Admin: approve/reject jobs + manage users + service pages + basic notifications</li>
            </ul>
          </div>

          <div className="text-sm text-white/70">
            Quick links:{" "}
            <Link to="/candidate" className="underline hover:text-white">Candidate</Link>{" "}
            •{" "}
            <Link to="/employer" className="underline hover:text-white">Employer</Link>{" "}
            •{" "}
            <Link to="/admin" className="underline hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
