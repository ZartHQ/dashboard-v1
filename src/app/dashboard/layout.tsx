"use client";

import Sidebar from "../../components/layout/Sidebar";
import { useAdmin } from "../../features/auth/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div style={{ padding: 40, fontFamily: "Outfit, sans-serif" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar admin={admin} />
      <div className="main">{children}</div>
    </div>
  );
}
