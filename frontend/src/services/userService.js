import api from "./api.js";

export const getProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/user/profile", data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/user/profile");
  return response.data;
};
