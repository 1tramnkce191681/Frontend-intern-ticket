import { NextRequest, NextResponse } from "next/server";
import { getAllTickets, createTicket } from "@/lib/api/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    
    let tickets = getAllTickets();
    
    if (search) {
      tickets = tickets.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    }

    // Add a delay to simulate network latency, similar to mock-api
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
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
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const newTicket = createTicket(title, description);
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}