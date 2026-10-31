/**
 * Browser helpers for system notifications and Web Push.
 * The service worker itself is the hand-written `public/sw.js`.
 */

export const APP_ICON = "/favicon/android-chrome-192x192.png";
export const NOTIFICATION_BADGE = "/favicon/notification-badge.png";
const SW_URL = "/sw.js";

export type PushSupport = "supported" | "ios-install" | "unsupported";

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Web Push needs a service worker + PushManager + Notification. On iPhone
 * these only exist in the installed (home-screen) app, iOS 16.4+.
 */
export function getPushSupport(): PushSupport {
  if (typeof window === "undefined") return "unsupported";
  const ok =
    "serviceWorker" in navigator && "PushManager" in window && notificationsSupported();
  if (ok) return "supported";
  if (isIOS() && !isStandalone()) return "ios-install";
  return "unsupported";
}

let registrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;

/** Registers /sw.js once per page load. Resolves null where unsupported or on failure. */
export function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return Promise.resolve(null);
  }
  if (!registrationPromise) {
    registrationPromise = navigator.serviceWorker
      .register(SW_URL, { scope: "/" })
      .then(() => navigator.serviceWorker.ready)
      .catch((err) => {
        console.warn("Service worker registration failed", err);
        registrationPromise = null;
        return null;
      });
  }
  return registrationPromise;
}

/** VAPID keys are URL-safe base64; PushManager wants raw bytes. */
export function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export interface SystemNotification {
  title: string;
  body: string;
  /** Same tag as the push for this request, so the two replace each other. */
  tag: string;
  /** Dashboard path to open when clicked. */
  url: string;
}

/**
 * Shows an OS notification if permission is granted. Prefers the service
 * worker (required on Android / installed PWAs; clicks handled in sw.js),
 * falling back to `new Notification` with `onClick`.
 */
export async function showSystemNotification(
  n: SystemNotification,
  onClick: (url: string) => void
): Promise<void> {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  const options: NotificationOptions = {
    body: n.body,
    tag: n.tag,
    icon: APP_ICON,
    badge: NOTIFICATION_BADGE,
    data: { url: n.url },
  };

  const registration = await registerServiceWorker();
  if (registration) {
    try {
      await registration.showNotification(n.title, options);
      return;
    } catch {
      /* fall back below */
    }
  }

  try {
    const notification = new Notification(n.title, options);
    notification.onclick = () => {
      window.focus();
      notification.close();
      onClick(n.url);
    };
  } catch {
    /* e.g. Android Chrome, which only allows SW notifications */
  }
}
