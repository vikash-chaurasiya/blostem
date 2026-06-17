import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { queryClient } from "@/lib/queryClient";
import { router } from "@/router/AppRouter";
import { refreshToken as refreshTokenApi } from "@/api/auth.api";
import { API_BASE_URL } from "@/lib/constants";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

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

        const original = error.config as RetriableConfig | undefined;
        const url = original?.url ?? "";
        const isAuthCall = url.includes("/auth/login") || url.includes("/auth/refresh");

        // No config, already retried once, or the failing call was the auth
        // flow itself → don't loop; sign the user out.
        if (!original || original._retry || isAuthCall) {
            forceLogout();
            return Promise.reject(error);
        }

        const storedRefresh = useAuthStore.getState().refreshToken;
        if (!storedRefresh) {
            forceLogout();
            return Promise.reject(error);
        }

        // Silent refresh: swap the token once, then replay the original request.
        original._retry = true;
        try {
            const data = await refreshTokenApi(storedRefresh);
            useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return apiClient(original);
        } catch {
            forceLogout();
            return Promise.reject(error);
        }
    }
);

export default apiClient;
