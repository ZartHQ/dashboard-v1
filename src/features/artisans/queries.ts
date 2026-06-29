import { useQuery } from "@tanstack/react-query";
import { artisansApi, GetArtisansParams } from "./api";

export function useArtisans(params?: GetArtisansParams) {
  return useQuery({
    queryKey: ["admin", "artisans", params],
    queryFn: () => artisansApi.getArtisans(params),
  });
}
