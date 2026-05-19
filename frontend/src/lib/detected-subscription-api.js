import { apiClient } from "./api-client";

const unwrap = (response) => response.data.data;

export async function listDetectedSubscriptions(params = {}) {
  const response = await apiClient.get("/detected-subscriptions", { params });
  return unwrap(response);
}

export async function confirmDetectedSubscription({ id, payload = {} }) {
  const response = await apiClient.post(`/detected-subscriptions/${id}/confirm`, payload);
  return unwrap(response);
}

export async function dismissDetectedSubscription(id) {
  const response = await apiClient.post(`/detected-subscriptions/${id}/dismiss`);
  return unwrap(response);
}
