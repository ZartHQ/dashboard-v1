import { useQuery } from "@tanstack/react-query";
import { authApi } from "./api";

export const AUTH_QUERY_KEY = ["admin", "me"];

export function useAdminProfile() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.me,
    retry: false, // Don't retry on 401
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
