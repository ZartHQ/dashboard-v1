import { useMutation, useQueryClient } from "@tanstack/react-query";
import { monitoringApi } from "./api";

export function useRetryFailedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: monitoringApi.retryFailed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queues"] });
    },
  });
}
