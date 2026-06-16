import { api } from "@/lib/api";
import { ARTISANS, Artisan } from "./constants";

export const artisansApi = {
  getArtisans: async (): Promise<Artisan[]> => {
    // In real app: const response = await api.get("/artisans"); return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(ARTISANS), 800);
    });
  },
};
