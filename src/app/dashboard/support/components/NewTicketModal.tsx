"use client";

import React, { useState } from "react";
import { useCreateTicket } from "@/features/support/queries";
import { TicketRequesterType } from "@/features/support/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { X } from "lucide-react";

interface NewTicketModalProps {
  onClose: () => void;
  onCreated: (id: string) => void;
}

export function NewTicketModal({ onClose, onCreated }: NewTicketModalProps) {
  const createTicket = useCreateTicket();
  const [subject, setSubject] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterType, setRequesterType] = useState<TicketRequesterType>("patron");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");

  const canSubmit = subject.trim() && requesterName.trim() && message.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    createTicket.mutate(
      { subject: subject.trim(), requesterName: requesterName.trim(), requesterType, category, message: message.trim() },
      { onSuccess: (ticket) => { onCreated(ticket.id); onClose(); } }
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[460px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-[16px_20px] border-b border-[#f0f0f0]">
          <div className="text-[15px] font-bold text-[#115746]">New ticket</div>
          <button onClick={onClose} className="text-[#aaa] hover:text-[#1a1a1a]"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#666] mb-1.5">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Refund not received" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#666] mb-1.5">Requester</label>
              <Input value={requesterName} onChange={(e) => setRequesterName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#666] mb-1.5">Type</label>
              <Select value={requesterType} onChange={(e) => setRequesterType(e.target.value as TicketRequesterType)} className="h-10">
                <option value="patron">Patron</option>
                <option value="artisan">Artisan</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#666] mb-1.5">Category</label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10">
              <option>General</option>
              <option>Payments</option>
              <option>Account</option>
              <option>Technical</option>
              <option>Complaint</option>
            </Select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#666] mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue..."
              rows={4}
              className="w-full rounded-md border-[1.5px] border-[#e0e0e0] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-[#115746] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="plain" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!canSubmit} isLoading={createTicket.isPending}>Create ticket</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
