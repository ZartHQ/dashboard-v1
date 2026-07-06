"use client";

import { useState } from "react";
import { Patron } from "@/types/patrons";
import { usePatrons } from "../../../features/patrons/queries";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/PageLoader";

export default function PatronsPage() {
  const { data: patrons, isLoading: patronsLoading } = usePatrons();
  const [selected, setSelected] = useState<Patron | null>(null);
  const [isMobileDetailActive, setIsMobileDetailActive] = useState(false);

  if (patronsLoading) {
    return <PageLoader />;
  }

  const patronsList = (patrons || []).map((p: any) => {
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
      joined: p.joined || (p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "March 2026"),
      spent: p.spent || (p.totalSpent ? `₦${p.totalSpent.toLocaleString()}` : "₦0"),
      activeJob: p.activeJob || null,
      pastJobs: p.pastJobs || []
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
            <Input className="h-9" placeholder="🔍  Search patrons..." />
          </div>
          {patronsList.map((p) => (
            <div 
              key={p.id} 
              className={cn(
                "flex items-center gap-2.5 p-[12px_14px] border-b border-[#f5f5f5] cursor-pointer border-l-[3px] border-transparent transition-all hover:bg-[#fafafa]",
                selected?.id === p.id && "bg-[#e8f5f0] border-l-[#115746]"
              )} 
              onClick={() => { setSelected(p); setIsMobileDetailActive(true); }}
            >
              <div 
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                style={{ background: p.avBg, color: p.avColor }}
              >{p.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#1a1a1a]">{p.name}</div>
                <div className="text-[11px] text-[#888] mt-0.5 truncate">{p.preview}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] text-[#bbb]">{p.time}</span>
                {p.unread && <div className="w-2 h-2 rounded-full bg-[#FA4812]" />}
              </div>
            </div>
          ))}
        </div>

        {/* Detail split */}
        {selected ? (
          <div className={cn(
            "flex-1 flex flex-col overflow-hidden bg-[#f9f9f9]",
            !isMobileDetailActive ? "hidden md:flex" : "flex"
          )}>
            {/* Patron header */}
            <div className="bg-white border-b border-[#e8e8e8] p-[14px_20px] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMobileDetailActive(false)}
                  className="md:hidden flex items-center gap-1 text-[13px] font-semibold text-[#115746] bg-transparent border-none cursor-pointer mr-1.5"
                >
                  ← Back
                </button>
                <div 
                  className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[14px] font-bold"
                  style={{ background: selected.avBg, color: selected.avColor }}
                >{selected.initials}</div>
                <div>
                  <div className="text-[15px] font-bold text-[#115746]">{selected.name}</div>
                  <div className="text-[11px] text-[#aaa] mt-0.5">{selected.loc} · {selected.bookings} bookings · Joined {selected.joined}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-xs h-9">📞 Call</Button>
                <Button variant="wa" className="text-xs h-9">💬 WhatsApp</Button>
              </div>
            </div>

            {/* Details Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#f9f9f9] flex flex-col gap-6">
              {/* Profile Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Patron Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Location", value: selected.loc, icon: "📍" },
                      { label: "Joined Zart", value: selected.joined, icon: "📅" },
                      { label: "Total Bookings", value: selected.bookings, icon: "🔧" },
                      { label: "Total Spent", value: selected.spent, icon: "💳" }
                    ].map((item) => (
                      <div key={item.label} className="bg-[#fafafa] border border-[#f0f0f0] p-4 rounded-xl flex flex-col gap-1.5">
                        <span className="text-[18px]">{item.icon}</span>
                        <span className="text-[11px] text-[#aaa] font-semibold uppercase tracking-wider">{item.label}</span>
                        <span className="text-[14px] font-bold text-[#115746]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bookings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Request Card */}
                <Card className="flex flex-col">
                  <CardHeader className="border-b border-[#f0f0f0]">
                    <CardTitle>Active Request</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 py-4">
                    {selected.activeJob ? (
                      <div className="bg-[#fff9e6] border border-[#ffe082] rounded-xl p-4 flex flex-col gap-2.5">
                        <div className="text-[14px] font-bold text-[#8a6f00]">{selected.activeJob.title}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[11px] text-[#b27b00] font-semibold">Request ID: #{selected.activeJob.id}</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-[12px] font-bold bg-[#ffe082] text-[#8a6f00] uppercase tracking-wider">
                            {selected.activeJob.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[13px] text-[#aaa] italic text-center py-8">
                        No active requests at the moment.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Past Bookings Card */}
                <Card className="flex flex-col">
                  <CardHeader className="border-b border-[#f0f0f0]">
                    <CardTitle>Past Bookings</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 py-4">
                    {selected.pastJobs && selected.pastJobs.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {selected.pastJobs.map((j) => (
                          <div key={j.id} className="bg-[#fcfcfc] border border-[#e8e8e8] rounded-xl p-3 flex justify-between items-center hover:border-[#115746] transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-[#1a1a1a]">{j.title}</div>
                              <span className="text-[11px] text-[#aaa] mt-0.5 inline-block">ID: #{j.id}</span>
                            </div>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-[12px] font-bold bg-[#e8f5f0] text-[#115746] uppercase tracking-wider">
                              Completed
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[13px] text-[#aaa] italic text-center py-8">
                        No past bookings recorded.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
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
