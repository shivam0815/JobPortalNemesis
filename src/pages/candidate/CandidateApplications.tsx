const applied = [
  { title: "HR Executive", city: "Delhi", status: "Applied" },
  { title: "Customer Care Associate", city: "Noida", status: "Selected" },
  { title: "Banking Sales Officer", city: "Mumbai", status: "Rejected" },
];

const badge = (s: string) => {
  if (s === "Selected") return "bg-white text-[#083B7E]";
  if (s === "Rejected") return "bg-white/10 border border-white/12 text-white/85";
  return "bg-white/10 border border-white/12 text-white/85";
};

export default function CandidateApplications() {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/5 shadow-card p-6 md:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Applications</h1>
          <p className="text-white/70 mt-1">Track your application status.</p>
        </div>
        <div className="text-sm text-white/70">{applied.length} total</div>
      </div>

      <div className="mt-6 space-y-3">
        {applied.map((a) => (
          <div
            key={a.title}
            className="rounded-3xl bg-white/6 border border-white/12 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div>
              <div className="font-extrabold">{a.title}</div>
              <div className="text-sm text-white/70">{a.city}</div>
            </div>

            <span className={"px-4 py-2 rounded-full text-sm font-semibold " + badge(a.status)}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
