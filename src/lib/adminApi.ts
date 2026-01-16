import { adminAuth } from "./adminAuth";

const API_BASE =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/+$/, "") || "";


async function request<T>(
  path: string,
  opts: RequestInit & { json?: any } = {}
): Promise<T> {
  const token = adminAuth.getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.json ? { "Content-Type": "application/json" } : {}),
    ...(opts.headers as any),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    body: opts.json ? JSON.stringify(opts.json) : opts.body,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

/* Types (minimal, aligned to your backend) */
export type AdminLoginResp = { token: string; admin: { email?: string; role: "admin" } };

export type DashSummary = {
  totals: {
    customers: number;
    employees: number;
    jobs: number;
    active_jobs?: number;
    applications: number;
  };
  today: {
    new_customers?: number;
    new_employees?: number;
    new_jobs: number;
    new_applications: number;
    new_users?: number;
  };
};

export type LaravelPage<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type UserRow = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "candidate" | "employer" | "admin" | string;
  created_at?: string;
};

export type JobRow = {
  id: number;
  employer_id?: number | null;
  title?: string;
  location?: string;
  company_name?: string | null;
  is_active?: boolean;
  applications_count?: number;
  created_at?: string;
};

export type ApplicationRow = {
  id: number;
  job_id: number;
  candidate_id: number;
  status: string;
  resume_url?: string | null;
  cover_letter?: string | null;
  created_at?: string;
  candidate?: { id: number; name: string; email: string; phone?: string | null };
  job?: { id: number; title?: string; location?: string; company_name?: string | null; is_active?: boolean };
};

/* API */
export const adminApi = {
  login(email: string, password: string) {
    return request<AdminLoginResp>(`/api/admin/auth/login`, {
      method: "POST",
      json: { email, password },
    });
  },
  logout() {
    return request<{ message: string }>(`/api/admin/auth/logout`, { method: "POST" });
  },
  summary() {
    return request<DashSummary>(`/api/admin/dashboard/summary`);
  },
  customers(params: { q?: string; page?: number; limit?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    return request<LaravelPage<UserRow>>(`/api/admin/customers?${qs.toString()}`);
  },
  employees(params: { q?: string; page?: number; limit?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    return request<LaravelPage<UserRow>>(`/api/admin/employees?${qs.toString()}`);
  },
  jobs(params: { q?: string; page?: number; limit?: number; is_active?: boolean } = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (typeof params.is_active === "boolean") qs.set("is_active", String(params.is_active));
    return request<LaravelPage<JobRow>>(`/api/admin/jobs?${qs.toString()}`);
  },
  setJobActive(id: number, is_active: boolean) {
    return request<{ message: string; job: JobRow }>(`/api/admin/jobs/${id}/active`, {
      method: "PATCH",
      json: { is_active },
    });
  },
  applications(params: { page?: number; limit?: number; status?: string; job_id?: number; candidate_id?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.status) qs.set("status", params.status);
    if (params.job_id) qs.set("job_id", String(params.job_id));
    if (params.candidate_id) qs.set("candidate_id", String(params.candidate_id));
    return request<LaravelPage<ApplicationRow>>(`/api/admin/applications?${qs.toString()}`);
  },
  setApplicationStatus(id: number, status: string) {
    return request<{ message: string; application: ApplicationRow }>(
      `/api/admin/applications/${id}/status`,
      { method: "PATCH", json: { status } }
    );
  },
};
