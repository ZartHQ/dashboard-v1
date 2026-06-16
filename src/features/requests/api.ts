import { api } from "@/lib/api";

export interface ServiceRequest {
  id: string;
  title: string;
  cat: string;
  catKey: string;
  patron: string;
  loc: string;
  time: string;
  status: 'pending' | 'assigned' | 'progress' | 'done' | 'cancelled';
}

export interface GetRequestsParams {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export const requestsApi = {
  getRequests: async (params: GetRequestsParams = {}): Promise<ServiceRequest[]> => {
    const response = await api.get("/admin/service-requests", { params });
    return response.data;
  },

  getRequestById: async (id: string): Promise<ServiceRequest> => {
    const response = await api.get(`/admin/service-requests/${id}`);
    return response.data;
  },
  
  updateStatus: async ({ id, status }: { id: string; status: string }) => {
    const response = await api.patch(`/admin/service-requests/${id}`, { status });
    return response.data;
  },
};
