import { apiClient } from "./api-client";

export async function getCurrentUser() {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function logout() {
  const response = await apiClient.post("/auth/logout");
  return response.data.data;
}
