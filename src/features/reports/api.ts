import { api } from "@/lib/api";
import { CATEGORIES, TOP_ARTISANS, Category, TopArtisan } from "./constants";

export interface ReportsData {
  categories: Category[];
  topArtisans: TopArtisan[];
}

export const reportsApi = {
  getReports: async (): Promise<ReportsData> => {
    // In real app: const response = await api.get("/reports"); return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        categories: CATEGORIES,
        topArtisans: TOP_ARTISANS,
      }), 800);
    });
  },
};
