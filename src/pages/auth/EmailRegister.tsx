import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../../lib/api";

type ApiError = { message?: string };

export default function EmailRegister() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function showError(e: unknown, fallback = "Request failed") {
    const ax = e as AxiosError<ApiError>;
    setError(ax.response?.data?.message || fallback);
  }

  async function sendOtp() {
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/email/request-otp", { email });
      setSent(true);
      localStorage.setItem("jp_otp_email", email.trim().toLowerCase());
      nav("/auth/verify-otp", { replace: true });
    } catch (e) {
      showError(e, "OTP send failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-x py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Register</h1>
        <p className="text-white/70 mt-1 text-sm">Email → OTP → Set Password</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6">
          <label className="text-sm font-semibold text-white/85">Email</label>
          <input
            className="mt-2 h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <button
          onClick={sendOtp}
          disabled={loading || !email.trim()}
          className="mt-4 h-11 w-full rounded-2xl bg-white text-[#061433] font-semibold disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send OTP"}
        </button>

        {sent && (
          <p className="mt-3 text-sm text-white/70">
            OTP sent. Check inbox/spam.
          </p>
        )}

        <div className="mt-4 text-center text-sm text-white/70">
          Already have account?{" "}
          <Link className="text-white underline" to="/auth/login">
            Login
          </Link>
        </div>

        <div className="mt-2 text-center text-sm text-white/70">
          <Link className="text-white underline" to="/auth">
            Back to Google login
          </Link>
        </div>
      </div>
    </main>
  );
}
