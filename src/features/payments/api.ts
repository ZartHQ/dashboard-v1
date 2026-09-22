import { api } from "@/lib/api";
import { Payment } from "@/types";

export const paymentsApi = {
  getPayments: async (): Promise<Payment[]> => {
    // Confirm the route with the backend if it differs.
    const response = await api.get("/admin/payments");
    return response.data.data;
  },
};
