import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patronsApi } from "./api";

export function useUnblockPatronMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patronsApi.unblockBooking,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["patrons", id] });
    },
  });
}
