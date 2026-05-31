import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,  // CRITICAL: sends HttpOnly cookies with every request automatically
});

// ── Request interceptor ───────────────────────────────────────────────────────
// No token injection needed — cookies are sent automatically by the browser.
// We keep this interceptor only as a hook for future request modifications.
api.interceptors.request.use((config) => config);

// ── Response interceptor ──────────────────────────────────────────────────────
// IMPORTANT: Only redirect to /login for 401s on OUR auth-sensitive endpoints.
// Do NOT globally redirect on all 401s — this causes logout when the GitHub API
// returns 401 (e.g. expired GitHub OAuth token) via our proxy endpoints.
const AUTH_ONLY_PATHS = ["/api/auth/me", "/api/user/profile"];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (status === 401) {
      const isAuthPath = AUTH_ONLY_PATHS.some((p) => requestUrl.includes(p));

      if (isAuthPath) {
        // Our session is truly gone — redirect to login
        // Use replace to avoid the broken page being in browser history
        window.location.replace("/login");
      }
      // For all other 401s (GitHub proxy, etc.), just propagate the error
      // so the specific page can handle it gracefully (e.g. "Reconnect GitHub")
    }

    return Promise.reject(error);
  }
);

export default api;
