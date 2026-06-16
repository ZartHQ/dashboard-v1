"use client";

import { useAdmin } from "../../../features/auth/auth";
import { useReports } from "../../../features/reports/queries";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const { admin, loading: adminLoading } = useAdmin();
  const { data: reports, isLoading: reportsLoading } = useReports();

  if (adminLoading || reportsLoading) {
    return <div className="p-10 font-outfit">Loading reports...</div>;
  }

  const { categories, topArtisans } = reports || { categories: [], topArtisans: [] };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="text-[16px] font-bold text-[#115746]">Reports</div>
        <div className="flex gap-2.5 items-center">
          <Select className="w-auto h-9"><option>This week</option><option>This month</option><option>Last 3 months</option><option>All time</option></Select>
          <Button variant="outline" size="sm">↓ Export CSV</Button>
        </div>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Jobs completed", val: "128", sub: "+18 vs last week" }, 
            { label: "New patrons", val: "24", sub: "+6 vs last week" }, 
            { label: "Revenue invoiced", val: "₦1.4M", sub: "+₦180k" }, 
            { label: "Completion rate", val: "90%", sub: "Target: 85% ✓" }
          ].map((m) => (
            <Card key={m.label} className="p-[14px_16px]">
              <div className="text-[11px] text-[#aaa] mb-1.5 uppercase tracking-wider font-semibold">{m.label}</div>
              <div className="text-[26px] font-bold text-[#115746]">{m.val}</div>
              <div className="text-[11px] mt-1 font-medium text-[#166534]">{m.sub}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Category bar chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#e8e8e8]">
              <CardTitle>Jobs by category</CardTitle>
              <span className="text-[11px] text-[#aaa]">This week</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {categories.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-[#1a1a1a] w-[70px] shrink-0">{c.label}</span>
                  <div className="flex-1 bg-[#f5f5f5] h-2 rounded-[4px] overflow-hidden">
                    <div className="h-full rounded-[4px]" style={{ width: `${c.pct}%`, background: c.color }} />
                  </div>
                  <span className="text-[11px] text-[#aaa] w-[40px] text-right font-medium">{c.jobs} jobs</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top artisans */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#e8e8e8]">
              <CardTitle>Top artisans</CardTitle>
              <span className="text-[11px] text-[#aaa]">By jobs completed</span>
            </CardHeader>
            <div className="flex flex-col">
              {topArtisans.map((a) => (
                <div key={a.rank} className="flex items-center justify-between p-[10px_16px] border-b border-[#f8f8f8] last:border-b-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[12px] font-bold text-[#aaa] w-[18px]">{a.rank}</span>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: a.bg, color: a.color }}
                    >{a.initials}</div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#1a1a1a]">{a.name}</div>
                      <div className="text-[11px] text-[#aaa]">{a.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-[#115746]">{a.jobs} jobs</div>
                    <div className="text-[11px] text-[#FA4812] mt-[1px]">★ {a.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Platform health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#e8e8e8]">
            <CardTitle>Platform health</CardTitle>
            <span className="text-[11px] text-[#aaa]">Key operational metrics</span>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#f9f9f9]">
            {[
              { val: "18 min", label: "Avg response time" }, 
              { val: "2.4 hrs", label: "Avg job duration" }, 
              { val: "73%", label: "Patron repeat rate" }, 
              { val: "1.6%", label: "Dispute rate", warn: true }
            ].map((h) => (
              <div key={h.label} className="bg-white border border-[#e8e8e8] rounded-[10px] p-[16px_20px] text-center">
                <div className={cn("text-[20px] font-bold mb-1.5", h.warn ? "text-[#c2410c]" : "text-[#1a1a1a]")}>{h.val}</div>
                <div className="text-[11px] text-[#aaa] font-medium uppercase tracking-wider">{h.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
