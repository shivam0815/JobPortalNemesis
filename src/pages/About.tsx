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

      {/* ABOUT US FULL TEXT */}
      <section className={"mt-6 " + card}>
        <h2 className="text-xl md:text-2xl font-extrabold">
          About Us – Nemesis Group
        </h2>

        <div className="mt-4 space-y-4 text-white/75 leading-relaxed">
          <p>
            Nemesis Group is a leading staffing and workforce solutions firm based in India, delivering comprehensive human resource and talent management services to organizations across a wide range of industries. With a strong foundation built on quality, integrity, and long-term partnerships, we specialize in executive search, permanent recruitment, temporary staffing, and compliance management solutions that enable businesses to grow efficiently, compliantly, and sustainably.
          </p>

          <p>
            Our mission is to deliver exceptional service and consistent support to our clients as well as our associate employees, while striving to become the most respected and trusted staffing firm in every market we serve. We strongly believe that people are the backbone of organizational success, and our approach is centered on connecting the right talent with the right opportunity at the right time.
          </p>

          <p>
            Backed by over a decade of industry experience, Nemesis Group has developed deep market knowledge and a clear understanding of evolving workforce trends. Our team of highly skilled and dedicated professionals works closely with clients to understand their business objectives, organizational culture, and workforce challenges. This consultative approach allows us to design customized, hassle-free staffing solutions that align with both short-term operational needs and long-term strategic goals.
          </p>

          <p>
            We offer end-to-end recruitment solutions across multiple domains, ensuring access to qualified, reliable, and performance-driven talent. Our executive search services help organizations identify and attract leadership professionals capable of driving growth and transformation. Through permanent recruitment, we assist companies in building strong and stable teams, while our temporary staffing solutions provide flexibility, scalability, and cost efficiency. Additionally, our compliance management services ensure adherence to statutory regulations and labor laws, enabling clients to operate with confidence and minimal risk.
          </p>

          <p>
            Alongside staffing solutions, Nemesis Group is deeply committed to talent development and career building for fresher candidates. We recognize that many graduates and early-career professionals face challenges in entering the corporate world due to a lack of practical exposure and industry readiness. To address this gap, we have developed structured, job-oriented training programs designed to help freshers build, maintain, and grow their professional careers with confidence.
          </p>

          <p>
            Our HR Training Program for Freshers is designed to bridge the gap between academic learning and real-world corporate HR practices. The program covers core HR functions such as recruitment and staffing processes, interview coordination, payroll fundamentals, labor laws and statutory compliance, HR operations, employee engagement, and performance management. In addition to technical knowledge, we focus on communication skills, documentation, corporate etiquette, and workplace professionalism to ensure candidates are industry-ready.
          </p>

          <p>
            In addition to HR training, Nemesis Group offers Customer Care and Customer Support Training for freshers aspiring to build careers in service-oriented roles. This program focuses on customer interaction skills, call handling techniques, email and chat support, problem-solving, complaint management, and service quality standards. Candidates are trained in professional communication, customer relationship management, and handling real-life customer scenarios. This training helps freshers gain confidence, improve interpersonal skills, and prepare for roles in customer support, BPOs, and service-driven organizations.
          </p>

          <p>
            We also provide Banking and Financial Services Training for Freshers, aimed at candidates seeking entry-level roles in the banking and finance sector. This program covers banking fundamentals, financial products, customer onboarding, KYC norms, basic accounting concepts, compliance awareness, and customer service in banking environments. Emphasis is placed on accuracy, professionalism, ethical practices, and regulatory understanding, enabling candidates to adapt quickly to banking operations and corporate expectations.
          </p>

          <p>
            All our training programs are led by experienced industry professionals who bring real-world insights into the learning process. The methodology combines theoretical understanding with practical exposure, live examples, case studies, role plays, and career guidance sessions. Our focus is not only on skill development but also on building the right mindset, confidence, and professionalism required to sustain long-term careers.
          </p>

          <p>
            At Nemesis Group, we believe in empowering individuals to maintain and grow their careers through continuous learning and practical exposure. Whether it is HR, customer care, or banking, our training programs are designed to make freshers employable, confident, and workplace-ready.
          </p>

          <p>
            At the heart of Nemesis Group lies a commitment to trust, transparency, and excellence. We focus on building long-term relationships with clients, candidates, and partners by consistently delivering value-driven solutions. As workforce dynamics continue to evolve, Nemesis Group remains dedicated to innovation, continuous improvement, and creating meaningful employment opportunities that drive business success and individual career growth.add this text into this code donts miss and remove any complete this text
          </p>
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
