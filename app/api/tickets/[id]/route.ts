import { NextRequest, NextResponse } from "next/server";
import { getTicketById, updateTicketStatus, getCommentsByTicketId, deleteTicket, updateTicket } from "@/lib/api/db";
import { TicketWithComments } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = getTicketById(id);

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }
    const comments = getCommentsByTicketId(id);

    // Add a delay to simulate network latency (Requirement: 400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    const ticketWithComments: TicketWithComments = { ...ticket, comments };
    return NextResponse.json(ticketWithComments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Add a delay to simulate network latency (Requirement: 500ms for delete/modify)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = deleteTicket(id);

    if (!success) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Ticket deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, title, description } = await request.json();

    let updatedTicket = null;

    if (status !== undefined) {
      updatedTicket = updateTicketStatus(id, status);
    } else if (title !== undefined || description !== undefined) {
      updatedTicket = updateTicket(id, { title, description });
    } else {
      return NextResponse.json({ error: "No valid fields provided for update" }, { status: 400 });
    }

    // Add a delay to simulate network latency (Requirement: 400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!updatedTicket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
