import { api } from "@/lib/api";
import { ServiceRequest, ServiceRequestDetail, ServiceRequestListResponse, ServiceRequestDetailResponse } from "@/types/api";

export interface GetRequestsParams {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export const requestsApi = {
  getRequests: async (params: GetRequestsParams = {}): Promise<ServiceRequestListResponse> => {
    const response = await api.get<ServiceRequestListResponse>("/admin/service-requests", { params });
    return response.data;
  },

  getRequestById: async (id: string): Promise<ServiceRequestDetail> => {
    const response = await api.get<ServiceRequestDetailResponse>(`/admin/service-requests/${id}`);
    return response.data.data;
  },

  updateStatus: async ({ id, status }: { id: string; status: string }): Promise<ServiceRequestDetail> => {
    const response = await api.patch<ServiceRequestDetailResponse>(`/admin/service-requests/${id}/status`, { status });
    return response.data.data;
  },

  assignArtisan: async ({ id, artisanProfileId }: { id: string; artisanProfileId: number }): Promise<ServiceRequestDetail> => {
    const response = await api.patch<ServiceRequestDetailResponse>(`/admin/service-requests/${id}/assign`, { artisanProfileId });
    return response.data.data;
  },

  addNote: async ({ id, note }: { id: string; note: string }): Promise<any> => {
    const response = await api.post(`/admin/service-requests/${id}/notes`, { note });
    console.log(response.data);
    return response.data.data;
  },
};
