import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketStatus } from "@/lib/api";
import type { TicketWithComments, TicketStatus } from "@/types";

export function useUpdateStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(id, status),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["ticket", id] });
      const previous = queryClient.getQueryData<TicketWithComments>(["ticket", id]);

      if (previous) {
        queryClient.setQueryData(["ticket", id], { ...previous, status: newStatus });
      }

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (_error, _status, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["ticket", id], context.previous);
      }
    },
  });
}
