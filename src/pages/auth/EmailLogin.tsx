import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../../lib/api";
import { setAuth } from "../../lib/authStorage";

type ApiError = { message?: string };
type Role = "candidate" | "employer" | "admin" | null;



export default function EmailLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => email.trim() && password.trim(), [email, password]);

  function goByRole(r: Role) {
    if (r === "employer") nav("/employer", { replace: true });
    else nav("/candidate", { replace: true });
  }

  function showError(e: unknown, fallback = "Request failed") {
    const ax = e as AxiosError<ApiError>;
    setError(ax.response?.data?.message || fallback);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (!data?.token) throw new Error("Token missing");

      setAuth(data.token, data.user);
const ret = localStorage.getItem("jp_return_to");
if (ret) {
  localStorage.removeItem("jp_return_to");
  nav(ret, { replace: true });
  return;
}
      goByRole(data.user?.role);
    } catch (err) {
      showError(err, "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-x py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Login</h1>
        <p className="text-white/70 mt-1 text-sm">Email + Password</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <label className="text-sm font-semibold text-white/85">Email</label>
            <input
              className="mt-2 h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/85">Password</label>
            <input
              type="password"
              className="mt-2 h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading || !canSubmit}
            className="h-11 w-full rounded-2xl bg-white text-[#061433] font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-white/70">
          New user?{" "}
          <Link className="text-white underline" to="/auth/register">
            Register with OTP
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
