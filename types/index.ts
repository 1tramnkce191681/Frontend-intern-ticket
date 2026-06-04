// types/index.ts

export type TicketStatus = "Open" | "In Progress" | "Done";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
}