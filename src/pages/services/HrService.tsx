// src/pages/services/HrConsultingServices.tsx
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  Users,
  BadgeCheck,
  Sparkles,
  Headphones,
  Timer,
  BarChart3,
  Briefcase,
  Scale,
  ClipboardList,
  Target,
  Search,
  GraduationCap,
  Building2,
} from "lucide-react";

const heroPills = [
  { icon: <Target size={18} />, label: "HR strategy & operating model" },
  { icon: <ClipboardList size={18} />, label: "HR policy & SOP design" },
  { icon: <Scale size={18} />, label: "Compliance & labour law advisory" },
  { icon: <Search size={18} />, label: "Hiring, JD & interview frameworks" },
];

const consultPillars = [
  {
    icon: <Building2 size={18} />,
    title: "HR Setup for New / Growing Businesses",
    points: [
      "HR roadmap (30/60/90 days) aligned to business goals",
      "Org structure, role clarity (RACI), and reporting lines",
      "Employee file templates + onboarding kit",
      "HRIS selection guidance (optional)",
    ],
  },
  {
    icon: <FileText size={18} />,
    title: "Policies, SOPs & Documentation",
    points: [
      "Leave, attendance, WFH, travel, reimbursements policies",
      "Code of conduct, POSH, IT & data usage policies",
      "Disciplinary process + warning letters templates",
      "Offer letter, appointment letter, confirmations, exits",
    ],
  },
  {
    icon: <Users size={18} />,
    title: "Talent & Performance Systems",
    points: [
      "Hiring process design: sourcing → screening → selection",
      "Job descriptions, scorecards, interview guides",
      "Performance management: OKRs/KPIs, appraisal cycles",
      "Training needs analysis + learning plan",
    ],
  },
  {
    icon: <Scale size={18} />,
    title: "Compliance & Employee Relations",
    points: [
      "PF/ESIC/Gratuity/CLRA/Shops & Establishment guidance",
      "Contractor/vendor compliance checklist",
      "Employee grievance handling framework",
      "Audit-ready compliance documentation support",
    ],
  },
];

const whyChoose = [
  {
    icon: <BadgeCheck size={18} />,
    title: "Practical, implementation-first",
    desc: "Not just advice—ready templates, SOPs, and rollout support.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Compliance-driven approach",
    desc: "Strong focus on statutory basics, risk reduction, and audit readiness.",
  },
  {
    icon: <Timer size={18} />,
    title: "Fast turnaround",
    desc: "Clear timelines, weekly checkpoints, and quick closure on action items.",
  },
  {
    icon: <BarChart3 size={18} />,
    title: "Data + dashboards",
    desc: "Optional analytics for hiring funnel, attrition, and HR ops tracking.",
  },
];

const deliverables = [
  "HR Policy Pack (customized PDF/Doc)",
  "Offer/Appointment/Exit letter templates",
  "Onboarding checklist + employee handbook outline",
  "Hiring kit: JDs, scorecards, interview process",
  "Performance framework: KPIs/OKRs + appraisal templates",
  "Compliance checklist + audit-ready folder structure",
];

