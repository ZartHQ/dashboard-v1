import { api } from "@/lib/api";
import { ChatMessage, Conversation, Paginated } from "./types";

export const messagingApi = {
  // List conversations (admin). Paginated; we pull a wide page so we can
  // match a request's thread client-side (there is no get-by-request route).
  getConversations: async (page = 1, limit = 100): Promise<Paginated<Conversation>> => {
    const res = await api.get<any>("/admin/conversations", { params: { page, limit } });
    const data = res.data?.data ?? {};
    return {
      items: Array.isArray(data.items) ? data.items : [],
      meta: data.meta ?? { total: 0, page, limit, totalPages: 0 },
    };
  },

  // Find the conversation tied to a specific service request, if the patron
  // has started one. Returns null when none exists yet.
  findConversationForRequest: async (requestId: number): Promise<Conversation | null> => {
    const { items } = await messagingApi.getConversations(1, 100);
    return items.find((c) => c.serviceRequestId === requestId) ?? null;
  },

  // Message history for a conversation. Page 1 = newest page, oldest-first within.
  getMessages: async (conversationId: number, page = 1, limit = 50): Promise<ChatMessage[]> => {
    const res = await api.get<any>(`/admin/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    const data = res.data?.data ?? {};
    return Array.isArray(data.items) ? data.items : [];
  },
};
