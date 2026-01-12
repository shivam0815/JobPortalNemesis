// src/pages/Auth.tsx
// Google-only auth:
// POST /auth/google
// POST /auth/set-role (protected via auth:sanctum)

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { api } from "../lib/api";
import { setAuth } from "../lib/authStorage";
import GoogleButton from "../components/GoogleButton";

type Role = "candidate" | "employer";
type ApiError = { message?: string };

export default function Auth() {
  const nav = useNavigate();

  const [role, setRole] = useState<Role>("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goByRole(r?: string | null) {
    if (r === "employer") nav("/employer", { replace: true });
    else nav("/candidate", { replace: true });
  }

  function showError(e: unknown, fallback = "Request failed") {
    const ax = e as AxiosError<ApiError>;
    setError(ax.response?.data?.message || fallback);
  }

  // Google login -> backend
  // If role missing: use temp token -> set role -> replace token
  async function onGoogleToken(idToken: string) {
    setError(null);
    setLoading(true);

    try {
      // 1) Login with Google (send Google ID token / credential JWT)
      const { data } = await api.post("/auth/google", {
        google_token: idToken,
      });
      console.log("Google login response:", data);

      // Case A: role not set yet
      if (data?.needs_role) {
        const tempToken: string | undefined = data?.token;
        const tempUser = data?.user;

        if (!tempToken) {
          throw new Error("Token missing from /auth/google response");
        }

        // Store temp token/user (so Authorization header can be attached)
        setAuth(tempToken, tempUser);

        // 2) Set role (protected route) — explicitly pass Bearer token
        const roleResp = await api.post(
          "/auth/set-role",
          { role },
          { headers: { Authorization: `Bearer ${tempToken}` } }
        );

        const finalToken: string | undefined = roleResp.data?.token;
        const finalUser = roleResp.data?.user;
        const finalRole = roleResp.data?.role;

        if (!finalToken) {
          throw new Error("Token missing from /auth/set-role response");
        }

        // Replace temp auth with final auth
        setAuth(finalToken, finalUser);
        goByRole(finalRole || finalUser?.role);
        return;
      }

      // Case B: role already exists
      if (!data?.token) {
        throw new Error("Token missing from /auth/google response");
      }

      setAuth(data.token, data.user);
      goByRole(data.user?.role);
    } catch (e) {
      showError(e, "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-x py-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Continue with Google
            </h1>
            <p className="text-white/75 mt-1">Candidate • Employer / HR</p>
          </div>

          {loading && (
            <div className="text-sm text-white/75">Signing you in…</div>
          )}
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

        {/* INFO */}
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Briefcase size={16} />
            Select your role first, then continue with Google.
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* GOOGLE BUTTON */}
        <div className="mt-6 grid place-items-center">
          <GoogleButton onToken={onGoogleToken} />
        </div>

        {/* NOTE */}
        <p className="mt-4 text-center text-xs text-white/60">
          Note: Email/OTP signup is disabled. Google login is active.
        </p>
      </div>
    </main>
  );
}
