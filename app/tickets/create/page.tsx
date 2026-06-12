"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTicketSchema } from "@/lib/validations";
import { useCreateTicket } from "@/hooks/useCreateTicket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  PlusCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { z } from "zod";

type CreateTicketValues = z.infer<typeof createTicketSchema>;

export default function CreateTicketPage() {
  const { mutate: createTicket, isPending } = useCreateTicket();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const descriptionValue = watch("description") || "";
  const MAX_DESCRIPTION = 1000;

  const onSubmit = (data: CreateTicketValues) => {
    createTicket(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <Link href="/tickets">
          <Button 
            variant="ghost" 
            size="sm" 
            className="pl-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight mt-4">Create New Ticket</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Raise a support request and our team will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <Card className="border-primary/10 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>
                Provide the essential information about the issue or request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Cannot access dashboard after login"
                    {...register("title")}
                    className={cn(
                      "h-11 bg-muted/30 focus-visible:ring-primary/20",
                      errors.title && "border-destructive focus-visible:ring-destructive/20"
                    )}
                  />
                  {errors.title ? (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.title.message}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      A concise summary of the problem.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description" className="text-sm font-semibold">
                      Description
                    </Label>
                    <span className={cn(
                      "text-[10px] font-mono",
                      descriptionValue.length > MAX_DESCRIPTION ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {descriptionValue.length}/{MAX_DESCRIPTION}
                    </span>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Please provide steps to reproduce, what you expected to see, and what happened instead..."
                    className={cn(
                      "min-h-[200px] bg-muted/30 focus-visible:ring-primary/20 resize-none",
                      errors.description && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    {...register("description")}
                  />
                  {errors.description ? (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.description.message}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      The more detail you provide, the faster we can help.
                    </p>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-4 border-t border-muted/50">
                  <Link href="/tickets">
                    <Button type="button" variant="ghost" disabled={isPending}>
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isPending || descriptionValue.length > MAX_DESCRIPTION}
                    className="min-w-[140px] shadow-lg shadow-primary/20"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Ticket
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Tips Column */}
        <div className="space-y-6">
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-yellow-600 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" /> Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Write a clear title</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Avoid vague titles like "It's broken". Be specific about where the error occurs.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Steps to reproduce</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    List the exact buttons you clicked or URLs you visited before the error happened.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Expected behavior</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Tell us what you thought was supposed to happen vs. what actually occurred.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Attachments</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Include screenshots if available once the ticket is created in the discussion section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-muted/20">
            <CardContent className="p-6 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need immediate assistance? Check our <Link href="#" className="text-primary hover:underline font-medium">Knowledge Base</Link> for common solutions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}