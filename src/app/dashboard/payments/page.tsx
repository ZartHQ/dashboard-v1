"use client";

import { useAdmin } from "../../../features/auth/auth";
import { BADGE } from "../../../features/payments/constants";
import { usePayments } from "../../../features/payments/queries";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/PageLoader";

export default function PaymentsPage() {
  const { admin, loading: adminLoading } = useAdmin();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  if (adminLoading || paymentsLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="text-[16px] font-bold text-[#115746]">Payments</div>
        <Button variant="outline" size="sm">↓ Export CSV</Button>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Total invoiced", val: "₦1.4M", sub: "+₦180k this week", up: true }, 
            { label: "Zart commission (8%)", val: "₦112k", sub: "Earned this month", up: true }, 
            { label: "Awaiting payment", val: "₦84k", sub: "12 invoices pending", up: false }, 
            { label: "Disputed", val: "2", sub: "Needs resolution", up: false }
          ].map((m) => (
            <Card key={m.label} className="p-[14px_16px]">
              <div className="text-[11px] text-[#aaa] mb-1.5 uppercase tracking-wider font-semibold">{m.label}</div>
              <div className={cn("text-[26px] font-bold", !m.up && m.label === "Disputed" ? "text-[#FA4812]" : "text-[#115746]")}>{m.val}</div>
              <div className={cn("text-[11px] mt-1 font-medium", m.up ? "text-[#166534]" : "text-[#c2410c]")}>{m.sub}</div>
            </Card>
          ))}
        </div>
        <div className="flex justify-between items-center gap-3 mb-4 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {["All", "Paid", "Invoice sent", "Pending", "Disputed"].map((c, i) => (
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
          <Input className="max-w-[240px] h-9" placeholder="🔍  Search by job or patron..." />
        </div>
        <Card className="rounded-[14px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-[11px] text-[#aaa] p-[10px_16px] text-left font-bold tracking-wider uppercase border-b-[1.5px] border-[#f0f0f0] bg-[#fafafa]">Job</th>
                  <th className="text-[11px] text-[#aaa] p-[10px_16px] text-left font-bold tracking-wider uppercase border-b-[1.5px] border-[#f0f0f0] bg-[#fafafa]">Patron</th>
                  <th className="text-[11px] text-[#aaa] p-[10px_16px] text-left font-bold tracking-wider uppercase border-b-[1.5px] border-[#f0f0f0] bg-[#fafafa]">Artisan</th>
                  <th className="text-[11px] text-[#aaa] p-[10px_16px] text-left font-bold tracking-wider uppercase border-b-[1.5px] border-[#f0f0f0] bg-[#fafafa]">Invoice amount</th>
                  <th className="text-[11px] text-[#aaa] p-[10px_16px] text-left font-bold tracking-wider uppercase border-b-[1.5px] border-[#f0f0f0] bg-[#fafafa]">Zart fee</th>
                  <th className="text-[11px] text-[#aaa] p-[10px_16px] text-left font-bold tracking-wider uppercase border-b-[1.5px] border-[#f0f0f0] bg-[#fafafa]">Status</th>
                  <th className="text-[11px] text-[#aaa] p-[10px_16px] text-left font-bold tracking-wider uppercase border-b-[1.5px] border-[#f0f0f0] bg-[#fafafa]">Date</th>
                  <th className="text-[11px] text-[#aaa] p-[10px_16px] text-left font-bold tracking-wider uppercase border-b-[1.5px] border-[#f0f0f0] bg-[#fafafa]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f9fffe] group">
                    <td className="p-[12px_16px] border-b border-[#f8f8f8] align-middle group-last:border-none">
                      <div className="text-[13px] font-semibold text-[#1a1a1a]">{p.job}</div>
                      <div className="text-[11px] text-[#aaa] mt-0.5">#{p.id}</div>
                    </td>
                    <td className="p-[12px_16px] border-b border-[#f8f8f8] align-middle text-[13px] text-[#1a1a1a] group-last:border-none">{p.patron}</td>
                    <td className="p-[12px_16px] border-b border-[#f8f8f8] align-middle text-[13px] text-[#1a1a1a] group-last:border-none">{p.artisan}</td>
                    <td className="p-[12px_16px] border-b border-[#f8f8f8] align-middle group-last:border-none">
                      <div className="font-bold text-[#115746]">₦{p.amount.toLocaleString()}</div>
                    </td>
                    <td className="p-[12px_16px] border-b border-[#f8f8f8] align-middle group-last:border-none">
                      <div className="text-[11px] text-[#FA4812] font-medium">{p.fee ? `₦${p.fee.toLocaleString()}` : "—"}</div>
                    </td>
                    <td className="p-[12px_16px] border-b border-[#f8f8f8] align-middle group-last:border-none">
                      <Badge variant={p.status as any}>{BADGE[p.status].label}</Badge>
                    </td>
                    <td className="p-[12px_16px] border-b border-[#f8f8f8] align-middle text-[#aaa] text-[12px] group-last:border-none">{p.date}</td>
                    <td className="p-[12px_16px] border-b border-[#f8f8f8] align-middle group-last:border-none">
                      <div className="flex gap-1.5">
                        <Button variant="outline" className="text-[11px] h-7 px-2.5">View</Button>
                        {p.status === "invoiced" && <Button variant="wa" className="text-[11px] h-7 px-2.5">Send via app</Button>}
                        {p.status === "disputed" && <Button variant="danger" className="text-[11px] h-7 px-2.5">Refund</Button>}
                        {p.status === "pending" && <Button variant="orange" className="text-[11px] h-7 px-2.5">Generate invoice</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-[12px_16px] border-t border-[#f0f0f0] bg-[#fafafa]">
            <span className="text-[12px] text-[#aaa]">Showing {payments?.length || 0} of 128 transactions</span>
            <div className="flex gap-1.5">
              {["1", "2", "3", "→"].map((p, i) => (
                <button 
                  key={p} 
                  className={cn(
                    "text-[12px] p-[5px_12px] rounded-[6px] border-[1.5px] border-[#e0e0e0] text-[#888] font-semibold bg-white cursor-pointer transition-all",
                    i === 0 && "bg-[#115746] text-white border-[#115746]"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
