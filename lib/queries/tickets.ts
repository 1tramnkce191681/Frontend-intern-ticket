import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "@/lib/api";
import { Ticket, Comment } from "@/types";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: ticketsApi.getAll,
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => ticketsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Ticket["status"] }) =>
      ticketsApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets", variables.id] });
    },
  });
};

export const useTicketComments = (ticketId: string) => {
  return useQuery({
    queryKey: ["tickets", ticketId, "comments"],
    queryFn: () => ticketsApi.getComments(ticketId),
    enabled: !!ticketId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, content }: { ticketId: string; content: string }) =>
      ticketsApi.addComment(ticketId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets", variables.ticketId, "comments"] });
    },
  });
};
