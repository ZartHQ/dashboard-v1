import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: reportsApi.getReports,
  });
}
