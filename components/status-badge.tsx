import { Badge } from "@/components/ui/badge";
import type { TicketStatus } from "@/types";

const statusColors: Record<TicketStatus, string> = {
  Open: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  "In Progress": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  Done: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
};

interface StatusBadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge className={statusColors[status]}>{status}</Badge>;
}
