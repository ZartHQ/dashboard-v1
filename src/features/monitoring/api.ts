import { FLAGS, Flag } from "./constants";

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
    return new Promise((resolve) => setTimeout(() => resolve({
      waiting: 42,
      active: 12,
      completed: 1250,
      failed: 3,
      delayed: 0
    }), 500));
  },

  getQueueHealth: async (): Promise<QueueHealth> => {
    return new Promise((resolve) => setTimeout(() => resolve({
      status: 'ok',
      details: 'All queues operational'
    }), 500));
  },
  
  getSystemHealth: async (): Promise<{ status: string }> => {
    return new Promise((resolve) => setTimeout(() => resolve({ status: 'healthy' }), 500));
  },

  getLiveHealth: async (): Promise<{ status: string }> => {
    return new Promise((resolve) => setTimeout(() => resolve({ status: 'live' }), 500));
  },
  
  retryFailed: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
  },
  
  getFlags: async (): Promise<Flag[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(FLAGS), 500));
  }
};
