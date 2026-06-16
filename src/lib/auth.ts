import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Admin } from "./admins";

export interface SessionAdmin {
  id: number;
  name: string;
  initials: string;
  role: string;
  color: string;
}

/** Save admin session to sessionStorage */
export function saveSession(admin: Admin) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    "zart_admin",
    JSON.stringify({ id: admin.id, name: admin.name, initials: admin.initials, role: admin.roleLabel, color: admin.color })
  );
}

/** Read admin session from sessionStorage */
export function getSession(): SessionAdmin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("zart_admin");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Clear session (logout) */
export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("zart_admin");
}

/** Hook: returns current admin or redirects to login */
export function useAdmin() {
  const router = useRouter();
  const [admin, setAdmin] = useState<SessionAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/");
    } else {
      setAdmin(session);
      setLoading(false);
    }
  }, [router]);

  return { admin, loading };
}
