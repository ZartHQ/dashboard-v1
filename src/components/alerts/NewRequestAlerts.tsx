"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { BellRing, Volume2, VolumeX, X } from "lucide-react";
import { useAdminSSE, AdminSSEEvent } from "@/hooks/useAdminSSE";
import { useRequests } from "@/features/requests/queries";
import { requestsApi } from "@/features/requests/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * New service request alerts, mounted once in the dashboard layout:
 * - listens for `service_request.created` on the admin SSE stream
 * - shows a stacked toast (top-right) with a View button + plays a chime
 * - prefixes the tab title with the number of alerts not yet looked at
 * - tracks which pending requests this admin has opened, so the sidebar
 *   Requests badge means "new requests you haven't opened"
 */

const REQUESTS_PATH = "/dashboard/requests";
const SEEN_KEY = "zart-seen-requests";
const MUTE_KEY = "zart-alerts-muted";
const MAX_SEEN = 500;
const MAX_TOASTS = 4;
const TOAST_MS = 10_000;

interface RequestAlert {
  id: string;
  service: string;
  title: string;
  patronFirstName: string;
  createdAt: string;
  address?: string;
}

interface NewRequestAlertsValue {
  /** Pending requests this admin hasn't opened yet (sidebar badge). */
  unseenCount: number;
  markRequestSeen: (id: string | number) => void;
  muted: boolean;
  toggleMuted: () => void;
}

const NewRequestAlertsContext = createContext<NewRequestAlertsValue | null>(null);

export function useNewRequestAlerts() {
  const ctx = useContext(NewRequestAlertsContext);
  if (!ctx) throw new Error("useNewRequestAlerts must be used inside <NewRequestAlerts>");
  return ctx;
}

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids.map(String) : [];
  } catch {
    return [];
  }
}

// ─── Chime (Web Audio, no files) ─────────────────────────────────────────

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) {
    try {
      audioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

/** Soft two-note chime. Silently does nothing until the browser allows audio. */
function playChime() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== "running") return;
  const now = ctx.currentTime;
  [
    { freq: 880, at: 0 }, // A5
    { freq: 1318.5, at: 0.14 }, // E6
  ].forEach(({ freq, at }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + at);
    gain.gain.exponentialRampToValueAtTime(0.18, now + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + at);
    osc.stop(now + at + 0.65);
  });
}

// ─── Provider ────────────────────────────────────────────────────────────

