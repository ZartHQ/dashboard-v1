import { api } from "@/lib/api";
import { Ticket, TicketStatus, CreateTicketInput } from "./types";
import { supportStub } from "./stub";

/**
 * While true, the support inbox runs on the local stub store so it works
 * without a backend. When the endpoints below are live, set this to false
 * (and delete ./stub.ts). No UI changes are needed.
 *
 * Expected backend routes:
 *   GET   /admin/support/tickets            -> Ticket[]
 *   GET   /admin/support/tickets/:id        -> Ticket
 *   POST  /admin/support/tickets            -> Ticket   (body: CreateTicketInput)
 *   POST  /admin/support/tickets/:id/reply  -> Ticket   (body: { body })
 *   PATCH /admin/support/tickets/:id/status -> Ticket   (body: { status })
 */
export const USE_STUB = true;

export const supportApi = {
  getTickets: async (): Promise<Ticket[]> => {
    if (USE_STUB) return supportStub.list();
    const res = await api.get("/admin/support/tickets");
    return res.data.data;
  },

  getTicket: async (id: string): Promise<Ticket | undefined> => {
    if (USE_STUB) return supportStub.get(id);
    const res = await api.get(`/admin/support/tickets/${id}`);
    return res.data.data;
  },

  createTicket: async (input: CreateTicketInput): Promise<Ticket> => {
    if (USE_STUB) return supportStub.create(input);
    const res = await api.post("/admin/support/tickets", input);
    return res.data.data;
  },

  reply: async ({ id, body }: { id: string; body: string }): Promise<Ticket | undefined> => {
    if (USE_STUB) return supportStub.reply(id, body);
    const res = await api.post(`/admin/support/tickets/${id}/reply`, { body });
    return res.data.data;
  },

  updateStatus: async ({ id, status }: { id: string; status: TicketStatus }): Promise<Ticket | undefined> => {
    if (USE_STUB) return supportStub.setStatus(id, status);
    const res = await api.patch(`/admin/support/tickets/${id}/status`, { status });
    return res.data.data;
  },
};
