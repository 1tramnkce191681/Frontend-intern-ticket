import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/lib/api";

export function useTickets(searchTerm = "") {
  return useQuery({
    queryKey: ["tickets", searchTerm],
    queryFn: () => getTickets(searchTerm || undefined),
    staleTime: 30_000,
  });
}
