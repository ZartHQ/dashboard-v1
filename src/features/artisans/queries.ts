import { useQuery } from "@tanstack/react-query";
import { artisansApi } from "./api";

export function useArtisans() {
  return useQuery({
    queryKey: ["artisans"],
    queryFn: artisansApi.getArtisans,
  });
}
