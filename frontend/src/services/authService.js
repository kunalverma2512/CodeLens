import api from "./api.js";

export const register = async (name, email, password) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const login = async (email, password) => {
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

export const getGithubConnectUrl = async (redirectPath = "/account-center") => {
  const response = await api.get("/auth/github/connect-url", {
    params: { redirectPath }
  });
  return response.data;
};
