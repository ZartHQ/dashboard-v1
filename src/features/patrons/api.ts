import { api } from "@/lib/api";
import { DbPatron } from "@/types";

export const patronsApi = {
  getPatrons: async (): Promise<DbPatron[]> => {
    const response = await api.get("/admin/patrons");

    console.log(response.data);
    return response.data.data;
  },

  getPatronById: async (id: number): Promise<DbPatron> => {
    const response = await api.get(`/admin/patrons/${id}`);

    return response.data.data;
  }
};
