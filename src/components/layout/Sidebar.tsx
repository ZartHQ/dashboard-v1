"use client";

import Link from "next/link";
import { unsubscribeThisDevice } from "@/features/push/api";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearSession, SessionAdmin } from "../../features/auth/auth";
import { useFlags } from "../../features/monitoring/queries";
import { useRefunds } from "../../features/refunds/queries";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { AlertSoundToggle, useNewRequestAlerts } from "../alerts/NewRequestAlerts";
import { PushAlertsToggle } from "../alerts/PushAlertsToggle";
import { 
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Users,
  MessageSquare,
  Flag,
  CreditCard,
  Undo2,
  BarChart3,
  LifeBuoy,
  LogOut,
  X
} from "lucide-react";

interface SidebarProps {
  admin: SessionAdmin | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ admin, isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Pending requests this admin hasn't opened yet (tracked in NewRequestAlerts)
  const { unseenCount: newRequestsCount } = useNewRequestAlerts();

  // Pulse the Requests badge briefly whenever the count goes up
  const prevNewRequestsCount = useRef(newRequestsCount);
  const [pulseKey, setPulseKey] = useState(0);
  useEffect(() => {
    if (newRequestsCount > prevNewRequestsCount.current) setPulseKey((k) => k + 1);
    prevNewRequestsCount.current = newRequestsCount;
  }, [newRequestsCount]);

  // Fetch flags count dynamically for the sidebar badge
  const { data: flags } = useFlags();
  const openFlagsCount = flags?.length || 0;

  // Fetch refunds still to be sent for the sidebar badge
  const { data: pendingRefunds } = useRefunds("pending");
  const pendingRefundsCount = pendingRefunds?.length || 0;

  async function logout() {
    // Stop phone/desktop alerts for this device before the session goes.
    await unsubscribeThisDevice();
    clearSession();
    router.push("/");
  }

  let lastSection: string | boolean | null = null;

  const navItems = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      section: "Overview" 
    },
    { 
      href: "/dashboard/requests", 
      label: "Requests", 
      icon: ClipboardList, 
      badge: newRequestsCount > 0 ? String(newRequestsCount) : undefined,
      badgePulse: true,
      section: "Operations"
    },
    {
      href: "/dashboard/artisans",
      label: "Artisans", 
      icon: Wrench, 
      section: false 
    },
    {
      href: "/dashboard/patrons",
      label: "Patrons",
      icon: Users,
      section: false
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
      section: false
    },
    { 
      href: "/dashboard/flags",    
      label: "Flags",    
      icon: Flag, 
      badge: openFlagsCount > 0 ? String(openFlagsCount) : undefined, 
      badgeWarn: true, 
      section: "Monitor" 
    },
    { 
      href: "/dashboard/payments", 
      label: "Payments", 
      icon: CreditCard, 
      section: false 
    },
    {
      href: "/dashboard/refunds",
      label: "Refunds",
      icon: Undo2,
      badge: pendingRefundsCount > 0 ? String(pendingRefundsCount) : undefined,
      section: false
    },
    {
      href: "/dashboard/reports",
      label: "Reports",
      icon: BarChart3,
      section: false
    },
    {
      href: "/dashboard/support",
      label: "Support",
      icon: LifeBuoy,
      section: "Support"
    },
  ];

  return (
    <>
      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/45 z-[95] md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside 
        className={cn(
          "w-[220px] bg-[#0d3d31] flex flex-col flex-shrink-0 min-h-screen fixed top-0 z-[100] transition-all duration-300 md:left-0",
          isOpen ? "left-0" : "-left-[220px]"
        )}
      >
        {/* Logo and Mobile Close Toggle */}
        <div className="p-[20px_20px_18px] border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-[10px]">
              <img
                src="/zart-logo.png"
                alt="Zart"
                className="w-[28px] h-[28px] object-contain flex-shrink-0"
              />
              <span className="text-[20px] font-bold text-[#FDF4D7] tracking-[-0.5px]">Zart</span>
            </div>
            <div className="text-[10px] mt-[3px] pl-[38px] text-[#FDF4D7]/50">Operations dashboard</div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden bg-transparent border-none text-[#FDF4D7]/60 hover:text-white cursor-pointer p-1 flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto">
          {navItems.map((item, i) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <div key={i}>
                {showSection && typeof item.section === 'string' && (
                  <div className="p-[16px_16px_6px] text-[10px] text-[#FDF4D7]/40 uppercase tracking-[0.6px] font-semibold">
                    {item.section}
                  </div>
                )}
                <Link 
                  href={item.href} 
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-[10px] p-[9px_16px] text-[13px] text-[#FDF4D7]/75 cursor-pointer border-l-[3px] border-transparent transition-all hover:bg-white/5 hover:text-[#FDF4D7] no-underline",
                    isActive && "bg-white/12 text-[#FDF4D7] border-l-[#FA4812] font-semibold"
                  )}
                >
                  <Icon className={cn("w-4 h-4 text-[#FDF4D7]/65 shrink-0", isActive && "text-[#FDF4D7]")} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      key={item.badgePulse ? pulseKey : undefined}
                      className={cn(
                        "ml-auto text-[10px] p-[2px_7px] rounded-[10px] font-semibold bg-[#FA4812] text-white",
                        item.badgeWarn && "bg-[#FFC92A] text-[#1a1a1a]",
                        item.badgePulse && pulseKey > 0 && "motion-safe:animate-badge-pulse"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Theme toggle */}
        <div className="mt-auto border-t border-white/10 pt-1">
          <ThemeToggle />
          <AlertSoundToggle />
          <PushAlertsToggle />
        </div>

        {/* Admin footer */}
        <div className="p-[16px] border-t border-white/10">
          <div className="flex items-center gap-[10px]">
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className={cn(
                "flex items-center gap-[10px] flex-1 hover:bg-white/5 transition-all no-underline group min-w-0 p-1.5 -m-1.5 rounded-lg",
                pathname === "/dashboard/profile" && "bg-white/10 font-semibold"
              )}
            >
              {admin?.image ? (
                <img
                  src={admin.image}
                  alt={admin.name || "Admin"}
                  className="w-[34px] h-[34px] rounded-full object-cover flex-shrink-0 border border-white/10"
                />
              ) : (
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                  style={{ background: admin?.color || "#FA4812" }}
                >
                  {admin?.initials || "MI"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#FDF4D7] truncate group-hover:underline">{admin?.name || "Admin"}</div>
                <div className="text-[10px] text-[#FDF4D7]/50 truncate">{admin?.role || "Admin"}</div>
              </div>
            </Link>
            <button
              onClick={logout}
              className="bg-none border-none text-[#FDF4D7]/50 hover:text-white cursor-pointer flex-shrink-0 pl-1 transition-colors flex items-center justify-center p-1"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
