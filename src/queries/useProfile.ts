import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useProfile() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}
