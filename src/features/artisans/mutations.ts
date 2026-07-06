import { useMutation, useQueryClient } from "@tanstack/react-query";
import { artisansApi } from "./api";
import { UpdateArtisanVettingStatusRequest } from "@/types/api";

export function useCreateArtisanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: artisansApi.createArtisan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "artisans"] });
    },
  });
}

export function useUpdateArtisanVettingStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateArtisanVettingStatusRequest }) =>
      artisansApi.updateArtisanVettingStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "artisans"] });
    },
  });
}
