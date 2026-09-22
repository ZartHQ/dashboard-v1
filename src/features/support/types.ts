export type TicketStatus = "open" | "pending" | "resolved";

export type TicketRequesterType = "patron" | "artisan";

export interface TicketMessage {
  id: string;
  body: string;
  sender: "admin" | "requester";
  createdAt: string; // ISO timestamp
}

export interface Ticket {
  id: string;
  subject: string;
  requesterName: string;
  requesterType: TicketRequesterType;
  category: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface CreateTicketInput {
  subject: string;
  requesterName: string;
  requesterType: TicketRequesterType;
  category: string;
  message: string;
}