export default function HrConsultingServices() {
  return (
    <main className="relative bg-[#1F4F8F] min-h-screen overflow-x-hidden">
      {/* top gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

      <section className="container-x relative z-10 pt-10 pb-16">
        {/* back */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-white/85 hover:text-white"
        >
          <ArrowLeft size={18} /> Back to Services
        </Link>

        {/* HERO CARD */}
        <div className="mt-6 rounded-[2rem] border border-white/30 bg-[#1F4F8F]/95 shadow-card overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                HR Consulting
              </h1>

              <p className="mt-3 text-white/85 text-base sm:text-lg leading-relaxed">
                Build a strong HR foundation with practical consulting that
                covers strategy, hiring systems, policies, compliance, and
                employee experience. We help you design and implement HR
                processes that scale—reducing risk, improving productivity, and
                creating a consistent people operating model.
              </p>

              <p className="mt-4 text-white font-semibold italic">
                *End-to-end HR consulting—setup, optimize, and scale your people
                processes with ready-to-use templates and compliance-first
                execution.*
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
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full
                           bg-white text-[#061433] font-extrabold hover:opacity-95 transition w-full sm:w-auto"
              >
                Book HR Consultation <ArrowRight size={18} />
              </Link>

              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full
                           bg-white/10 border border-white/35 text-white font-extrabold
                           hover:bg-white/15 transition w-full sm:w-auto"
              >
                View Jobs <Briefcase size={18} />
              </Link>
            </div>
          </div>

          {/* subtle bottom shine */}
          <div className="h-10 bg-gradient-to-r from-white/0 via-white/8 to-white/0" />
        </div>

        {/* CONTENT SECTIONS */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* left: details */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* What we do */}
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <Sparkles size={18} className="text-white" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    What HR Consulting Covers
                  </h2>
                  <p className="mt-2 text-white/85 leading-relaxed">
                    We help you build a structured HR function—from policies and
                    hiring systems to compliance and performance. You get a
                    clear plan, ready documents, and implementation support so
                    the process actually runs inside your company.
                  </p>
                </div>
              </div>
            </section>

            {/* Pillars */}
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <Users size={18} className="text-white" />
                </span>
                <div className="min-w-0 w-full">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Core Consulting Pillars
                  </h2>
                  <p className="mt-2 text-white/85 leading-relaxed">
                    Choose full-stack HR consulting or pick specific modules
                    based on your current gaps and stage of growth.
                  </p>

                  <div className="mt-5 grid gap-4">
                    {consultPillars.map((c) => (
                      <div
                        key={c.title}
                        className="rounded-2xl border border-white/25 bg-white/5 p-5 hover:bg-white/10 transition"
                      >
                        <div className="flex items-start gap-3">
                          <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0 text-white">
                            {c.icon}
                          </span>
                          <div className="min-w-0 w-full">
                            <div className="font-extrabold text-white">
                              {c.title}
                            </div>
                            <ul className="mt-2 space-y-2 text-white/85 text-sm leading-relaxed list-disc pl-5">
                              {c.points.map((pt) => (
                                <li key={pt}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Deliverables */}
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <FileText size={18} className="text-white" />
                </span>
                <div className="min-w-0 w-full">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    What You Receive (Deliverables)
                  </h2>
                  <p className="mt-2 text-white/85 leading-relaxed">
                    A complete set of documents and frameworks customized to
                    your organization’s structure, roles, and compliance needs.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {deliverables.map((d) => (
                      <div
                        key={d}
                        className="rounded-2xl border border-white/25 bg-white/5 px-4 py-3 text-white/90 text-sm flex items-center gap-3"
                      >
                        <span className="h-8 w-8 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                          <BadgeCheck size={16} className="text-white" />
                        </span>
                        <span className="min-w-0">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* How engagement works */}
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <Timer size={18} className="text-white" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    How the Engagement Works
                  </h2>
                  <div className="mt-3 grid gap-4 sm:grid-cols-3">
                    {[
                      {
                        t: "1) Discovery",
                        d: "Understand org structure, current HR gaps, and priorities.",
                        i: <Search size={18} />,
                      },
                      {
                        t: "2) Design",
                        d: "Policies, SOPs, hiring/performance systems, compliance plan.",
                        i: <ClipboardList size={18} />,
                      },
                      {
                        t: "3) Implement",
                        d: "Rollout support, training, handover, and review checkpoints.",
                        i: <GraduationCap size={18} />,
                      },
                    ].map((x) => (
                      <div
                        key={x.t}
                        className="rounded-2xl border border-white/25 bg-white/5 p-4 hover:bg-white/10 transition"
                      >
                        <div className="flex items-start gap-3">
                          <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0 text-white">
                            {x.i}
                          </span>
                          <div className="min-w-0">
                            <div className="font-extrabold text-white">
                              {x.t}
                            </div>
                            <div className="text-white/80 text-sm mt-1 leading-relaxed">
                              {x.d}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/25 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                        <ShieldCheck size={18} className="text-white" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-white">
                          Confidentiality + access control
                        </div>
                        <p className="text-white/80 text-sm mt-1 leading-relaxed">
                          Structured access for sensitive data (HR docs, employee
                          records, compliance files) with role-based sharing and
                          audit-friendly folder structure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* right: why choose us */}
          <div className="lg:col-span-1 space-y-6 min-w-0">
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold text-white">
                    Why Choose Us
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    HR systems that work in real operations.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {whyChoose.map((w) => (
                  <div
                    key={w.title}
                    className="rounded-2xl border border-white/25 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0 text-white">
                        {w.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-white">
                          {w.title}
                        </div>
                        <div className="text-white/80 text-sm mt-1 leading-relaxed">
                          {w.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* quick highlights */}
              <div className="mt-6 rounded-2xl border border-white/25 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                    <Headphones size={18} className="text-white" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-white">
                      Dedicated HR support
                    </div>
                    <p className="text-white/80 text-sm mt-1 leading-relaxed">
                      Support over email/phone + periodic reviews with leadership
                      for progress, risk, and people metrics.
                    </p>
                  </div>
                </div>
              </div>

              {/* contact */}
              <Link
                to="/contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-4 rounded-full
                           bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
              >
                Request HR Consulting <ArrowRight size={18} />
              </Link>
            </section>

            {/* small compliance note card */}
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <Scale size={18} className="text-white" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-white">
                    HR Compliance Coverage
                  </h3>
                  <p className="mt-2 text-white/85 text-sm leading-relaxed">
                    Advisory is aligned to common Indian statutory requirements
                    (PF/ESIC/Gratuity/Shops & Establishment/CLRA) based on your
                    setup, state, and workforce type.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
