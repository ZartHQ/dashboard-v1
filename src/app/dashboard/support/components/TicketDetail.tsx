"use client";

import React, { useEffect, useRef, useState } from "react";
import { Ticket, TicketStatus, TicketMessage } from "@/features/support/types";
import { useReplyToTicket, useUpdateTicketStatus } from "@/features/support/queries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Send } from "lucide-react";

interface TicketDetailProps {
  ticket: Ticket;
  onBack: () => void;
}

export function TicketDetail({ ticket, onBack }: TicketDetailProps) {
  const reply = useReplyToTicket();
  const updateStatus = useUpdateTicketStatus();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    reply.mutate({ id: ticket.id, body });
    setDraft("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f9f9f9]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8e8e8] p-[14px_20px] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="md:hidden text-[#115746]">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-[#115746] truncate">{ticket.subject}</div>
            <div className="text-[11px] text-[#aaa] mt-0.5">
              {ticket.requesterName} · <span className="capitalize">{ticket.requesterType}</span> · {ticket.category}
            </div>
          </div>
        </div>
        <Select
          value={ticket.status}
          onChange={(e) => updateStatus.mutate({ id: ticket.id, status: e.target.value as TicketStatus })}
          className="w-auto h-9 shrink-0"
        >
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </Select>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
        {ticket.messages.map((m: TicketMessage) => (
          <div
            key={m.id}
            className={cn(
              "flex flex-col max-w-[75%]",
              m.sender === "admin" ? "self-end items-end" : "self-start items-start"
            )}
          >
            <div
              className={cn(
                "px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed break-words",
                m.sender === "admin"
                  ? "bg-[#115746] text-white rounded-br-sm"
                  : "bg-white border border-[#e8e8e8] text-[#1a1a1a] rounded-bl-sm"
              )}
            >
              {m.body}
            </div>
            <span className="text-[10px] text-[#bbb] mt-1 px-1">{formatDateTime(m.createdAt)}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-[#f0f0f0] bg-white shrink-0">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a reply..."
          className="h-10 flex-1"
        />
        <Button type="submit" disabled={!draft.trim()} isLoading={reply.isPending} className="h-10 px-4 flex items-center gap-1.5">
          <Send className="w-4 h-4" /> Send
        </Button>
      </form>
    </div>
  );
}
