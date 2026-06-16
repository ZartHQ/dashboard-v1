import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "./api";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: paymentsApi.getPayments,
  });
}
