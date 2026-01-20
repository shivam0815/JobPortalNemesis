import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../../lib/api";
import { setAuth } from "../../lib/authStorage";

type ApiError = { message?: string };
type Role = "candidate" | "employer";



export default function EmailSetPassword() {
  const nav = useNavigate();

  const email = localStorage.getItem("jp_otp_email") || "";
  const otpToken = localStorage.getItem("jp_otp_token") || "";

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("candidate");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => email.trim() && otpToken && password.trim().length >= 8,
    [email, otpToken, password]
  );

  function goByRole(r?: string | null) {
    if (r === "employer") nav("/employer", { replace: true });
    else nav("/candidate", { replace: true });
  }

  function showError(e: unknown, fallback = "Request failed") {
    const ax = e as AxiosError<ApiError>;
    setError(ax.response?.data?.message || fallback);
  }

  async function submit() {
    if (!canSubmit) return;

    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post(
        "/auth/email/set-password",
        { email, password, role, name: name.trim() || undefined },
        { headers: { Authorization: `Bearer ${otpToken}` } }
      );

      if (!data?.token) throw new Error("token missing");

setAuth(data.token, data.user);

      // cleanup otp temp
localStorage.removeItem("jp_otp_token");
localStorage.removeItem("jp_otp_email");

const ret = localStorage.getItem("jp_return_to");
if (ret) {
  localStorage.removeItem("jp_return_to");
  nav(ret, { replace: true });
  return;
}
      goByRole(data.user?.role);
    } catch (e) {
      showError(e, "Register failed");
    } finally {
      setLoading(false);
    }
  }

  if (!email || !otpToken) {
    return (
      <main className="container-x py-10">
        <div className="mx-auto max-w-md rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight">Session expired</h1>
          <p className="text-white/70 mt-2 text-sm">
            Please start registration again.
          </p>
          <Link className="mt-4 inline-block text-white underline" to="/auth/register">
            Go to Register
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-x py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Set Password</h1>
        <p className="text-white/70 mt-1 text-sm">{email}</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <div>
            <label className="text-sm font-semibold text-white/85">Name (optional)</label>
            <input
              className="mt-2 h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {([
              ["candidate", "Candidate"],
              ["employer", "Employer / HR"],
            ] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setRole(k)}
                disabled={loading}
                className={
                  "h-11 rounded-2xl border text-sm font-semibold transition disabled:opacity-60 " +
                  (role === k
                    ? "bg-white text-[#061433] border-transparent"
                    : "bg-white/8 border-white/12 hover:bg-white/10")
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-semibold text-white/85">Password</label>
            <input
              type="password"
              className="mt-2 h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              disabled={loading}
            />
          </div>

          <button
            onClick={submit}
            disabled={loading || !canSubmit}
            className="h-11 w-full rounded-2xl bg-white text-[#061433] font-semibold disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-white/70">
          Already have account?{" "}
          <Link className="text-white underline" to="/auth/login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
