import { Ticket, TicketStatus, CreateTicketInput } from "./types";

/**
 * TEMPORARY local ticket store, backed by localStorage.
 *
 * Starts empty (no fake tickets). Admins can log tickets via "New ticket"
 * so the inbox is usable before the backend exists. Once the backend
 * endpoints are ready, flip USE_STUB to false in ./api.ts and delete this.
 */
const KEY = "zart_support_tickets";

function readAll(): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(tickets: Ticket[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(tickets));
  } catch {
    // storage unavailable — fail quietly
  }
}

export const supportStub = {
  list(): Ticket[] {
    return readAll().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  get(id: string): Ticket | undefined {
    return readAll().find((t) => t.id === id);
  },

  create(input: CreateTicketInput): Ticket {
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: `local-${Date.now()}`,
      subject: input.subject,
      requesterName: input.requesterName,
      requesterType: input.requesterType,
      category: input.category,
      status: "open",
      createdAt: now,
      updatedAt: now,
      messages: [
        { id: `m-${Date.now()}`, body: input.message, sender: "requester", createdAt: now },
      ],
    };
    writeAll([ticket, ...readAll()]);
    return ticket;
  },

  reply(id: string, body: string): Ticket | undefined {
    const all = readAll();
    const ticket = all.find((t) => t.id === id);
    if (!ticket) return undefined;
    const now = new Date().toISOString();
    ticket.messages.push({ id: `m-${Date.now()}`, body, sender: "admin", createdAt: now });
    ticket.updatedAt = now;
    writeAll(all);
    return ticket;
  },

  setStatus(id: string, status: TicketStatus): Ticket | undefined {
    const all = readAll();
    const ticket = all.find((t) => t.id === id);
    if (!ticket) return undefined;
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    writeAll(all);
    return ticket;
  },
};
