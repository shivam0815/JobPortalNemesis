import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";
import { adminAuth } from "../../lib/adminAuth";

const Item = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-xl text-sm font-semibold ${
        isActive ? "bg-white text-black" : "text-white/75 hover:text-white hover:bg-white/10"
      }`
    }
  >
    {label}
  </NavLink>
);

export default function AdminLayout() {
  const nav = useNavigate();

  const onLogout = async () => {
    try {
      await adminApi.logout();
    } catch {}
    adminAuth.clear();
    nav("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold tracking-wide">Nemisis Admin</div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/15"
          >
            Logout
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Item to="/admin/dashboard" label="Dashboard" />
          <Item to="/admin/customers" label="Customers" />
          <Item to="/admin/employees" label="Employees" />
          <Item to="/admin/jobs" label="Jobs" />
          <Item to="/admin/applications" label="Applications" />
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
