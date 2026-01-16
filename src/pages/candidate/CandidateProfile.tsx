// src/pages/candidate/CandidateProfile.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UploadCloud,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { api } from "../../lib/api";
import type { User } from "../../lib/authStorage";

type ProfileForm = {
  phone: string;
  city: string;
};

const card = "rounded-3xl border border-white/12 bg-white/6 shadow-card";
const inputBase =
  "h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25";

const Chip = ({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn";
  children: React.ReactNode;
}) => {
  const cls =
    tone === "good"
      ? "bg-emerald-500/15 border-emerald-300/25 text-emerald-50"
      : tone === "warn"
      ? "bg-amber-500/15 border-amber-300/25 text-amber-50"
      : "bg-white/10 border-white/15 text-white";
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-extrabold ${cls}`}
    >
      {children}
    </span>
  );
};

export default function CandidateProfile() {
  const nav = useNavigate();

  const [form, setForm] = useState<ProfileForm>({ phone: "", city: "" });
  const [resume, setResume] = useState<File | null>(null);

  const [existingResume, setExistingResume] = useState<string | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [msgTone, setMsgTone] = useState<"good" | "warn" | "neutral">("neutral");

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // ✅ ROLE GUARD + FETCH PROFILE
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

        const res = await api.get("/candidate/profile");
        if (!alive) return;

        setForm({
          phone: res.data?.phone ?? "",
          city: res.data?.city ?? "",
        });

        setExistingResume(res.data?.resume_path ?? null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Profile load failed", err);
        if (alive) {
          setMsg("Failed to load profile");
          setMsgTone("warn");
        }
      } finally {
        if (alive) setInitLoading(false);
      }
    };

    init();
    return () => {
      alive = false;
    };
  }, [nav]);

  const checks = useMemo(() => {
    const phoneOk = !!form.phone.trim();
    const cityOk = !!form.city.trim();
    const resumeOk = !!existingResume || !!resume;
    const score = Math.round(
      ((phoneOk ? 1 : 0) + (cityOk ? 1 : 0) + (resumeOk ? 1 : 0)) / 3 * 100
    );
    return { phoneOk, cityOk, resumeOk, score };
  }, [form.phone, form.city, existingResume, resume]);

  // ✅ SAVE PROFILE (FormData + file upload)
  async function saveProfile() {
    setMsg(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("phone", form.phone);
      fd.append("city", form.city);
      if (resume) fd.append("resume", resume);

      await api.post("/candidate/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("Profile updated successfully");
      setMsgTone("good");

      // refresh resume state (best-effort)
      if (resume) setExistingResume("uploaded");
      setResume(null);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Save profile failed", err);
      setMsg(err?.response?.data?.message || "Failed to save profile");
      setMsgTone("warn");
    } finally {
      setLoading(false);
    }
  }

  if (initLoading) {
    return (
      <div className={card + " p-6 md:p-8"}>
        <div className="text-white/80 text-sm">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {/* HERO */}
      <div className={card + " p-6 md:p-8"}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm">
              <FileText size={16} />
              Candidate Profile
            </div>

            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Complete profile = higher shortlisting
            </h1>

            <p className="text-white/70 mt-1 text-sm md:text-base">
              WorkIndia-style profile: phone + city + resume.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip tone={checks.score === 100 ? "good" : "warn"}>
                {checks.score === 100 ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                {checks.score}% complete
              </Chip>

              <Chip tone={checks.phoneOk ? "good" : "warn"}>
                <Phone size={14} /> Phone: {checks.phoneOk ? "Added" : "Missing"}
              </Chip>

              <Chip tone={checks.cityOk ? "good" : "warn"}>
                <MapPin size={14} /> City: {checks.cityOk ? "Added" : "Missing"}
              </Chip>

              <Chip tone={checks.resumeOk ? "good" : "warn"}>
                <UploadCloud size={14} /> Resume: {checks.resumeOk ? "Ready" : "Pending"}
              </Chip>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/candidate"
              className="px-5 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition font-semibold inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>

            <button
              disabled={loading}
              onClick={saveProfile}
              className="px-5 py-3 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {msg ? (
          <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/90">
            <span className="inline-flex items-center gap-2">
              {msgTone === "good" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {msg}
            </span>
          </div>
        ) : null}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-5">
        {/* LEFT: BASIC DETAILS */}
        <div className={card + " p-6"}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold">Basic Details</div>
              <div className="text-sm text-white/65 mt-1">
                Employers use this to contact you.
              </div>
            </div>
            <Chip tone={checks.phoneOk && checks.cityOk ? "good" : "warn"}>
              {checks.phoneOk && checks.cityOk ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              Required
            </Chip>
          </div>

          <div className="mt-5 grid gap-3">
            <div>
              <div className="text-sm font-semibold text-white/85">Mobile Number</div>
              <input
                className={inputBase + " mt-2"}
                placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value.replace(/[^\d+]/g, "") }))
                }
              />
            </div>

            <div>
              <div className="text-sm font-semibold text-white/85">City</div>
              <input
                className={inputBase + " mt-2"}
                placeholder="e.g. Noida"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              />
            </div>

            <div className="mt-2 text-xs text-white/65">
              Tip: Correct phone + city increases employer call rate.
            </div>
          </div>
        </div>

        {/* RIGHT: RESUME */}
        <div className={card + " p-6"}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold">Resume</div>
              <div className="text-sm text-white/65 mt-1">
                PDF/DOC/DOCX supported.
              </div>
            </div>

            <Chip tone={checks.resumeOk ? "good" : "warn"}>
              <UploadCloud size={14} />
              {checks.resumeOk ? "Ready" : "Pending"}
            </Chip>
          </div>

          <div className="mt-5 rounded-3xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                <UploadCloud size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold">Upload / Update Resume</div>
                <div className="text-sm text-white/70 mt-1">
                  Resume helps recruiters shortlist faster.
                </div>
              </div>
            </div>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="mt-4 text-sm"
            />

            <div className="mt-3 text-xs text-white/65">
              {existingResume
                ? "Resume already present. Upload to replace."
                : "No resume uploaded yet."}
            </div>

            <button
              disabled={loading}
              onClick={saveProfile}
              className="mt-4 w-full h-11 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
