"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTicket } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const createTicketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
});

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export default function NewTicketPage() {
  const router = useRouter();
  const createTicketMutation = useCreateTicket();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
  });

  const onSubmit = async (data: CreateTicketFormData) => {
    setError("");
    try {
      const ticket = await createTicketMutation.mutateAsync(data);
      router.push(`/dashboard/tickets/${ticket.id}`);
    } catch (err) {
      setError("Failed to create ticket. Please try again.");
    }
  };

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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Ticket</CardTitle>
          <CardDescription>Fill in the details to create a new support ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief summary of the issue"
                {...register("title")}
                disabled={createTicketMutation.isPending}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the issue"
                className="min-h-[150px]"
                {...register("description")}
                disabled={createTicketMutation.isPending}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={createTicketMutation.isPending}>
              {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
