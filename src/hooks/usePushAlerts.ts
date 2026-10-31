import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { pushApi } from "@/features/push/api";
import {
  getPushSupport,
  notificationsSupported,
  PushSupport,
  registerServiceWorker,
  urlBase64ToUint8Array,
} from "@/lib/push";

export type PushAlertsStatus = "loading" | "unsupported" | "ios-install" | "blocked" | "on" | "off";

export interface PushAlerts {
  status: PushAlertsStatus;
  /** True when this device can get Web Push (SW + PushManager + a server key). */
  pushAvailable: boolean;
  /** Why push isn't available although the browser supports it (server side). */
  serverNote: string | null;
  /** Show OS notifications for events that arrive while the dashboard is open. */
  systemNotificationsOn: boolean;
  busy: boolean;
  error: string | null;
  /** Must be called straight from a click/tap (permission prompt needs the gesture). */
  enable: () => void;
  disable: () => void;
}

function sameKey(sub: PushSubscription, key: Uint8Array): boolean {
  const current = sub.options?.applicationServerKey;
  if (!current) return true; // browser doesn't expose it; assume it matches
  const a = new Uint8Array(current);
  return a.length === key.length && a.every((b, i) => b === key[i]);
}

/** Existing subscription for this key, or a new one (replacing one made with an old key). */
async function getOrCreateSubscription(
  registration: ServiceWorkerRegistration,
  key: Uint8Array<ArrayBuffer>
): Promise<PushSubscription> {
  const existing = await registration.pushManager.getSubscription();
  if (existing && sameKey(existing, key)) return existing;
  if (existing) await existing.unsubscribe().catch(() => {});
  return registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
}

/**
 * Phone & desktop alerts: notification permission, the Web Push subscription
 * and keeping the API in sync with it. Used once, in NewRequestAlerts.
 */
export function usePushAlerts(): PushAlerts {
  const router = useRouter();
  const [support, setSupport] = useState<PushSupport | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupport(getPushSupport());
    if (notificationsSupported()) setPermission(Notification.permission);
  }, []);

  const keyQuery = useQuery({
    queryKey: ["admin", "push", "vapid-public-key"],
    queryFn: pushApi.getVapidPublicKey,
    enabled: support === "supported",
    staleTime: Infinity,
    retry: false,
  });
  const publicKey = keyQuery.data || null;
  const pushAvailable = support === "supported" && !!publicKey;

  let serverNote: string | null = null;
  if (support === "supported" && keyQuery.isError) {
    const code = (keyQuery.error as any)?.response?.status;
    serverNote =
      code === 400 || code === 404
        ? "Phone alerts aren't set up on the server yet."
        : "Couldn't reach the server for phone alerts.";
  }

  // Register the service worker, and if this device is already subscribed,
  // re-send the subscription so the server stays in sync.
  const synced = useRef(false);
  useEffect(() => {
    if (support !== "supported") {
      if (support) setSubscribed(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const registration = await registerServiceWorker();
      if (!registration) {
        if (!cancelled) setSubscribed(false);
        return;
      }
      let sub = await registration.pushManager.getSubscription();
      if (sub && publicKey && Notification.permission === "granted" && !synced.current) {
        synced.current = true;
        try {
          sub = await getOrCreateSubscription(registration, urlBase64ToUint8Array(publicKey));
          await pushApi.subscribe(sub);
        } catch (err) {
          console.warn("Couldn't sync push subscription", err);
        }
      }
      if (!cancelled) setSubscribed(!!sub);
    })().catch(() => {
      if (!cancelled) setSubscribed(false);
    });
    return () => {
      cancelled = true;
    };
  }, [support, publicKey]);

  // A tapped notification asks an open dashboard window to navigate (sw.js).
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== "zart:navigate" || typeof e.data.url !== "string") return;
      const url = new URL(e.data.url, window.location.origin);
      if (url.origin === window.location.origin) router.push(url.pathname + url.search);
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, [router]);

  const enable = useCallback(() => {
    if (!notificationsSupported() || busy) return;
    setBusy(true);
    setError(null);
    // Ask first, synchronously inside the tap: Safari drops the prompt otherwise.
    const asked =
      Notification.permission === "default"
        ? Notification.requestPermission()
        : Promise.resolve(Notification.permission);
    (async () => {
      const result = await asked;
      setPermission(result);
      if (result !== "granted" || !pushAvailable || !publicKey) return;
      const registration = await registerServiceWorker();
      if (!registration) throw new Error("no service worker");
      const sub = await getOrCreateSubscription(registration, urlBase64ToUint8Array(publicKey));
      await pushApi.subscribe(sub);
      synced.current = true;
      setSubscribed(true);
    })()
      .catch((err) => {
        console.error("Couldn't turn on push alerts", err);
        setError("Couldn't turn on alerts. Try again.");
      })
      .finally(() => setBusy(false));
  }, [busy, pushAvailable, publicKey]);

  const disable = useCallback(() => {
    if (busy) return;
    setBusy(true);
    setError(null);
    (async () => {
      const registration = await registerServiceWorker();
      const sub = await registration?.pushManager.getSubscription();
      if (sub) {
        const { endpoint } = sub;
        await sub.unsubscribe();
        // Best effort: once unsubscribed the endpoint is dead anyway.
        await pushApi.unsubscribe(endpoint).catch((err) =>
          console.warn("Couldn't remove push subscription on the server", err)
        );
      }
      setSubscribed(false);
    })()
      .catch((err) => {
        console.error("Couldn't turn off push alerts", err);
        setError("Couldn't turn off alerts. Try again.");
      })
      .finally(() => setBusy(false));
  }, [busy]);

  let status: PushAlertsStatus;
  if (support === null) status = "loading";
  else if (support === "ios-install") status = "ios-install";
  else if (!notificationsSupported()) status = "unsupported";
  else if (permission === "denied") status = "blocked";
  else if (permission !== "granted") status = "off";
  else if (!pushAvailable) status = keyQuery.isLoading ? "loading" : "on"; // open-tab notifications only
  else if (subscribed === null) status = "loading";
  else status = subscribed ? "on" : "off";

  return useMemo(
    () => ({
      status,
      pushAvailable,
      serverNote,
      systemNotificationsOn: status === "on",
      busy,
      error,
      enable,
      disable,
    }),
    [status, pushAvailable, serverNote, busy, error, enable, disable]
  );
}
