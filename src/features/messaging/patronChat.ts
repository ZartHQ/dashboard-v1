import { useQuery } from "@tanstack/react-query";
import { messagingApi } from "./api";
import { Conversation } from "./types";

/**
 * Resolve the conversation to show for a patron in the Patron view.
 * Prefers the patron's general "Chat with Zart" thread (no service request);
 * falls back to their most recent request thread. null when none exists yet.
 */
export function usePatronConversation(patronId: number | null | undefined) {
  return useQuery<Conversation | null>({
    queryKey: ["admin", "conversations", "by-patron", patronId],
    queryFn: async () => {
      if (!patronId) return null;
      const { items } = await messagingApi.getConversations(1, 100);
      const forPatron = items.filter((c) => c.patronId === patronId);
      if (forPatron.length === 0) return null;
      const general = forPatron.find((c) => c.serviceRequestId == null);
      if (general) return general;
      return [...forPatron].sort((a, b) =>
        (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? "")
      )[0];
    },
    enabled: !!patronId,
    refetchInterval: 15000,
  });
}
