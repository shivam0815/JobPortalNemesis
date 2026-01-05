import { useState } from "react";
import { Phone, Mail, Lock, User, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

type Role = "candidate" | "employer";
type Mode = "login" | "signup";

export default function Auth() {
  const [role, setRole] = useState<Role>("candidate");
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<"form" | "otp">("form");

  return (
    <main className="container-x py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {mode === "login" ? "Login" : "Signup"}
            </h1>
            <p className="text-white/75 mt-1">
              Candidate • Employer / HR
            </p>
          </div>

          <div className="flex gap-2">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m as Mode);
                  setStep("form");
                }}
                className={
                  "px-4 py-2 rounded-full text-sm border transition " +
                  (mode === m
                    ? "bg-white text-[#061433] border-transparent"
                    : "bg-white/8 border-white/12 hover:bg-white/10")
                }
              >
                {m === "login" ? "Login" : "Signup"}
              </button>
            ))}
          </div>
        </div>

        {/* ROLE SELECT */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          {[
            ["candidate", "Candidate"],
            ["employer", "Employer / HR"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setRole(k as Role)}
              className={
                "h-11 rounded-2xl border text-sm font-semibold transition " +
                (role === k
                  ? "bg-white text-[#061433] border-transparent"
                  : "bg-white/8 border-white/12 hover:bg-white/10")
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* FORM */}
        {step === "form" && (
          <div className="mt-6 grid gap-3">

            {/* NAME – candidate signup only */}
            {mode === "signup" && role === "candidate" && (
              <Input icon={<User />} placeholder="Full Name" />
            )}

            {/* MOBILE */}
            <Input icon={<Phone />} placeholder="Mobile Number" />

            {/* EMAIL */}
            <Input icon={<Mail />} placeholder="Email ID" />

            {/* EXPERIENCE – candidate signup */}
            {mode === "signup" && role === "candidate" && (
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 text-white/70" size={18} />
                <select className="h-12 w-full rounded-2xl bg-white/8 border border-white/12 pl-11 pr-4 text-sm outline-none">
                  <option>Fresher</option>
                  <option>Experienced</option>
                </select>
              </div>
            )}

            {/* PASSWORD (login OR signup) */}
            <Input icon={<Lock />} placeholder="Password" type="password" />

            {/* ACTION */}
            <button
              onClick={() => mode === "signup" && setStep("otp")}
              className="h-12 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
            >
              {mode === "login" ? "Login" : "Register"}
            </button>

            {/* GOOGLE LOGIN */}
            <button className="h-12 rounded-full bg-white/10 border border-white/20 font-semibold hover:bg-white/15 transition">
              Continue with Google
            </button>

            {/* FORGOT */}
            {mode === "login" && (
              <Link
                to="/forgot-password"
                className="text-sm text-white/75 hover:text-white underline text-center"
              >
                Forgot Password?
              </Link>
            )}
          </div>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div className="mt-6 grid gap-3">
            <p className="text-white/80 text-sm">
              OTP sent to your email. Please verify.
            </p>

            <Input icon={<Lock />} placeholder="Enter OTP" />

            <button className="h-12 rounded-full bg-white text-[#061433] font-extrabold">
              Verify & Create Account
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

/* Small reusable input */
function Input({
  icon,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-3.5 text-white/70">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl bg-white/8 border border-white/12 pl-11 pr-4 text-sm outline-none focus:border-white/25"
      />
    </div>
  );
}
