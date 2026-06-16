import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
import { useRouter } from "next/navigation";
import { AUTH_QUERY_KEY } from "./queries";

export function useAdminSignin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signin,
    onSuccess: (data) => {
      // Assuming data is LoginData containing user and accessToken
      if (typeof window !== "undefined") {
        sessionStorage.setItem("zart_access_token", data.accessToken);
      }
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      router.push("/dashboard/requests");
    },
  });
}
