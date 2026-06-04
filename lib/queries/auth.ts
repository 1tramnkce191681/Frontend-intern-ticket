import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginCredentials } from "@/lib/api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      queryClient.setQueryData(["auth", "user"], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: authApi.me,
    retry: false,
  });
};
