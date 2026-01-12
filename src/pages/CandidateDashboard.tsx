// src/pages/candidate/CandidateDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, Clock, XCircle } from "lucide-react";
import { api } from "../lib/api";
import type { User } from "../lib/authStorage";

type AppStatus = "applied" | "shortlisted" | "rejected" | "hired";

type ApplicationItem = {
  id: number | string;
  status: AppStatus;
  created_at?: string;

  job?: {
    id: number | string;
    title?: string;
    location?: string;
  };

  // fallback if backend later returns flat fields
  applied_job_title?: string | null;
};

type ProfileForm = {
  phone: string;
  city: string;
};

const input =
  "h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25 w-full";

const pill = (status: AppStatus) => {
  if (status === "applied")
    return {
      text: "Applied",
      cls: "bg-white/10 border-white/12 text-white/90",
      Icon: Clock,
    };
  if (status === "shortlisted")
    return {
      text: "Selected",
      cls: "bg-emerald-500/12 border-emerald-300/20 text-emerald-50",
      Icon: CheckCircle2,
    };
  if (status === "rejected")
    return {
      text: "Rejected",
      cls: "bg-rose-500/12 border-rose-300/20 text-rose-50",
      Icon: XCircle,
    };
  return {
    text: "Hired",
    cls: "bg-sky-500/12 border-sky-300/20 text-sky-50",
    Icon: CheckCircle2,
  };
};

export default function CandidateDashboard() {
  const nav = useNavigate();

  const [profile, setProfile] = useState<ProfileForm>({ phone: "", city: "" });
  const [resume, setResume] = useState<File | null>(null);

  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ✅ role guard + load profile + load applications
  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        const raw = localStorage.getItem("jp_user");
        if (!raw) {
          nav("/auth", { replace: true });
          return;
        }

        const user = JSON.parse(raw) as User;
        if (user?.role !== "candidate") {
          nav("/employer", { replace: true });
          return;
        }

        // profile
        try {
          const p = await api.get("/candidate/profile");
          if (!alive) return;
          setProfile({
            phone: p.data?.phone ?? "",
            city: p.data?.city ?? "",
          });
        } catch {
          // profile endpoint missing or not implemented -> keep empty
        } finally {
          if (alive) setLoadingProfile(false);
        }

        // applications (must)
        try {
          const res = await api.get("/candidate/applications");
          if (!alive) return;

          const data = res.data;
          const list = Array.isArray(data) ? data : (data?.data ?? []);
          setApps(Array.isArray(list) ? list : []);
        } catch (e) {
          console.log("CANDIDATE APPLICATIONS ERROR:", e);
          if (alive) setApps([]);
        } finally {
          if (alive) setLoadingApps(false);
        }
      } catch {
        if (alive) nav("/auth", { replace: true });
      }
    };

    init();
    return () => {
      alive = false;
    };
  }, [nav]);

  const saveProfile = async () => {
    setMsg(null);
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("phone", profile.phone);
      fd.append("city", profile.city);
      if (resume) fd.append("resume", resume);

      await api.post("/candidate/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("✅ Profile updated");
      setResume(null);
    } catch (e) {
      console.log("SAVE PROFILE ERROR:", e);
      setMsg("❌ Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const rows = useMemo(() => {
    return apps.map((a) => {
      const title = a.job?.title ?? a.applied_job_title ?? "—";
      const city = a.job?.location ?? "—";
      return { ...a, title, city };
    });
  }, [apps]);

  return (
    <main className="container-x py-10">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: PROFILE */}
        <section className="lg:col-span-1 rounded-3xl border border-white/12 bg-white/5 shadow-card p-6">
          <h2 className="text-xl font-extrabold">Candidate Profile</h2>
          <p className="text-white/70 text-sm mt-1">
            Resume upload + basic details
          </p>

          {msg && (
            <div className="mt-4 rounded-2xl bg-white/10 border border-white/12 p-3 text-sm">
              {msg}
            </div>
          )}

          <div className="mt-4 grid gap-3">
            <input
              className={input}
              placeholder="Mobile Number"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              disabled={loadingProfile}
            />
            <input
              className={input}
              placeholder="City"
              value={profile.city}
              onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
              disabled={loadingProfile}
            />

            <div className="rounded-2xl bg-white/8 border border-white/12 p-4 text-sm text-white/75">
              <div className="flex items-center gap-2 font-semibold text-white">
                <UploadCloud size={18} /> Resume Upload
              </div>
              <div className="text-xs text-white/70 mt-1">
                PDF/DOC/DOCX • max 5MB
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                className="mt-3 block w-full text-sm text-white/80 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-[#061433] file:font-semibold hover:file:opacity-95"
              />
              {resume && (
                <div className="mt-2 text-xs text-white/70">
                  Selected: <span className="text-white/90">{resume.name}</span>
                </div>
              )}
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="h-11 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

            <Link
              to="/jobs"
              className="h-11 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold grid place-items-center"
            >
              Browse Jobs
            </Link>
          </div>
        </section>

        {/* RIGHT: APPLICATIONS */}
        <section className="lg:col-span-2 rounded-3xl border border-white/12 bg-white/5 shadow-card p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">My Applications</h2>
              <p className="text-white/70 text-sm mt-1">
                Status is updated by employer.
              </p>
            </div>
            <div className="text-sm text-white/70">
              {loadingApps ? "Loading..." : `${rows.length} applications`}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {loadingApps ? (
              <div className="rounded-2xl border border-white/12 bg-white/5 p-6 text-white/75">
                Loading applications…
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-white/12 bg-white/5 p-6 text-white/75">
                No applications yet. <Link className="underline" to="/jobs">Browse Jobs</Link>
              </div>
            ) : (
              rows.map((a) => {
                const meta = pill(a.status);
                const Icon = meta.Icon;

                return (
                  <div
                    key={String(a.id)}
                    className="rounded-3xl bg-white/5 border border-white/12 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-bold truncate">{a.title}</div>
                      <div className="text-sm text-white/70">{a.city}</div>

                      {/* optional: open job */}
                      {a.job?.id && (
                        <Link
                          to={`/jobs/${a.job.id}`}
                          className="text-xs text-white/70 underline mt-1 inline-block"
                        >
                          View job
                        </Link>
                      )}
                    </div>

                    <span
                      className={
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm " +
                        meta.cls
                      }
                    >
                      <Icon size={16} /> {meta.text}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
