"use client";

import React from "react";
import { Patron } from "@/features/patrons/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PatronDetailsPanelProps {
  selected: Patron;
  isMobileDetailActive: boolean;
  setIsMobileDetailActive: (active: boolean) => void;
}

export function PatronDetailsPanel({
  selected,
  isMobileDetailActive,
  setIsMobileDetailActive,
}: PatronDetailsPanelProps) {
  return (
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
          >
            {selected.initials}
          </div>
          <div>
            <div className="text-[15px] font-bold text-[#115746]">{selected.name}</div>
            <div className="text-[11px] text-[#aaa] mt-0.5">{selected.loc} · {selected.bookings} bookings · Joined {selected.joined}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-xs h-9" onClick={() => window.open(`tel:${selected.id}`)}>📞 Call</Button>
          <Button variant="wa" className="text-xs h-9" onClick={() => window.open(`https://wa.me/${selected.id}`)}>💬 WhatsApp</Button>
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
  );
}
