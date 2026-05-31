import api from "./api.js";

/** GET /api/github/dashboard — all data in one shot (cached) */
export const getGitHubDashboard = () => api.get("/github/dashboard");

/** POST /api/github/sync — manually force a sync */
export const syncGitHubDashboard = () => api.post("/github/sync");

export const getGitHubProfile       = () => api.get("/github/profile");
export const getGitHubRepos         = () => api.get("/github/repos");
export const getGitHubContributions = () => api.get("/github/contributions");
export const getGitHubActivity      = () => api.get("/github/activity");
