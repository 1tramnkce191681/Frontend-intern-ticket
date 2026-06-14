import { NextRequest, NextResponse } from "next/server";
import { addComment, getTicketById } from "@/lib/api/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Check if ticket exists before adding comment
    const ticket = getTicketById(ticketId);
    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    const newComment = addComment(ticketId, content);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}