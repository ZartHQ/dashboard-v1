import { useQuery } from "@tanstack/react-query";
import { artisansApi, GetArtisansParams } from "./api";

export function useArtisans(params?: GetArtisansParams) {
  return useQuery({
    queryKey: ["admin", "artisans", params],
    queryFn: () => artisansApi.getArtisans(params),
  });
}

/** Full artisan record, including the vetting notes history. */
export function useArtisanDetail(id: number | null | undefined) {
  return useQuery({
    queryKey: ["admin", "artisans", "detail", id],
    queryFn: () => artisansApi.getArtisanById(id as number),
    enabled: !!id,
  });
}
