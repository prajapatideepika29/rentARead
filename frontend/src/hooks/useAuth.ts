import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { User } from "@/lib/types";

// Session state lives in an httpOnly cookie; /auth/me answers "who am I".
// A failed call (401 or no backend) resolves to null — pages still render their shell.
export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await apiGet<User>("/auth/me");
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
  return { user: data ?? null, loading: isLoading };
}
