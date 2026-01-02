// src/pages/HRTraining.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Globe,
  Mail,
  Clock,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Users,
} from "lucide-react";
import DotGrid from "../../components/DotGrid";
import HexImage from "../../components/HexImage";

const t: Transition = { duration: 0.75, ease: "easeOut" };
const tFast: Transition = { duration: 0.55, ease: "easeOut" };
const vp = { once: true, amount: 0.22 as const };

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={t}
        >
          <div className="text-2xl md:text-4xl font-extrabold tracking-tight">{title}</div>
          {subtitle ? <div className="mt-3 text-white/80 max-w-3xl leading-relaxed">{subtitle}</div> : null}
        </motion.div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/12 border border-white/15 px-4 py-2">
      <div className="h-8 w-8 rounded-2xl bg-white/10 border border-white/10 grid place-items-center">
        {icon}
      </div>
      <div className="font-semibold text-white/90">{text}</div>
    </div>
  );
}

function Card({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={vp}
      transition={t}
      className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1.5">
        <CheckCircle2 size={18} className="text-white/90" />
      </span>
      <span className="text-white/85 leading-relaxed">{children}</span>
    </li>
  );
}

export default function HRTraining() {
  return (
    <main className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B4FA8] to-[#083B7E]" />
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-56 -right-40 h-[620px] w-[620px] rounded-full bg-[#57C3E6]/20 blur-3xl" />

      {/* dots like brochure */}
      <DotGrid className="absolute top-14 left-8 h-32 w-32" />
      <DotGrid className="absolute top-14 right-10 h-32 w-32" />
      <DotGrid className="absolute bottom-16 right-10 h-36 w-36" opacity={0.18} />

      {/* HERO (from brochure cover page) */}
      <section className="relative mx-auto max-w-6xl px-4 pt-10 pb-10 md:pt-12 md:pb-12">
        <Link to="/services" className="inline-flex items-center gap-2 text-white/85 hover:text-white">
          <ArrowLeft size={18} /> Back to Services
        </Link>

        <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tFast}
              className="text-white/85 tracking-widest text-sm font-semibold"
            >
              NEMESIS GROUP
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: 0.04 } as Transition}
              className="mt-3 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight"
            >
              HR – HUMAN RESOURCE
              <br />
              CERTIFICATION COURSE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: 0.10 } as Transition}
              className="mt-4 text-lg md:text-xl text-white/85 font-semibold"
            >
              Guaranteed Interviews &amp; Placement Assurance
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: 0.16 } as Transition}
              className="mt-2 text-white/85 font-semibold"
            >
              Begin Your HR Career
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: 0.22 } as Transition}
              className="mt-6 flex flex-wrap gap-3"
            >
              <InfoPill icon={<Clock size={18} />} text="8 Weeks | Live Online Classes" />
              <InfoPill icon={<Users size={18} />} text="Mentoring & Feedback" />
              <InfoPill icon={<Briefcase size={18} />} text="Perfect for freelancers" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: 0.28 } as Transition}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#enroll"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
              >
                Enroll / Contact <ArrowRight size={18} />
              </a>
              <a
                href="#skills"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
              >
                View Skills Covered
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...t, delay: 0.34 } as Transition}
              className="mt-6 text-white/70 text-sm font-semibold tracking-wide"
            >
              Limited seats available • www.nemesisgroup.in
            </motion.div>
          </div>

          {/* visual panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: "easeOut" } as Transition}
            className="relative"
          >
            <div className="rounded-[32px] bg-white/10 border border-white/15 shadow-soft overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-6">
                  <div className="text-sm font-bold tracking-wide text-white/90">Highlights</div>
                  <ul className="mt-4 space-y-3">
                    <Bullet>Guaranteed Interviews &amp; Placement Assurance</Bullet>
                    <Bullet>Live Online Training + Practical Sessions</Bullet>
                    <Bullet>Mentoring, Feedback &amp; Doubt clearing</Bullet>
                    <Bullet>Resume building + Interview preparation</Bullet>
                  </ul>
                </div>

                <div className="p-6 pt-0 md:pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <HexImage
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                      alt="HR Training"
                      className="h-36 w-full"
                    />
                    <HexImage
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                      alt="Live Classes"
                      className="h-36 w-full"
                    />
                    <div className="col-span-2">
                      <HexImage
                        src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1200&q=80"
                        alt="Career"
                        className="h-40 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="p-6 flex flex-wrap items-center justify-between gap-3">
                <div className="text-white/85 font-semibold">Visit: www.nemesisgroup.in</div>
                <a
                  href="#enroll"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-4 py-2 font-bold shadow-soft hover:opacity-95 transition"
                >
                  Contact Now <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SKILLS COVERED (page 2) */}
      <Section
        id="skills"
        title="Skills Covered in Human Resource"
        subtitle="A complete corporate HR skill-set designed for freshers and entry-level candidates."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={t}
            className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
          >
            <div className="text-sm text-white/70 tracking-widest font-semibold">MODULES</div>
            <ul className="mt-4 space-y-3">
              {[
                "Understanding organization structure",
                "Staff Management",
                "Payroll Management",
                "Employee Hiring",
                "Recruitment",
                "Labour laws",
                "Employee Development Skills",
                "Training and Development Programs",
                "Talent Acquisition and Retention",
                "Workforce Planning and Job Analysis",
                "HR Analytics and Reporting",
                "Diversity and Inclusion in the Workplace",
                "HR Information Systems (HRIS)",
                "Organizational Behavior and Culture",
                "Leadership and Management in HR",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-white/90" />
                  <span className="text-white/85">{x}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="grid gap-5">
            <Card
              icon={<GraduationCap size={18} />}
              title="Live learning + practical exposure"
              desc="Live sessions, assignments, role plays, and HR tool exposure to build corporate readiness."
            />
            <Card
              icon={<ShieldCheck size={18} />}
              title="Certification + Placement support"
              desc="Professional resume building, interview preparation, and continuous interview support."
            />
          </div>
        </div>
      </Section>

      {/* KEY FEATURES (page 3 & 4) */}
      <Section
        id="features"
        title="Human Resource Training Key Features"
        subtitle="Built as a practical program with mentoring, assignments, recorded access, and placement assistance."
      >
        <div className="grid lg:grid-cols-3 gap-5">
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Practical Sessions"
            desc="60 hrs practical sessions and 40+ hrs practical learning, delivered by working professionals."
          />
          <Card
            icon={<Briefcase size={18} />}
            title="Placement & Interview Prep"
            desc="Assured job placement support, interview preparation, designated placement advisor."
          />
          <Card
            icon={<Users size={18} />}
            title="Learning Support"
            desc="Interactive Q&A, doubt clearing, weekly practice assignments, 1-year access to recorded sessions."
          />
        </div>

        <div className="mt-6 rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-lg font-extrabold">Online Training Schedule</div>
              <div className="mt-2 text-white/80 leading-relaxed">
                Interactive live training sessions with daily 2 hrs or weekend 10 hrs option.
                Regular assignments and assessments are included.
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <InfoPill icon={<Clock size={18} />} text="10 AM to 10 PM (support window)" />
                <InfoPill icon={<CheckCircle2 size={18} />} text="HR Certification Assistance" />
              </div>
            </div>
            <div className="rounded-3xl bg-white/8 border border-white/10 p-5">
              <div className="text-sm text-white/70 tracking-widest font-semibold">Includes</div>
              <ul className="mt-4 space-y-3">
                <Bullet>Interactive live training</Bullet>
                <Bullet>40+ hrs practical learning</Bullet>
                <Bullet>Doubt clearing sessions</Bullet>
                <Bullet>Assignments &amp; assessments</Bullet>
                <Bullet>1 year recorded access</Bullet>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* CAREER OPPORTUNITIES (page 5) */}
      <Section
        id="career"
        title="Career Opportunities After HR Training"
        subtitle="After completing HR training, candidates can pursue multiple roles across corporate HR departments and consulting firms."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={t}
            className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
          >
            <div className="text-sm text-white/70 tracking-widest font-semibold">ROLES</div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                "HR Executive",
                "Recruiter",
                "Talent Acquisition Specialist",
                "HR Coordinator",
                "Payroll Executive",
                "HR Operations Executive",
                "Employee Relations Officer",
                "Training & Development Executive",
              ].map((r) => (
                <div key={r} className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 font-semibold">
                  {r}
                </div>
              ))}
            </div>
            <div className="mt-4 text-white/80">
              This training builds strong communication, organizational, and people-management skills.
            </div>
          </motion.div>

          <div className="grid gap-5">
            <Card
              icon={<Briefcase size={18} />}
              title="Long-term growth"
              desc="Opens growth opportunities in corporate HR departments, staffing, and consulting firms."
            />
            <Card
              icon={<Users size={18} />}
              title="Confidence + professionalism"
              desc="Candidates gain confidence, professional skills, and hands-on HR knowledge for corporate readiness."
            />
          </div>
        </div>
      </Section>

      {/* PROCESS & TIMELINE (page 6 & 7) */}
      <Section
        id="timeline"
        title="Process & Timeline After HR Certification"
        subtitle="From training to joining — an average placement timeline of around 2 to 3 months, depending on performance and interview readiness."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={t}
            className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
          >
            <div className="text-sm text-white/70 tracking-widest font-semibold">STEPS</div>

            <ol className="mt-4 space-y-4">
              {[
                ["HR Training Duration (1–2 Months)", "4–8 weeks covering recruitment, HR operations, payroll basics, labour laws, compliance, and corporate practices."],
                ["Practical Exposure & Assessments (1–2 Weeks)", "Practical assignments, case studies, mock interviews, and HR tool exposure for corporate readiness."],
                ["Resume Preparation & Profile Building (3–5 Days)", "Professional HR resume + LinkedIn profile optimization and interview preparation."],
                ["Interview Scheduling (2–4 Weeks)", "Guaranteed interview calls based on skill matching and job availability through corporate network."],
                ["Interview Rounds & Selection (1–3 Weeks)", "Multiple attempts possible; continuous interview support is provided."],
                ["Placement Confirmation & Joining (1–2 Weeks)", "Offer letter, background verification, and joining formalities."],
              ].map(([h, d], idx) => (
                <li key={h} className="flex gap-3">
                  <div className="mt-1 h-8 w-8 rounded-2xl bg-white/12 border border-white/15 grid place-items-center font-extrabold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-extrabold">{h}</div>
                    <div className="mt-1 text-white/80 text-sm leading-relaxed">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          <div className="grid gap-5">
            <Card
              icon={<Clock size={18} />}
              title="Total time to get placed"
              desc="Average timeline is around 2–3 months from course start to final job joining (may vary by performance and job market)."
            />
            <Card
              icon={<ShieldCheck size={18} />}
              title="Continuous support"
              desc="Candidates who actively participate in training sessions and interview prep often secure jobs faster."
            />
          </div>
        </div>
      </Section>

      {/* WHY CHOOSE (page 9 & 10) */}
      <Section
        id="why"
        title="Why choose Nemesis Group for HR Training?"
        subtitle="Industry-oriented training with practical learning and placement support."
      >
        <div className="grid md:grid-cols-3 gap-5">
          <Card
            icon={<Briefcase size={18} />}
            title="Industry-oriented training"
            desc="Covers recruitment, HR operations, payroll basics, labour laws, compliance, and employee engagement."
          />
          <Card
            icon={<GraduationCap size={18} />}
            title="Professional certification"
            desc="Enhances credibility and job readiness."
          />
          <Card
            icon={<Users size={18} />}
            title="Experienced trainers"
            desc="Learn from working HR professionals with real corporate exposure."
          />
        </div>

        <div className="mt-5 grid md:grid-cols-3 gap-5">
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Practical learning approach"
            desc="Live cases, role plays, assignments, and corporate scenarios."
          />
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Guaranteed interviews"
            desc="Continuous interview support after training completion."
          />
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Placement assistance"
            desc="Strong corporate connections to support job placement."
          />
        </div>

        <div className="mt-8 rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft">
          <div className="text-2xl font-extrabold tracking-tight">Start your HR career with confidence</div>
          <div className="mt-2 text-white/80 leading-relaxed max-w-3xl">
            We help you gain confidence, professional skills, and hands-on HR knowledge so you can enter the corporate world prepared and assured.
            We provide a transparent, structured, career-focused training program with proper guidance and placement assistance.
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#enroll"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
            >
              Enroll Today <ArrowRight size={18} />
            </a>
            <a
              href="#enroll"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
            >
              Get Trained
            </a>
            <a
              href="#timeline"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
            >
              Get Placed
            </a>
          </div>
        </div>
      </Section>

      {/* CONTACT / ENROLL (page 11 style) */}
      <Section
        id="enroll"
        title="Enroll / Contact"
        subtitle="Call or message for batches, schedule, fee details, and placement guidance."
      >
        <div className="grid lg:grid-cols-2 gap-5 items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={t}
            className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
          >
            <div className="text-sm font-bold tracking-wide text-white/90">CONTACT</div>

            <div className="mt-5 grid gap-4 text-white/90">
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
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
              >
                View Services <ArrowRight size={18} />
              </Link>
              <a
                href="#skills"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
              >
                Skills Covered
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={t}
            className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
          >
            <div className="text-sm text-white/70 tracking-widest font-semibold">THANK YOU</div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight">Thank you for exploring</div>
            <div className="mt-2 text-white/80 leading-relaxed">
              We appreciate the trust shown by students and parents in our professional training programs.
              We are committed to industry-focused learning, practical exposure, and placement support to help freshers build confident and successful careers.
            </div>

            <div className="mt-6 rounded-3xl bg-white/8 border border-white/10 p-5">
              <div className="font-extrabold">Next step</div>
              <div className="mt-2 text-white/80 text-sm">
                Share your profile (education + location + preferred role). We’ll guide the best batch and placement path.
              </div>
              <div className="mt-4">
                <a
                  href="#enroll"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
                >
                  Contact Now <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <div className="relative h-10" />
    </main>
  );
}
