import { useQuery } from "@tanstack/react-query";
import { requestsApi, GetRequestsParams } from "./api";

export function useRequests(params: GetRequestsParams = {}) {
  return useQuery({
    queryKey: ["admin", "service-requests", params],
    queryFn: () => requestsApi.getRequests(params),
  });
}

export function useRequestDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "service-requests", id],
    queryFn: () => (id ? requestsApi.getRequestById(id) : null),
    enabled: !!id,
  });
}

export function useRequestCounts() {
  return useQuery({
    queryKey: ["admin", "service-requests", "counts"],
    queryFn: requestsApi.getRequestCountByStatus,
  });
}

export function useRequestInvoice(requestId: string | null) {
  return useQuery({
    queryKey: ["admin", "service-requests", requestId, "invoice"],
    queryFn: () => (requestId ? requestsApi.getInvoice(requestId) : null),
    enabled: !!requestId,
    retry: false,
  });
}
