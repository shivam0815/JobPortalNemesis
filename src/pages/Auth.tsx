// src/pages/Auth.tsx
import { useMemo, useState } from "react";
import { Phone, Mail, Lock, User, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { api } from "../lib/api";
import { setAuth } from "../lib/authStorage";
import GoogleButton from "../components/GoogleButton";

type Role = "candidate" | "employer";
type Mode = "login" | "signup";

type ApiError = { message?: string };

export default function Auth() {
  const nav = useNavigate();

  const [role, setRole] = useState<Role>("candidate");
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<"form" | "otp">("form");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    experience: "Fresher",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShowName = mode === "signup" && role === "candidate";
  const canShowExperience = mode === "signup" && role === "candidate";

  const title = useMemo(() => (mode === "login" ? "Login" : "Signup"), [mode]);

  function goByRole(r?: string | null) {
    if (r === "employer") nav("/employer", { replace: true });
    else nav("/candidate", { replace: true });
  }

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function showError(e: unknown, fallback = "Request failed") {
    const ax = e as AxiosError<ApiError>;
    setError(ax.response?.data?.message || fallback);
  }

  async function onLogin() {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Expect: { token, user }
      setAuth(data.token, data.user);
      goByRole(data.user?.role);
    } catch (e) {
      showError(e, "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function onRegisterSendOtp() {
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", {
        role,
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        experience: role === "candidate" ? form.experience : undefined,
      });

      setStep("otp");
    } catch (e) {
      showError(e, "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyOtp() {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });

      // Expect: { token, user }
      setAuth(data.token, data.user);
      goByRole(data.user?.role);
    } catch (e) {
      showError(e, "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  // Google login -> backend -> if needs_role then set role immediately using selected role
  async function onGoogleToken(idToken: string) {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/google", { google_token: idToken });
      // data: { token, user, needs_role }
      setAuth(data.token, data.user);

      if (data.needs_role) {
        // set role based on selected tab
        const setRoleResp = await api.post("/auth/set-role", { role });
        // backend returns { user }
        setAuth(localStorage.getItem("jp_token") || "", setRoleResp.data.user);
        goByRole(role);
        return;
      }

      goByRole(data.user?.role);
    } catch (e) {
      showError(e, "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-x py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-white/75 mt-1">Candidate • Employer / HR</p>
          </div>

          <div className="flex gap-2">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setStep("form");
                  setError(null);
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
          {([
            ["candidate", "Candidate"],
            ["employer", "Employer / HR"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setRole(k)}
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

        {/* ERROR */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* FORM */}
        {step === "form" && (
          <div className="mt-6 grid gap-3">
            {/* NAME – candidate signup only */}
            {canShowName && (
              <Input
                icon={<User size={18} />}
                placeholder="Full Name"
                value={form.name}
                onChange={(v) => setField("name", v)}
              />
            )}

            {/* MOBILE */}
            <Input
              icon={<Phone size={18} />}
              placeholder="Mobile Number"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
            />

            {/* EMAIL */}
            <Input
              icon={<Mail size={18} />}
              placeholder="Email ID"
              value={form.email}
              onChange={(v) => setField("email", v)}
            />

            {/* EXPERIENCE – candidate signup */}
            {canShowExperience && (
              <div className="relative">
                <Briefcase
                  className="absolute left-4 top-3.5 text-white/70"
                  size={18}
                />
                <select
                  value={form.experience}
                  onChange={(e) => setField("experience", e.target.value)}
                  className="h-12 w-full rounded-2xl bg-white/8 border border-white/12 pl-11 pr-4 text-sm outline-none focus:border-white/25"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            )}

            {/* PASSWORD */}
            <Input
              icon={<Lock size={18} />}
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(v) => setField("password", v)}
            />

            {/* ACTION */}
            <button
              disabled={loading}
              onClick={() => {
                if (mode === "login") onLogin();
                else onRegisterSendOtp();
              }}
              className="h-12 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </button>

            {/* GOOGLE LOGIN */}
            <div className="grid place-items-center">
              <GoogleButton onToken={onGoogleToken} />
            </div>

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

            <Input
              icon={<Lock size={18} />}
              placeholder="Enter OTP"
              value={form.otp}
              onChange={(v) => setField("otp", v)}
            />

            <button
              disabled={loading}
              onClick={onVerifyOtp}
              className="h-12 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              disabled={loading}
              onClick={() => setStep("form")}
              className="h-12 rounded-full bg-white/10 border border-white/20 font-semibold hover:bg-white/15 transition disabled:opacity-60"
            >
              Back
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
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-3.5 text-white/70">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl bg-white/8 border border-white/12 pl-11 pr-4 text-sm outline-none focus:border-white/25"
      />
    </div>
  );
}
