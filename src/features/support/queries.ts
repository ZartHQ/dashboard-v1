import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "./api";
import { TicketStatus, CreateTicketInput } from "./types";

export const TICKETS_KEY = ["support", "tickets"];

export function useTickets() {
  return useQuery({
    queryKey: TICKETS_KEY,
    queryFn: supportApi.getTickets,
    refetchInterval: 8000, // poll so new tickets show up
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTicketInput) => supportApi.createTicket(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}

export function useReplyToTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; body: string }) => supportApi.reply(vars),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: TicketStatus }) => supportApi.updateStatus(vars),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}
