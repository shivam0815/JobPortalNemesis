import React from "react";
import { motion, type Transition } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
 
  Globe,
  Mail,
  ArrowRight,
  ShieldCheck,
  Users,
  Briefcase,
} from "lucide-react";

/**
 * ✅ FIX for TS error:
 * Framer Motion expects `ease` as a typed tuple (4 numbers) or valid easing.
 * We provide a properly typed cubic-bezier tuple.
 */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.75,
    delay: d,
    ease: EASE,
  } satisfies Transition,
});

function Hex({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-[26px] bg-gradient-to-br from-white/35 to-white/5 blur-[1px]" />
      <div className="relative rounded-[26px] bg-[#1F4F8F]/55 border border-[#8FB1DA]/35 shadow-soft p-3">
        <div className="rounded-2xl overflow-hidden bg-[#4A79B8]/25 border border-white/10">
          {children}
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  k,
  v,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  k: string;
  v: string;
}) {
  return (
    <div className="rounded-3xl bg-[#1F4F8F]/55 border border-[#8FB1DA]/30 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-[#4A79B8] grid place-items-center border border-white/10">
          <Icon size={18} className="text-white" />
        </div>
        <div>
          <div className="text-xs text-white/80">{k}</div>
          <div className="text-lg font-extrabold text-white leading-tight">{v}</div>
        </div>
      </div>
    </div>
  );
}

export default function HeroNemesis() {
  return (
    <section className="relative overflow-hidden">
      {/* ✅ BG SAME (no change) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F4F8F] via-[#4A79B8] to-[#8FB1DA]" />
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* corner dot blocks like poster */}
      <div className="absolute top-10 left-10 h-28 w-28 dot-grid opacity-45 rounded-3xl" />
      <div className="absolute top-10 right-10 h-28 w-28 dot-grid opacity-45 rounded-3xl" />
      <div className="absolute bottom-10 right-10 h-28 w-28 dot-grid opacity-45 rounded-3xl" />

      {/* soft vignette + glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-white/12 blur-3xl" />

      <div className="relative container-x pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div>
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/12 border border-white/15"
            >
              <Sparkles size={16} />
              <span className="text-sm text-white/90">
                Job Portal • HR Services • Training & Development
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-white"
            >
              NEMESIS GROUP
              <span className="block text-white/95 mt-2">
                Hire Faster. Train Better. Stay Compliant.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="mt-4 text-white/85 text-lg max-w-xl leading-relaxed"
            >
              All Over India • Payroll • Compliance • IT Staffing • Recruitment • Training & Development • Executive Search
            </motion.p>

            <motion.div {...fadeUp(0.22)} className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="/jobs"
                className="px-6 py-3 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition inline-flex items-center justify-center gap-2"
              >
                Browse Jobs <ArrowRight size={18} />
              </a>
              <a
                href="/auth"
                className="px-6 py-3 rounded-full bg-white/12 border border-white/15 hover:bg-white/15 transition font-semibold text-white inline-flex items-center justify-center"
              >
                Candidate / Employer Login
              </a>
            </motion.div>

            <motion.div {...fadeUp(0.28)} className="mt-7 grid sm:grid-cols-2 gap-3">
              {[
                "Policy-based interview scheduling",
                "Placement assistance support",
                "Application status tracking",
                "Basic WhatsApp/Email updates",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 size={18} className="opacity-95" />
                  <span className="text-sm">{t}</span>
                </div>
              ))}
            </motion.div>

            <motion.div {...fadeUp(0.34)} className="mt-7 grid sm:grid-cols-3 gap-3">
              <Metric icon={Briefcase} k="Services" v="8+ HR Modules" />
              <Metric icon={Users} k="Coverage" v="All India" />
              <Metric icon={ShieldCheck} k="Compliance" v="Audit Ready" />
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="mt-7 flex flex-wrap gap-4 text-sm text-white/90">
              
              <div className="inline-flex items-center gap-2">
                <Globe size={16} /> nemesisgroup.in
              </div>
              <div className="inline-flex items-center gap-2">
                <Mail size={16} /> flexicare@nemesisgroup.in
              </div>
            </motion.div>
          </div>

          {/* Right: Unsplash tiles */}
          <motion.div {...fadeUp(0.12)} className="relative">
            <div className="absolute -inset-6 rounded-[42px] bg-white/6 border border-white/12" />
            <div className="relative p-6 md:p-8">
              <div className="grid grid-cols-2 gap-4">
  {/* Training & Development */}
  <Hex>
    <div className="relative h-40 md:h-44">
      <img
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
        alt="Training & Development"
        className="h-full w-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute bottom-3 left-3 right-3">
        <div className="text-white font-extrabold">Training & Development</div>
        <div className="text-white/80 text-xs">Soft Skills • Customer Care</div>
      </div>
    </div>
  </Hex>

  {/* HR Services */}
  <Hex>
    <div className="relative h-40 md:h-44">
      <img
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
        alt="HR Services"
        className="h-full w-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute bottom-3 left-3 right-3">
        <div className="text-white font-extrabold">HR Services</div>
        <div className="text-white/80 text-xs">Payroll • Compliance • Consulting</div>
      </div>
    </div>
  </Hex>

  {/* Payroll & Compliance */}
  <Hex>
    <div className="relative h-40 md:h-44">
      <img
        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"
        alt="Payroll & Compliance"
        className="h-full w-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute bottom-3 left-3 right-3">
        <div className="text-white font-extrabold">Payroll & Compliance</div>
        <div className="text-white/80 text-xs">PF/ESI • Audits • Statutory</div>
      </div>
    </div>
  </Hex>

  {/* IT Staffing */}
<Hex>
  <div className="relative h-40 md:h-44">
    <img
      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
      alt="IT Staffing"
      className="h-full w-full object-cover"
      loading="lazy"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src =
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80";
      }}
    />
    <div className="absolute inset-0 bg-black/35" />
    <div className="absolute bottom-3 left-3 right-3">
      <div className="text-white font-extrabold">IT Staffing</div>
      <div className="text-white/80 text-xs">
        Developers • Support • Infrastructure
      </div>
    </div>
  </div>
</Hex>


  {/* Recruitment & Staffing (wide) */}
  <div className="col-span-2">
    <Hex>
      <div className="relative h-44 md:h-48">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
          alt="Recruitment & Staffing"
          className="h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white font-extrabold text-lg">Recruitment & Staffing</div>
          <div className="text-white/80 text-sm">
            Bulk Hiring • Executive Search • Pan-India
          </div>
        </div>
      </div>
    </Hex>
  </div>
</div>


              {/* Feature strip */}
              <div className="mt-5 rounded-3xl bg-[#1F4F8F]/55 border border-[#8FB1DA]/35 p-4">
                <div className="text-sm font-extrabold text-white">Follow Company + Group Chat</div>
                <div className="text-white/85 text-sm mt-1">
                  Role-based follow, job alerts, and group chat rooms (UI ready; backend later).
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href="/candidate"
                    className="flex-1 px-4 py-2 rounded-full bg-white text-[#061433] font-extrabold text-sm hover:opacity-95 transition text-center"
                  >
                    Create Profile
                  </a>
                  <a
                    href="/services/hr-consulting"
                    className="flex-1 px-4 py-2 rounded-full bg-white/12 border border-white/15 hover:bg-white/15 transition text-sm font-semibold text-center text-white"
                  >
                    Explore Services
                  </a>
                </div>
              </div>

              <div className="mt-4 text-xs text-white/85">
                Tip: Candidates can track application status inside Candidate Dashboard.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
