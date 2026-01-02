import { useMemo, useState } from "react";
import HeroNemesis from "../components/HeroNemesis";
import StatPills from "../components/StatPills";
import ServiceCards from "../components/ServiceCards";
import ChatWidgetMock from "../components/ChatWidgetMock";
import { Search, MapPin, Briefcase, ArrowRight, BadgeCheck, Building2, UserPlus } from "lucide-react";

const categories = [
  "IT Staffing",
  "HR",
  "Sales",
  "Customer Support",
  "Accounts",
  "Office Admin",
  "Banking",
  "Hospitality",
];

const topCompanies = [
  { name: "Nemesis Group", tag: "HR Services", city: "All India", verified: true },
  { name: "Prime Staffing Desk", tag: "Staffing", city: "Delhi NCR", verified: true },
  { name: "Tech Hiring Hub", tag: "IT Staffing", city: "Bangalore", verified: false },
];

export default function Home() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [exp, setExp] = useState("All");
  const [mode, setMode] = useState("All");

  const searchHint = useMemo(() => {
    const parts = [q && `"${q}"`, city && city, exp !== "All" && exp, mode !== "All" && mode].filter(Boolean);
    return parts.length ? parts.join(" • ") : "Job title, skills or company • City • Experience";
  }, [q, city, exp, mode]);

  return (
    <main className="relative bg-[#1F4F8F] home-navy">
      {/* HERO */}
      <HeroNemesis />

      {/* SEARCH BAR (Naukri-style) */}
    <div className="container-x -mt-14 relative z-20">
  <div className="rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/95 shadow-card p-5 md:p-6">
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      {/* ✅ better responsive grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Job */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Job title / skills"
            className="h-12 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
          />
        </div>

        {/* City */}
        <div className="relative">
          <MapPin className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="h-12 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] placeholder:text-[#061433]/55 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
          />
        </div>

        {/* Experience */}
        <div className="relative">
          <Briefcase className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
          <select
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            className="h-12 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
          >
            <option value="All">Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
        </div>

        {/* Mode */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="h-12 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25"
        >
          <option value="All">WFH / Office</option>
          <option value="WFH">WFH</option>
          <option value="Office">Office</option>
        </select>
      </div>

      {/* ✅ button same height + responsive width */}
      <a
        href="/jobs"
        className="h-12 px-7 rounded-2xl bg-white text-[#061433] font-extrabold hover:opacity-95 transition inline-flex items-center justify-center gap-2 w-full lg:w-auto"
        title={searchHint}
      >
        Search Jobs <ArrowRight size={18} />
      </a>
    </div>

    {/* Category Chips */}
    <div className="mt-4 flex flex-wrap gap-2">
      {categories.map((c) => (
        <a
          key={c}
          href="/jobs"
          className="px-4 py-2 rounded-full bg-[#4A79B8]/35 border border-[#8FB1DA]/30 text-sm text-white/90 hover:bg-[#4A79B8]/55 transition"
        >
          {c}
        </a>
      ))}
    </div>
  </div>
</div>


      {/* MAIN CONTENT */}
      <div className="container-x mt-8 relative z-10">
        <StatPills />

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Services */}
            <ServiceCards />

            {/* Trust Strip */}
            <section className="rounded-3xl border border-[#8FB1DA]/35 bg-[#1F4F8F]/90 shadow-card p-6 md:p-7">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white">
                    Trusted HR Partner for Hiring + Compliance
                  </h3>
                  <p className="text-[#EAF2FF] mt-1">
                    Verified employers • Structured hiring • Basic Email/WhatsApp updates.
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href="/candidate"
                    className="px-5 py-3 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
                  >
                    Create Candidate Profile
                  </a>
                  <a
                    href="/auth"
                    className="px-5 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/15 transition font-semibold"
                  >
                    Login / Signup
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            <ChatWidgetMock />

            {/* Top Companies (Follow) */}
            <section className="rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/90 shadow-card p-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Top Companies</h3>
                  <p className="text-[#EAF2FF] text-sm mt-1">Follow for updates & jobs.</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {topCompanies.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-3xl bg-[#1F4F8F]/85 border border-[#8FB1DA]/30 p-4 hover:bg-[#4A79B8]/60 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-[#4A79B8] grid place-items-center">
                          <Building2 size={18} className="text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-extrabold text-white">{c.name}</div>
                            {c.verified && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10 border border-white/12 text-white">
                                <BadgeCheck size={14} /> Verified
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-[#EAF2FF] mt-0.5">
                            {c.tag} • {c.city}
                          </div>
                        </div>
                      </div>

                      <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#061433] font-extrabold text-sm hover:opacity-95 transition">
                        <UserPlus size={16} /> Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* CTA SECTION – FULL NAVY */}
      <section className="container-x mt-16 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/95 shadow-card p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Post a Job in 60 Seconds
              </h3>
              <p className="text-[#EAF2FF] mt-2 max-w-xl">
                Employer / HR dashboard → Job post → Candidate resumes → Status update (Selected / Rejected).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/employer"
                className="px-6 py-3 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition text-center"
              >
                Employer Dashboard
              </a>
              <a
                href="/jobs"
                className="px-6 py-3 rounded-full bg-[#4A79B8]/60 border border-[#8FB1DA]/40 hover:bg-[#4A79B8]/85 transition font-semibold text-center text-white"
              >
                Browse Jobs
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
