import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createTicket } from "@/lib/api";

export function useCreateTicket() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      // Invalidate tickets list to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      router.push("/tickets");
    },
  });
}