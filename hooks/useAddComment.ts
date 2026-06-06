import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "@/lib/api";

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => addComment(ticketId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    },
  });
}
