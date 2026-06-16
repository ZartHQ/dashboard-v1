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
      <div className="p-10 font-outfit">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar admin={admin} />
      <div className="flex-1 flex flex-col ml-[220px] min-h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
