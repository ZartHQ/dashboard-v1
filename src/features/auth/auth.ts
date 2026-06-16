import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminProfile } from "./queries";
import { authApi } from "./api";

export interface SessionAdmin {
  id: string;
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

  return { 
    admin: admin ? {
      ...admin,
      initials: admin.initials || admin.name.substring(0, 2).toUpperCase(),
      color: admin.color || "#115746"
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
      window.location.href = "/";
    }
  }
}
