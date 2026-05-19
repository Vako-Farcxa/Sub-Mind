import axios from "axios";
import { apiUrl } from "./config";

export const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
