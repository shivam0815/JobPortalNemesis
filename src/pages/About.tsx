import {
  Building2,
  Users,
  Briefcase,
  ShieldCheck,
  GraduationCap,
  Globe,
} from "lucide-react";

const card =
  "rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-8";

export default function About() {
  return (
    <main className="container-x py-10">
      {/* HERO */}
      <section className={card}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              About Nemesis Group
            </h1>
            <p className="mt-3 text-white/75 leading-relaxed">
              Nemesis Group is a professional Job Portal and HR Services
              organization delivering recruitment, staffing, payroll,
              compliance, and training solutions to businesses and candidates
              across India.
            </p>
            <p className="mt-3 text-white/75 leading-relaxed">
              We bridge the gap between talent and opportunity by combining
              technology-driven hiring with strong HR domain expertise.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[260px]">
            <Stat icon={Globe} title="All India" desc="Pan-India Services" />
            <Stat icon={Users} title="Candidates" desc="Freshers to Executives" />
            <Stat icon={Briefcase} title="Employers" desc="SMEs to Enterprises" />
            <Stat icon={ShieldCheck} title="Compliance" desc="Process Driven" />
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className={"mt-6 " + card}>
        <h2 className="text-xl md:text-2xl font-extrabold">
          What We Do
        </h2>
        <p className="mt-2 text-white/70 max-w-3xl">
          We provide end-to-end hiring and HR lifecycle solutions that help
          organizations scale efficiently and help candidates build meaningful
          careers.
        </p>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Info
            icon={Briefcase}
            title="Recruitment & Staffing"
            desc="IT staffing, bulk hiring, executive search, and role-specific recruitment."
          />
          <Info
            icon={Building2}
            title="HR Services"
            desc="Payroll management, statutory compliance, HR consulting, SOPs, and audits."
          />
          <Info
            icon={GraduationCap}
            title="Training & Development"
            desc="Soft skills, customer care training, HR & finance skill programs."
          />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={"mt-6 " + card}>
        <h2 className="text-xl md:text-2xl font-extrabold">
          Why Choose Nemesis Group
        </h2>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <Bullet
            title="Industry-Focused Hiring"
            desc="We understand domain requirements and screen candidates accordingly."
          />
          <Bullet
            title="Technology-Enabled Platform"
            desc="Job posting, application tracking, resume view, and status updates in one place."
          />
          <Bullet
            title="Policy-Driven Processes"
            desc="Transparent workflows for interviews, shortlisting, and compliance."
          />
          <Bullet
            title="Pan-India Reach"
            desc="Serving employers and candidates across multiple cities and industries."
          />
        </div>
      </section>

      {/* OUR APPROACH */}
      <section className={"mt-6 " + card}>
        <h2 className="text-xl md:text-2xl font-extrabold">
          Our Approach
        </h2>
        <p className="mt-2 text-white/75 max-w-4xl leading-relaxed">
          At Nemesis Group, we believe hiring is not just filling positions —
          it’s about building long-term value. Our approach combines
          structured recruitment, HR best practices, and continuous
          improvement to ensure quality outcomes for both employers and
          candidates.
        </p>

        <p className="mt-3 text-white/75 max-w-4xl leading-relaxed">
          Whether you are a candidate seeking growth or an organization looking
          for reliable talent and HR support, we work as your long-term partner.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-8 text-center">
        <div className="inline-flex flex-col sm:flex-row gap-3">
          <a
            href="/jobs"
            className="px-6 py-3 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition"
          >
            Browse Jobs
          </a>
          <a
            href="/employer"
            className="px-6 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/15 transition font-semibold"
          >
            Employer / HR Portal
          </a>
        </div>
      </section>
    </main>
  );
}

/* ---------- helpers ---------- */

function Stat({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl bg-white/8 border border-white/12 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
          <Icon size={18} />
        </div>
        <div>
          <div className="font-extrabold">{title}</div>
          <div className="text-xs text-white/70">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl bg-white/8 border border-white/12 p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
          <Icon size={18} />
        </div>
        <div>
          <div className="font-extrabold">{title}</div>
          <div className="text-sm text-white/75 mt-1">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Bullet({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl bg-white/8 border border-white/12 p-5">
      <div className="font-extrabold">{title}</div>
      <div className="text-sm text-white/75 mt-1">{desc}</div>
    </div>
  );
}
