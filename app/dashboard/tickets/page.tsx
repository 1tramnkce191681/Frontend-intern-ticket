"use client";

import { useState } from "react";
import { useTickets } from "@/lib/queries";
import { Ticket, TicketStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const statusColors: Record<TicketStatus, string> = {
  Open: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  "In Progress": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  Done: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
};

export default function TicketsPage() {
  const { data: tickets, isLoading, error } = useTickets();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");

  const filteredTickets = tickets?.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error loading tickets</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">Manage and track support tickets</p>
        </div>
        <Link href="/dashboard/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Open", "In Progress", "Done"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              size="sm"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-zinc-500">
              No tickets found
            </CardContent>
          </Card>
        ) : (
          filteredTickets?.map((ticket) => (
            <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`}>
              <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{ticket.title}</CardTitle>
                      <CardDescription className="mt-1">{ticket.description}</CardDescription>
                    </div>
                    <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-500">
                    Created: {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
