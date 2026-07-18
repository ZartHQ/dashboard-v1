"use client";

import React from "react";
import { ServiceRequest } from "@/types";
import { STATUS_LABELS } from "../../../../features/requests/constants";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";

interface RequestListItemProps {
  request: ServiceRequest;
  isSelected: boolean;
  onClick: () => void;
}

export function RequestListItem({ request, isSelected, onClick }: RequestListItemProps) {
  const r = request;
  return (
    <div
      className={cn(
        "p-[14px_16px] border-b border-[#f0f0f0] cursor-pointer border-l-[3px] border-transparent transition-all hover:bg-[#fafafa]",
        isSelected && "bg-[#e8f5f0] border-l-[#115746]"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="text-[13px] font-semibold text-[#1a1a1a] flex-1 mr-2 leading-tight">{r.title}</div>
        <span className={cn(
          "text-[9px] font-bold px-2 py-0.5 rounded-[12px] border shrink-0 mt-0.5",
          r.status === 'pending' && "bg-[#FDF4D7] text-[#8a6f00] border-[#e8d98a]",
          r.status === 'assigned' && "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]",
          r.status === 'in_progress' && "bg-[#fff5f2] text-[#FA4812] border-[#ffd4c7]",
          r.status === 'completed' && "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]",
          r.status === 'cancelled' && "bg-[#f5f5f5] text-[#737373] border-[#e5e5e5]",
          r.status === 'disputed' && "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]"
        )}>
          {STATUS_LABELS[r.status] || r.status}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className={cn("text-[10px] px-2 py-0.5 rounded-[6px] font-semibold", `cat-${r.artisanType?.name?.toLowerCase().substring(0, 5)}`,
          r.artisanType?.name?.toLowerCase().includes('plumb') && "bg-[#e0f0ff] text-[#1e5a8e]",
          r.artisanType?.name?.toLowerCase().includes('elec') && "bg-[#fff3cc] text-[#8a5f00]",
          r.artisanType?.name?.toLowerCase().includes('carp') && "bg-[#e8f5e8] text-[#2a6b2a]",
          r.artisanType?.name?.toLowerCase().includes('paint') && "bg-[#f0eaff] text-[#5a3d8a]",
          r.artisanType?.name?.toLowerCase().includes('ac') && "bg-[#e0f8f8] text-[#1a6a6a]",
          r.artisanType?.name?.toLowerCase().includes('clean') && "bg-[#ffe8e8] text-[#8a2020]"
        )}>{r.artisanType?.name}</span>
        <span className="text-[11px] text-[#888]">{r.patron?.firstName} {r.patron?.lastName}</span>
      </div>
      <div className="flex justify-between items-end">
        <span className="text-[11px] text-[#aaa] truncate max-w-[150px] flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#aaa] shrink-0" /> {r.address}
        </span>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] text-[#bbb] font-outfit">Created: {formatDate(r.createdAt || new Date())}</span>
          {r.scheduledAt && (
            <span className="text-[10px] font-semibold text-[#1e5a8e] bg-[#e0f0ff] border border-[#b3d7f7] px-2 py-0.5 rounded-[12px] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#1e5a8e] shrink-0" /> {formatDateTime(r.scheduledAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
