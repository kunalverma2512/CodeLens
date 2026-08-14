import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,  // CRITICAL: sends HttpOnly cookies with every request automatically
});

const csrfClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let csrfToken = null;
let csrfTokenRequest = null;

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const isCsrfTokenRequest = (url = "") => url.includes("/auth/csrf-token");

const ensureCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  if (csrfTokenRequest) return csrfTokenRequest;

  csrfTokenRequest = csrfClient
    .get("/auth/csrf-token")
    .then((response) => {
      csrfToken = response.data?.data?.csrfToken ?? null;
      return csrfToken;
    })
    .finally(() => {
      csrfTokenRequest = null;
    });

  return csrfTokenRequest;
};

export const getCsrfToken = ensureCsrfToken;

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const method = (config.method || "GET").toUpperCase();
  const shouldAttachCsrf = UNSAFE_METHODS.has(method) && !isCsrfTokenRequest(config.url);

  if (shouldAttachCsrf) {
    const token = await ensureCsrfToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["X-CSRF-Token"] = token;
    }
  }

  return config;
});

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

    if (
      status === 403 &&
      !isCsrfTokenRequest(requestUrl) &&
      !error.config?._csrfRetried &&
      String(error.response?.data?.message || "").toLowerCase().includes("csrf")
    ) {
      error.config._csrfRetried = true;
      csrfToken = null;
      const token = await ensureCsrfToken();
      if (token) {
        error.config.headers = error.config.headers || {};
        error.config.headers["X-CSRF-Token"] = token;
      }
      return api(error.config);
    }

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
