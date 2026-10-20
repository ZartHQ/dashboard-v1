import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { messagingApi } from "./api";
import { ChatMessage, Conversation } from "./types";
import { getChatSocket } from "@/lib/socket";

/** Resolve the conversation tied to a service request (null if none yet). */
export function useRequestConversation(requestId: number | null | undefined) {
  return useQuery<Conversation | null>({
    queryKey: ["admin", "conversations", "by-request", requestId],
    queryFn: () => (requestId ? messagingApi.findConversationForRequest(requestId) : null),
    enabled: !!requestId,
    refetchInterval: 15000, // catch a newly-opened patron thread without a manual refresh
  });
}

interface ChatThread {
  messages: ChatMessage[];
  send: (content: string) => void;
  sending: boolean;
  error: string | null;
  connected: boolean;
  isLoading: boolean;
}

/**
 * Live chat for one conversation: loads history over REST, then keeps the
 * thread current over the shared Socket.IO connection (join room, receive
 * new_message / message_read, send, mark read).
 */
export function useChatThread(conversationId: number | null | undefined): ChatThread {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentReadFor = useRef<number | null>(null);

  // 1. Initial history
  const { data: history = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["admin", "conversations", conversationId, "messages"],
    queryFn: () => (conversationId ? messagingApi.getMessages(conversationId) : []),
    enabled: !!conversationId,
  });

  useEffect(() => {
    setMessages(history);
  }, [history]);

  // 2. Socket: join + live events
  useEffect(() => {
    if (!conversationId) return;
    const socket = getChatSocket();
    if (!socket) return;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    setConnected(socket.connected);

    const onNewMessage = (payload: { conversationId: number; message: ChatMessage }) => {
      if (payload.conversationId !== conversationId) return;
      setMessages((prev) =>
        prev.some((m) => m.id === payload.message.id) ? prev : [...prev, payload.message]
      );
    };

    const onRead = (payload: { conversationId: number; readAt: string; readerType: string }) => {
      if (payload.conversationId !== conversationId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.senderType !== payload.readerType && !m.readAt ? { ...m, readAt: payload.readAt } : m
        )
      );
    };

    const onError = (payload: { code: string; message: string }) => {
      setError(payload?.message || "Chat error");
      setSending(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new_message", onNewMessage);
    socket.on("message_read", onRead);
    socket.on("chat_error", onError);

    socket.emit("join_conversation", { conversationId });

    return () => {
      socket.emit("leave_conversation", { conversationId });
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new_message", onNewMessage);
      socket.off("message_read", onRead);
      socket.off("chat_error", onError);
    };
  }, [conversationId]);

  // 3. Mark the patron's messages read once we have an unread one open
  useEffect(() => {
    if (!conversationId) return;
    const hasUnreadFromPatron = messages.some((m) => m.senderType === "patron" && !m.readAt);
    if (hasUnreadFromPatron && sentReadFor.current !== conversationId) {
      const socket = getChatSocket();
      socket?.emit("mark_read", { conversationId });
      sentReadFor.current = conversationId;
    }
  }, [messages, conversationId]);

  // reset read-tracking when switching threads
  useEffect(() => {
    sentReadFor.current = null;
    setError(null);
  }, [conversationId]);

  const send = useCallback(
    (content: string) => {
      const body = content.trim();
      if (!body || !conversationId) return;
      const socket = getChatSocket();
      if (!socket) {
        setError("Not connected. Please refresh.");
        return;
      }
      setSending(true);
      setError(null);
      socket.emit(
        "send_message",
        { conversationId, content: body },
        (ack: { event: string; data: { conversationId: number; message: ChatMessage } }) => {
          setSending(false);
          if (ack?.data?.message) {
            setMessages((prev) =>
              prev.some((m) => m.id === ack.data.message.id) ? prev : [...prev, ack.data.message]
            );
          }
        }
      );
    },
    [conversationId]
  );

  return { messages, send, sending, error, connected, isLoading };
}
