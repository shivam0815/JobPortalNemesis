export default function AdminDashboard() {
  return (
    <main className="container-x py-10">
      <div className="rounded-3xl border border-white/10 bg-white/6 p-6 md:p-8 shadow-card">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-white/75 mt-2">Approve/Reject jobs • Manage users • Manage service pages • Notifications</p>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          {[
            ["Pending Jobs", "12"],
            ["Total Candidates", "2,450"],
            ["Total Employers", "310"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl bg-white/6 border border-white/10 p-5">
              <div className="text-white/70 text-sm">{k}</div>
              <div className="text-3xl font-extrabold mt-1">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl bg-white/6 border border-white/10 p-5">
            <h2 className="text-lg font-bold">Job Approvals</h2>
            <div className="mt-4 space-y-3">
              {[
                ["HR Executive", "Delhi", "Office"],
                ["IT Support", "Pune", "WFH"],
              ].map(([t, city, type]) => (
                <div key={t} className="rounded-3xl bg-white/6 border border-white/10 p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-white/70">{city} • {type}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-full bg-white text-[#0B2B6B] font-semibold">Approve</button>
                    <button className="px-4 py-2 rounded-full bg-white/10 border border-white/12">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white/6 border border-white/10 p-5">
            <h2 className="text-lg font-bold">Manage Service Pages</h2>
            <div className="mt-4 space-y-3">
              {[
                "Payroll Services",
                "Statutory Compliance",
                "IT Staffing",
                "Recruitment",
              ].map((s) => (
                <div key={s} className="rounded-3xl bg-white/6 border border-white/10 p-4 flex items-center justify-between">
                  <div className="font-semibold">{s}</div>
                  <button className="px-4 py-2 rounded-full bg-white/10 border border-white/12">Edit</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
