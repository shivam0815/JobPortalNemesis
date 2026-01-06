import { useEffect, useMemo, useState } from "react";
import HeroNemesis from "../components/HeroNemesis";
import StatPills from "../components/StatPills";
import ServiceCards from "../components/ServiceCards";
import ChatWidgetMock from "../components/ChatWidgetMock";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  BadgeCheck,
  Building2,
} from "lucide-react";
import TopCompaniesStrip from "../components/TopCompaniesStrip";
import CustomerCareHiringStrip from "../components/CustomerCareHiringStrip";
import BackofficeDeliveryWarehouseStrip from "../components/BackofficeDeliveryWarehouseStrip";

/* ---------------- DATA ---------------- */

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

/* Floating community positions (desktop only) */
const COMMUNITY_POSITIONS = [
  "top-[140px] right-6",
  "top-[420px] right-6",
  "bottom-32 right-6",
  "bottom-32 left-6",
];

/* ---------------- PAGE ---------------- */

export default function Home() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [exp, setExp] = useState("All");
  const [mode, setMode] = useState("All");

  /* community floating position */
  const [communityPos, setCommunityPos] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCommunityPos((p) => (p + 1) % COMMUNITY_POSITIONS.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const searchHint = useMemo(() => {
    const parts = [
      q && `"${q}"`,
      city && city,
      exp !== "All" && exp,
      mode !== "All" && mode,
    ].filter(Boolean);
    return parts.length
      ? parts.join(" • ")
      : "Job title, skills or company • City • Experience";
  }, [q, city, exp, mode]);

  return (
    <main className="relative bg-[#1F4F8F] home-navy overflow-x-hidden">
      {/* HERO */}
      <HeroNemesis />

      {/* SEARCH */}
      <div className="container-x relative z-20 -mt-10 sm:-mt-12 md:-mt-14">
        <div className="rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/95 shadow-card p-4 sm:p-5 md:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Job title / skills"
                  className="h-12 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] outline-none"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="h-12 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] outline-none"
                />
              </div>

              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 text-[#061433]/55" size={18} />
                <select
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  className="h-12 w-full rounded-2xl bg-white border border-white/20 pl-11 pr-4 text-sm text-[#061433] outline-none"
                >
                  <option value="All">Experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="h-12 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] outline-none"
              >
                <option value="All">WFH / Office</option>
                <option value="WFH">WFH</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <a
              href="/jobs"
              title={searchHint}
              className="h-12 w-full lg:w-auto px-7 rounded-2xl bg-white text-[#061433] font-extrabold inline-flex items-center justify-center gap-2"
            >
              Search Jobs <ArrowRight size={18} />
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c}
                href="/jobs"
                className="px-4 py-2 rounded-full bg-[#4A79B8]/35 border border-[#8FB1DA]/30 text-sm text-white/90"
              >
                {c}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container-x mt-8 relative z-10">
        <StatPills />
        <TopCompaniesStrip />
<CustomerCareHiringStrip />
<BackofficeDeliveryWarehouseStrip />
        <div className="mt-8 md:mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ServiceCards />

            {/* TRUST STRIP */}
            <section className="rounded-3xl border border-[#8FB1DA]/35 bg-[#1F4F8F]/90 shadow-card p-6">
              <h3 className="text-2xl font-extrabold text-white">
                Trusted HR Partner for Hiring & Compliance
              </h3>
              <p className="text-[#EAF2FF] mt-1">
                Verified employers • Structured hiring • Email/WhatsApp updates
              </p>
            </section>
          </div>

          {/* RIGHT COLUMN (static content only) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Animated Top Companies */}
            <section className="rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/90 shadow-card p-5">
              <h3 className="text-xl font-extrabold text-white">Top Companies</h3>
              <p className="text-[#EAF2FF] text-sm mt-1">Actively hiring</p>

              <div className="relative mt-6 h-[140px] overflow-hidden">
                {topCompanies.map((c, i) => (
                  <div
                    key={c.name}
                    className="absolute inset-0 company-shuffle"
                    style={{ animationDelay: `${i * 3}s` }}
                  >
                    <div className="rounded-3xl bg-[#1F4F8F]/85 border border-[#8FB1DA]/30 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-[#4A79B8] grid place-items-center">
                            <Building2 size={18} className="text-white" />
                          </div>
                          <div>
                            <div className="font-extrabold text-white">{c.name}</div>
                            <div className="text-sm text-[#EAF2FF]">
                              {c.tag} • {c.city}
                            </div>
                          </div>
                        </div>

                        {c.verified && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/12 text-white">
                            <BadgeCheck size={14} /> Verified
                          </span>
                        )}
                      </div>

                      <button className="mt-4 w-full px-4 py-2 rounded-full bg-white text-[#061433] font-extrabold">
                        Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* FLOATING COMMUNITY CARD (DESKTOP ONLY) */}
      <div
        className={`
          hidden lg:block fixed z-40 w-[340px]
          transition-all duration-700 ease-in-out
          ${COMMUNITY_POSITIONS[communityPos]}
        `}
      >
        <ChatWidgetMock />
      </div>

      {/* CTA */}
      <section className="container-x mt-14 pb-20">
        <div className="rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/95 shadow-card p-8">
          <h3 className="text-3xl font-extrabold text-white">
            Post a Job in 60 Seconds
          </h3>
          <p className="text-[#EAF2FF] mt-2">
            Employer dashboard → Job post → Resume review → Status update
          </p>
        </div>
      </section>
    </main>
  );
}
