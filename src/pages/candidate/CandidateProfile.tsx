// src/pages/candidate/CandidateProfile.tsx
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import type { User } from "../../lib/authStorage";

type ProfileForm = {
  phone: string;
  city: string;
};

export default function CandidateProfile() {
  const nav = useNavigate();

  const [form, setForm] = useState<ProfileForm>({ phone: "", city: "" });
  const [resume, setResume] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // ✅ ROLE GUARD + FETCH PROFILE (single useEffect only)
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

        // ✅ Only candidate can access
        if (user?.role !== "candidate") {
          nav("/employer", { replace: true });
          return;
        }

        // ✅ Fetch profile from backend
        const res = await api.get("/candidate/profile");

        if (!alive) return;

        setForm({
          phone: res.data?.phone ?? "",
          city: res.data?.city ?? "",
        });
      } catch (err) {
        console.error("Profile load failed", err);
        if (alive) setMsg("❌ Failed to load profile");
      } finally {
        if (alive) setInitLoading(false);
      }
    };

    init();

    return () => {
      alive = false;
    };
  }, [nav]);

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

      setMsg("✅ Profile updated successfully");
      setResume(null);
    } catch (err) {
      console.error("Save profile failed", err);
      setMsg("❌ Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  if (initLoading) {
    return (
      <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <div className="text-white/80 text-sm">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
        Profile
      </h1>
      <p className="text-white/70 mt-1">Candidate details + Resume upload.</p>

      {msg && (
        <div className="mt-4 rounded-2xl bg-white/10 border border-white/12 p-3 text-sm">
          {msg}
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="grid gap-3">
          <input
            className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <input
            className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          />
        </div>

        <div className="rounded-3xl bg-white/6 border border-white/12 p-5">
          <div className="flex items-center gap-2 font-extrabold">
            <UploadCloud size={18} /> Resume Upload
          </div>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="mt-4 text-sm"
          />

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
  );
}
