import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Comment } from "@/types";

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

const CommentCard = ({ content, date, author }: { content: string, date: string, author?: string }) => {
  const displayName = author || "Support Agent";
  const initials = displayName.split(" ").map(n => n[0]).join("");

  return (
    <div className="flex gap-4 p-4 rounded-xl border bg-card/50">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary text-xs font-bold">
        {initials}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{displayName}</span>
          <span className="text-[11px] text-muted-foreground">{format(new Date(date), "MMM d, yyyy 'at' h:mm a")}</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
}

export function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) return <CommentSkeleton />;

  if (!comments || comments.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground border rounded-xl border-dashed">
        No comments yet. Start the conversation below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard 
          key={comment.id} 
          content={comment.content} 
          date={comment.createdAt} 
          author={comment.author} 
        />
      ))}
    </div>
  );
}