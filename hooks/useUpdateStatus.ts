import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketStatus } from "@/lib/api";
import { TicketStatus } from "@/types";

export function useUpdateStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(id, status),
    onSuccess: () => {
      // Invalidate both list and detail
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}