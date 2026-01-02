import { useParams, Link } from "react-router-dom";

const SERVICES: Record<string, { title: string; desc: string; points: string[] }> = {
  payroll: {
    title: "Payroll Services",
    desc: "End-to-end payroll management for organizations across India.",
    points: [
      "Salary processing & payslips",
      "Attendance & leave integration",
      "Statutory deductions",
      "Monthly & annual reports",
    ],
  },
  "statutory-compliance": {
    title: "Statutory Compliance",
    desc: "PF, ESI and labour law compliance handled professionally.",
    points: [
      "PF / ESI filings",
      "Labour law compliance",
      "Audit & documentation support",
      "Penalty risk reduction",
    ],
  },
  "it-staffing": {
    title: "IT Staffing",
    desc: "Fast and reliable IT hiring for startups and enterprises.",
    points: [
      "Contract & permanent hiring",
      "Verified technical profiles",
      "Quick turnaround time",
      "Pan India availability",
    ],
  },
  "staffing-solutions": {
    title: "Staffing Solutions",
    desc: "Bulk hiring and workforce management solutions.",
    points: [
      "Bulk recruitment",
      "Vendor management",
      "Onsite / offsite staffing",
      "Flexible workforce models",
    ],
  },
  recruitment: {
    title: "Recruitment",
    desc: "End-to-end recruitment across multiple industries.",
    points: [
      "Candidate screening",
      "Interview coordination",
      "Offer & onboarding support",
      "Industry-focused hiring",
    ],
  },
  "training-development": {
    title: "Training & Development",
    desc: "Skill enhancement and professional training programs.",
    points: [
      "Soft skills training",
      "Customer care training",
      "HR & finance training",
      "Industry-oriented programs",
    ],
  },
  "hr-consulting": {
    title: "HR Consulting",
    desc: "HR policy, SOP and process consulting services.",
    points: [
      "HR policy drafting",
      "SOP creation",
      "Process optimization",
      "Compliance-ready HR setup",
    ],
  },
  "executive-search": {
    title: "Executive Search",
    desc: "Leadership hiring with strict screening standards.",
    points: [
      "CXO & leadership hiring",
      "Confidential search",
      "Quality-focused screening",
      "Long-term role matching",
    ],
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES[slug || ""];

  if (!service) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="text-3xl font-extrabold">Service Not Found</h1>
        <Link to="/" className="mt-4 inline-block underline">Go Home</Link>
      </div>
    );
  }

  return (
    <main className="container-x py-14">
      <div className="rounded-3xl bg-white/5 border border-white/12 shadow-card p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">{service.title}</h1>
        <p className="text-white/75 mt-2 max-w-2xl">{service.desc}</p>

        <ul className="mt-6 grid md:grid-cols-2 gap-3">
          {service.points.map((p) => (
            <li
              key={p}
              className="rounded-2xl bg-white/6 border border-white/12 px-4 py-3"
            >
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex gap-3">
          <Link
            to="/jobs"
            className="px-5 py-3 rounded-full bg-white text-[#083B7E] font-extrabold hover:opacity-95"
          >
            View Jobs
          </Link>
          <Link
            to="/auth"
            className="px-5 py-3 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 font-semibold"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
