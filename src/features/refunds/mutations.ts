import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refundsApi } from "./api";

export function useMarkRefundSentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundsApi.markSent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "refunds"] });
    },
  });
}
