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

export interface TicketWithComments extends Ticket {
  comments: Comment[];
}

export interface ApiError {
  message: string;
  status?: number;
}