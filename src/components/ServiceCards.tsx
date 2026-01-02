import {
  Briefcase,
  
  Users,
  GraduationCap,
  Search,
  Wrench,
  ScrollText,
  
} from "lucide-react";

const services = [
  {
    title: "Payroll Services",
    slug: "payroll",
    icon: Briefcase,
    desc: "Payroll processing, salary structure, reports, payslips.",
  },
 
  {
    title: "IT Staffing",
    slug: "it-staffing",
    icon: Wrench,
    desc: "Contract / permanent IT hiring with fast turnaround.",
  },
  {
    title: "Staffing Solutions",
    slug: "staffing-solutions",
    icon: Users,
    desc: "Bulk hiring, vendor management, onsite/offsite deployment.",
  },
  {
    title: "Recruitment",
    slug: "recruitment",
    icon: Search,
    desc: "End-to-end recruitment for multiple industries.",
  },
  {
    title: "Training & Development",
    slug: "training-development",
    icon: GraduationCap,
    desc: "Soft skills, customer care, HR, finance training.",
  },
  {
    title: "HR Consulting",
    slug: "hr-consulting",
    icon: ScrollText,
    desc: "Policies, SOPs, HR process setup & optimization.",
  },
  
];

export default function ServiceCards() {
  return (
    <section
      id="services"
      className="rounded-3xl border border-[#8FB1DA]/40 bg-[#1F4F8F]/90 p-6 md:p-8 shadow-card"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Services
          </h2>
          <p className="text-[#EAF2FF] mt-1">
            All Over India • HR Services + Job Portal Ecosystem
          </p>
        </div>

        <a
          href="/jobs"
          className="hidden sm:inline-flex px-4 py-2 rounded-full bg-[#4A79B8] hover:bg-[#8FB1DA] text-white text-sm font-semibold transition"
        >
          View Jobs →
        </a>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((s) => {
          const Icon = s.icon;

          return (
            <a
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block rounded-3xl bg-[#1F4F8F]/85 border border-[#8FB1DA]/30 p-5 hover:bg-[#4A79B8]/90 transition"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#4A79B8] grid place-items-center">
                  <Icon size={18} className="text-white" />
                </div>

                <div>
                  <div className="font-semibold text-white">{s.title}</div>
                  <div className="text-sm text-[#EAF2FF] mt-1">{s.desc}</div>

                  <div className="mt-2 text-sm text-white/80 font-semibold">
                    View Details →
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
