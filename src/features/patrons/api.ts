import { api } from "@/lib/api";
import { Patron } from "@/types/patrons";

export const patronsApi = {
  getPatrons: async (): Promise<Patron[]> => {
    const response = await api.get("/admin/patrons");

    console.log(response.data);
    return response.data.data;
  },

  getPatronById: async (id: number): Promise<Patron> => {
    const response = await api.get(`/admin/patrons/${id}`);

    return response.data.data;
  }
};
