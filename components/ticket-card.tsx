import Link from "next/link";
import { format } from "date-fns";
import { Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Ticket } from "@/types";

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link href={`/tickets/${ticket.id}`}>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">#TIC-{ticket.id.slice(0, 4)}</span>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {ticket.title}
                </CardTitle>
              </div>
              <CardDescription className="line-clamp-2 leading-relaxed">
                {ticket.description}
              </CardDescription>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pt-4 border-t border-muted/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Clock className="h-3 w-3" />
              {format(new Date(ticket.createdAt), "MMM d, yyyy")}
            </div>
            <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}