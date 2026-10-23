import { useQuery } from "@tanstack/react-query";
import { RefundStatus } from "@/types";
import { refundsApi } from "./api";

export function useRefunds(status?: RefundStatus) {
  return useQuery({
    queryKey: ["admin", "refunds", status ?? "all"],
    queryFn: () => refundsApi.getRefunds(status),
  });
}
