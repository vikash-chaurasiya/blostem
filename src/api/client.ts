import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { queryClient } from "@/lib/queryClient";
import { router } from "@/router/AppRouter";
import { refreshToken as refreshTokenApi } from "@/api/auth.api";
import { API_BASE_URL } from "@/lib/constants";

declare module "axios" {
    export interface AxiosRequestConfig {
        /** Set internally to avoid replaying a request more than once after refresh. */
        _retry?: boolean;
        /** Suppresses the logout-redirect/toast on 401 — used by the silent session restore. */
        _skipAuthRedirect?: boolean;
    }
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function forceLogout() {
    useAuthStore.getState().logout();
    queryClient.clear();
    toast.error("Your session expired. Please sign in again.");
    router.navigate("/login");
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        const original = error.config;
        const url = original?.url ?? "";
        const isAuthCall = url.includes("/auth/login") || url.includes("/auth/refresh");

        // The session-restore call cleans up on its own — never bounce the user
        // off a public page or toast for a background token check.
        const giveUp = () => {
            if (!original?._skipAuthRedirect) forceLogout();
            return Promise.reject(error);
        };

        // No config, already retried once, or the failing call was the auth
        // flow itself → don't loop.
        if (!original || original._retry || isAuthCall) {
            return giveUp();
        }

        const storedRefresh = useAuthStore.getState().refreshToken;
        if (!storedRefresh) {
            return giveUp();
        }

        // Silent refresh: swap the token once, then replay the original request.
        original._retry = true;
        try {
            const data = await refreshTokenApi(storedRefresh);
            useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return apiClient(original);
        } catch {
            return giveUp();
        }
    }
);

export default apiClient;
