import { NextRequest, NextResponse } from "next/server";
import { Ticket } from "@/types";

// Mock data
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

export async function GET() {
  return NextResponse.json(mockTickets, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();

    const newTicket: Ticket = {
      id: String(mockTickets.length + 1),
      title,
      description,
      status: "Open",
      createdAt: new Date().toISOString(),
    };

    mockTickets.push(newTicket);

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 400 }
    );
  }
}
