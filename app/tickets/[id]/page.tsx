"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTicket } from "@/hooks/useTicket";
import { useAddComment } from "@/hooks/useAddComment";
import { useUpdateStatus } from "@/hooks/useUpdateStatus";
import { MockApiError, deleteTicket, updateTicket } from "@/lib/mock-api";
import type { TicketStatus } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorCard } from "@/components/error-card";
import { StatusBadge } from "@/components/status-badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  Clock, 
  Hash, 
  Calendar,
  User,
  CheckCircle2,
  Trash2,
  Loader2,
  Edit2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TicketDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-24 w-full" />
        </CardHeader>
      </Card>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
    <div className="space-y-6">
      <Card>
        <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

const CommentSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 p-4 rounded-xl border bg-card/50">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ))}
  </div>
);

const CommentCard = ({ content, date, author }: { content: string, date: string, author: string }) => {
  const initials = author.split(" ").map(n => n[0]).join("");

  return (
    <div className="flex gap-4 p-4 rounded-xl border bg-card/50">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary text-xs font-bold">
        {initials}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{author}</span>
          <span className="text-[11px] text-muted-foreground">{format(new Date(date), "MMM d, yyyy 'at' h:mm a")}</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const queryClient = useQueryClient();
  const { data: ticket, isLoading, isError, error, refetch } = useTicket(ticketId);
  const addCommentMutation = useAddComment(ticketId);
  const updateStatusMutation = useUpdateStatus(ticketId);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [statusToast, setStatusToast] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const updateMutation = useMutation({
    mutationFn: () => updateTicket(ticketId, { title: editTitle, description: editDescription }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      setIsEditDialogOpen(false);
    },
    onError: (err) => {
      setStatusToast(err instanceof Error ? err.message : "Failed to update ticket");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      router.push("/tickets");
    },
    onError: (err) => {
      setCommentError(err instanceof Error ? err.message : "Failed to delete ticket");
    },
  });

  const isNotFound = error instanceof MockApiError && error.status === 404;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentError("");
    addCommentMutation.mutate(newComment, {
      onSuccess: () => {
        setNewComment("");
        queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      },
      onError: (err) => {
        setCommentError(err instanceof Error ? err.message : "Failed to add comment");
      },
    });
  };

  const handleStatusChange = useCallback((newStatus: TicketStatus) => {
    setStatusToast("");
    updateStatusMutation.mutate(newStatus, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
      onError: (err) => {
        setStatusToast(err instanceof Error ? err.message : "Failed to update status");
      },
    });
  }, [ticketId, queryClient, updateStatusMutation]);

  if (!isLoading && isNotFound) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="max-w-md mx-auto border-primary/20 bg-primary/5">
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
      <div className="container mx-auto p-6 max-w-7xl">
        <ErrorCard message={message} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {statusToast && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{statusToast}</AlertDescription>
        </Alert>
      )}

      <div className="mb-8 flex items-center justify-between">
        <Link href="/tickets">
          <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        {!isLoading && ticket && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> Last updated: {format(new Date(), "h:mm a")}
          </div>
        )}
      </div>

      {isLoading ? (
        <TicketDetailSkeleton />
      ) : ticket ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Comments */}
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-extrabold tracking-tight">{ticket.title}</h1>
                <StatusBadge status={ticket.status} />
              </div>
              <Card className="bg-muted/30 border-none shadow-none">
                <CardContent className="pt-6">
                  <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {ticket.description}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <MessageSquare className="h-4 w-4" />
                Discussion ({ticket.comments.length})
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  <CommentSkeleton />
                ) : ticket.comments && ticket.comments.length > 0 ? (
                  ticket.comments.map((comment) => (
                    <CommentCard 
                      key={comment.id} 
                      content={comment.content} 
                      date={comment.createdAt} 
                      author={comment.author} // Pass author directly
                    />
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground border rounded-xl border-dashed">
                    No comments yet. Start the conversation below.
                  </div>
                )}
              </div>

              <Card className="mt-8 overflow-hidden border-primary/10">
                <CardContent className="p-0">
                  <form onSubmit={handleAddComment}>
                    <Textarea
                      placeholder="Type your reply here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="border-0 focus-visible:ring-0 min-h-[120px] p-4 resize-none"
                      disabled={addCommentMutation.isPending}
                    />
                    <div className="flex items-center justify-between p-3 bg-muted/50 border-t">
                      <p className="text-[11px] text-muted-foreground italic">
                        Markdown is supported
                      </p>
                      <Button 
                        type="submit" 
                        size="sm"
                        disabled={addCommentMutation.isPending || !newComment.trim()}
                      >
                        {addCommentMutation.isPending ? "Posting..." : (
                          <>
                            <Send className="mr-2 h-3.5 w-3.5" /> Post Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              {commentError && <p className="text-sm text-destructive mt-2">{commentError}</p>}
            </section>
          </div>

          {/* Right Column: Metadata & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Hash className="h-3.5 w-3.5" /> Ticket ID</span>
                  <span className="font-mono font-medium">{ticket.id.slice(0, 8)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Created</span>
                  <span>{format(new Date(ticket.createdAt), "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /> Comments</span>
                  <span>{ticket.comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><User className="h-3.5 w-3.5" /> Assignee</span>
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-green-500" /> Support Team</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-muted-foreground">General</label>
                  <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                    if (open) {
                      setEditTitle(ticket.title);
                      setEditDescription(ticket.description);
                    }
                    setIsEditDialogOpen(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Ticket</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Title</label>
                          <input 
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea 
                            className="min-h-[100px]"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} disabled={updateMutation.isPending}>Cancel</Button>
                        <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending || !editTitle.trim()}>
                          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-muted-foreground">Change Status</label>
                  <div className="flex flex-col gap-2">
                    {(["Open", "In Progress", "Done"] as TicketStatus[]).map((status) => (
                      <Button
                        key={status}
                        variant={ticket.status === status ? "default" : "outline"}
                        size="sm"
                        className="justify-start w-full"
                        onClick={() => handleStatusChange(status)}
                        disabled={updateStatusMutation.isPending}
                      >
                        {ticket.status === status && <CheckCircle2 className="mr-2 h-4 w-4" />}
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full transition-colors border-destructive/20 hover:border-destructive/40">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Ticket
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this ticket?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      deleteMutation.mutate();
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {deleteMutation.isPending ? "Deleting..." : "Delete Ticket"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ) : null}
    </div>
  );
}
