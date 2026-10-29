"use client";

import { useAdmin } from "@/features/auth/auth";
import { useRequestCounts, useRequests } from "@/features/requests/queries";
import { useFlags } from "@/features/monitoring/queries";
import { useArtisans } from "@/features/artisans/queries";
import { usePatrons } from "@/features/patrons/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { ServiceRequest } from "@/types";
import { Calendar } from "lucide-react";

// Custom SVG Icons
const BookingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const FlagsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const RevenueIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 11h4" />
  </svg>
);

export default function DashboardPage() {
  const { admin, loading: adminLoading } = useAdmin();
  const { data: counts } = useRequestCounts();
  const { data: flags } = useFlags();
  const { data: artisans } = useArtisans();
  const { data: patrons } = usePatrons();
  const { data: recentRequests } = useRequests({ limit: 5 });

  if (adminLoading) {
    return <PageLoader />;
  }

  // Calculate dynamic stats
  const activeRequestsCount = counts
    ? (Number(counts.pending) || 0) + (Number(counts.assigned) || 0) + (Number(counts.in_progress) || 0)
    : 0;

  const openFlagsCount = flags?.filter((f: any) => f.status === "open").length || 0;
  const vettedArtisansCount = artisans?.filter((a: any) => a.vettingStatus === "approved").length || 0;
  const totalPatronsCount = patrons?.length || 0;

  const recentList = recentRequests?.data || [];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f5f5]">
      {/* Top Header */}
      <div className="bg-white border-b border-[#e8e8e8] p-[16px_24px] flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div>
          <div className="text-[18px] font-bold text-[#115746] tracking-tight">Operations Cockpit</div>
          <div className="text-[12px] text-[#aaa] mt-0.5 font-medium">
            Welcome back, <strong className="text-[#115746]">{admin?.firstName || "Admin"}</strong> · Status: Live & Connected
          </div>
        </div>
        
        {/* System Health Indicator */}
        <div className="flex items-center gap-2 bg-[#e8f5f0] border border-[#b2d8cc] rounded-[20px] p-[5px_12px] text-[11px] text-[#115746] font-semibold whitespace-nowrap shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#115746] animate-pulse" />
          API Online
        </div>
      </div>

      <div className="p-4 md:p-6 overflow-y-auto flex-1 flex flex-col gap-4 md:gap-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              title: "Active Jobs",
              value: activeRequestsCount,
              desc: "In progress, assigned, & pending",
              icon: <BookingsIcon />,
              // Each card owns a colour: emerald / blue / violet / orange.
              // `accent` tints the spine + icon chip (decorative). `textCls`
              // colours the number + icon and gets a lighter dark-mode value
              // in globals.css so it stays readable on the dark surface.
              accent: "#059669",
              textCls: "text-[#059669]",
              bg: "from-white to-[#f0fdf9]",
            },
            {
              title: "Vetted Artisans",
              value: vettedArtisansCount,
              desc: "Approved active operators",
              icon: <UserIcon />,
              accent: "#2563eb",
              textCls: "text-[#2563eb]",
              bg: "from-white to-[#eff6ff]",
            },
            {
              title: "Registered Patrons",
              value: totalPatronsCount,
              desc: "Total client accounts on Zart",
              icon: <RevenueIcon />,
              accent: "#7c3aed",
              textCls: "text-[#7c3aed]",
              bg: "from-white to-[#f5f3ff]",
            },
            {
              title: "Active Flags",
              value: openFlagsCount,
              desc: "Requires immediate attention",
              icon: <FlagsIcon />,
              accent: "#ea580c",
              textCls: "text-[#ea580c]",
              bg: "from-white to-[#fff7ed]",
            }
          ].map((stat) => (
            <Card
              key={stat.title}
              className={cn("border border-solid border-[#efeae0] border-l-4 bg-gradient-to-br", stat.bg)}
              style={{ borderLeftColor: stat.accent }}
            >
              <CardContent className="p-3.5 md:p-5 flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] md:text-[11px] text-[#aaa] font-bold uppercase tracking-wider leading-tight">{stat.title}</span>
                  <span className={cn("text-[26px] md:text-[32px] font-extrabold tracking-tight", stat.textCls)}>{stat.value}</span>
                  <span className="hidden md:block text-[11px] text-[#888] font-medium mt-0.5">{stat.desc}</span>
                </div>
                <div
                  className={cn("p-2 md:p-2.5 rounded-xl shrink-0", stat.textCls)}
                  style={{ backgroundColor: `${stat.accent}1f` }}
                >
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="flex flex-col flex-1 min-h-[360px]">
            <CardHeader className="border-b border-[#f0f0f0] flex flex-row items-center justify-between">
              <CardTitle>Recent Service Requests</CardTitle>
              <Link href="/dashboard/requests">
                <Button variant="plain" size="sm" className="text-xs">
                  View all requests ➔
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-y-auto">
              {recentList.length > 0 ? (
                <div className="flex flex-col">
                  {recentList.map((req: ServiceRequest) => (
                    <div key={req.id} className="p-4 border-b border-[#f5f5f5] last:border-b-0 hover:bg-[#fafafa] transition-colors flex justify-between items-center">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="text-[13px] font-bold text-[#1a1a1a] truncate">
                          {req.artisanType?.name || "Service Request"}
                        </div>
                        <div className="text-[11px] text-[#aaa] flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span>Patron: <strong className="text-[#666]">{req.patron?.firstName} {req.patron?.lastName}</strong></span>
                          <span>·</span>
                          <span>Location: <strong className="text-[#666]">{req.address}</strong></span>
                          {req.scheduledAt && (
                            <>
                              <span>·</span>
                              <span className="text-[#1e5a8e] font-semibold bg-[#e0f0ff] border border-[#b3d7f7] px-1.5 py-0.5 rounded-[4px] font-outfit flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#1e5a8e] shrink-0" /> {formatDateTime(req.scheduledAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={cn(
                          "text-[10px] px-2.5 py-0.5 rounded-[12px] font-bold uppercase tracking-wider",
                          req.status === "pending" && "bg-[#FDF4D7] text-[#8a6f00]",
                          req.status === "assigned" && "bg-[#e8f5f0] text-[#115746]",
                          req.status === "in_progress" && "bg-[#fff5f2] text-[#FA4812]",
                          req.status === "completed" && "bg-[#f0fdf4] text-[#15803d]",
                          req.status === "cancelled" && "bg-[#f5f5f5] text-[#737373]"
                        )}>
                          {req.status}
                        </span>
                        <Link href={`/dashboard/requests`}>
                          <Button variant="plain" size="sm" className="h-7 w-7 p-0 flex items-center justify-center rounded-lg">
                            ➔
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#bbb] p-6">
                  <div className="text-[28px] mb-1.5">📋</div>
                  <div className="text-[12px] font-semibold">No recent requests recorded.</div>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
