"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTicket } from "@/hooks/useTicket";
import { useAddComment } from "@/hooks/useAddComment";
import { useUpdateStatus } from "@/hooks/useUpdateStatus";
import { MockApiError } from "@/lib/mock-api";
import type { TicketStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorCard } from "@/components/error-card";
import { StatusBadge } from "@/components/status-badge";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const TicketDetailSkeleton = () => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const CommentSkeleton = () => (
  <div className="space-y-4">
    {[1, 2].map((i) => (
      <div key={i} className="border-b border-zinc-200 dark:border-zinc-800 pb-4"><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-3 w-24" /></div>
    ))}
  </div>
);

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { data: ticket, isLoading, isError, error, refetch } = useTicket(ticketId);
  const addCommentMutation = useAddComment(ticketId);
  const updateStatusMutation = useUpdateStatus(ticketId);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [statusToast, setStatusToast] = useState("");

  const isNotFound = error instanceof MockApiError && error.status === 404;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentError("");
    addCommentMutation.mutate(newComment, {
      onSuccess: () => setNewComment(""),
      onError: (err) => {
        setCommentError(err instanceof Error ? err.message : "Failed to add comment");
      },
    });
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    setStatusToast("");
    updateStatusMutation.mutate(newStatus, {
      onError: (err) => {
        setStatusToast(err instanceof Error ? err.message : "Failed to update status");
      },
    });
  };

  if (!isLoading && isNotFound) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">404 – Ticket not found</h2>
            <p className="text-zinc-500 mb-6">
              The ticket you are looking for does not exist or may have been removed.
            </p>
            <Link href="/tickets">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to list
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoading && isError && !isNotFound) {
    const message = error instanceof Error ? error.message : "Failed to load ticket";
    return (
      <div className="container mx-auto p-6">
        <ErrorCard message={message} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {statusToast && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{statusToast}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <Link href="/tickets">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <TicketDetailSkeleton />
      ) : ticket ? (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                <CardDescription className="mt-2 text-base">{ticket.description}</CardDescription>
              </div>
              <StatusBadge status={ticket.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-zinc-500">
                Created: {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
              <div className="flex gap-2 flex-wrap">
                {(["Open", "In Progress", "Done"] as TicketStatus[]).map((status) => (
                  <Button
                    key={status}
                    variant={ticket.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    disabled={updateStatusMutation.isPending}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>Discussion about this ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 min-h-[80px]"
                disabled={addCommentMutation.isPending || isLoading}
              />
              <Button
                type="submit"
                disabled={addCommentMutation.isPending || !newComment.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {commentError && <p className="text-sm text-red-500 mt-2">{commentError}</p>}
          </form>

          <div className="space-y-4">
            {isLoading ? (
              <CommentSkeleton />
            ) : ticket?.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-zinc-200 dark:border-zinc-800 pb-4 last:border-0"
                >
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-4">No comments yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
