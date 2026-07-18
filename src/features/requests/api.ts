import { api } from "@/lib/api";
import {
  ServiceRequestDetail,
  ServiceRequestListResponse,
  ServiceRequestDetailResponse,
  Invoice,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from "@/types";

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
    console.log("Service Request Detail API Response (Raw):", response.data);
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

  getRequestCountByStatus: async (): Promise<any> => {
    const response = await api.get(`admin/service-requests/counts`);
    console.log(response, "<===");
    return response.data.data;
  },

  getInvoice: async (requestId: string): Promise<Invoice> => {
    const response = await api.get<any>(`/admin/service-requests/${requestId}/invoice`);
    console.log("Invoice/Receipt API Response (Raw):", response.data);
    return response.data.data?.data || response.data.data;
  },

  createInvoice: async ({ requestId, data }: { requestId: string; data: CreateInvoiceDto }): Promise<Invoice> => {
    const response = await api.post<any>(`/admin/service-requests/${requestId}/invoice`, data);
    return response.data.data?.data || response.data.data;
  },

  updateInvoice: async ({ requestId, data }: { requestId: string; data: UpdateInvoiceDto }): Promise<Invoice> => {
    const response = await api.patch<any>(`/admin/service-requests/${requestId}/invoice`, data);
    return response.data.data?.data || response.data.data;
  },

  sendInvoice: async (requestId: string): Promise<any> => {
    const response = await api.post<any>(`/admin/service-requests/${requestId}/invoice/send`);
    return response.data;
  },

  markInvoicePaid: async (requestId: string): Promise<any> => {
    const response = await api.post<any>(`/admin/service-requests/${requestId}/invoice/mark-paid`);
    return response.data;
  }
};
