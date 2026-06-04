import axiosInstance from "./axios";
import { Ticket, Comment } from "@/types";

export const ticketsApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Ticket[]>("/tickets");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  create: async (data: { title: string; description: string }) => {
    const response = await axiosInstance.post<Ticket>("/tickets", data);
    return response.data;
  },

  updateStatus: async (id: string, status: Ticket["status"]) => {
    const response = await axiosInstance.patch<Ticket>(`/tickets/${id}`, { status });
    return response.data;
  },

  getComments: async (ticketId: string) => {
    const response = await axiosInstance.get<Comment[]>(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  addComment: async (ticketId: string, content: string) => {
    const response = await axiosInstance.post<Comment>(`/tickets/${ticketId}/comments`, { content });
    return response.data;
  },
};
