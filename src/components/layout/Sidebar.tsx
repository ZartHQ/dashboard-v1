"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { clearSession, SessionAdmin } from "../../features/auth/auth";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  badgeWarn?: boolean;
  section?: string | boolean;
}

const NAV: NavItem[] = [
  { href: "/dashboard/requests", label: "Requests", icon: "📋", badge: "7", section: "Operations" },
  { href: "/dashboard/artisans", label: "Artisans", icon: "🔧", section: false },
  { href: "/dashboard/patrons",  label: "Patrons",  icon: "👤", section: false },
  { href: "/dashboard/flags",    label: "Flags",    icon: "⚠️", badge: "3", badgeWarn: true, section: "Monitor" },
  { href: "/dashboard/payments", label: "Payments", icon: "💳", section: false },
  { href: "/dashboard/reports",  label: "Reports",  icon: "📊", section: false },
];

interface SidebarProps {
  admin: SessionAdmin | null;
}

export default function Sidebar({ admin }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  function logout() {
    clearSession();
    router.push("/");
  }

  let lastSection: string | boolean | null = null;

  return (
    <aside className="w-[220px] bg-[#115746] flex flex-col flex-shrink-0 min-h-screen fixed top-0 left-0 z-[100]">
      {/* Logo */}
      <div className="p-[20px_20px_18px] border-b border-white/10">
        <div className="flex items-center gap-[10px]">
          <img
            src="/zart-logo.png"
            alt="Zart"
            className="w-[28px] h-[28px] object-contain flex-shrink-0"
          />
          <span className="text-[20px] font-bold text-[#FDF4D7] tracking-[-0.5px]">Zart</span>
        </div>
        <div className="text-[10px] color-white/50 mt-[3px] pl-[38px] text-[#FDF4D7]/50">Operations dashboard</div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {NAV.map((item, i) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          const isActive = pathname === item.href;
          return (
            <div key={i}>
              {showSection && typeof item.section === 'string' && (
                <div className="p-[16px_16px_6px] text-[10px] text-[#FDF4D7]/40 uppercase tracking-[0.6px] font-semibold">
                  {item.section}
                </div>
              )}
              <Link 
                href={item.href} 
                className={cn(
                  "flex items-center gap-[10px] p-[9px_16px] text-[13px] text-[#FDF4D7]/75 cursor-pointer border-l-[3px] border-transparent transition-all hover:bg-white/5 hover:text-[#FDF4D7] no-underline",
                  isActive && "bg-white/12 text-[#FDF4D7] border-l-[#FA4812] font-semibold"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-[10px] p-[2px_7px] rounded-[10px] font-semibold bg-[#FA4812] text-white",
                    item.badgeWarn && "bg-[#FFC92A] text-[#1a1a1a]"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Admin footer */}
      <div className="mt-auto p-[16px] border-t border-white/10">
        <div className="flex items-center gap-[10px]">
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
            style={{ background: admin?.color || "#FA4812" }}
          >
            {admin?.initials || "MI"}
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-[#FDF4D7]">{admin?.name || "Admin"}</div>
            <div className="text-[10px] text-[#FDF4D7]/50">{admin?.role || "Admin"}</div>
          </div>
          <button
            onClick={logout}
            className="bg-none border-none text-[#FDF4D7]/50 cursor-pointer text-[18px]"
            title="Log out"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}
