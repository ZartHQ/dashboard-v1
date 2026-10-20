export type SenderType = "patron" | "admin";

export interface ChatUserSummary {
  id: number;
  firstName: string;
  lastName: string;
  image: string | null;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: SenderType;
  content: string;
  readAt: string | null;
  createdAt: string;
  sender: ChatUserSummary;
}

export interface Conversation {
  id: number;
  patronId: number;
  serviceRequestId: number | null;
  lastMessageAt: string | null;
  createdAt: string;
  patron: ChatUserSummary;
  serviceRequest: { id: number; title: string; referenceId: string; status: string } | null;
  lastMessage: Pick<ChatMessage, "id" | "content" | "senderType" | "readAt" | "createdAt"> | null;
  unreadCount: number;
}

export interface Paginated<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