export default function NewRequestAlerts({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [toasts, setToasts] = useState<RequestAlert[]>([]);
  const [unackedCount, setUnackedCount] = useState(0);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  // Restore seen ids + mute preference, and keep other tabs in sync.
  useEffect(() => {
    setSeenIds(readSeen());
    try {
      setMuted(localStorage.getItem(MUTE_KEY) === "1");
    } catch {
      /* ignore */
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === SEEN_KEY) setSeenIds(readSeen());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Browsers only allow audio after a user gesture: resume on the first one.
  useEffect(() => {
    const unlock = () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const markRequestSeen = useCallback((id: string | number) => {
    const key = String(id);
    setToasts((prev) => prev.filter((t) => t.id !== key));
    setSeenIds((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key].slice(-MAX_SEEN);
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleEvent = useCallback(({ event, data }: AdminSSEEvent) => {
    if (event !== "service_request.created" || data?.id == null) return;
    const alert: RequestAlert = {
      id: String(data.id),
      service: data.artisanType || "Service",
      title: data.title || "",
      patronFirstName: String(data.patronName || "").split(" ")[0],
      createdAt: data.createdAt || new Date().toISOString(),
    };
    setToasts((prev) => [alert, ...prev.filter((t) => t.id !== alert.id)].slice(0, MAX_TOASTS));
    setUnackedCount((n) => n + 1);
    if (!mutedRef.current) playChime();

    // The event has no address; fetch it (into the detail cache, so View
    // opens instantly) so the toast can say where.
    queryClient
      .fetchQuery({
        queryKey: ["admin", "service-requests", alert.id],
        queryFn: () => requestsApi.getRequestById(alert.id),
      })
      .then((detail) => {
        if (!detail?.address) return;
        setToasts((prev) => prev.map((t) => (t.id === alert.id ? { ...t, address: detail.address } : t)));
      })
      .catch(() => {});
  }, [queryClient]);

  useAdminSSE(handleEvent);

  // Alerts count as looked at while the admin has the requests page in view.
  const onRequestsPage = pathname === REQUESTS_PATH;
  useEffect(() => {
    if (!onRequestsPage) return;
    const ack = () => {
      if (document.visibilityState === "visible") setUnackedCount(0);
    };
    ack();
    document.addEventListener("visibilitychange", ack);
    return () => document.removeEventListener("visibilitychange", ack);
  }, [onRequestsPage, unackedCount]);

  // "(2) New request · Zart" while there are alerts nobody has looked at.
  const baseTitleRef = useRef<string | null>(null);
  useEffect(() => {
    if (baseTitleRef.current === null) baseTitleRef.current = document.title;
    document.title =
      unackedCount > 0 ? `(${unackedCount}) New request · Zart` : baseTitleRef.current;
  }, [unackedCount, pathname]);

  // Badge: pending requests (up to the API's max page) minus the ones opened here.
  const { data: pending } = useRequests({ status: "pending", limit: 100 });
  const unseenCount = useMemo(() => {
    const items = pending?.data || [];
    const total = pending?.meta?.total ?? items.length;
    const seen = new Set(seenIds);
    return Math.max(0, total - items.filter((r) => seen.has(String(r.id))).length);
  }, [pending, seenIds]);

  const value = useMemo(
    () => ({ unseenCount, markRequestSeen, muted, toggleMuted }),
    [unseenCount, markRequestSeen, muted, toggleMuted]
  );

  return (
    <NewRequestAlertsContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 left-4 sm:left-auto sm:w-[340px] z-[120] flex flex-col gap-2.5 pointer-events-none"
      >
        {toasts.map((t) => (
          <RequestToast
            key={t.id}
            alert={t}
            onDismiss={() => dismiss(t.id)}
            onView={() => {
              markRequestSeen(t.id);
              router.push(`${REQUESTS_PATH}?id=${t.id}`);
            }}
          />
        ))}
      </div>
    </NewRequestAlertsContext.Provider>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────

function RequestToast({
  alert,
  onView,
  onDismiss,
}: {
  alert: RequestAlert;
  onView: () => void;
  onDismiss: () => void;
}) {
  const time = new Date(alert.createdAt).toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const area = alert.address?.split(",")[0]?.trim();
  const headline = ["New request", alert.service, area].filter(Boolean).join(" · ");

  return (
    <div
      role="status"
      className="group pointer-events-auto relative overflow-hidden rounded-[14px] bg-white border border-[#e8e8e8] shadow-[0_10px_30px_rgba(0,0,0,0.12)] animate-toast-in"
    >
      <div className="absolute inset-y-0 left-0 w-[4px] bg-[#FA4812]" />
      <div className="flex items-start gap-3 p-[14px_14px_12px_18px]">
        <div className="w-9 h-9 rounded-full bg-[#fff5f2] text-[#FA4812] flex items-center justify-center shrink-0">
          <BellRing className="w-[18px] h-[18px]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-[#1a1a1a] truncate" title={headline}>
            {headline}
          </div>
          {alert.title && alert.title.toLowerCase() !== alert.service.toLowerCase() && (
            <div className="text-[12px] text-[#555] truncate mt-0.5">{alert.title}</div>
          )}
          <div className="text-[11px] text-[#888] mt-0.5 truncate">
            {[alert.patronFirstName, time].filter(Boolean).join(" · ")}
          </div>
          <Button size="sm" className="mt-2.5 h-7 rounded-[8px]" onClick={onView}>
            View
          </Button>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="bg-transparent border-none text-[#aaa] hover:text-[#555] cursor-pointer p-0.5 -mt-0.5 -mr-0.5 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Countdown bar: dismisses when it runs out, pauses while hovered. */}
      <div
        className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-[#FA4812]/60 animate-toast-timer group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${TOAST_MS}ms` }}
        onAnimationEnd={onDismiss}
      />
    </div>
  );
}

// ─── Sound toggle (sidebar) ──────────────────────────────────────────────

export function AlertSoundToggle() {
  const { muted, toggleMuted } = useNewRequestAlerts();
  const Icon = muted ? VolumeX : Volume2;
  return (
    <button
      onClick={toggleMuted}
      aria-pressed={muted}
      aria-label={muted ? "Unmute new request sound" : "Mute new request sound"}
      className={cn(
        "flex items-center gap-[10px] w-full p-[9px_16px] text-[13px] text-[#FDF4D7]/75",
        "cursor-pointer border-l-[3px] border-transparent transition-all",
        "hover:bg-white/5 hover:text-[#FDF4D7] bg-transparent",
      )}
    >
      <Icon className="w-4 h-4 text-[#FDF4D7]/65 shrink-0" />
      <span>{muted ? "Alert sound off" : "Alert sound on"}</span>
    </button>
  );
}
