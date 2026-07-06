"use client";

import React from "react";
import { Patron } from "@/features/patrons/types";
import { cn } from "@/lib/utils";

interface PatronListItemProps {
  patron: Patron;
  isSelected: boolean;
  onClick: () => void;
}

export function PatronListItem({ patron: p, isSelected, onClick }: PatronListItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2.5 p-[12px_14px] border-b border-[#f5f5f5] cursor-pointer border-l-[3px] border-transparent transition-all hover:bg-[#fafafa]",
        isSelected && "bg-[#e8f5f0] border-l-[#115746]"
      )} 
      onClick={onClick}
    >
      <div 
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
        style={{ background: p.avBg, color: p.avColor }}
      >
        {p.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#1a1a1a]">{p.name}</div>
        <div className="text-[11px] text-[#888] mt-0.5 truncate">{p.preview}</div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-[10px] text-[#bbb]">{p.time}</span>
        {p.unread && <div className="w-2 h-2 rounded-full bg-[#FA4812]" />}
      </div>
    </div>
  );
}
