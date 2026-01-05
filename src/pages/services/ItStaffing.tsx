// src/pages/services/ITStaffing.tsx
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Users,
  BadgeCheck,
  Timer,
  Globe2,
  Layers3,
  ShieldCheck,
  ClipboardList,
  Headphones,
  Sparkles,
} from "lucide-react";

const heroPills = [
  { icon: <Users size={18} />, label: "Contract & permanent hiring" },
  { icon: <BadgeCheck size={18} />, label: "Verified technical profiles" },
  { icon: <Timer size={18} />, label: "Quick turnaround time" },
  { icon: <Globe2 size={18} />, label: "Pan India availability" },
];

const whyChoose = [
  {
    icon: <Timer size={18} />,
    title: "Fast TAT (time-to-hire)",
    desc: "Shortlisting + interview scheduling with clear SLA-based timelines.",
  },
  {
    icon: <BadgeCheck size={18} />,
    title: "Pre-vetted candidates",
    desc: "Screened profiles with skill-fit checks and role-aligned evaluation.",
  },
  {
    icon: <Layers3 size={18} />,
    title: "Scale up or down",
    desc: "Flexible hiring model for startups and enterprises across tech stacks.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Compliance-ready",
    desc: "Documentation support and structured hiring process for peace of mind.",
  },
];

const process = [
  {
    icon: <ClipboardList size={18} />,
    title: "Requirement Intake",
    desc: "JD, budget, skills, location/remote, and interview plan.",
  },
  {
    icon: <Sparkles size={18} />,
    title: "Sourcing & Screening",
    desc: "Active sourcing + shortlisting with technical-fit filters.",
  },
  {
    icon: <Code2 size={18} />,
    title: "Interview Pipeline",
    desc: "Scheduling, feedback loops, and offer coordination.",
  },
  {
    icon: <Headphones size={18} />,
    title: "Onboarding Support",
    desc: "Joining follow-up, documentation, and replacements if needed.",
  },
];

export default function ITStaffing() {
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

        {/* HERO (match screenshot style) */}
        <div className="mt-6 rounded-[2rem] border border-white/30 bg-[#1F4F8F]/95 shadow-card overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                IT Staffing
              </h1>
              <p className="mt-3 text-white/85 text-base sm:text-lg leading-relaxed">
                Fast and reliable IT hiring for startups and enterprises. We help
                you hire the right engineers, product and QA talent with a
                structured pipeline—from requirement intake to onboarding.
                Choose contract, permanent, or project-based staffing with
                verified profiles and a quick turnaround time.
              </p>
            </div>

            {/* Pills grid */}
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

            {/* CTA buttons */}
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
                Contact Us <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="h-10 bg-gradient-to-r from-white/0 via-white/8 to-white/0" />
        </div>

        {/* CONTENT GRID */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* left: details */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                What we deliver
              </h2>
              <p className="mt-2 text-white/85 leading-relaxed">
                We source candidates across backend, frontend, full-stack,
                DevOps, QA, data, and product roles. Every profile goes through a
                role-fit screening, skill checklist, and availability validation
                so you get fewer mismatches and faster closures.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["Tech stack match", "Role-aligned shortlisting for your stack."],
                  ["Interview coordination", "Scheduling + feedback loop follow-up."],
                  ["Offer & joining support", "Negotiation help and joining tracking."],
                  ["Replacement support", "Support to reduce hiring risk."],
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
                Hiring process
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

          {/* right: why choose */}
          <div className="lg:col-span-1 space-y-6 min-w-0">
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <h2 className="text-xl font-extrabold text-white">Why Choose Us</h2>
              <p className="text-white/80 text-sm mt-1">
                Reliable staffing with speed + quality checks.
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

              <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                    <Globe2 size={18} className="text-white" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-white">
                      Pan-India & remote-ready
                    </div>
                    <p className="text-white/80 text-sm mt-1">
                      City-wise hiring plus remote roles—based on your team model.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-4 rounded-full
                           bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
              >
                Request IT Staffing <ArrowRight size={18} />
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
