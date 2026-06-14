"use client";

import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { TicketStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorCard } from "@/components/error-card";
import { SkeletonList } from "@/components/skeleton-list";
import { TicketCard } from "@/components/ticket-card";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");
  const { data: tickets, isLoading, isError, error, refetch } = useTickets(searchQuery);

  const errorMessage = error instanceof Error ? error.message : "Failed to load tickets";

  const filteredTickets = tickets?.filter((ticket) => {
    return statusFilter === "All" || ticket.status === statusFilter;
  })?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">Manage and track support tickets</p>
        </div>
        <Link href="/tickets/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      {!isLoading && !isError && (
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
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <SkeletonList />
        ) : isError ? (
          <ErrorCard message={errorMessage} onRetry={() => refetch()} />
        ) : filteredTickets?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-zinc-500">
              No tickets found
            </CardContent>
          </Card>
        ) : (
          filteredTickets?.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
      </div>
    </div>
  );
}
