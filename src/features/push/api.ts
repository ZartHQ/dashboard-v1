import { api } from "@/lib/api";

export const pushApi = {
  /** VAPID public key; the API answers 400 when Web Push isn't configured. */
  getVapidPublicKey: async (): Promise<string> => {
    const response = await api.get<any>("/admin/push/vapid-public-key");
    const body = response.data ?? {};
    return (body.data ?? body).publicKey;
  },

  subscribe: async (subscription: PushSubscription): Promise<void> => {
    await api.post("/admin/push/subscriptions", {
      ...subscription.toJSON(),
      userAgent: navigator.userAgent,
    });
  },

  unsubscribe: async (endpoint: string): Promise<void> => {
    await api.delete("/admin/push/subscriptions", { data: { endpoint } });
  },
};

/**
 * Stop push alerts on this device at logout: tell the server first (while
 * still logged in), then drop the browser subscription. Never throws.
 */
export async function unsubscribeThisDevice(): Promise<void> {
  try {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const registration = await navigator.serviceWorker.getRegistration();
    const sub = await registration?.pushManager.getSubscription();
    if (!sub) return;
    await pushApi.unsubscribe(sub.endpoint).catch(() => {});
    await sub.unsubscribe();
  } catch {
    // Best effort; logging out must still go ahead.
  }
}
