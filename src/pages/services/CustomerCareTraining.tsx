// src/pages/CustomerTraining.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import DotGrid from "../../components/DotGrid";
import HexImage from "../../components/HexImage";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Globe,
  Mail,
  Clock,
  Headphones,
  MessageSquareText,
  ShieldCheck,
  Briefcase,
  Users,
  Sparkles,
} from "lucide-react";

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
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={t}>
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
      <div className="h-8 w-8 rounded-2xl bg-white/10 border border-white/10 grid place-items-center">{icon}</div>
      <div className="font-semibold text-white/90">{text}</div>
    </div>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={vp}
      transition={t}
      className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-2xl bg-white/12 border border-white/15 grid place-items-center">{icon}</div>
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

function RolePill({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 font-semibold">{text}</div>
  );
}

export default function CustomerTraining() {
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

      {/* HERO (cover page) */}
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
              CUSTOMER CARE
              <br />
              TRAINING
              <br />
              COURSE COVERAGE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: 0.10 } as Transition}
              className="mt-4 text-lg md:text-xl text-white/85 font-semibold"
            >
              Job-oriented training designed to equip freshers for professional customer support roles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: 0.16 } as Transition}
              className="mt-6 flex flex-wrap gap-3"
            >
              <InfoPill icon={<Clock size={18} />} text="Online Training (Daily / Weekend)" />
              <InfoPill icon={<Headphones size={18} />} text="Voice + Non-Voice Support" />
              <InfoPill icon={<ShieldCheck size={18} />} text="Interview & Placement Support" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: 0.22 } as Transition}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#enroll"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
              >
                Enroll / Contact <ArrowRight size={18} />
              </a>
              <a
                href="#coverage"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
              >
                View Course Coverage
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...t, delay: 0.28 } as Transition}
              className="mt-6 text-white/70 text-sm font-semibold tracking-wide"
            >
              Designed for freshers • Practical learning • Corporate readiness
            </motion.div>
          </div>

          {/* visual panel (brochure-like) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: "easeOut" } as Transition}
            className="relative"
          >
            <div className="rounded-[32px] bg-white/10 border border-white/15 shadow-soft overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-6">
                  <div className="text-sm font-bold tracking-wide text-white/90">Course Coverage</div>
                  <div className="mt-2 text-white/80 leading-relaxed">
                    Communication, call handling, email/chat support, problem solving, complaint handling, service
                    quality, soft skills, and practical exposure.
                  </div>

                  <ul className="mt-4 space-y-3">
                    <Bullet>Communication skills (verbal + written)</Bullet>
                    <Bullet>Inbound &amp; outbound call handling</Bullet>
                    <Bullet>Email &amp; chat support</Bullet>
                    <Bullet>Complaint &amp; escalation handling</Bullet>
                  </ul>
                </div>

                <div className="p-6 pt-0 md:pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <HexImage
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                      alt="Customer Care"
                      className="h-36 w-full"
                    />
                    <HexImage
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                      alt="Professional"
                      className="h-36 w-full"
                    />
                    <div className="col-span-2">
                      <HexImage
                        src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80"
                        alt="Support Team"
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

      {/* COURSE COVERAGE (page 2) */}
      <Section
        id="coverage"
        title="Course Coverage"
        subtitle="Our Customer Care Training Program equips freshers with practical skills required for professional customer support roles."
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
                "Communication Skills (verbal + written)",
                "Call Handling Techniques (inbound & outbound)",
                "Email & Chat Support",
                "Problem-Solving Skills",
                "Complaint Management",
                "Service Quality Standards",
                "Soft Skills Development (patience, empathy, teamwork)",
                "Practical Exposure (role plays, simulations)",
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
              icon={<MessageSquareText size={18} />}
              title="Advanced communication + customer interaction"
              desc="Build confident speaking, writing, empathy, and professional tone for real customer conversations."
            />
            <Card
              icon={<ShieldCheck size={18} />}
              title="Practical role plays + real-time scenarios"
              desc="Mock calls, email/chat templates, complaint handling, and simulations to become job-ready."
            />
          </div>
        </div>
      </Section>

      {/* KEY FEATURES (page 3) */}
      <Section
        id="features"
        title="Customer Care Professional Training – Key Features"
        subtitle="Job-oriented training with communication mastery, support process training, and placement preparation."
      >
        <div className="grid lg:grid-cols-3 gap-5">
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Call Handling + Digital Support"
            desc="Inbound/outbound calling techniques with email, chat, and digital customer support training."
          />
          <Card
            icon={<ShieldCheck size={18} />}
            title="Complaints + Escalations"
            desc="Complaint resolution, escalation handling, and service quality improvement methods."
          />
          <Card
            icon={<Users size={18} />}
            title="CRM Basics + Professionalism"
            desc="CRM tools basics, customer data handling, confidence building, and workplace professionalism."
          />
        </div>

        <div className="mt-6 rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft">
          <div className="text-lg font-extrabold">Also Includes</div>
          <ul className="mt-4 grid md:grid-cols-2 gap-3">
            {[
              "Practical role plays and real-time scenarios",
              "Problem-solving & service excellence methods",
              "Interview preparation and placement support",
              "Soft skills and confidence-building drills",
            ].map((x) => (
              <li key={x} className="flex gap-3">
                <span className="mt-1.5">
                  <CheckCircle2 size={18} className="text-white/90" />
                </span>
                <span className="text-white/85">{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ONLINE TRAINING (page 4) */}
      <Section
        id="online"
        title="Online Training"
        subtitle="Interactive live sessions with practical learning and recorded access."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={t}
            className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
          >
            <div className="text-sm text-white/70 tracking-widest font-semibold">PROGRAM</div>
            <ul className="mt-4 space-y-3">
              <Bullet>Interactive Live Training Sessions</Bullet>
              <Bullet>40+ Hrs Practical Learning</Bullet>
              <Bullet>Delivered by Working Professionals</Bullet>
              <Bullet>1 Year Access to Recorded Sessions</Bullet>
              <Bullet>Daily 2 Hrs or Weekend 10 Hrs</Bullet>
              <Bullet>Placement assistance will be provided</Bullet>
              <Bullet>Doubt clearing sessions</Bullet>
              <Bullet>Regular assignments + assessments</Bullet>
            </ul>
          </motion.div>

          <Card
            icon={<Clock size={18} />}
            title="Timing"
            desc="Support window: 10 AM to 10 PM. Choose daily batches or weekend batches as per availability."
          />
        </div>
      </Section>

      {/* CAREER OPPORTUNITIES (page 5) */}
      <Section
        id="career"
        title="Career Opportunities After Customer Care Training"
        subtitle="Open roles across BPO, corporate support, banking, e-commerce, telecom, healthcare, and hospitality."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={t}
            className="rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft"
          >
            <div className="text-sm text-white/70 tracking-widest font-semibold">INDUSTRIES</div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                "BPO & Call Center",
                "Corporate Offices & MNCs",
                "Banking & Financial Services",
                "E-Commerce & Retail",
                "Telecom & IT Services",
                "Healthcare & Insurance",
                "Travel / Hospitality / Airlines",
              ].map((r) => (
                <RolePill key={r} text={r} />
              ))}
            </div>
            <div className="mt-4 text-white/80">
              Roles include Customer Care Executive, Support Executive, Client Service/Helpdesk, Relationship Support, and more.
            </div>
          </motion.div>

          <div className="grid gap-5">
            <Card
              icon={<Briefcase size={18} />}
              title="Job-ready outcomes"
              desc="Training focuses on customer handling, service quality, and professional communication for fast hiring readiness."
            />
            <Card
              icon={<Headphones size={18} />}
              title="Voice & Non-Voice support"
              desc="Voice process + chat/email support skills for wide opportunity coverage."
            />
          </div>
        </div>
      </Section>

      {/* PROCESS & TIMELINE (page 7) */}
      <Section
        id="timeline"
        title="Process & Timeline After Customer Care Certification"
        subtitle="From course start to job joining: typically 1.5 to 2.5 months (depends on batch + interview performance)."
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
                ["Training Duration (3–6 Weeks)", "Communication, call handling, support process, email/chat etiquette, complaint handling, professionalism."],
                ["Practical Exposure & Assessments (1 Week)", "Mock calls, role plays, live scenarios, assessments to ensure job readiness."],
                ["Resume Preparation & Profile Building (3–5 Days)", "Professional resume + interview behavior and communication improvement guidance."],
                ["Interview Scheduling (2–4 Weeks)", "Guaranteed interview calls through corporate and BPO network."],
                ["Interview Rounds & Selection (1–3 Weeks)", "Multiple interview attempts supported until placement."],
                ["Offer Letter & Joining (3–7 Days)", "Offer letter, documentation, and joining formalities."],
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
              desc="Average placement time is 1.5–2.5 months including training, practice, resume prep, interviews, and selection."
            />
            <Card
              icon={<ShieldCheck size={18} />}
              title="What affects timeline?"
              desc="Communication skills, interview performance, and current hiring demand in customer care industry."
            />
          </div>
        </div>
      </Section>

      {/* BUILD A SUCCESSFUL CAREER (page 9) */}
      <Section
        id="success"
        title="Build a Successful Career in Customer Care"
        subtitle="Customer care offers scalable career progression with cross-industry demand and long-term stability."
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Card
            icon={<Sparkles size={18} />}
            title="Growth & stability"
            desc="Structured training supports long-term employment stability and growth across industries."
          />
          <Card
            icon={<ShieldCheck size={18} />}
            title="High-value skill development"
            desc="Advanced communication, service excellence, and leadership skills enable progress into QA, training, management, and customer success."
          />
        </div>

        <div className="mt-6 rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft">
          <div className="text-lg font-extrabold">Core strengths you build</div>
          <ul className="mt-4 grid md:grid-cols-3 gap-3">
            {["Clear & confident communication", "Smart problem handling", "Growth-oriented career path"].map((x) => (
              <li key={x} className="flex gap-3">
                <span className="mt-1.5">
                  <CheckCircle2 size={18} className="text-white/90" />
                </span>
                <span className="text-white/85">{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* WHY CHOOSE (page 10) */}
      <Section
        id="why"
        title="Why choose Nemesis Group for Customer Care Training?"
        subtitle="Industry-focused curriculum, practical learning, and placement support."
      >
        <div className="grid md:grid-cols-3 gap-5">
          <Card
            icon={<ShieldCheck size={18} />}
            title="Industry-Focused Curriculum"
            desc="Communication, call handling, complaint resolution, and service excellence aligned to corporate needs."
          />
          <Card
            icon={<Users size={18} />}
            title="Experienced Trainers"
            desc="Learn from working customer care professionals with hands-on industry exposure."
          />
          <Card
            icon={<Headphones size={18} />}
            title="Practical & Interactive Learning"
            desc="Live sessions, role plays, mock calls, and real-world scenarios ensure job readiness."
          />
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-5">
          <Card
            icon={<CheckCircle2 size={18} />}
            title="Certification & Placement Support"
            desc="Professional certification plus guaranteed interview opportunities and placement assistance."
          />
          <Card
            icon={<Clock size={18} />}
            title="Flexible Online Training"
            desc="Daily or weekend batches with 1-year access to recorded sessions for revision."
          />
        </div>

        <div className="mt-6 rounded-3xl bg-white/10 border border-white/15 p-6 shadow-soft">
          <div className="text-2xl font-extrabold tracking-tight">Strategic Career Advancement</div>
          <div className="mt-2 text-white/80 leading-relaxed max-w-3xl">
            Cultivate advanced communication, leadership, and workplace acumen while leveraging Nemesis Group’s corporate network for premium interview opportunities and assured placement in customer care roles.
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#enroll"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#0B4FA8] px-5 py-3 font-bold shadow-soft hover:opacity-95 transition"
            >
              Enroll Today <ArrowRight size={18} />
            </a>
            <a
              href="#timeline"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
            >
              Placement Timeline
            </a>
          </div>
        </div>
      </Section>

      {/* ENROLL / CONTACT + THANK YOU (page 11 & 12) */}
      <Section
        id="enroll"
        title="Enroll / Contact"
        subtitle="Call or message for batch schedule, fee details, and placement guidance."
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
                <div className="font-semibold">flexicare@nemesisgroup.in</div>
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
                href="#coverage"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/12 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15 transition"
              >
                Course Coverage
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
            <div className="mt-3 text-2xl font-extrabold tracking-tight">Thank you for choosing Nemesis Group</div>
            <div className="mt-2 text-white/80 leading-relaxed">
              Our programs combine practical learning, professional certification, and placement support—ensuring candidates are equipped to excel in competitive customer care roles.
            </div>

            <div className="mt-6 rounded-3xl bg-white/8 border border-white/10 p-5">
              <div className="font-extrabold">Next step</div>
              <div className="mt-2 text-white/80 text-sm">
                Share your education, location, and preferred role (Voice/Non-Voice). We’ll guide the best batch and placement path.
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
