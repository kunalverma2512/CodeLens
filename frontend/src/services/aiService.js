import api from "./api";

export const getDashboardSummary = async () => {
  const response = await api.get("/ai/dashboard-summary");
  return response.data;
};
