"use client";

import { useFlags, useQueueStats } from "../../../features/monitoring/queries";
import { useRetryFailedMutation } from "../../../features/monitoring/mutations";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/PageLoader";
import { Flag, FlagPerson } from "@/types";
import { AlertTriangle, Star, MessageSquare } from "lucide-react";

export default function FlagsPage() {
  const { data: flags, isLoading: isFlagsLoading } = useFlags();
  const { data: stats, isLoading: isStatsLoading } = useQueueStats();
  const retryMutation = useRetryFailedMutation();

  const isLoading = isFlagsLoading || isStatsLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between sticky top-0 z-50">
        <div className="text-[16px] font-bold text-[#115746]">Monitoring &amp; Queue Stats</div>
        <Button 
          variant="orange" 
          onClick={() => retryMutation.mutate()}
          disabled={retryMutation.isPending}
          size="sm"
        >
          {retryMutation.isPending ? "Retrying..." : "Retry Failed Queues"}
        </Button>
      </div>
      <div className="p-6 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Queued", val: stats?.waiting.toString() || "0", sub: "Waiting", subColor: "#aaa" },
            { label: "Active", val: stats?.active.toString() || "0", sub: "Processing", subColor: "#166534" },
            { label: "Failed", val: stats?.failed.toString() || "0", sub: "Needs retry", subColor: "#c2410c" },
            { label: "Completed", val: stats?.completed.toString() || "0", sub: "All time", subColor: "#166534" }
          ].map((m) => (
            <Card key={m.label} className="p-[14px_16px]">
              <div className="text-[11px] text-[#aaa] mb-1.5 uppercase tracking-wider font-semibold">{m.label}</div>
              <div className={cn("text-[26px] font-bold", m.label === "Failed" ? "text-[#FA4812]" : "text-[#115746]")}>{m.val}</div>
              <div className="text-[11px] mt-1 font-medium" style={{ color: m.subColor }}>{m.sub}</div>
            </Card>
          ))}
        </div>

        <div className="text-[16px] font-bold text-[#115746] mt-6 mb-4">Flags &amp; Alerts</div>
        <div className="flex gap-1.5 mb-4">
          {["Open", "Resolved", "All time"].map((c, i) => (
            <button 
              key={c} 
              className={cn(
                "text-[12px] p-[5px_14px] rounded-[20px] border-[1.5px] border-[#e0e0e0] text-[#888] font-medium transition-all hover:border-[#115746] hover:text-[#115746]",
                i === 0 && "bg-[#115746] text-white border-[#115746]"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col gap-3.5">
          {(Array.isArray(flags) ? (flags as Flag[]) : [])?.map((f: Flag) => (
            <Card key={f.id} className={cn(f.priority === "high" && "border-[#FA4812]")}>
              <div className={cn("p-[14px_18px] border-b border-[#f0f0f0] flex items-center justify-between", f.priority === "high" && "bg-[#fff8f6]")}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-9 h-9 rounded-[10px] flex items-center justify-center", f.priority === "high" ? "bg-[#ffe8e8]" : "bg-[#fff3e0]")}>
                    {f.priority === "high" ? (
                      <AlertTriangle className="w-5 h-5 text-[#FA4812]" />
                    ) : f.id === 3 ? (
                      <Star className="w-5 h-5 fill-[#b27b00] text-[#b27b00]" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-[#8a5f00]" />
                    )}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1a1a1a]">{f.title}</div>
                    <div className="text-[11px] text-[#aaa] mt-0.5">{f.sub}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={f.priority === "high" ? "disputed" : "invoiced"}>
                    {f.priority === "high" ? "High priority" : "Medium"}
                  </Badge>
                  <Badge variant="pending">Open</Badge>
                  <span className="text-[11px] text-[#bbb]">{f.time}</span>
                </div>
              </div>
              <div className="p-[16px_18px] flex gap-5 items-start">
                <p className="text-[13px] text-[#555] leading-relaxed flex-1">{f.desc}</p>
                <div className="flex gap-5 shrink-0">
                  {[f.artisan, f.patron].map((p: FlagPerson, i: number) => (
                    <div key={i} className="text-center">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white mb-1.5 mx-auto"
                        style={{ background: p?.bg || "#eee", color: p?.color || "#888" }}
                      >
                        {p?.initials || "??"}
                      </div>
                      <div className="text-[10px] text-[#aaa]">{i === 0 ? "Artisan" : "Patron"}</div>
                      <div className="text-[12px] font-semibold text-[#1a1a1a]">{p?.name || "Unknown"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-[12px_18px] border-t border-[#f0f0f0] bg-[#f9f9f9] flex gap-2 flex-wrap">
                {f.actions?.map((a: string, i: number) => (
                  <Button 
                    key={a} 
                    variant={i === 1 ? "danger" : i === 2 ? "outline" : "plain"} 
                    className="text-[12px] h-8"
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
        {flags?.length === 0 && <p className="text-center text-[#aaa] py-5 font-outfit text-sm">No flags detected.</p>}
      </div>
    </>
  );
}
