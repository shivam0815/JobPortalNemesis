export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role?: "candidate" | "employer" | "admin" | null;
  company_name?: string | null; // optional
};

export function setAuth(token: string, user: User) {
  localStorage.setItem("jp_token", token);
  localStorage.setItem("jp_user", JSON.stringify(user));
  localStorage.setItem("jp_role", user.role || "");

  // 🔔 notify UI (Navbar etc.)
  window.dispatchEvent(new Event("auth-changed"));
}

export function clearAuth() {
  localStorage.removeItem("jp_token");
  localStorage.removeItem("jp_user");
  localStorage.removeItem("jp_role");

  window.dispatchEvent(new Event("auth-changed"));
}

export function getToken() {
  return localStorage.getItem("jp_token");
}

export function getUser(): User | null {
  const raw = localStorage.getItem("jp_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getRole() {
  return (localStorage.getItem("jp_role") as User["role"]) || null;
}
