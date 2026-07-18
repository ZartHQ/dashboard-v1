"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useAdmin } from "../../features/auth/auth";
import { PageLoader } from "@/components/ui/PageLoader";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] text-[#1a1a1a] relative">
      {/* Sidebar Navigation */}
      <Sidebar 
        admin={admin} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main workspace area */}
      <div className="flex-1 flex flex-col md:ml-[220px] min-h-screen overflow-hidden">
        {/* Mobile top-header bar */}
        <header className="bg-white border-b border-[#e8e8e8] px-5 py-3.5 flex items-center justify-between md:hidden sticky top-0 z-[80] shadow-xs">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1 -ml-1 text-[#115746] hover:text-gray-700 bg-transparent border-none cursor-pointer flex items-center justify-center"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-[10px]">
            <img
              src="/zart-logo.png"
              alt="Zart"
              className="w-[28px] h-[28px] object-contain flex-shrink-0"
            />
            <span className="text-[18px] font-bold text-[#115746] tracking-[-0.5px]">Zart</span>
          </div>
          
          {/* Empty element for center balancing */}
          <div className="w-8" />
        </header>

        {children}
      </div>
    </div>
  );
}
