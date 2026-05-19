import { apiClient } from "./api-client";

const unwrap = (response) => response.data.data;

export async function getReminderSettings() {
  const response = await apiClient.get("/reminder-settings");
  return unwrap(response);
}

export async function updateReminderSettings(payload) {
  const response = await apiClient.patch("/reminder-settings", payload);
  return unwrap(response);
}
