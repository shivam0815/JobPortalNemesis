import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../../lib/api";

type ApiError = { message?: string };

export default function EmailVerifyOtp() {
  const nav = useNavigate();

  const savedEmail = localStorage.getItem("jp_otp_email") || "";
  const [email, setEmail] = useState(savedEmail);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => email.trim() && otp.trim().length === 6,
    [email, otp]
  );

  function showError(e: unknown, fallback = "Request failed") {
    const ax = e as AxiosError<ApiError>;
    setError(ax.response?.data?.message || fallback);
  }

  async function verify() {
    if (!canSubmit) return;

    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/email/verify-otp", {
        email,
        otp,
      });

      if (!data?.otp_token) throw new Error("otp_token missing");

      localStorage.setItem("jp_otp_email", email.trim().toLowerCase());
      localStorage.setItem("jp_otp_token", data.otp_token);

      nav("/auth/set-password", { replace: true });
    } catch (e) {
      showError(e, "OTP verify failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-x py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Verify OTP</h1>
        <p className="text-white/70 mt-1 text-sm">Enter the 6-digit OTP</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <div>
            <label className="text-sm font-semibold text-white/85">Email</label>
            <input
              className="mt-2 h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/85">OTP</label>
            <input
              className="mt-2 h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433]"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              disabled={loading}
            />
          </div>

          <button
            onClick={verify}
            disabled={loading || !canSubmit}
            className="h-11 w-full rounded-2xl bg-white text-[#061433] font-semibold disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-white/70">
          Didn’t get OTP?{" "}
          <Link className="text-white underline" to="/auth/register">
            Send again
          </Link>
        </div>
      </div>
    </main>
  );
}
