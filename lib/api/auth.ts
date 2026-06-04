import axiosInstance from "./axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
  },

  me: async () => {
    const response = await axiosInstance.get<AuthResponse["user"]>("/auth/me");
    return response.data;
  },
};
