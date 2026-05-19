import api from "./api.js";

/** GET /api/github/dashboard — all data in one shot */
export const getGitHubDashboard = () => api.get("/github/dashboard");

export const getGitHubProfile       = () => api.get("/github/profile");
export const getGitHubRepos         = () => api.get("/github/repos");
export const getGitHubContributions = () => api.get("/github/contributions");
export const getGitHubActivity      = () => api.get("/github/activity");
