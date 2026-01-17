import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

import HeroNemesis from "../components/HeroNemesis";
import StatPills from "../components/StatPills";
import ServiceCards from "../components/ServiceCards";
import ChatWidgetMock from "../components/ChatWidgetMock";
import { Search, MapPin, Briefcase, ArrowRight, BadgeCheck, Building2 } from "lucide-react";
import TopCompaniesStrip from "../components/TopCompaniesStrip";
import CustomerCareHiringStrip from "../components/CustomerCareHiringStrip";
import BackofficeDeliveryWarehouseStrip from "../components/BackofficeDeliveryWarehouseStrip";

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

type ActiveCompany = {
  company_name: string;
  jobs_count: number;
};

export default function Home() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [exp, setExp] = useState("All");
  const [mode, setMode] = useState("All");

  const [activeCompanies, setActiveCompanies] = useState<ActiveCompany[]>([]);
  const [myFollows, setMyFollows] = useState<string[]>([]);
  const [followBusy, setFollowBusy] = useState<Record<string, boolean>>({});

  const searchHint = useMemo(() => {
    const parts = [
      q && `"${q}"`,
      city && city,
      exp !== "All" && exp,
      mode !== "All" && mode,
    ].filter(Boolean);
    return parts.length ? parts.join(" • ") : "Job title, skills or company • City • Experience";
  }, [q, city, exp, mode]);

  const onSearch = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("city", city.trim());
    if (exp !== "All") params.set("exp", exp);
    if (mode !== "All") params.set("mode", mode);
    navigate(`/jobs?${params.toString()}`);
  };

  const isLoggedIn = () => {
    try {
      return !!localStorage.getItem("jp_token") || !!JSON.parse(localStorage.getItem("jp_user") || "null");
    } catch {
      return false;
    }
  };

  // load active companies (public)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/active-companies");
        setActiveCompanies(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.log("Failed to load active companies");
        setActiveCompanies([]);
      }
    })();
  }, []);

  // load my follows (auth) - only if logged in
  useEffect(() => {
    (async () => {
      if (!isLoggedIn()) return;
      try {
        const res = await api.get("/company/follows");
        setMyFollows(Array.isArray(res.data) ? res.data : []);
      } catch {
        setMyFollows([]);
      }
    })();
  }, []);

  const doFollowToggle = async (companyName: string) => {
    const name = (companyName || "").trim();
    if (!name) return;

    if (!isLoggedIn()) {
      navigate("/auth");
      return;
    }

    const already = myFollows.includes(name);
    setFollowBusy((p) => ({ ...p, [name]: true }));

    // optimistic
    setMyFollows((p) => (already ? p.filter((x) => x !== name) : [...p, name]));

    try {
      if (already) {
        await api.post("/company/unfollow", { company_name: name });
      } else {
        await api.post("/company/follow", { company_name: name });
      }
    } catch (e) {
      // revert if fail
      setMyFollows((p) => (already ? [...p, name] : p.filter((x) => x !== name)));
      console.log("Follow toggle failed");
    } finally {
      setFollowBusy((p) => ({ ...p, [name]: false }));
    }
  };

  return (
    <main className="relative bg-[#1F4F8F] home-navy overflow-x-hidden">
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

            <button
              onClick={onSearch}
              title={searchHint}
              className="h-12 w-full lg:w-auto px-7 rounded-2xl bg-white text-[#061433] font-extrabold inline-flex items-center justify-center gap-2"
            >
              Search Jobs <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c}
                href={`/jobs?q=${encodeURIComponent(c)}`}
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

            <section className="rounded-3xl border border-[#8FB1DA]/35 bg-[#1F4F8F]/90 shadow-card p-6">
              <h3 className="text-2xl font-extrabold text-white">
                Trusted HR Partner for Hiring & Compliance
              </h3>
              <p className="text-[#EAF2FF] mt-1">
                Verified employers • Structured hiring • Email/WhatsApp updates
              </p>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="hidden lg:block sticky top-24">
              <ChatWidgetMock />
            </div>

            {/* ✅ HOME PAGE: Active Hiring Companies */}
            <section className="rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/90 shadow-card p-5">
              <h3 className="text-xl font-extrabold text-white">Active Hiring Companies</h3>
              <p className="text-[#EAF2FF] text-sm mt-1">Follow to get job alerts</p>

              <div className="relative mt-6 space-y-3">
                {activeCompanies.length === 0 ? (
                  <div className="text-sm text-white/70">No active companies yet.</div>
                ) : (
                  activeCompanies.map((c) => {
                    const name = c.company_name;
                    const followed = myFollows.includes(name);
                    const busy = !!followBusy[name];

                    return (
                      <div
                        key={name}
                        className="rounded-3xl bg-[#1F4F8F]/85 border border-[#8FB1DA]/30 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-[#4A79B8] grid place-items-center">
                              <Building2 size={18} className="text-white" />
                            </div>
                            <div>
                              <div className="font-extrabold text-white">{name}</div>
                              <div className="text-sm text-[#EAF2FF]">
                                {c.jobs_count} active jobs
                              </div>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10 border border-white/12 text-white">
                            <BadgeCheck size={14} /> Hiring
                          </span>
                        </div>

                        <button
                          disabled={busy}
                          onClick={() => doFollowToggle(name)}
                          className={
                            "mt-4 w-full px-4 py-2 rounded-full font-extrabold transition " +
                            (followed
                              ? "bg-white/10 border border-white/12 text-white hover:bg-white/12"
                              : "bg-white text-[#061433] hover:opacity-95") +
                            (busy ? " opacity-70 cursor-not-allowed" : "")
                          }
                        >
                          {busy ? "..." : followed ? "Following" : "Follow"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <section className="container-x mt-14 pb-20">
        <div className="rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/95 shadow-card p-8">
          <h3 className="text-3xl font-extrabold text-white">Post a Job in 60 Seconds</h3>
          <p className="text-[#EAF2FF] mt-2">
            Employer dashboard → Job post → Resume review → Status update
          </p>
        </div>
      </section>
    </main>
  );
}
