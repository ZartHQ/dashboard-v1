import { api } from "@/lib/api";
import { DbPatron } from "@/types";

export const patronsApi = {
  getPatrons: async (): Promise<DbPatron[]> => {
    const response = await api.get<any>("/admin/patrons");
    const inner = response.data?.data ?? {};
    // Backend returns { data: { items, meta } }; tolerate { data: [] } too.
    return Array.isArray(inner) ? inner : inner.items ?? [];
  },

  getPatronById: async (id: number): Promise<DbPatron> => {
    const response = await api.get(`/admin/patrons/${id}`);

    return response.data.data;
  }
};
