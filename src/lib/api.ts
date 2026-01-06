import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor (Axios v1 compatible)
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("jp_token");

    if (token) {
      // headers is guaranteed to exist in InternalAxiosRequestConfig
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

/**
 * Response interceptor
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jp_token");
      localStorage.removeItem("jp_user");
      localStorage.removeItem("jp_role");
    }
    return Promise.reject(error);
  }
);
