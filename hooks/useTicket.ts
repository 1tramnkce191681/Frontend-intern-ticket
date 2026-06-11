import { useQuery } from "@tanstack/react-query";
import { getTicketById } from "@/lib/api";

export function useTicket(id: string) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id),
    enabled: !!id,
  });
}