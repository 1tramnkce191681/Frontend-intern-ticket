import { NextRequest, NextResponse } from "next/server";
import { Ticket } from "@/types";

// Mock data (same as parent route)
const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Login page not responding",
    description: "The login page shows a blank screen and doesn't respond to input",
    status: "Open",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Dashboard loading slowly",
    description: "The dashboard takes too long to load, affects user experience",
    status: "In Progress",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Ticket creation successful",
    description: "Successfully implemented the ticket creation feature",
    status: "Done",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = mockTickets.find((t) => t.id === id);

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const ticketIndex = mockTickets.findIndex((t) => t.id === id);

    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    mockTickets[ticketIndex].status = status;

    return NextResponse.json(mockTickets[ticketIndex], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
