import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, updateTicketStatus } from "@/lib/api";
import type { TicketStatus } from "@/types";

export { useTickets } from "@/hooks/useTickets";
export { useTicket } from "@/hooks/useTicket";
export { useCreateTicket } from "@/hooks/useCreateTicket";
export { useLogin, useLogout } from "@/hooks/useAuth";

export function useTicketComments(ticketId: string) {
  const query = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const { getTicketById } = await import("@/lib/api");
      const ticket = await getTicketById(ticketId);
      return ticket.comments;
    },
    enabled: !!ticketId,
  });

  return query;
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, content }: { ticketId: string; content: string }) =>
      addComment(ticketId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticketId] });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      updateTicketStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useAuthUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => null,
    enabled: false,
  });
}
