import { apiClient } from "./api-client";

const unwrap = (response) => response.data.data;

export async function listEmailScans(params = {}) {
  const response = await apiClient.get("/email-scans", { params });
  return unwrap(response);
}

export async function startEmailScan(payload = {}) {
  const response = await apiClient.post("/email-scans", payload);
  return unwrap(response);
}
