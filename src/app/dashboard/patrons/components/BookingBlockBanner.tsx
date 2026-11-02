"use client";

import React from "react";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePatronDetail } from "@/features/patrons/queries";
import { useUnblockPatronMutation } from "@/features/patrons/mutations";

/**
 * Shown when a patron has cancelled so often they can't book. Support talks
 * to them, then unblocks them here.
 */
export function BookingBlockBanner({ patronId }: { patronId: number }) {
  const { data: detail } = usePatronDetail(patronId);
  const unblock = useUnblockPatronMutation();

  if (!detail?.bookingBlocked) return null;

  return (
    <div className="bg-[#ffe8e8] border border-[#f5b5b5] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <Ban className="w-5 h-5 text-[#c41c1c] shrink-0 mt-0.5" />
        <div>
          <div className="text-[14px] font-bold text-[#c41c1c]">Blocked from booking</div>
          <div className="text-[12px] text-[#8a2a2a] mt-0.5">
            Cancelled {detail.recentCancellations} requests in the last 30 days. Unblock them once you&apos;ve spoken to them.
          </div>
          {unblock.isError && (
            <div className="text-[12px] text-[#c41c1c] font-semibold mt-1">Couldn&apos;t unblock. Please try again.</div>
          )}
        </div>
      </div>
      <Button
        className="text-xs h-9 shrink-0"
        disabled={unblock.isPending}
        onClick={() => unblock.mutate(patronId)}
      >
        {unblock.isPending ? "Unblocking..." : "Unblock"}
      </Button>
    </div>
  );
}
