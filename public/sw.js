/* Zart Ops service worker: Web Push for new service requests.
 *
 * Deliberately has no fetch handler or caching, so it never serves stale
 * pages; it only shows notifications and opens the dashboard when one is
 * tapped. Registered from src/lib/push.ts.
 */

const ICON = "/favicon/android-chrome-192x192.png";
const BADGE = "/favicon/notification-badge.png";
const DEFAULT_URL = "/dashboard/requests";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Payload from the API: { title, body, url, tag }
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || "New request";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || "",
      tag: payload.tag || undefined,
      icon: ICON,
      badge: BADGE,
      data: { url: payload.url || DEFAULT_URL },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(
    (event.notification.data && event.notification.data.url) || DEFAULT_URL,
    self.location.origin
  ).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const client =
        windows.find((c) => new URL(c.url).pathname.startsWith("/dashboard")) ||
        windows.find((c) => new URL(c.url).origin === self.location.origin);

      if (client) {
        await client.focus();
        if (new URL(client.url).pathname.startsWith("/dashboard")) {
          // The dashboard routes client-side (no reload) — see usePushAlerts.
          client.postMessage({ type: "zart:navigate", url: target });
          return;
        }
        if ("navigate" in client) {
          try {
            await client.navigate(target);
            return;
          } catch (e) {
            /* uncontrolled client: fall through and open a window */
          }
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});
