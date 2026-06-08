import { NextRequest, NextResponse } from "next/server";
import { getAllTickets, createTicket } from "@/lib/api/db";

export async function GET() {
  try {
    const tickets = getAllTickets();
    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const newTicket = createTicket(title, description);
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 400 }
    );
  }
}
