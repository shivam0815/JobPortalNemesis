// src/pages/Home.tsx
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { Phone, Globe, Mail, ArrowRight, CheckCircle2, Briefcase, Users, Shield, Sparkles, MapPin } from "lucide-react";
import DotGrid from "../../components/DotGrid";
import HexImage from "../../components/HexImage";
import { Link } from "react-router-dom";

const tEaseOut: Transition = { duration: 0.75, ease: "easeOut" };
const tFast: Transition = { duration: 0.55, ease: "easeOut" };

const viewportOnce = { once: true, amount: 0.22 as const };

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={tEaseOut}
        >
          {eyebrow ? (
            <div className="text-white/75 tracking-[0.22em] text-xs font-semibold uppercase">
              {eyebrow}
            </div>
          ) : null}

          <div className="mt-2 text-2xl md:text-4xl font-extrabold tracking-tight">{title}</div>

          {subtitle ? (
            <div className="mt-3 text-white/80 max-w-3xl leading-relaxed">{subtitle}</div>
          ) : null}
        </motion.div>

        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function Card({
  icon,
  title,
  desc,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={tEaseOut}
      className={`rounded-3xl bg-white/10 border border-white/15 shadow-soft p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-2xl bg-white/12 border border-white/15 grid place-items-center">
          {icon}
        </div>
        <div>
          <div className="text-lg font-extrabold">{title}</div>
          <div className="mt-1 text-white/80 leading-relaxed">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ServiceTile({
  title,
  desc,
  to,
}: {
  title: string;
  desc: string;
  to?: string;
}) {
  const content = (
    <div className="group rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft hover:bg-white/12 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-extrabold tracking-tight">{title}</div>
          <div className="mt-2 text-white/75 leading-relaxed">{desc}</div>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15 grid place-items-center shrink-0">
          <ArrowRight size={18} className="opacity-90 group-hover:translate-x-0.5 transition" />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={tEaseOut}
    >
      {to ? <Link to={to}>{content}</Link> : content}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B4FA8] via-[#0B4FA8] to-[#083B7E]" />
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-48 -right-40 h-[560px] w-[560px] rounded-full bg-[#57C3E6]/20 blur-3xl" />

      {/* Dots */}
      <DotGrid className="absolute top-10 left-8 h-32 w-32" />
      <DotGrid className="absolute top-10 right-8 h-32 w-32" />
      <DotGrid className="absolute bottom-10 right-10 h-36 w-36" opacity={0.18} />

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pt-10 pb-10 md:pt-12 md:pb-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tFast}
              className="text-white/85 tracking-widest text-sm font-semibold"
            >
              NEMESIS GROUP
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...tEaseOut, delay: 0.05 }}
              className="mt-3 text-4xl md:text-6xl font-extrabold leading-[1.03] tracking-tight"
            >
              CERTIFIED
              <br />
              PROFESSIONAL
              <br />
              TRAINING
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...tEaseOut, delay: 0.12 }}
              className="mt-4 text-lg md:text-xl text-white/85 font-semibold"
            >
              Guaranteed Interviews &amp; Placement Assurance
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...tEaseOut, delay: 0.18 }}
              className="mt-7 inline-flex items-center rounded-full bg-white/12 border border-white/15 px-5 py-3 shadow-soft"
            >
              <span className="text-base font-bold tracking-wide">TRAINING &amp; DEVELOPMENT</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...tEaseOut, delay: 0.24 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
              >
                 Training Program <ArrowRight size={18} />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
              >
                Contact
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...tEaseOut, delay: 0.30 }}
              className="mt-8 grid sm:grid-cols-3 gap-3"
            >
              <div className="rounded-3xl bg-white/10 border border-white/15 p-4">
                <div className="text-xs text-white/70 tracking-widest font-semibold">FOCUS</div>
                <div className="mt-1 font-bold">Job-ready skills</div>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/15 p-4">
                <div className="text-xs text-white/70 tracking-widest font-semibold">FORMAT</div>
                <div className="mt-1 font-bold">Practical learning</div>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/15 p-4">
                <div className="text-xs text-white/70 tracking-widest font-semibold">OUTCOME</div>
                <div className="mt-1 font-bold">Placement support</div>
              </div>
            </motion.div>
          </div>

          {/* Right collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: "easeOut" } as Transition}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 grid place-items-center">
              <div className="h-[380px] w-[380px] rounded-full bg-white" />
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-[520px] mx-auto">
              <HexImage
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Training"
                className="h-56 w-full"
              />
              <HexImage
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Professional"
                className="h-56 w-full"
              />
              <div className="col-span-2 flex justify-center">
                <HexImage
                  src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1200&q=80"
                  alt="Career"
                  className="h-56 w-[65%]"
                />
              </div>
            </div>

            <div className="mt-7 rounded-3xl bg-white/10 border border-white/15 p-5 shadow-soft">
              <div className="text-sm font-bold tracking-wide text-white/90">CONTACT</div>
              <div className="mt-4 grid gap-3 text-white/90">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/12 border border-white/15 grid place-items-center">
                    <Phone size={18} />
                  </div>
                  <div className="font-semibold">+91-8808062698</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/12 border border-white/15 grid place-items-center">
                    <Globe size={18} />
                  </div>
                  <div className="font-semibold">www.nemesisgroup.in</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/12 border border-white/15 grid place-items-center">
                    <Mail size={18} />
                  </div>
                  <div className="font-semibold">edu.info@nemesisgroup.in</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMPANY OVERVIEW */}
      <Section
        id="overview"
        eyebrow="Company Overview"
        title="Staffing + Training + Placement support for freshers"
        subtitle="Nemesis Group supports fresher candidates through selection, professional training, and placement assistance — with job-oriented programs that build practical skills, communication, and workplace professionalism."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <Card
            icon={<Users size={18} />}
            title="Fresher-focused programs"
            desc="Designed for candidates starting their careers with clear processes, real scenarios, and confidence-building."
          />
          <Card
            icon={<Briefcase size={18} />}
            title="Strong client network"
            desc="Placement support with interview preparation and guidance to help candidates secure suitable opportunities."
          />
        </div>
      </Section>

      {/* VISION + MISSION */}
      <Section
        id="vision-mission"
        eyebrow="Vision & Mission"
        title="Build job-ready professionals with ethical, long-term growth"
        subtitle="We bridge the gap between education and employment by delivering industry-focused training and supporting sustainable career success."
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Card
            icon={<Sparkles size={18} />}
            title="Our Mission"
            desc="Empower fresher candidates by identifying potential talent and delivering industry-focused training in HR, Customer Care, and Banking & Finance — with practical skill development and placement support."
          />
          <Card
            icon={<Shield size={18} />}
            title="Our Vision"
            desc="Become a trusted leader in talent development and staffing solutions by creating job-ready professionals and meaningful employment opportunities through quality training and ethical practices."
          />
        </div>
      </Section>

      {/* WHY T&D MATTERS */}
      <Section
        id="why"
        eyebrow="Why Training & Development Matters"
        title="Better performance, adaptability, and employability"
        subtitle="Training helps individuals grow and organizations stay competitive — while making candidates industry-ready with confidence and professionalism."
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Supports Career & Business Growth"
            desc="Continuous learning enhances performance, adaptability, and long-term career growth while maintaining a skilled workforce."
          />
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Builds Job-Ready Skills"
            desc="Bridges the gap between education and industry needs, improving practical skills, confidence, and workplace professionalism."
          />
        </div>
      </Section>

      {/* DESIGNING EFFECTIVE T&D */}
      <Section
        id="design"
        eyebrow="Designing Effective Training"
        title="A structured approach that delivers outcomes"
        subtitle="From identifying skill gaps to continuous evaluation — training is built around measurable objectives and real-world learning."
      >
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { title: "Identify Skill Gaps", desc: "Analyze learner needs and industry requirements to define objectives." },
            { title: "Set Clear Goals", desc: "Establish measurable outcomes aligned with career needs." },
            { title: "Practical Learning", desc: "Real examples, case studies, hands-on activities." },
            { title: "Expert Trainers", desc: "Experienced professionals with industry insights." },
            { title: "Continuous Evaluation", desc: "Measure progress and update content for effectiveness." },
          ].map((x, i) => (
            <motion.div
              key={x.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ ...tEaseOut, delay: i * 0.03 } as Transition}
              className="rounded-3xl bg-white/10 border border-white/15 p-5 shadow-soft"
            >
              <div className="text-xs text-white/70 font-semibold tracking-widest">STEP {i + 1}</div>
              <div className="mt-2 font-extrabold">{x.title}</div>
              <div className="mt-2 text-white/80 text-sm leading-relaxed">{x.desc}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* REACTION / SATISFACTION / ADVANTAGE */}
      <Section
        id="rsa"
        eyebrow="Training Outcomes"
        title="Reaction, Satisfaction, and Advantage"
        subtitle="We measure how well training is received, how relevant it feels, and what benefits candidates gain for employability and growth."
      >
        <div className="grid md:grid-cols-3 gap-5">
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Reaction"
            desc="Measures immediate response — engagement, interest, and satisfaction with content and delivery."
          />
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Satisfaction"
            desc="Evaluates relevance, trainer effectiveness, environment, and perceived value toward career development."
          />
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Advantage"
            desc="Highlights improved skills, confidence, productivity, employability, and long-term career growth."
          />
        </div>
      </Section>

      {/* EMPLOYEE DEVELOPMENT */}
      <Section
        id="development"
        eyebrow="Employee Development"
        title="Soft skills + career growth that compounds"
        subtitle="Continuous development improves communication, teamwork, leadership, and promotion readiness — aligning individual goals with organizational growth."
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Card
            icon={<Users size={18} />}
            title="Soft Skills Improvement"
            desc="Communication, teamwork, leadership, problem-solving, professionalism, and confidence in dynamic corporate environments."
          />
          <Card
            icon={<Briefcase size={18} />}
            title="Career Growth"
            desc="Builds expertise, improves performance, and strengthens promotion readiness, job stability, and long-term success."
          />
        </div>
      </Section>

      {/* TRAINING & SERVICES OVERVIEW */}
      <Section
        id="all-services"
        eyebrow="Training & Services"
        title="Programs designed for real roles"
        subtitle="Comprehensive training with practical scenarios, hands-on learning, and placement support."
      >
        <div className="grid md:grid-cols-2 gap-5">
          <ServiceTile
            title="HR Training "
            desc="Recruitment, staffing, HR operations, payroll basics, labor laws, compliance, employee engagement, and workplace professionalism."
            to="/services/hr-training"
          />
          <ServiceTile
            title="Customer Care Training "
            desc="Communication skills, call handling, email/chat etiquette, problem-solving, complaint management, and service quality."
            to="/services/customer-training"
          />
          <ServiceTile
            title="Banking & Finance Training Services"
            desc="Banking fundamentals, financial products, customer service, KYC norms, compliance awareness, and professional conduct."
          />
          <ServiceTile
            title="Skill Development & Soft Skills Training"
            desc="Communication, teamwork, confidence, time management, and professional behavior for corporate readiness."
          />
          <ServiceTile
            title="Practical & Industry-Oriented Training"
            desc="Real-life scenarios, case studies, role plays, and hands-on learning with experienced industry professionals."
          />
          <ServiceTile
            title="Placement Support Services"
            desc="Interview preparation, career guidance, and placement assistance through a strong client network."
          />
        </div>
      </Section>

      {/* CONTACT */}
      <Section
        id="contact"
        eyebrow="Contact"
        title="Talk to us for training and placement support"
        subtitle="Reach out for program details, schedules, and placement assistance."
      >
        <div className="grid lg:grid-cols-2 gap-5 items-start">
          <div className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft">
            <div className="grid gap-4 text-white/90">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/12 border border-white/15 grid place-items-center">
                  <Phone size={18} />
                </div>
                <div className="font-semibold">+91-8808062698</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/12 border border-white/15 grid place-items-center">
                  <Mail size={18} />
                </div>
                <div className="font-semibold">edu.info@nemesisgroup.in</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/12 border border-white/15 grid place-items-center">
                  <Globe size={18} />
                </div>
                <div className="font-semibold">www.nemesisgroup.in</div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/12 border border-white/15 grid place-items-center mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="font-semibold leading-relaxed">
                  TAJPUR ROAD HUNDAL CHOWK
                  <br />
                  LUDHIANA, PUNJAB 141015
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
              >
                View Services <ArrowRight size={18} />
              </Link>
              <a
                href="#overview"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
              >
                About
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={tEaseOut}
            className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
          >
            <div className="text-xl font-extrabold tracking-tight">Thank you</div>
            <div className="mt-2 text-white/80 leading-relaxed">
              Thank you for exploring Nemesis Group for your training and career development needs.
              We support your journey toward professional growth with the right skills, confidence, and opportunities.
            </div>

            <div className="mt-6 rounded-3xl bg-white/8 border border-white/10 p-5">
              <div className="text-sm text-white/70 tracking-widest font-semibold">NEXT STEP</div>
              <div className="mt-2 font-bold">Book a quick call for program guidance</div>
              <div className="mt-2 text-white/80 text-sm">
                Get the right training path based on your goal: HR, Customer Care, or Banking &amp; Finance.
              </div>
              <div className="mt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
                >
                  Contact Now <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Footer spacing */}
      <div className="relative h-10" />
    </main>
  );
}
