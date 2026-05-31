import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

const AUTH_FAILURE_STATUSES = new Set([401, 403]);
const AUTH_ONLY_PATHS = new Set(["/api/auth/me", "/api/user/profile"]);

const getRequestPathname = (requestUrl) => {
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const { pathname } = new URL(requestUrl, origin);
    return pathname.replace(/\/+$/, "") || "/";
  } catch {
    return "";
  }
};

// No token injection needed — cookies are sent automatically by the browser.
api.interceptors.request.use((config) => config);

// Redirect only when the application's own session endpoints confirm auth loss.
// Other 401/403 responses, such as GitHub proxy failures, should be handled by
// the feature page that made the request.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (AUTH_FAILURE_STATUSES.has(status)) {
      const isAuthPath = AUTH_ONLY_PATHS.has(getRequestPathname(requestUrl));

      if (isAuthPath) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
