import React, { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";
import type { DashSummary } from "../../lib/adminApi";

const Card = ({ title, value, sub }: { title: string; value: string | number; sub?: string }) => (
  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
    <div className="text-[11px] font-extrabold tracking-[0.22em] text-white/55">{title}</div>
    <div className="mt-2 text-3xl font-extrabold">{value}</div>
    {sub ? <div className="mt-1 text-sm text-white/55">{sub}</div> : null}
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState<DashSummary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const res = await adminApi.summary();
        setData(res);
      } catch (e: any) {
        setErr(e?.message || "Failed to load summary");
      }
    })();
  }, []);

  if (err) return <div className="text-sm text-red-300">{err}</div>;
  if (!data) return <div className="text-sm text-white/60">Loading...</div>;

  return (
    <div>
      <div className="text-xl font-extrabold">Dashboard</div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Card title="CUSTOMERS" value={data.totals.customers} sub={`Today: ${data.today.new_customers ?? data.today.new_users ?? 0}`} />
        <Card title="EMPLOYEES" value={data.totals.employees} sub={`Today: ${data.today.new_employees ?? 0}`} />
        <Card title="JOBS" value={data.totals.jobs} sub={`Active: ${data.totals.active_jobs ?? "-"}`} />
        <Card title="APPLICATIONS" value={data.totals.applications} sub={`Today: ${data.today.new_applications}`} />
      </div>
    </div>
  );
}
