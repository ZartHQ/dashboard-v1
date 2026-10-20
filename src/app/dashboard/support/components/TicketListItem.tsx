"use client";

import { Ticket } from "@/features/support/types";
import { cn, formatDateTime } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  open: "bg-[#FDF4D7] text-[#8a6f00]",
  pending: "bg-[#e0f0ff] text-[#1e5a8e]",
  resolved: "bg-[#e8f5f0] text-[#115746]",
};

interface TicketListItemProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
}

export function TicketListItem({ ticket, isSelected, onClick }: TicketListItemProps) {
  const preview = ticket.messages[ticket.messages.length - 1]?.body || "";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors flex flex-col gap-1.5",
        isSelected && "bg-[#f4fbf8] hover:bg-[#f4fbf8]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-bold text-[#1a1a1a] truncate">{ticket.subject}</span>
        <span className={cn("text-[10px] px-2 py-0.5 rounded-[10px] font-bold uppercase tracking-wider shrink-0", STATUS_STYLE[ticket.status])}>
          {ticket.status}
        </span>
      </div>
      <div className="text-[11px] text-[#aaa]">
        {ticket.requesterName} · <span className="capitalize">{ticket.requesterType}</span> · {ticket.category}
      </div>
      {preview && <div className="text-[11px] text-[#888] truncate">{preview}</div>}
      <div className="text-[10px] text-[#bbb]">{formatDateTime(ticket.updatedAt)}</div>
    </button>
  );
}
