"use client";

import React from "react";
import { ServiceRequest } from "@/types";
import { STATUS_LABELS } from "../../../../features/requests/constants";
import { cn, formatDateTime } from "@/lib/utils";
import { MapPin, CalendarClock } from "lucide-react";

interface RequestListItemProps {
  request: ServiceRequest;
  isSelected: boolean;
  onClick: () => void;
}

// Brand-only status styles: green / yellow / orange + neutral grey.
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#FDF4D7] text-[#8a6500] border-[#e8d98a]",
  assigned: "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]",
  in_progress: "bg-[#fff5f2] text-[#FA4812] border-[#ffd4c7]",
  completed: "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]",
  cancelled: "bg-[#f5f5f5] text-[#737373] border-[#e5e5e5]",
  disputed: "bg-[#fff5f2] text-[#FA4812] border-[#ffd4c7]",
};

// Colored left stripe per status — a quick colour cue you can scan.
const STATUS_ACCENT: Record<string, string> = {
  pending: "border-l-[#FFC92A]",
  assigned: "border-l-[#16a34a]",
  in_progress: "border-l-[#FA4812]",
  completed: "border-l-[#16a34a]",
  cancelled: "border-l-[#9aa0a6]",
  disputed: "border-l-[#FA4812]",
};

export function RequestListItem({ request, isSelected, onClick }: RequestListItemProps) {
  const r = request;
  const patron = `${r.patron?.firstName || ""} ${r.patron?.lastName || ""}`.trim() || "Unknown patron";
  const category = r.artisanType?.name || "";
  const title = r.title || "";
  // Show the title only when it adds something beyond the category name.
  const showTitle = title && title.toLowerCase() !== category.toLowerCase();

  return (
    <div
      className={cn(
        "rounded-[12px] border border-[#e8e8e8] border-l-[5px] bg-white p-4 mb-2.5 cursor-pointer transition-all hover:shadow-sm",
        STATUS_ACCENT[r.status] || STATUS_ACCENT.cancelled,
        isSelected && "bg-[#e8f5f0] shadow-sm ring-1 ring-[#115746]/30"
      )}
      onClick={onClick}
    >
      {/* Row 1: who + status */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="text-[15px] font-bold text-[#1a1a1a] leading-tight truncate">{patron}</div>
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wide",
            STATUS_STYLES[r.status] || STATUS_STYLES.cancelled
          )}
        >
          {STATUS_LABELS[r.status] || r.status}
        </span>
      </div>

      {/* Row 2: category + optional title */}
      <div className="flex items-center gap-2 mb-2.5 min-w-0">
        <span className="text-[10px] px-2 py-0.5 rounded-[6px] font-bold bg-[#e8f5f0] text-[#115746] shrink-0 uppercase tracking-wide">
          {category}
        </span>
        {showTitle && <span className="text-[13px] text-[#333] font-medium truncate">{title}</span>}
      </div>

      {/* Row 3: where + when */}
      <div className="flex items-center justify-between gap-3 text-[12px] min-w-0">
        <span className="flex items-center gap-1.5 text-[#666] truncate min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#888] shrink-0" />
          <span className="truncate">{r.address}</span>
        </span>
        {r.scheduledAt && (
          <span className="flex items-center gap-1.5 shrink-0 text-[#115746] font-semibold">
            <CalendarClock className="w-3.5 h-3.5 shrink-0" />
            {formatDateTime(r.scheduledAt)}
          </span>
        )}
      </div>
    </div>
  );
}
