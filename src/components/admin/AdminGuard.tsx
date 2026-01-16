import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { adminAuth } from "../../lib/adminAuth";

export default function AdminGuard() {
  if (!adminAuth.isLoggedIn()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
