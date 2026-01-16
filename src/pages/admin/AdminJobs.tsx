import React, { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";
import type { JobRow } from "../../lib/adminApi";

export default function AdminJobs() {
  const [q, setQ] = useState("");
  const [onlyActive, setOnlyActive] = useState<boolean | undefined>(undefined);
  const [rows, setRows] = useState<JobRow[]>([]);
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async (p = page) => {
    setLoading(true);
    try {
      setErr(null);
      const res = await adminApi.jobs({ q, page: p, limit: 20, is_active: onlyActive });
      setRows(res.data);
      setPage(res.current_page);
      setLast(res.last_page);
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); /* eslint-disable-next-line */ }, []);

  const toggleActive = async (job: JobRow) => {
    const next = !job.is_active;
    await adminApi.setJobActive(job.id, next);
    setRows((prev) => prev.map((x) => (x.id === job.id ? { ...x, is_active: next } : x)));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xl font-extrabold">Jobs</div>
        <div className="flex flex-wrap gap-2">
          <input
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title/location/company"
          />
          <select
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            value={onlyActive === undefined ? "all" : onlyActive ? "active" : "inactive"}
            onChange={(e) => {
              const v = e.target.value;
              setOnlyActive(v === "all" ? undefined : v === "active");
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={() => load(1)} className="rounded-xl bg-white text-black px-3 py-2 text-sm font-extrabold">
            Search
          </button>
        </div>
      </div>

      {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
      {loading ? <div className="mt-3 text-sm text-white/60">Loading...</div> : null}

      <div className="mt-4 overflow-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Apps</th>
              <th className="p-3 text-left">Active</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-3">{r.id}</td>
                <td className="p-3 font-semibold">{r.title ?? "-"}</td>
                <td className="p-3">{r.company_name ?? "-"}</td>
                <td className="p-3">{r.location ?? "-"}</td>
                <td className="p-3">{r.applications_count ?? "-"}</td>
                <td className="p-3">
                  <span className={`rounded-lg px-2 py-1 text-xs font-bold ${r.is_active ? "bg-green-500/15 text-green-200" : "bg-white/10 text-white/60"}`}>
                    {r.is_active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleActive(r)}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-extrabold hover:bg-white/15"
                  >
                    {r.is_active ? "Disable" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td className="p-3 text-white/60" colSpan={7}>No data</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <button disabled={page <= 1} onClick={() => load(page - 1)} className="rounded-xl border border-white/10 px-3 py-2 disabled:opacity-50">
          Prev
        </button>
        <div className="text-white/60">Page {page} / {last}</div>
        <button disabled={page >= last} onClick={() => load(page + 1)} className="rounded-xl border border-white/10 px-3 py-2 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
}
