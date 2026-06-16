import { API_BASE_URL } from "./config";

export const api = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  },

  post: async (endpoint: string, data: any, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  },
};
