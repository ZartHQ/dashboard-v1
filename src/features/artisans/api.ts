import { api } from "@/lib/api";
import { UpdateArtisanVettingStatusRequest, Artisan } from "@/types";

export interface GetArtisansParams {
  page?: number;
  limit?: number;
  artisanTypeId?: number;
  location?: string;
  vettingStatus?: string;
}

export interface CreateArtisanInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  artisanTypeId: number;
  operatingArea: string[];
  skills: string[];
  image?: string;
}

export const artisansApi = {
  getArtisans: async (params?: GetArtisansParams): Promise<Artisan[]> => {
    const response = await api.get<any>("/admin/artisans", { params });
    const rawData = Array.isArray(response.data.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : [];
    return rawData;
  },

  getArtisanById: async (id: number): Promise<any> => {
    const response = await api.get(`/admin/artisans/${id}`);
    return response.data.data;
  },

  createArtisan: async (data: CreateArtisanInput): Promise<any> => {
    const response = await api.post("/admin/artisans", data);
    return response.data.data;
  },

  updateArtisanVettingStatus: async (id: number, data: UpdateArtisanVettingStatusRequest): Promise<any> => {
    const response = await api.patch(`/admin/artisans/${id}/vetting-status`, data);
    return response.data.data;
  },

  updateArtisan: async (id: number, data: any): Promise<any> => {
    const response = await api.patch(`/admin/artisans/${id}`, data);
    return response.data.data;
  }
};
