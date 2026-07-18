"use client";

import { useState } from "react";
import { Patron } from "@/features/patrons/types";
import { DbPatron } from "@/types";
import { usePatrons } from "../../../features/patrons/queries";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { PageLoader } from "@/components/ui/PageLoader";
import { Search } from "lucide-react";
import { PatronListItem } from "./components/PatronListItem";
import { PatronDetailsPanel } from "./components/PatronDetailsPanel";

export default function PatronsPage() {
  const { data: patrons, isLoading: patronsLoading } = usePatrons();
  const [selected, setSelected] = useState<Patron | null>(null);
  const [isMobileDetailActive, setIsMobileDetailActive] = useState(false);

  if (patronsLoading) {
    return <PageLoader />;
  }

  const patronsList = (patrons || []).map((p: DbPatron) => {
    const firstName = p.firstName || p.name?.split(" ")[0] || "Patron";
    const lastName = p.lastName || p.name?.split(" ")[1] || "";
    const name = p.name || `${firstName} ${lastName}`.trim();
    const initials = p.initials || `${firstName[0]}${lastName[0] || ""}`.toUpperCase();
    
    const avColors = [
      { bg: "#e8f5f0", text: "#115746" },
      { bg: "#fff3e0", text: "#c2410c" },
      { bg: "#FDF4D7", text: "#8a6f00" },
      { bg: "#f0eaff", text: "#5a3d8a" },
      { bg: "#e8f5e8", text: "#166534" }
    ];
    const colorPair = avColors[p.id % avColors.length] || avColors[0];

    return {
      ...p,
      name,
      initials,
      avBg: p.avBg || colorPair.bg,
      avColor: p.avColor || colorPair.text,
      loc: p.loc || "Lagos, Nigeria",
      bookings: p.bookings ?? p.bookingsCount ?? 0,
      joined: p.joined || (p.createdAt ? formatDate(p.createdAt) : "March 2026"),
      spent: p.spent || (p.totalSpent ? formatCurrency(p.totalSpent) : "₦0"),
      activeJob: p.activeJob || null,
      pastJobs: p.pastJobs || [],
      preview: p.preview || "",
      unread: !!p.unread,
      time: p.time || ""
    };
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar */}
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between shrink-0">
        <div className="text-[16px] font-bold text-[#115746]">Patrons <span className="text-[#aaa] font-normal text-[13px] ml-1.5">{patronsList.length} total</span></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Patron list */}
        <div className={cn(
          "w-full md:w-[300px] flex-shrink-0 border-r border-[#e8e8e8] bg-white overflow-y-auto",
          isMobileDetailActive ? "hidden md:block" : "block"
        )}>
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#aaa]" />
              <Input className="h-9 pl-9 w-full" placeholder="Search patrons..." />
            </div>
          </div>
          {patronsList.map((p) => (
            <PatronListItem
              key={p.id}
              patron={p}
              isSelected={selected?.id === p.id}
              onClick={() => { setSelected(p); setIsMobileDetailActive(true); }}
            />
          ))}
        </div>

        {/* Detail split */}
        {selected ? (
          <PatronDetailsPanel
            selected={selected}
            isMobileDetailActive={isMobileDetailActive}
            setIsMobileDetailActive={setIsMobileDetailActive}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f9f9f9] text-[#bbb] font-outfit p-6">
            <img 
              src="/zart-logo-green.svg" 
              alt="Zart Logo" 
              className="w-16 h-16 object-contain mb-4" 
            />
            <div className="text-[14px] font-semibold text-[#888] tracking-wide">Select a patron to view details</div>
          </div>
        )}
      </div>
    </div>
  );
}
