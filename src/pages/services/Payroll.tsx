// src/pages/services/PayrollServices.tsx
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  Calculator,
  Users,
  BadgeCheck,
  Sparkles,
  Headphones,
  Timer,
  BarChart3,
} from "lucide-react";

const heroPills = [
  { icon: <FileText size={18} />, label: "Salary processing & payslips" },
  { icon: <Users size={18} />, label: "Attendance & leave integration" },
  { icon: <Calculator size={18} />, label: "Statutory deductions" },
  { icon: <BarChart3 size={18} />, label: "Monthly & annual reports" },
];

const whyChoose = [
  {
    icon: <BadgeCheck size={18} />,
    title: "Extensive experience",
    desc: "Managing complex payroll processes across industries and scale.",
  },
  {
    icon: <Sparkles size={18} />,
    title: "Cutting-edge technology",
    desc: "Digitally enabled workflows that reduce manual effort and errors.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "In-house experts",
    desc: "Strong expertise in compliance, statutory, legal, and HR operations.",
  },
  {
    icon: <Timer size={18} />,
    title: "Speedy resolutions",
    desc: "Fast handling of employee queries with strong review mechanisms.",
  },
];

export default function PayrollServices() {
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

        {/* HERO CARD (same style as screenshot) */}
        <div className="mt-6 rounded-[2rem] border border-white/30 bg-[#1F4F8F]/95 shadow-card overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Payroll Outsourcing
              </h1>

              <p className="mt-3 text-white/85 text-base sm:text-lg leading-relaxed">
                Tailored HRIS, payroll, and compliance solutions with advanced
                technology and expert support, enhancing ROI and employee
                satisfaction. Our secure, efficient payroll outsourcing services
                minimize manual processes and non-compliance risks, offering
                seamless management and robust support through a digitally
                enabled platform.
              </p>

              <p className="mt-4 text-white font-semibold italic">
                *Customized Solutions for your HRIS, Payroll and Compliance
                requirements to increase your return on investment and ensure
                employee satisfaction*
              </p>
            </div>

            {/* Pills grid like screenshot */}
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

            {/* CTA buttons like screenshot */}
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

          {/* subtle bottom shine */}
          <div className="h-10 bg-gradient-to-r from-white/0 via-white/8 to-white/0" />
        </div>

        {/* CONTENT SECTIONS (same color + rounded cards) */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* left: details */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <ShieldCheck size={18} className="text-white" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Secure, compliant, end-to-end payroll
                  </h2>
                  <p className="mt-2 text-white/85 leading-relaxed">
                    We offer end-to-end payroll outsourcing services through a
                    state-of-the-art tech-enabled offering. We offer secure and
                    data-driven processing with a special focus on security and
                    confidentiality management. We collaborate with Indian and
                    global clients both small and large across various sectors
                    to help them overcome payroll, compliance, tax, and statutory
                    challenges.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <FileText size={18} className="text-white" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Confidentiality + hassle-free processing
                  </h2>
                  <p className="mt-2 text-white/85 leading-relaxed">
                    We maintain strict confidentiality of data and provide
                    competent and hassle-free processing of payroll and
                    reimbursements, provident funds, profession tax, and income
                    tax-related planning while accommodating changes in employee
                    benefit management.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <Users size={18} className="text-white" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Centralized or decentralized models
                  </h2>
                  <p className="mt-2 text-white/85 leading-relaxed">
                    You can choose from our centralized or decentralized payroll
                    outsourcing approach based on your organizational requirement
                    and business model. We aim for seamless management of
                    assignments, removing most manual processes and paperwork
                    related to timesheets, payroll, and legal documentation—
                    ensuring lower non-compliance risks, fewer delays, and higher
                    operational efficiency.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/25 bg-white/5 shadow-card p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                  <Headphones size={18} className="text-white" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Robust employee support + analytics
                  </h2>
                  <p className="mt-2 text-white/85 leading-relaxed">
                    Our in-house team carries knowledge across compliance,
                    statutory, regulatory, legal, and human resources. Our SOPs
                    and digitally enabled systems ensure high-quality delivery.
                    Employees get support via email, phone, or an online portal.
                    With strong review mechanisms, we work as an extension of
                    your team, delivering customized data and analytics for
                    management reviews and risk planning.
                  </p>
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
                    Reliable payroll + compliance at scale.
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

              <div className="mt-6 rounded-2xl border border-white/25 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 grid place-items-center shrink-0">
                    <Sparkles size={18} className="text-white" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-white">
                      Nationwide coordination points
                    </div>
                    <p className="text-white/80 text-sm mt-1 leading-relaxed">
                      Our presence across the nation reduces cost and time
                      constraints and supports speedy resolution of client and
                      employee issues.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-4 rounded-full
                           bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
              >
                Request a Payroll Consultation <ArrowRight size={18} />
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
