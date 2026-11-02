"use client";

import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { useNewRequestAlerts } from "./NewRequestAlerts";
import { cn } from "@/lib/utils";

const STATUS_LABEL = {
  loading: "…",
  on: "On",
  off: "Off",
  blocked: "Blocked",
  unsupported: "Not supported",
  "ios-install": "Not supported",
} as const;

/** Sidebar control for system notifications + Web Push (sits under the sound toggle). */
export function PushAlertsToggle() {
  const { push } = useNewRequestAlerts();
  const { status, pushAvailable, serverNote, busy, error, enable, disable } = push;

  // Without push (server not configured) "on" is just the browser permission,
  // which a page can't revoke; nothing to toggle off.
  const canTurnOn = status === "off";
  const canTurnOff = status === "on" && pushAvailable;
  const actionable = (canTurnOn || canTurnOff) && !busy;

  let note: string | null = error;
  if (!note) {
    if (status === "ios-install") note = "Install the dashboard to your home screen to get alerts.";
    else if (status === "unsupported") note = "This browser can't show notifications.";
    else if (status === "blocked") note = "Allow notifications for this site in your browser settings.";
    else if (serverNote) note = `${serverNote} You'll still be alerted while the dashboard is open.`;
    else if (canTurnOn) note = "Tap to turn on. Alerts arrive even when the app is closed.";
  }

  const Icon = busy ? Loader2 : status === "on" ? BellRing : status === "off" || status === "loading" ? Bell : BellOff;

  return (
    <div>
      <button
        onClick={canTurnOn ? enable : canTurnOff ? disable : undefined}
        disabled={!actionable}
        aria-label={
          canTurnOn
            ? "Turn on phone and desktop alerts"
            : canTurnOff
              ? "Turn off phone and desktop alerts"
              : `Phone and desktop alerts: ${STATUS_LABEL[status]}`
        }
        className={cn(
          "flex items-center gap-[10px] w-full p-[9px_16px] text-[13px] text-[#FDF4D7]/75 text-left",
          "border-l-[3px] border-transparent transition-all bg-transparent",
          actionable ? "cursor-pointer hover:bg-white/5 hover:text-[#FDF4D7]" : "cursor-default",
        )}
      >
        <Icon className={cn("w-4 h-4 text-[#FDF4D7]/65 shrink-0", busy && "animate-spin")} />
        <span className="flex-1 min-w-0 truncate">Phone & desktop alerts</span>
        <span
          className={cn(
            "text-[10px] p-[2px_7px] rounded-[10px] font-semibold shrink-0",
            status === "on" ? "bg-[#FA4812] text-white" : "bg-white/10 text-[#FDF4D7]/70",
          )}
        >
          {STATUS_LABEL[status]}
        </span>
      </button>
      {note && (
        <p
          role={error ? "alert" : undefined}
          className={cn(
            "m-0 -mt-1 pb-2 pl-[45px] pr-4 text-[10px] leading-[1.4]",
            error ? "text-[#FFC92A]" : "text-[#FDF4D7]/50",
          )}
        >
          {note}
        </p>
      )}
    </div>
  );
}
