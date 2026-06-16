import { api } from "@/lib/api";
import { LoginInput } from "./schemas";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials?: string;
  color?: string;
}

export const authApi = {
  signin: async (data: LoginInput): Promise<AdminUser> => {
    const response = await api.post("/admin/signin", data);
    return response.data;
  },
  
  me: async (): Promise<AdminUser> => {
    const response = await api.get("/admin/me");
    return response.data;
  },

  logout: async () => {
    // Backend should handle session clearing (e.g. clearing cookies)
    await api.post("/admin/logout").catch(() => {}); 
  },
};
