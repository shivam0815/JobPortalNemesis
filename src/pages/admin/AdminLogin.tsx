import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";
import { adminAuth } from "../../lib/adminAuth";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await adminApi.login(email.trim(), password);
      adminAuth.setToken(res.token);
      nav("/admin/dashboard", { replace: true });
    } catch (ex: any) {
      setErr(ex?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6"
      >
        <div className="text-2xl font-extrabold">Admin Login</div>
        <div className="mt-1 text-sm text-white/60">Use your allowed .env admin email + password.</div>

        <div className="mt-5 space-y-3">
          <div>
            <label className="text-xs font-bold text-white/60">Email</label>
            <input
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nemisis.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white/60">Password</label>
            <input
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          {err ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm">{err}</div> : null}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-white text-black py-3 font-extrabold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
