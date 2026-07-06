import { api } from "@/lib/api";
import { FLAGS } from "./constants";
import { Flag } from "@/types";

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export interface QueueHealth {
  status: "ok" | "error";
  details?: string;
}

export const monitoringApi = {
  getStats: async (): Promise<QueueStats> => {
    const response = await api.get<{
      success: boolean;
      data: {
        emailQueue: QueueStats;
      };
    }>("/queues/stats");
    return response.data.data.emailQueue;
  },

  getQueueHealth: async (): Promise<QueueHealth> => {
    const response = await api.get<{
      success: boolean;
      status: string;
      data?: any;
    }>("/queues/health");
    return {
      status: response.data.status === "healthy" ? "ok" : "error",
      details: `Queue health: ${response.data.status}`,
    };
  },

  getSystemHealth: async (): Promise<{ status: string }> => {
    const response = await api.get<{ status: string }>("/health");
    return response.data;
  },

  getLiveHealth: async (): Promise<{ status: string }> => {
    const response = await api.get<{ status: string }>("/health/live");
    return response.data;
  },

  retryFailed: async (): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: { retriedCount: number };
    }>("/queues/retry-failed");
    return response.data;
  },

  getFlags: async (): Promise<Flag[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(FLAGS), 500));
  },
};
