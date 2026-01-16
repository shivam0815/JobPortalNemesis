import React, { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";
import type { ApplicationRow } from "../../lib/adminApi";
const STATUS = ["applied", "viewed", "shortlisted", "rejected", "hired"];

export default function AdminApplications() {
  const [status, setStatus] = useState<string>("");
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async (p = page) => {
    setLoading(true);
    try {
      setErr(null);
      const res = await adminApi.applications({ status: status || undefined, page: p, limit: 20 });
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

  const changeStatus = async (id: number, next: string) => {
    await adminApi.setApplicationStatus(id, next);
    setRows((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xl font-extrabold">Applications</div>
        <div className="flex gap-2">
          <select
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            value={status || "all"}
            onChange={(e) => setStatus(e.target.value === "all" ? "" : e.target.value)}
          >
            <option value="all">All</option>
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => load(1)} className="rounded-xl bg-white text-black px-3 py-2 text-sm font-extrabold">
            Filter
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
              <th className="p-3 text-left">Candidate</th>
              <th className="p-3 text-left">Job</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Resume</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-3">{r.id}</td>
                <td className="p-3">
                  <div className="font-semibold">{r.candidate?.name ?? r.candidate_id}</div>
                  <div className="text-xs text-white/60">{r.candidate?.email ?? ""}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold">{r.job?.title ?? r.job_id}</div>
                  <div className="text-xs text-white/60">{r.job?.company_name ?? ""}</div>
                </td>
                <td className="p-3">
                  <span className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold">{r.status}</span>
                </td>
                <td className="p-3">
                  {r.resume_url ? (
                    <a className="text-xs underline text-white/80" href={r.resume_url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  ) : (
                    <span className="text-xs text-white/50">-</span>
                  )}
                </td>
                <td className="p-3">
                  <select
                    className="rounded-xl border border-white/10 bg-black/30 px-2 py-2 text-xs outline-none"
                    value={r.status}
                    onChange={(e) => changeStatus(r.id, e.target.value)}
                  >
                    {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td className="p-3 text-white/60" colSpan={6}>No data</td></tr>
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
