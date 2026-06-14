import axios from "axios";
import type { Ticket, Comment, TicketStatus, TicketWithComments } from "@/types";
// No longer importing from mock-api as we will use actual API routes

const AUTH_COOKIE = "auth-token";

const setCookie = (name: string, value: string, hours: number) => {
  const expires = new Date(Date.now() + hours * 3600000).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// --- Ticket API Calls ---
export async function getTickets(search?: string): Promise<Ticket[]> {
  const response = await apiClient.get<Ticket[]>("/tickets", { params: { search } });
  return response.data;
}

export async function getTicketById(id: string): Promise<TicketWithComments> {
  const response = await apiClient.get<TicketWithComments>(`/tickets/${id}`);
  return response.data;
}

export async function createTicket(data: {
  title: string;
  description: string;
}): Promise<Ticket> {
  const response = await apiClient.post<Ticket>("/tickets", data);
  return response.data;
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<Ticket> {
  const response = await apiClient.patch<Ticket>(`/tickets/${id}`, { status });
  return response.data;
}

export async function updateTicket(
  id: string,
  data: { title?: string; description?: string }
): Promise<Ticket> {
  const response = await apiClient.patch<Ticket>(`/tickets/${id}`, data);
  return response.data;
}

export async function deleteTicket(id: string): Promise<void> {
  await apiClient.delete(`/tickets/${id}`);
}

// --- Comment API Calls ---
export async function addComment(
  ticketId: string,
  content: string
): Promise<Comment> {
  const response = await apiClient.post<Comment>(`/tickets/${ticketId}/comments`, { content });
  return response.data;
}

// --- Auth API Calls (mocked for now) ---
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
