import { api } from "@/lib/api";
import { PATRONS } from "./constants";
import { Patron } from "@/types/patrons";

export const patronsApi = {
  getPatrons: async (): Promise<Patron[]> => {
    // In real app: const response = await api.get("/patrons"); return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(PATRONS), 800);
    });
  },
};
