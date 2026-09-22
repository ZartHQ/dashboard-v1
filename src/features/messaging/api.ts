import { api } from "@/lib/api";
import { Message, SendMessageInput } from "./types";
import { messagingStub } from "./stub";

/**
 * While true, messaging runs on the local stub store so the UI works
 * without a backend. When the backend endpoints below are live, set this
 * to false (and delete ./stub.ts). No UI changes are needed.
 *
 * Expected backend routes:
 *   GET  /admin/requests/:id/messages        -> Message[]
 *   POST /admin/requests/:id/messages        -> Message   (body: { body })
 *   POST /admin/requests/:id/messages/read   -> void
 */
export const USE_STUB = true;

export const messagingApi = {
  getThread: async (requestId: number): Promise<Message[]> => {
    if (USE_STUB) return messagingStub.getThread(requestId);
    const res = await api.get(`/admin/requests/${requestId}/messages`);
    return res.data.data;
  },

  sendMessage: async ({ requestId, body }: SendMessageInput): Promise<Message> => {
    if (USE_STUB) {
      return messagingStub.append({
        id: `local-${Date.now()}`,
        requestId,
        body,
        sender: "admin",
        createdAt: new Date().toISOString(),
        read: true,
      });
    }
    const res = await api.post(`/admin/requests/${requestId}/messages`, { body });
    return res.data.data;
  },

  markRead: async (requestId: number): Promise<void> => {
    if (USE_STUB) {
      messagingStub.markRead(requestId);
      return;
    }
    await api.post(`/admin/requests/${requestId}/messages/read`, {});
  },
};
