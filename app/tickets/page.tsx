"use client";

import { useState, useMemo } from "react";
import { useTickets } from "@/hooks/useTickets";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorCard } from "@/components/error-card";
import { SkeletonList } from "@/components/skeleton-list";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Ticket as TicketIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { data: tickets, isLoading, isError, error, refetch } = useTickets(searchTerm);

  const errorMessage = error instanceof Error ? error.message : "Failed to load tickets";

  // Statistics calculation for the premium dashboard feel
  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter((t) => t.status === "Open").length || 0,
    inProgress: tickets?.filter((t) => t.status === "In Progress").length || 0,
    done: tickets?.filter((t) => t.status === "Done").length || 0,
  };

  // Combine search (API) and status (Client-side) filters
  const displayedTickets = useMemo(() => {
    if (!tickets) return [];
    if (statusFilter === "All") return tickets;
    return tickets.filter((t) => t.status === statusFilter);
  }, [tickets, statusFilter]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Support Overview</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage and track customer support requests in real-time.
          </p>
        </div>
        <Link href="/tickets/create">
          <Button size="lg" className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-5 w-5" />
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card 
          className={cn(
            "bg-card cursor-pointer transition-all hover:border-primary/50",
            statusFilter === "All" && "ring-2 ring-primary border-transparent shadow-sm"
          )}
          onClick={() => setStatusFilter("All")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-3xl font-bold">{isLoading ? "..." : stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TicketIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:border-blue-500/50",
            statusFilter === "Open" && "ring-2 ring-blue-500 border-transparent bg-blue-500/5"
          )}
          onClick={() => setStatusFilter("Open")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-3xl font-bold text-blue-500">{isLoading ? "..." : stats.open}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:border-yellow-500/50",
            statusFilter === "In Progress" && "ring-2 ring-yellow-500 border-transparent bg-yellow-500/5"
          )}
          onClick={() => setStatusFilter("In Progress")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-yellow-500">{isLoading ? "..." : stats.inProgress}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:border-green-500/50",
            statusFilter === "Done" && "ring-2 ring-green-500 border-transparent bg-green-500/5"
          )}
          onClick={() => setStatusFilter("Done")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-500">{isLoading ? "..." : stats.done}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar Section */}
      {!isLoading && !isError && (
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by ticket title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-card border-muted-foreground/20 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <SkeletonList />
      ) : isError ? (
        <ErrorCard message={errorMessage} onRetry={() => refetch()} />
      ) : displayedTickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">No tickets found</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedTickets.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
              <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">#TIC-{ticket.id}</span>
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
          ))}
        </div>
      )}
    </div>
  );
}
