"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuthUser, useLogin, useLogout } from "@/lib/queries";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: user, isLoading: authLoading } = useAuthUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
    setIsAuthenticated(true);
    router.push("/dashboard");
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: authLoading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
