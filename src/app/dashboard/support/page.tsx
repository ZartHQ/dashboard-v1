"use client";

import { useState } from "react";
import { useTickets } from "@/features/support/queries";
import { TicketStatus } from "@/features/support/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/PageLoader";
import { cn } from "@/lib/utils";
import { Search, Plus, LifeBuoy } from "lucide-react";
import { TicketListItem } from "./components/TicketListItem";
import { TicketDetail } from "./components/TicketDetail";
import { NewTicketModal } from "./components/NewTicketModal";

const TABS: { label: string; value: TicketStatus | "all" }[] = [
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "All", value: "all" },
];

export default function SupportPage() {
  const { data: tickets, isLoading } = useTickets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<TicketStatus | "all">("open");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [mobileDetail, setMobileDetail] = useState(false);

  if (isLoading) return <PageLoader />;

  const all = tickets || [];
  const filtered = all.filter((t) => {
    const matchesTab = tab === "all" || t.status === tab;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || t.subject.toLowerCase().includes(q) || t.requesterName.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const selected = all.find((t) => t.id === selectedId) || null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar */}
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_24px] flex items-center justify-between shrink-0">
        <div className="text-[16px] font-bold text-[#115746]">
          Support <span className="text-[#aaa] font-normal text-[13px] ml-1.5">{all.length} tickets</span>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> New ticket
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className={cn(
          "w-full md:w-[320px] flex-shrink-0 border-r border-[#e8e8e8] bg-white flex flex-col",
          mobileDetail ? "hidden md:flex" : "flex"
        )}>
          <div className="p-3 flex flex-col gap-3 border-b border-[#f0f0f0]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#aaa]" />
              <Input className="h-9 pl-9 w-full" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "text-[12px] px-3 py-1 rounded-[16px] border-[1.5px] border-[#e0e0e0] text-[#888] font-medium transition-all hover:border-[#115746]",
                    tab === t.value && "bg-[#115746] text-white border-[#115746]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((t) => (
                <TicketListItem
                  key={t.id}
                  ticket={t}
                  isSelected={selectedId === t.id}
                  onClick={() => { setSelectedId(t.id); setMobileDetail(true); }}
                />
              ))
            ) : (
              <div className="text-[13px] text-[#aaa] italic text-center py-10 px-4">No tickets here.</div>
            )}
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <div className={cn("flex-1", mobileDetail ? "flex" : "hidden md:flex")}>
            <TicketDetail ticket={selected} onBack={() => setMobileDetail(false)} />
          </div>
        ) : (
          <div className="flex-1 flex-col items-center justify-center bg-[#f9f9f9] text-[#bbb] p-6 hidden md:flex">
            <LifeBuoy className="w-14 h-14 mb-4 text-[#ddd]" />
            <div className="text-[14px] font-semibold text-[#888]">Select a ticket to view it</div>
          </div>
        )}
      </div>

      {showNew && (
        <NewTicketModal
          onClose={() => setShowNew(false)}
          onCreated={(id) => { setSelectedId(id); setMobileDetail(true); }}
        />
      )}
    </div>
  );
}
