import axios from "axios";

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") + "/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for token handling or error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    return Promise.reject(error);
  }
);
