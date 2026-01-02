import { Link } from "react-router-dom";
import { MapPin, BadgeIndianRupee, Briefcase, ArrowRight } from "lucide-react";

export default function JobCard({ job }: { job: any }) {
  return (
    <div className="rounded-3xl bg-white/6 border border-white/10 p-5 hover:bg-white/8 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-bold">{job.title}</div>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-1"><Briefcase size={16} /> {job.type}</span>
            <span className="inline-flex items-center gap-1"><BadgeIndianRupee size={16} /> {job.salary}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
          </div>
          <p className="text-white/70 text-sm mt-3 line-clamp-2">{job.desc}</p>
        </div>

        <Link
          to={`/jobs/${job.id}`}
className="rounded-3xl bg-white/5 border border-white/12 p-5 hover:bg-white/7 transition"
        >
          View <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-white/75">Experience: <span className="text-white">{job.exp}</span></div>
        <button className="px-4 py-2 rounded-full bg-white/10 border border-white/12 hover:bg-white/12 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
}
