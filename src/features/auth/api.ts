import { api } from "@/lib/api";
import { LoginInput } from "./schemas";
import { LoginResponse, AdminProfileResponse, AdminProfile, LoginData } from "@/types";

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
    let refreshToken = "";
    if (typeof window !== "undefined") {
      refreshToken = sessionStorage.getItem("zart_refresh_token") || "";
    }
    await api.post("/auth/signout", { refreshToken }).catch(() => {});
  },
};
