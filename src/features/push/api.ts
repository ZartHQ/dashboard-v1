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
