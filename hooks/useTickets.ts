import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/lib/api";

export function useTickets(search?: string) {
  return useQuery({
    queryKey: ["tickets", search],
    queryFn: () => getTickets(search),
    staleTime: 30000, // 30 seconds as per requirement 8.1
  });
}