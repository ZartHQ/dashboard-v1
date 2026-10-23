import axios from "axios";
import { API_BASE_URL } from "./config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 20000, // fail a stalled request instead of spinning forever (PWA/mobile)
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("zart_access_token");
      // Skip attaching the token for the signin route
      if (token && !config.url?.includes("/admin/signin")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized and prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/admin/signin")
      ) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("zart_access_token");
          localStorage.removeItem("zart_refresh_token");
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("zart_refresh_token");
        if (refreshToken) {
          try {
            const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;

            localStorage.setItem("zart_access_token", accessToken);
            if (newRefreshToken) {
              localStorage.setItem("zart_refresh_token", newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            processQueue(null, accessToken);
            isRefreshing = false;
            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            isRefreshing = false;
            localStorage.removeItem("zart_access_token");
            localStorage.removeItem("zart_refresh_token");
            window.location.href = "/";
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token (e.g. a fresh PWA launch): reset the lock so later
          // 401s don't queue forever; the rejection falls through to the login.
          isRefreshing = false;
          processQueue(error, null);
        }
      }
    }

    return Promise.reject(error);
  }
);
