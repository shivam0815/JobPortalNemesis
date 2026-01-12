import { Link } from "react-router-dom";
import { MapPin, BadgeIndianRupee, Briefcase, ArrowRight, Clock } from "lucide-react";

type Job = {
  id: number | string;
  title?: string;
  location?: string;

  // backend fields
  job_type?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  total_experience?: string | null;
  description?: string | null;

  // fallback (old mock)
  type?: string;
  salary?: string;
  exp?: string;
  desc?: string;
};

const fmtMoney = (n?: number | null) => {
  if (n === null || n === undefined) return "";
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return String(n);
  }
};

const salaryLabel = (j: Job) => {
  // Prefer backend numeric salary
  if (j.salary_min != null || j.salary_max != null) {
    const a = j.salary_min != null ? `₹${fmtMoney(j.salary_min)}` : "";
    const b = j.salary_max != null ? `₹${fmtMoney(j.salary_max)}` : "";
    if (a && b) return `${a} - ${b}`;
    return a || b || "—";
  }
  // Fallback to old string salary
  return j.salary ?? "—";
};

export default function JobCard({ job }: { job: Job }) {
  const type = job.job_type ?? job.type ?? "—";
  const exp = job.total_experience ?? job.exp ?? "—";
  const sal = salaryLabel(job);
  const desc = job.description ?? job.desc ?? "";

  return (
    <div className="rounded-3xl bg-white/6 border border-white/10 p-5 hover:bg-white/8 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-bold">{job.title ?? "Untitled Job"}</div>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-1">
              <Briefcase size={16} /> {type}
            </span>
            <span className="inline-flex items-center gap-1">
              <BadgeIndianRupee size={16} /> {sal}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={16} /> {job.location ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={16} /> {exp}
            </span>
          </div>

          <p className="text-white/70 text-sm mt-3 line-clamp-2">{desc || "—"}</p>
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="shrink-0 inline-flex items-center gap-2 rounded-3xl bg-white/5 border border-white/12 px-4 py-3 hover:bg-white/7 transition"
        >
          View <ArrowRight size={16} />
        </Link>
      </div>

      {/* ✅ Removed Google Form link. Apply happens on JobDetails page */}
      <div className="mt-4 flex items-center justify-end text-sm">
        <Link
          to={`/jobs/${job.id}`}
          className="px-4 py-2 rounded-full bg-white text-[#061433] font-semibold hover:opacity-95 transition"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
