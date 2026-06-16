import { api } from "@/lib/api";
import { PATRONS, Patron } from "./constants";

export const patronsApi = {
  getPatrons: async (): Promise<Patron[]> => {
    // In real app: const response = await api.get("/patrons"); return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(PATRONS), 800);
    });
  },
};
