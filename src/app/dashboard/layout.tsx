"use client";

import Sidebar from "../../components/layout/Sidebar";
import { useAdmin } from "../../features/auth/auth";
import { PageLoader } from "@/components/ui/PageLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageLoader />
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
