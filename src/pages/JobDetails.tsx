import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, BadgeIndianRupee, Briefcase, Clock } from "lucide-react";

const mockJobs = [
  {
    id: "1",
    title: "HR Executive",
    type: "Office",
    exp: "Fresher",
    salary: "₹18k - ₹25k",
    location: "Delhi",
    desc:
      "HR operations, onboarding, documentation, employee coordination, attendance handling, basic payroll support.",
  },
  {
    id: "2",
    title: "Customer Care Associate",
    type: "WFH",
    exp: "Experienced",
    salary: "₹22k - ₹32k",
    location: "Noida",
    desc:
      "Handle calls, CRM updates, customer complaint resolution, escalation handling, follow-up support.",
  },
  {
    id: "3",
    title: "Banking Sales Officer",
    type: "Office",
    exp: "Experienced",
    salary: "₹25k - ₹45k",
    location: "Mumbai",
    desc:
      "Sales closure, lead follow-up, relationship management, targets, reporting and documentation.",
  },
];

export default function JobDetails() {
  const { id } = useParams();
  const job = useMemo(() => mockJobs.find((j) => j.id === id) ?? mockJobs[0], [id]);

  const [applied, setApplied] = useState(false);

  return (
    <main className="container-x py-10">
      <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
          <ArrowLeft size={18} /> Back to Jobs
        </Link>

        <div className="mt-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{job.title}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-1">
                <Briefcase size={16} /> {job.type}
              </span>
              <span className="inline-flex items-center gap-1">
                <BadgeIndianRupee size={16} /> {job.salary}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={16} /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={16} /> {job.exp}
              </span>
            </div>

            <div className="mt-6 rounded-3xl bg-white/5 border border-white/12 p-5">
              <div className="font-bold">Job Description</div>
              <p className="text-white/75 text-sm mt-2 leading-relaxed">{job.desc}</p>

              <div className="mt-5 grid md:grid-cols-2 gap-3 text-sm">
                {[
                  ["Job Title", job.title],
                  ["Job Type", job.type],
                  ["Experience", job.exp],
                  ["Salary", job.salary],
                  ["Location", job.location],
                  ["Status", "Open"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white/5 border border-white/12 px-4 py-3">
                    <div className="text-white/70 text-xs">{k}</div>
                    <div className="font-semibold">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:w-[420px] w-full">
            <div className="rounded-3xl bg-white/5 border border-white/12 p-6">
              <div className="text-lg font-extrabold">Apply Now</div>
              <p className="text-white/75 text-sm mt-1">
                Candidate profile + resume required. Track status in dashboard.
              </p>

              <div className="mt-4 grid gap-3">
                <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Full Name" />
                <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Mobile Number" />
                <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="Email" />
                <input className="h-11 rounded-2xl bg-white/8 border border-white/12 px-4 text-sm outline-none focus:border-white/25" placeholder="City" />

                <div className="rounded-2xl bg-white/8 border border-white/12 p-4 text-sm text-white/75">
                  Resume Upload (UI) — Choose file / drag-drop
                </div>

                <button
                  onClick={() => setApplied(true)}
                  disabled={applied}
                  className={
                    "h-11 rounded-full font-semibold transition " +
                    (applied
                      ? "bg-white/10 border border-white/12 text-white/70 cursor-not-allowed"
                      : "bg-white text-[#061433] hover:opacity-95")
                  }
                >
                  {applied ? "Applied" : "Submit Application"}
                </button>

                <div className="text-xs text-white/65">
                  Note: Basic Email/WhatsApp notifications will be triggered after status update.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
