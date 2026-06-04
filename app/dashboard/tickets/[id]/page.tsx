"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTicket, useTicketComments, useAddComment, useUpdateTicketStatus } from "@/lib/queries";
import { Ticket, TicketStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/contexts/auth-context";

const statusColors: Record<TicketStatus, string> = {
  Open: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  "In Progress": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  Done: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { logout } = useAuth();
  const ticketId = params.id as string;
  const { data: ticket, isLoading: ticketLoading, error: ticketError } = useTicket(ticketId);
  const { data: comments, isLoading: commentsLoading } = useTicketComments(ticketId);
  const addCommentMutation = useAddComment();
  const updateStatusMutation = useUpdateTicketStatus();
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addCommentMutation.mutateAsync({ ticketId, content: newComment });
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: ticketId, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (ticketLoading || commentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (ticketError || !ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error loading ticket</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/dashboard/tickets">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{ticket.title}</CardTitle>
              <CardDescription className="mt-2 text-base">{ticket.description}</CardDescription>
            </div>
            <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Created: {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
            <div className="flex gap-2">
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
                disabled={addCommentMutation.isPending}
              />
              <Button type="submit" disabled={addCommentMutation.isPending || !newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-zinc-200 dark:border-zinc-800 pb-4 last:border-0">
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
