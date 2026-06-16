import { useQuery } from "@tanstack/react-query";
import { monitoringApi } from "./api";

export function useQueueStats() {
  return useQuery({
    queryKey: ["queues", "stats"],
    queryFn: monitoringApi.getStats,
    refetchInterval: 10000,
  });
}

export function useQueueHealth() {
  return useQuery({
    queryKey: ["queues", "health"],
    queryFn: monitoringApi.getQueueHealth,
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["system", "health"],
    queryFn: monitoringApi.getSystemHealth,
  });
}

export function useFlags() {
  return useQuery({
    queryKey: ["admin", "flags"],
    queryFn: monitoringApi.getFlags,
  });
}
