import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { login, logout, type LoginCredentials } from "@/lib/api";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      const redirect = searchParams.get("redirect") || "/tickets";
      router.push(redirect);
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push("/login");
    },
  });
}
