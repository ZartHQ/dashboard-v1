/**
 * ZART ADMIN ACCESS LIST
 * ─────────────────────
 * This file is the single source of truth for who can access the dashboard.
 * To ADD an admin:  add a new object to the ADMINS array.
 * To REMOVE access: delete their object from the array.
 * Changes take effect immediately on next deployment.
 *
 * In production, migrate this to your Supabase `admins` table.
 */

export interface Admin {
  id: number;
  name: string;
  initials: string;
  email: string;
  password?: string;
  role: string;
  roleLabel: string;
  color: string;
}

export const ADMINS: Admin[] = [
  {
    id: 1,
    name: "Mia",
    initials: "MI",
    email: "mia@zart.ng",
    password: "zart2026!mia",       // Change before going live
    role: "super_admin",
    roleLabel: "Super Admin",
    color: "#115746",
  },
  {
    id: 2,
    name: "Ifedamola",
    initials: "IF",
    email: "ifedamola@zart.ng",
    password: "zart2026!ife",       // Change before going live
    role: "admin",
    roleLabel: "Admin",
    color: "#FA4812",
  },
];

/** Find an admin by email + password. Returns admin object or null. */
export function authenticate(email: string, password: string): Admin | null {
  return (
    ADMINS.find(
      (a) =>
        a.email.toLowerCase() === email.toLowerCase() &&
        a.password === password
    ) || null
  );
}

/** Check if a stored session matches a known admin. */
export function getAdminFromSession(sessionData: any): Admin | null {
  if (!sessionData) return null;
  return ADMINS.find((a) => a.id === sessionData.id) || null;
}
