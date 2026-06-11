import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { login, logout, LoginCredentials } from "@/lib/api";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/tickets";

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      router.push(redirectTo);
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
  });
}