import { api } from "@/lib/api";
import { LoginInput } from "./schemas";
import { LoginResponse, AdminProfileResponse, AdminProfile, LoginData } from "@/types/api";

export const authApi = {
  signin: async (data: LoginInput): Promise<LoginData> => {
    const response = await api.post<LoginResponse>("/admin/signin", data);
    return response.data.data;
  },

  me: async (): Promise<AdminProfile> => {
    const response = await api.get<AdminProfileResponse>("/admin/me");
    return response.data.data;
  },

  logout: async () => {
    // Backend should handle session clearing (e.g. clearing cookies)
    await api.post("/admin/logout").catch(() => {});
  },
};
