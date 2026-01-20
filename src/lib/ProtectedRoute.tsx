import { Navigate, Outlet, useLocation } from "react-router-dom";

type Role = "candidate" | "employer";

type AuthUser = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: Role;
};

function readAuth() {
  const token = localStorage.getItem("jp_token");
  const userRaw = localStorage.getItem("jp_user");

  if (!token || !userRaw) {
    return { isAuthed: false, user: null as AuthUser | null };
  }

  try {
    return {
      isAuthed: true,
      user: JSON.parse(userRaw) as AuthUser,
    };
  } catch {
    return { isAuthed: false, user: null as AuthUser | null };
  }
}

export default function ProtectedRoute({
  allow,
  redirectTo = "/auth",
}: {
  allow: Role;
  redirectTo?: string;
}) {
  const loc = useLocation();
  const { isAuthed, user } = readAuth();

  // ❌ not logged in
  if (!isAuthed) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: loc.pathname }}
      />
    );
  }

  // ❌ role mismatch
  if (user?.role !== allow) {
    return <Navigate to="/" replace />;
  }

  // ✅ allowed
  return <Outlet />;
}
