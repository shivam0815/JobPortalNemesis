import {
  Building2,
  Users,
  Briefcase,
  ShieldCheck,
  GraduationCap,
  Globe,
  Target,
  Handshake,
  BadgeCheck,
} from "lucide-react";

const card =
  "rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-8";

export default function About() {
  return (
    <main className="container-x py-10">
      {/* HERO + LONG ABOUT (same section, better design) */}
      <section className={card}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/12 px-4 py-2 text-xs text-white/80">
              <BadgeCheck size={14} />
              Staffing • HR Services • Training • Compliance
            </div>

            <h1 className="mt-4 text-2xl md:text-4xl font-extrabold tracking-tight">
              About Us – Nemesis Group
            </h1>

            <p className="mt-3 text-white/75 leading-relaxed">
              Nemesis Group is a leading staffing and workforce solutions firm
              based in India, delivering comprehensive human resource and talent
              management services to organizations across a wide range of
              industries. With a strong foundation built on quality, integrity,
              and long-term partnerships, we specialize in executive search,
              permanent recruitment, temporary staffing, and compliance
              management solutions that enable businesses to grow efficiently,
              compliantly, and sustainably.
            </p>

            {/* Mission highlight */}
            <div className="mt-5 rounded-3xl bg-white/8 border border-white/12 p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                  <Target size={18} />
                </div>
                <div>
                  <div className="font-extrabold text-white">Our Mission</div>
                  <p className="mt-1 text-white/75 leading-relaxed">
                    Our mission is to deliver exceptional service and consistent
                    support to our clients as well as our associate employees,
                    while striving to become the most respected and trusted
                    staffing firm in every market we serve. We strongly believe
                    that people are the backbone of organizational success, and
                    our approach is centered on connecting the right talent with
                    the right opportunity at the right time.
                  </p>
                </div>
              </div>
            </div>

            {/* Experience + approach */}
            <p className="mt-5 text-white/75 leading-relaxed">
              Backed by over a decade of industry experience, Nemesis Group has
              developed deep market knowledge and a clear understanding of
              evolving workforce trends. Our team of highly skilled and
              dedicated professionals works closely with clients to understand
              their business objectives, organizational culture, and workforce
              challenges. This consultative approach allows us to design
              customized, hassle-free staffing solutions that align with both
              short-term operational needs and long-term strategic goals.
            </p>

            <p className="mt-4 text-white/75 leading-relaxed">
              We offer end-to-end recruitment solutions across multiple domains,
              ensuring access to qualified, reliable, and performance-driven
              talent. Our executive search services help organizations identify
              and attract leadership professionals capable of driving growth and
              transformation. Through permanent recruitment, we assist companies
              in building strong and stable teams, while our temporary staffing
              solutions provide flexibility, scalability, and cost efficiency.
              Additionally, our compliance management services ensure adherence
              to statutory regulations and labor laws, enabling clients to
              operate with confidence and minimal risk.
            </p>

            {/* Training intro */}
            <div className="mt-6 rounded-3xl bg-white/8 border border-white/12 p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div className="font-extrabold text-white">
                    Training Programs for Freshers
                  </div>
                  <p className="mt-1 text-white/75 leading-relaxed">
                    Alongside staffing solutions, Nemesis Group is deeply
                    committed to talent development and career building for
                    fresher candidates. We recognize that many graduates and
                    early-career professionals face challenges in entering the
                    corporate world due to a lack of practical exposure and
                    industry readiness. To address this gap, we have developed
                    structured, job-oriented training programs designed to help
                    freshers build, maintain, and grow their professional
                    careers with confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Training cards */}
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <Info
                icon={GraduationCap}
                title="HR Training Program"
                desc="Recruitment & staffing, interview coordination, payroll fundamentals, labor laws & compliance, HR operations, engagement, performance management + communication & corporate etiquette."
              />
              <Info
                icon={Users}
                title="Customer Care / Support"
                desc="Customer interaction, call handling, email/chat support, problem-solving, complaint management, service quality standards, CRM basics, real-life scenarios for BPO/support roles."
              />
              <Info
                icon={Building2}
                title="Banking & Financial Services"
                desc="Banking fundamentals, financial products, onboarding, KYC norms, basic accounting, compliance awareness, customer service + accuracy and ethical practices."
              />
            </div>

            {/* Methodology + closing */}
            <div className="mt-6 rounded-3xl bg-white/8 border border-white/12 p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                  <Handshake size={18} />
                </div>
                <div>
                  <div className="font-extrabold text-white">
                    How We Deliver Value
                  </div>
                  <p className="mt-1 text-white/75 leading-relaxed">
                    All our training programs are led by experienced industry
                    professionals who bring real-world insights into the
                    learning process. The methodology combines theoretical
                    understanding with practical exposure, live examples, case
                    studies, role plays, and career guidance sessions. Our focus
                    is not only on skill development but also on building the
                    right mindset, confidence, and professionalism required to
                    sustain long-term careers.
                  </p>
                  <p className="mt-3 text-white/75 leading-relaxed">
                    At Nemesis Group, we believe in empowering individuals to
                    maintain and grow their careers through continuous learning
                    and practical exposure. Whether it is HR, customer care, or
                    banking, our training programs are designed to make freshers
                    employable, confident, and workplace-ready.
                  </p>
                  <p className="mt-3 text-white/75 leading-relaxed">
                    At the heart of Nemesis Group lies a commitment to trust,
                    transparency, and excellence. We focus on building long-term
                    relationships with clients, candidates, and partners by
                    consistently delivering value-driven solutions. As workforce
                    dynamics continue to evolve, Nemesis Group remains dedicated
                    to innovation, continuous improvement, and creating
                    meaningful employment opportunities that drive business
                    success and individual career growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: stats */}
          <div className="grid grid-cols-2 gap-4 min-w-[260px] lg:sticky lg:top-6">
            <Stat icon={Globe} title="Pan-India" desc="All India Services" />
            <Stat icon={Users} title="Candidates" desc="Freshers to Executives" />
            <Stat icon={Briefcase} title="Employers" desc="SMEs to Enterprises" />
            <Stat icon={ShieldCheck} title="Compliance" desc="Process Driven" />
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className={"mt-6 " + card}>
        <h2 className="text-xl md:text-2xl font-extrabold">What We Do</h2>
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
