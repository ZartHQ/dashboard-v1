import { api } from "@/lib/api";

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export interface QueueHealth {
  status: 'ok' | 'error';
  details?: string;
}

export const monitoringApi = {
  getStats: async (): Promise<QueueStats> => {
    const response = await api.get("/queues/stats");
    return response.data;
  },

  getQueueHealth: async (): Promise<QueueHealth> => {
    const response = await api.get("/queues/health");
    return response.data;
  },
  
  getSystemHealth: async (): Promise<{ status: string }> => {
    const response = await api.get("/health");
    return response.data;
  },

  getLiveHealth: async (): Promise<{ status: string }> => {
    const response = await api.get("/health/live");
    return response.data;
  },
  
  retryFailed: async () => {
    const response = await api.post("/queues/retry-failed");
    return response.data;
  },
  
  getFlags: async () => {
    const response = await api.get("/admin/flags").catch(() => ({ data: [] }));
    return response.data;
  }
};
