// src/pages/Services.tsx
import {
  
  
  
  
  Search as 
  GraduationCap,
  ScrollText,
  Landmark,
  Users,
  BriefcaseBusiness,
  Handshake,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

type Svc = {
  title: string;
  slug: string;
  icon: any;
  short: string;
  points: string[];
};

const services: Svc[] = [
  {
    title: "Customer Care & Training",
    slug: "customer-care-training",
    icon: GraduationCap,
    short: "Soft skills, customer care, HR, finance training.",
    points: ["Soft skills", "Customer care training", "HR training", "Finance basics"],
  },
  {
    title: "HR Training",
    slug: "hr-consulting",
    icon: ScrollText,
    short: "Policies, SOPs, HR process setup & optimization.",
    points: ["HR policies & SOPs", "Process setup", "Performance framework", "HR audits"],
  },

  // New 4 services from image
  {
    title: "Banking & Finance Training",
    slug: "banking-finance-training",
    icon: Landmark,
    short: "Core banking knowledge, finance fundamentals & industry readiness.",
    points: ["Banking fundamentals", "Financial literacy", "NBFC insights", "Interview prep for BFSI"],
  },
  {
    title: "Soft Skills & Skill Development",
    slug: "soft-skills-development",
    icon: Users,
    short: "Communication, behavioral skills, and professional personality training.",
    points: ["Communication skills", "Personality development", "Behavioral training", "Corporate etiquette"],
  },
  {
    title: "Practical Industry Training",
    slug: "practical-industry-training",
    icon: BriefcaseBusiness,
    short: "Hands-on, real-world training designed for industry workflows.",
    points: ["Live projects", "Industry case studies", "Role-based training", "Job readiness"],
  },
  {
    title: "Placement Support Services",
    slug: "placement-support",
    icon: Handshake,
    short: "Guaranteed interview support & placement guidance.",
    points: ["Resume building", "Mock interviews", "Job referrals", "Placement assistance"],
  },
];


const card =
  "rounded-3xl border border-white/10 bg-white/6 shadow-card p-6 md:p-8";
const tile =
  "rounded-3xl bg-white/6 border border-white/10 hover:bg-white/8 transition p-5";

export default function Services() {
  return (
    <main className="container-x py-10">
      {/* Header */}
      <section className={card}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/12 text-sm">
              <CheckCircle2 size={16} />
              All Over India • HR Services
            </div>
            <h1 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight">
              Services
            </h1>
            <p className="mt-2 text-white/75 max-w-3xl leading-relaxed">
              Guaranteed Interviews & Placement Assurance
              
              Choose a service to view details and enquiry options.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition text-center"
            >
              Browse Jobs
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/15 transition font-semibold text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.slug} className={tile}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/12 grid place-items-center">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-lg">{s.title}</div>
                  <div className="text-sm text-white/75 mt-1">{s.short}</div>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {s.points.slice(0, 4).map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-white/40 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex gap-3">
                {/* ✅ detail page via slug */}
                <Link
                  to={`/services/${s.slug}`}
                  className="flex-1 px-4 py-2 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition inline-flex items-center justify-center gap-2"
                >
                  View Details <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition text-sm font-semibold"
                >
                  Enquiry
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className={"mt-8 " + card}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold">Need help choosing a service?</h3>
            <p className="text-white/75 mt-1">
              Share your requirement and our team will connect with you.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-full bg-white text-[#061433] font-extrabold hover:opacity-95 transition text-center"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
