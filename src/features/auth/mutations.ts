import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
import { useRouter } from "next/navigation";
import { AUTH_QUERY_KEY } from "./queries";

export function useAdminSignin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signin,
    onSuccess: (admin) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, admin);
      router.push("/dashboard/requests");
    },
  });
}
