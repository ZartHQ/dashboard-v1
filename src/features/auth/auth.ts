import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminProfile } from "./queries";
import { authApi } from "./api";

export interface SessionAdmin {
  id: number;
  name: string;
  initials: string;
  role: string;
  color: string;
}

/**
 * Hook: returns current admin profile or redirects to login if unauthenticated.
 * This is the primary way to protect admin routes.
 */
export function useAdmin() {
  const router = useRouter();
  const { data: admin, isLoading, isError } = useAdminProfile();

  useEffect(() => {
    if (!isLoading && (isError || !admin)) {
      router.replace("/");
    }
  }, [admin, isLoading, isError, router]);

  const name = admin ? `${admin.firstName} ${admin.lastName}` : "Admin";
  
  return {
    admin: admin ? {
      name,
      initials: admin.image ? "" : name.substring(0, 2).toUpperCase(),
      role: admin.roles && admin.roles.length > 0 ? admin.roles[0].name : "Admin",
      color: "#115746",
      ...admin,
    } as SessionAdmin : null,
    loading: isLoading
  };
}

/** Clear session (logout) */
export async function clearSession() {
  try {
    await authApi.logout();
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("zart_admin");
      sessionStorage.removeItem("zart_access_token");
      window.location.href = "/";
    }
  }
}
