import { api } from "@/lib/api";
import { Refund, RefundStatus } from "@/types";

export const refundsApi = {
  getRefunds: async (status?: RefundStatus): Promise<Refund[]> => {
    const response = await api.get<any>("/admin/refunds", { params: status ? { status } : {} });
    return response.data.data;
  },

  markSent: async ({ id, note }: { id: number; note?: string }): Promise<Refund> => {
    const response = await api.post<any>(`/admin/refunds/${id}/mark-sent`, note ? { note } : {});
    return response.data.data;
  },
};
