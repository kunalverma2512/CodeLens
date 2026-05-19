import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
const AUTH_FAILURE_STATUSES = new Set([401, 403]);

// Request interceptor - inject auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - clear stored sessions only for real auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (AUTH_FAILURE_STATUSES.has(error.response?.status)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
