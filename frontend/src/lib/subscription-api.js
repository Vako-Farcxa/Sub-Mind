import { apiClient } from "./api-client";

const unwrap = (response) => response.data.data;

export async function listSubscriptions(filters = {}) {
  const response = await apiClient.get("/subscriptions", { params: filters });
  return unwrap(response);
}

export async function getSubscription(id) {
  const response = await apiClient.get(`/subscriptions/${id}`);
  return unwrap(response);
}

export async function getSubscriptionSummary() {
  const response = await apiClient.get("/subscriptions/summary");
  return unwrap(response);
}

export async function createSubscription(payload) {
  const response = await apiClient.post("/subscriptions", payload);
  return unwrap(response);
}

export async function updateSubscription({ id, payload }) {
  const response = await apiClient.patch(`/subscriptions/${id}`, payload);
  return unwrap(response);
}

export async function deleteSubscription(id) {
  const response = await apiClient.delete(`/subscriptions/${id}`);
  return unwrap(response);
}
