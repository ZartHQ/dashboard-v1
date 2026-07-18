import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestsApi } from "./api";

export function useUpdateStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestsApi.updateStatus,
    onSuccess: (data, variables) => {
      // Invalidate requests list and specific request detail queries to refresh UI data
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
}

export function useAssignArtisanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestsApi.assignArtisan,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
}

export function useAddNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestsApi.addNote,
    onMutate: async ({ id, note }) => {
      // Cancel outgoing queries to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["admin", "service-requests"] });

      // Snapshot the previous detail query data
      const detailQueryKey = ["admin", "service-requests", id];
      const previousDetail = queryClient.getQueryData(detailQueryKey);

      // Create an optimistic note object
      const newNote = {
        id: Math.random(),
        note: note,
        adminId: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sending: true,
      };

      // Optimistically insert it into the details query cache
      queryClient.setQueryData(detailQueryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notes: [...(old.notes || []), newNote],
        };
      });

      // Return context with snapshotted values
      return { previousDetail, detailQueryKey };
    },
    onError: (err, newNote, context) => {
      // Rollback to previous detail cache if mutation fails
      if (context?.detailQueryKey && context?.previousDetail) {
        queryClient.setQueryData(context.detailQueryKey, context.previousDetail);
      }
    },
    onSettled: (data, error, variables) => {
      // Always invalidate cache to fetch final data from server
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
}

export function useCreateInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestsApi.createInvoice,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests", variables.requestId, "invoice"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
}

export function useUpdateInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestsApi.updateInvoice,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests", variables.requestId, "invoice"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
}

export function useSendInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => requestsApi.sendInvoice(requestId),
    onSuccess: (data, requestId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests", requestId, "invoice"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
}

export function useMarkInvoicePaidMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => requestsApi.markInvoicePaid(requestId),
    onSuccess: (data, requestId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests", requestId, "invoice"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
}
