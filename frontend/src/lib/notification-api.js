import { apiClient } from "./api-client";

const unwrap = (response) => response.data.data;

export async function listNotifications(params = {}) {
  const response = await apiClient.get("/notifications", { params });
  return unwrap(response);
}

export async function runReminderCycle() {
  const response = await apiClient.post("/notifications/run-reminders");
  return unwrap(response);
}

export async function markNotificationRead(id) {
  const response = await apiClient.post(`/notifications/${id}/read`);
  return unwrap(response);
}
