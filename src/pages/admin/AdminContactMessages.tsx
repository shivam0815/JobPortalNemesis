// src/pages/admin/AdminContactMessages.tsx
// UI aligned with AdminEmployees (simple header + search bar, table/list feel, clean spacing)

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { adminApi } from "../../lib/adminApi";
import type { ContactMessageRow, ContactStatus } from "../../lib/adminApi";

const badgeBase =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-extrabold";

function StatusBadge({ s }: { s: ContactStatus }) {
  if (s === "new") return <span className={badgeBase}><Clock size={14} /> NEW</span>;
  if (s === "read") return <span className={badgeBase}><Eye size={14} /> READ</span>;
  if (s === "replied") return <span className={badgeBase}><CheckCircle2 size={14} /> REPLIED</span>;
  return <span className={badgeBase}><XCircle size={14} /> CLOSED</span>;
}

function fmt(dt?: string | null) {
  if (!dt) return "-";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return String(dt);
  }
}

export default function AdminContactMessages() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ContactStatus | "">("");

  const [rows, setRows] = useState<ContactMessageRow[]>([]);
  const [selected, setSelected] = useState<ContactMessageRow | null>(null);

  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { new: 0, read: 0, replied: 0, closed: 0 };
    for (const r of rows) {
      if (r.status === "new") c.new += 1;
      else if (r.status === "read") c.read += 1;
      else if (r.status === "replied") c.replied += 1;
      else c.closed += 1;
    }
    return c;
  }, [rows]);

  const load = async (keepSelection = true) => {
    setLoading(true);
    try {
      setErr(null);
      const res = await adminApi.contactMessages({
        q: q || undefined,
        status: status || undefined,
        limit: 50,
      });

      const list = res?.data || [];
      setRows(list);

      if (!keepSelection) setSelected(null);
      else if (selected) {
        const found = list.find((x) => x.id === selected.id);
        if (found) setSelected((prev) => ({ ...(prev as any), ...found }));
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const openOne = async (id: number) => {
    try {
      setErr(null);
      const res = await adminApi.contactMessage(id);
      const msg = res?.data;
      setSelected(msg);

      setRows((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: msg.status, read_at: msg.read_at } : x))
      );
    } catch (e: any) {
      setErr(e?.message || "Failed to open message");
    }
  };

  const setOneStatus = async (next: ContactStatus) => {
    if (!selected) return;
    setActing(true);
    try {
      setErr(null);
      const res = await adminApi.setContactMessageStatus(selected.id, next);
      const msg = res?.data;
      setSelected(msg);
      setRows((prev) => prev.map((x) => (x.id === msg.id ? { ...x, status: msg.status } : x)));
    } catch (e: any) {
      setErr(e?.message || "Failed to update status");
    } finally {
      setActing(false);
    }
  };

  const deleteOne = async () => {
    if (!selected) return;
    const ok = confirm("Delete this message?");
    if (!ok) return;

    setActing(true);
    try {
      setErr(null);
      await adminApi.deleteContactMessage(selected.id);
      setRows((prev) => prev.filter((x) => x.id !== selected.id));
      setSelected(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to delete message");
    } finally {
      setActing(false);
    }
  };

  return (
    <div>
      {/* Header like AdminEmployees */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xl font-extrabold">Contact Messages</div>

        <div className="flex gap-2">
          <div className="relative">
            <input
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 pr-9 text-sm outline-none"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name/email/subject"
              onKeyDown={(e) => {
                if (e.key === "Enter") load(true);
              }}
            />
            <Search className="absolute right-3 top-2.5 text-white/50" size={16} />
          </div>

          <button
            onClick={() => load(true)}
            disabled={loading}
            className="rounded-xl bg-white text-black px-3 py-2 text-sm font-extrabold disabled:opacity-60"
          >
            Search
          </button>

          <button
            onClick={() => load(true)}
            disabled={loading}
            className="rounded-xl border border-white/10 px-3 py-2 disabled:opacity-60"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Quick chips */}
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/70">
        <span className={badgeBase}>NEW: {counts.new}</span>
        <span className={badgeBase}>READ: {counts.read}</span>
        <span className={badgeBase}>REPLIED: {counts.replied}</span>
        <span className={badgeBase}>CLOSED: {counts.closed}</span>
      </div>

      {/* Filter buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(["", "new", "read", "replied", "closed"] as const).map((s) => (
          <button
            key={s || "all"}
            onClick={() => setStatus(s as any)}
            className={
              "rounded-xl px-3 py-2 text-xs font-extrabold border transition " +
              (status === s
                ? "bg-white text-black border-white/20"
                : "bg-black/30 text-white border-white/10 hover:bg-black/40")
            }
          >
            {s ? s.toUpperCase() : "ALL"}
          </button>
        ))}
      </div>

      {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
      {loading ? <div className="mt-3 text-sm text-white/60">Loading...</div> : null}

      {/* Main layout: list + detail (same page) */}
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {/* Left: table/list like employees */}
        <div className="overflow-auto rounded-2xl border border-white/10 lg:col-span-1">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="p-3 text-left">From</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => openOne(r.id)}
                  className={
                    "border-t border-white/10 cursor-pointer " +
                    (selected?.id === r.id ? "bg-white/10" : "hover:bg-white/5")
                  }
                >
                  <td className="p-3">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-white/60">{r.email}</div>
                    <div className="text-xs text-white/70 mt-1 line-clamp-1">
                      {r.subject || "(No subject)"}
                    </div>
                  </td>
                  <td className="p-3">
                    <StatusBadge s={r.status} />
                  </td>
                  <td className="p-3 text-white/70">{fmt(r.created_at)}</td>
                </tr>
              ))}

              {rows.length === 0 && !loading ? (
                <tr>
                  <td className="p-3 text-white/60" colSpan={3}>
                    No messages
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Right: details panel */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 lg:col-span-2">
          {!selected ? (
            <div className="text-sm text-white/60">Select a message to view details.</div>
          ) : (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-lg font-extrabold">{selected.name}</div>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2">
                      <Mail size={16} /> {selected.email}
                    </span>
                    {selected.phone ? (
                      <span className="inline-flex items-center gap-2">
                        <Phone size={16} /> {selected.phone}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 text-xs text-white/55">
                    Created: {fmt(selected.created_at)} • Read: {fmt(selected.read_at)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge s={selected.status} />
                  <button
                    onClick={deleteOne}
                    disabled={acting}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm font-extrabold hover:bg-white/10 disabled:opacity-60"
                    title="Delete"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Trash2 size={16} /> Delete
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-auto rounded-2xl border border-white/10">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-3 text-white/60 w-[140px]">Subject</td>
                      <td className="p-3 font-semibold">{selected.subject || "(No subject)"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-white/60 align-top">Message</td>
                      <td className="p-3">
                        <div className="whitespace-pre-wrap text-white/80">
                          {selected.message}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setOneStatus("read")}
                  disabled={acting}
                  className="rounded-xl bg-white text-black px-3 py-2 text-sm font-extrabold disabled:opacity-60"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => setOneStatus("replied")}
                  disabled={acting}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm font-extrabold hover:bg-white/10 disabled:opacity-60"
                >
                  Mark Replied
                </button>
                <button
                  onClick={() => setOneStatus("closed")}
                  disabled={acting}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm font-extrabold hover:bg-white/10 disabled:opacity-60"
                >
                  Close
                </button>
                <button
                  onClick={() => setOneStatus("new")}
                  disabled={acting}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm font-extrabold hover:bg-white/10 disabled:opacity-60"
                >
                  Set New
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
