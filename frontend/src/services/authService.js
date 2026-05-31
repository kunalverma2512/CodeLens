import api from "./api.js";

// ── Email Auth ────────────────────────────────────────────────────────────────

export const register = async (name, email, password) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  // Server sets HttpOnly cookies on success — response body has user only
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const login = async (email, password) => {
  // Server sets HttpOnly cookies on success — response body has user only
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post("/auth/reset-password", { email, otp, newPassword });
  return response.data;
};

export const resendOtp = async (email, purpose) => {
  const response = await api.post("/auth/resend-otp", { email, purpose });
  return response.data;
};

// ── Session ───────────────────────────────────────────────────────────────────

/**
 * Returns the currently authenticated user from the server (verifies the cookie).
 * Used by AuthContext on startup to hydrate user state.
 */
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * Clears auth cookies server-side. Call this to log the user out.
 */
export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// ── GitHub Connect ────────────────────────────────────────────────────────────

/**
 * Gets the GitHub OAuth URL for the "connect" flow (linking GitHub to an existing account).
 *
 * WHY this pattern exists:
 *   The old code did window.location.href = "${API_BASE}/auth/github/connect"
 *   A browser navigation never sends an Authorization header, causing 401.
 *   Solution: make an API call first (cookies sent automatically via withCredentials),
 *   get the GitHub OAuth URL back as JSON, then navigate to it.
 */
export const getGithubConnectUrl = async (redirectPath = "/account-center") => {
  const response = await api.get("/auth/github/connect-init", {
    params: { redirectPath }
  });
  return response.data?.data?.url;
};
