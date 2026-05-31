import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

const AUTH_FAILURE_STATUSES = new Set([401, 403]);

// No token injection needed — cookies are sent automatically by the browser.
api.interceptors.request.use((config) => config);

// Redirect only when the application's own session endpoints confirm auth loss.
// Other 401/403 responses, such as GitHub proxy failures, should be handled by
// the feature page that made the request.
const AUTH_ONLY_PATHS = ["/api/auth/me", "/api/user/profile"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (AUTH_FAILURE_STATUSES.has(status)) {
      const isAuthPath = AUTH_ONLY_PATHS.some((path) => requestUrl.includes(path));

      if (isAuthPath) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
