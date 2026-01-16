const KEY = "nemisis_admin_token";

export const adminAuth = {
  getToken(): string | null {
    return localStorage.getItem(KEY);
  },
  setToken(token: string) {
    localStorage.setItem(KEY, token);
  },
  clear() {
    localStorage.removeItem(KEY);
  },
  isLoggedIn(): boolean {
    return !!localStorage.getItem(KEY);
  },
};
