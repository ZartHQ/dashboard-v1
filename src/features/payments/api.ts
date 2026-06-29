import { api } from "@/lib/api";
import { PAYMENTS } from "./constants";
import { Payment } from "@/types/payments";

export const paymentsApi = {
  getPayments: async (): Promise<Payment[]> => {
    // In real app: const response = await api.get("/payments"); return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(PAYMENTS), 800);
    });
  },
};
