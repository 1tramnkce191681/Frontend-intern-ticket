import type { Ticket, Comment, TicketStatus, TicketWithComments } from "@/types";

export class MockApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "MockApiError";
    this.status = status;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = (prefix: string = "") => `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const tickets: Ticket[] = [
  {
    id: "tkt-001",
    title: "Login page not responding",
    description: "The login page shows a blank screen and doesn't respond to input",
    status: "Open",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "tkt-002",
    title: "Dashboard loading slowly",
    description: "The dashboard takes too long to load, affecting user experience",
    status: "In Progress",
    createdAt: "2026-06-02T14:30:00.000Z",
  },
  {
    id: "tkt-003",
    title: "Ticket creation successful",
    description: "Successfully implemented the ticket creation feature",
    status: "Done",
    createdAt: "2026-06-03T09:15:00.000Z",
  },
  {
    id: "tkt-004",
    title: "Mobile UI alignment issues",
    description: "Cards are overlapping on smaller screens like iPhone SE",
    status: "Open",
    createdAt: "2026-06-04T11:45:00.000Z",
  },
  {
    id: "tkt-005",
    title: "Email notifications not sending",
    description: "Users are not receiving email updates when ticket status changes",
    status: "In Progress",
    createdAt: "2026-06-05T08:20:00.000Z",
  },
];

const comments: (Comment & { author: string })[] = [
  {
    id: "cmt-001",
    ticketId: "tkt-001",
    author: "John Doe",
    content: "Started investigating the issue. I suspect it's related to the recent auth middleware update.",
    createdAt: "2026-06-01T12:00:00.000Z",
  },
  {
    id: "cmt-002",
    ticketId: "tkt-001",
    author: "Jane Smith",
    content: "Fix completed and waiting for QA verification. The issue was a missing null check in the session handler.",
    createdAt: "2026-06-01T15:30:00.000Z",
  },
  {
    id: "cmt-003",
    ticketId: "tkt-001",
    author: "Mike Wilson",
    content: "Feature successfully deployed to production. Monitoring logs for any regressions.",
    createdAt: "2026-06-02T16:00:00.000Z",
  },
  {
    id: "cmt-004",
    ticketId: "tkt-003",
    author: "Sarah Lee",
    content: "Feature successfully deployed to production.",
    createdAt: "2026-06-03T17:00:00.000Z",
  },
];

export async function getTickets(search?: string): Promise<Ticket[]> {
  await delay(400);

  if (search) {
    const term = search.toLowerCase();
    return tickets.filter((t) => t.title.toLowerCase().includes(term));
  }

  return [...tickets];
}

export async function getTicketById(id: string): Promise<TicketWithComments> {
  await delay(400);

  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) {
    throw new MockApiError("Ticket not found", 404);
  }

  return {
    ...ticket,
    comments: comments.filter((c) => c.ticketId === id),
  };
}

export async function createTicket(data: {
  title: string;
  description: string;
}): Promise<Ticket> {
  await delay(600);

  const newTicket: Ticket = {
    id: generateId("tkt-"),
    title: data.title,
    description: data.description,
    status: "Open",
    createdAt: new Date().toISOString(),
  };

  tickets.push(newTicket);
  return newTicket;
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<Ticket> {
  await delay(400);

  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new MockApiError("Ticket not found", 404);
  }

  tickets[index] = { ...tickets[index], status };
  return tickets[index];
}

export async function addComment(
  ticketId: string,
  content: string
): Promise<Comment & { author: string }> {
  await delay(500);

  const ticketExists = tickets.some((t) => t.id === ticketId);
  if (!ticketExists) {
    throw new MockApiError("Ticket not found", 404);
  }
  
  const newComment: Comment & { author: string } = {
    id: generateId("cmt-"),
    ticketId,
    author: "Support Agent", // Default author for new comments
    content,
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);
  return newComment;
}
