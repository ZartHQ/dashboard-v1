"use client";

import React from "react";
import { Artisan } from "@/types";
import { STATUS_PILL } from "../../../../features/artisans/constants";
import { cn } from "@/lib/utils";

interface ArtisanListItemProps {
  artisan: Artisan;
  isSelected: boolean;
  onClick: () => void;
}

export function ArtisanListItem({ artisan: a, isSelected, onClick }: ArtisanListItemProps) {
  const initials = `${a.user.firstName?.[0] ?? ""}${a.user.lastName?.[0] ?? ""}`.toUpperCase();
  const pill = STATUS_PILL[a.vettingStatus];

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 p-[12px_14px] border-b border-[#f5f5f5] cursor-pointer border-l-[3px] border-transparent transition-all hover:bg-[#fafafa]",
        isSelected && "bg-[#e8f5f0] border-l-[#115746]"
      )}
      onClick={onClick}
    >
      {a.user.image ? (
        <img src={a.user.image} alt="" className="w-[38px] h-[38px] rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 bg-[#e8f5f0] text-[#115746]">
          {initials || "?"}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#1a1a1a] truncate">
          {a.user.firstName} {a.user.lastName}
        </div>
        <div className="text-[11px] text-[#888] mt-0.5 truncate">
          {[a.artisanType?.name, a.operatingArea?.[0]].filter(Boolean).join(" · ")}
        </div>
      </div>
      <span className={`sp ${pill?.cls || "sp-offline"} shrink-0`}>{pill?.label || a.vettingStatus}</span>
    </div>
  );
}
