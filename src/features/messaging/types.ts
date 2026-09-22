export type MessageSender = "admin" | "patron";

export interface Message {
  id: string;
  requestId: number;
  body: string;
  sender: MessageSender;
  createdAt: string; // ISO timestamp
  read: boolean;
}

export interface SendMessageInput {
  requestId: number;
  body: string;
}
