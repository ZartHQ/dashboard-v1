import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagingApi } from "./api";

export const messagesKey = (requestId: number) => ["messages", requestId];

/**
 * Loads a patron's message thread and polls every 4s so new messages
 * appear without a manual refresh. Swap to a WebSocket later without
 * touching the components that use this hook.
 */
export function useMessages(requestId: number | null | undefined) {
  return useQuery({
    queryKey: messagesKey(requestId ?? 0),
    queryFn: () => (requestId ? messagingApi.getThread(requestId) : []),
    enabled: !!requestId,
    refetchInterval: 4000,
  });
}

export function useSendMessage(requestId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => messagingApi.sendMessage({ requestId, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(requestId) });
    },
  });
}
