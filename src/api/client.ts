import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { queryClient } from "@/lib/queryClient";

const apiClient = axios.create({
    baseURL: "https://dummyjson.com",
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const status =
            error instanceof Object && "response" in error
                ? (error as { response?: { status?: number } }).response?.status
                : undefined;

        if (status === 401) {
            useAuthStore.getState().logout();
            queryClient.clear();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default apiClient;
