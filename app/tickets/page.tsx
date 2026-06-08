"use client";

import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorCard } from "@/components/error-card";
import { SkeletonList } from "@/components/skeleton-list";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Search, LogOut } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: tickets, isLoading, isError, error, refetch } = useTickets(searchTerm);
  const logoutMutation = useLogout();

  const errorMessage = error instanceof Error ? error.message : "Failed to load tickets";

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">Manage and track support tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Link href="/tickets/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </Link>
        </div>
      </div>

      {!isLoading && !isError && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search tickets by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {isLoading ? (
        <SkeletonList />
      ) : isError ? (
        <ErrorCard message={errorMessage} onRetry={() => refetch()} />
      ) : tickets?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">No tickets found</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tickets?.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
              <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{ticket.title}</CardTitle>
                      <CardDescription className="mt-1">{ticket.description}</CardDescription>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-500">
                    Created: {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
