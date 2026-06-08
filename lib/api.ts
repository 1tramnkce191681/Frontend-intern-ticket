import axios from "axios";
import type { Ticket, Comment, TicketStatus, TicketWithComments } from "@/types";
import {
  getTickets as mockGetTickets,
  getTicketById as mockGetTicketById,
  createTicket as mockCreateTicket,
  updateTicketStatus as mockUpdateTicketStatus,
  addComment as mockAddComment,
} from "@/lib/mock-api";

const AUTH_COOKIE = "auth-token";

const setCookie = (name: string, value: string, hours: number) => {
  const expires = new Date(Date.now() + hours * 3600000).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

export async function getTickets(search?: string): Promise<Ticket[]> {
  return mockGetTickets(search);
}

export async function getTicketById(id: string): Promise<TicketWithComments> {
  return mockGetTicketById(id);
}

export async function createTicket(data: {
  title: string;
  description: string;
}): Promise<Ticket> {
  return mockCreateTicket(data);
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<Ticket> {
  return mockUpdateTicketStatus(id, status);
}

export async function addComment(
  ticketId: string,
  content: string
): Promise<Comment> {
  return mockAddComment(ticketId, content);
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<void> {
  // Giả lập delay mạng
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Chấp nhận mọi email/pass hợp lệ theo schema và set cookie
  setCookie(AUTH_COOKIE, "mock-token-12345", 8);
}

export async function logout(): Promise<void> {
  // Xóa cookie bằng cách set expires về quá khứ
  document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  await new Promise((resolve) => setTimeout(resolve, 300));
}
