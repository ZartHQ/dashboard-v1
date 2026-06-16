import axios from "axios";
import { API_BASE_URL } from "./config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("zart_access_token");
      // Skip attaching the token for the signin route
      if (token && !config.url?.includes("/admin/signin")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("zart_access_token");
        // Optionally redirect to login here
      }
    }
    return Promise.reject(error);
  }
);
