import { useMutation, useQueryClient } from "@tanstack/react-query";
import { artisansApi } from "./api";

export function useCreateArtisanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: artisansApi.createArtisan,
    onSuccess: () => {
      // Invalidate artisans list query to trigger automatic re-fetching
      queryClient.invalidateQueries({ queryKey: ["admin", "artisans"] });
    },
  });
}
