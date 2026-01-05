// src/pages/services/Recruitment.tsx
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  BadgeCheck,
  ClipboardList,
  Headphones,
  Timer,
  Target,
  FileText,
  ShieldCheck,
} from "lucide-react";

const heroPills = [
  { icon: <BadgeCheck size={18} />, label: "Candidate screening" },
  { icon: <ClipboardList size={18} />, label: "Interview coordination" },
  { icon: <FileText size={18} />, label: "Offer & onboarding support" },
  { icon: <Target size={18} />, label: "Industry-focused hiring" },
];

const process = [
  {
    icon: <ClipboardList size={18} />,
    title: "Requirement briefing",
    desc: "JD, must-have skills, location, CTC range, and timelines.",
  },
  {
    icon: <BadgeCheck size={18} />,
    title: "Shortlist & screening",
    desc: "Profile verification, role-fit checks, and pre-screen interviews.",
  },
  {
    icon: <Timer size={18} />,
    title: "Interview coordination",
    desc: "Scheduling, feedback loops, and closure-focused follow-ups.",
  },
  {
    icon: <FileText size={18} />,
    title: "Offer & onboarding",
    desc: "Offer rollout, documentation support, and joining tracking.",
  },
];

const whyChoose = [
  {
    icon: <Users size={18} />,
    title: "Wide talent network",
    desc: "Access to active and passive candidates across roles.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Structured process",
    desc: "Clear stages, clean communication, and timely updates.",
  },
  {
    icon: <BadgeCheck size={18} />,
    title: "Quality screening",
    desc: "Better fitment with fewer drop-offs and mismatches.",
  },
  {
    icon: <Timer size={18} />,
    title: "Faster closures",
    desc: "Speedy scheduling and follow-ups to reduce time-to-hire.",
  },
];

export default function Recruitment() {
  return (
    <main className="relative bg-[#1F4F8F] min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

      <section className="container-x relative z-10 pt-10 pb-16">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-white/85 hover:text-white"
        >
          <ArrowLeft size={18} /> Back to Services
        </Link>

        {/* HERO */}
        <div className="mt-6 rounded-[2rem] border border-white/30 bg-[#1F4F8F]/95 shadow-card overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Recruitment
              </h1>
              <p className="mt-3 text-white/85 text-base sm:text-lg leading-relaxed">
                End-to-end recruitment across multiple industries. We handle
                sourcing, screening, interview coordination, and onboarding
                support—so you can hire the right talent faster with a clean,
                structured process and consistent updates.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {heroPills.map((p) => (
                <div
                  key={p.label}
                  className="rounded-2xl border border-white/35 bg-white/5 px-5 py-4
                             text-white font-semibold flex items-center gap-3"
                >
                  <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center">
                    {p.icon}
                  </span>
                  <span className="text-base">{p.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full
                           bg-white text-[#061433] font-extrabold hover:opacity-95 transition w-full sm:w-auto"
              >
                View Jobs <ArrowRight size={18} />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full
                           bg-white/10 border border-white/35 text-white font-extrabold
                           hover:bg-white/15 transition w-full sm:w-auto"
              >
                Contact Us <Headphones size={18} />
              </Link>
            </div>
          </div>

          <div className="h-10 bg-gradient-to-r from-white/0 via-white/8 to-white/0" />
        </div>

        {/* CONTENT GRID */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* left */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                What we cover
              </h2>
              <p className="mt-2 text-white/85 leading-relaxed">
                We support hiring across sales, operations, customer support,
                finance, admin, and technical roles. Our team focuses on fitment,
                communication, and quick closures with transparent tracking.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["Candidate screening", "Role-fit checks and basic verification."],
                  ["Interview coordination", "Scheduling + reminders + feedback loop."],
                  ["Offer support", "Offer rollout and joining follow-up."],
                  ["Industry focus", "Hiring aligned to your domain needs."],
                ].map(([t, d]) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-white/20 bg-white/5 p-4"
                  >
                    <div className="font-extrabold text-white">{t}</div>
                    <div className="text-sm text-white/80 mt-1">{d}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Our process
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {process.map((s) => (
                  <div
                    key={s.title}
                    className="rounded-2xl border border-white/20 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0 text-white">
                        {s.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-white">{s.title}</div>
                        <div className="text-sm text-white/80 mt-1">{s.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* right */}
          <div className="lg:col-span-1 space-y-6 min-w-0">
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <h2 className="text-xl font-extrabold text-white">Why Choose Us</h2>
              <p className="text-white/80 text-sm mt-1">
                Better fitment with consistent follow-up.
              </p>

              <div className="mt-5 grid gap-4">
                {whyChoose.map((w) => (
                  <div
                    key={w.title}
                    className="rounded-2xl border border-white/20 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0 text-white">
                        {w.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-white">{w.title}</div>
                        <div className="text-sm text-white/80 mt-1 leading-relaxed">
                          {w.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-4 rounded-full
                           bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
              >
                Start Hiring Now <ArrowRight size={18} />
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
