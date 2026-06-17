import { describe, it, expect, beforeEach, vi } from "vitest";
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosAdapter } from "axios";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
vi.mock("@/router/AppRouter", () => ({ router: { navigate } }));
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/api/auth.api", () => ({ refreshToken: vi.fn() }));

import apiClient from "@/api/client";
import { refreshToken as refreshTokenApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

const mockUser = {
    id: 1,
    username: "emilys",
    email: "emily@example.com",
    firstName: "Emily",
    lastName: "Stone",
    image: "",
};

function error401(config: InternalAxiosRequestConfig) {
    return Object.assign(new Error("Request failed with status code 401"), {
        isAxiosError: true,
        config,
        response: { status: 401, data: {}, statusText: "Unauthorized", headers: {}, config },
    });
}

function okResponse(config: InternalAxiosRequestConfig): AxiosResponse {
    return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config } as AxiosResponse;
}

describe("Axios 401 handling", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.setState({
            accessToken: "expired",
            refreshToken: null,
            user: mockUser,
            isAuthenticated: true,
            isInitialized: true,
        });
    });

    it("logs out and redirects to /login when there is no refresh token", async () => {
        apiClient.defaults.adapter = (async (config: InternalAxiosRequestConfig) => {
            throw error401(config);
        }) as AxiosAdapter;

        await expect(apiClient.get("/products")).rejects.toBeTruthy();

        expect(refreshTokenApi).not.toHaveBeenCalled();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
        expect(navigate).toHaveBeenCalledWith("/login");
    });

    it("silently refreshes the token and replays the original request", async () => {
        useAuthStore.setState({ refreshToken: "refresh-token" });
        vi.mocked(refreshTokenApi).mockResolvedValue({ accessToken: "new-token", refreshToken: "new-refresh" });

        let attempt = 0;
        apiClient.defaults.adapter = (async (config: InternalAxiosRequestConfig) => {
            attempt += 1;
            if (attempt === 1) throw error401(config);
            return okResponse(config);
        }) as AxiosAdapter;

        const res = await apiClient.get("/products");

        expect(refreshTokenApi).toHaveBeenCalledWith("refresh-token");
        expect(res.data).toEqual({ ok: true });
        expect(useAuthStore.getState().accessToken).toBe("new-token");
        expect(navigate).not.toHaveBeenCalled();
    });

    it("logs out when the refresh attempt also fails", async () => {
        useAuthStore.setState({ refreshToken: "refresh-token" });
        vi.mocked(refreshTokenApi).mockRejectedValue(new Error("refresh failed"));

        apiClient.defaults.adapter = (async (config: InternalAxiosRequestConfig) => {
            throw error401(config);
        }) as AxiosAdapter;

        await expect(apiClient.get("/products")).rejects.toBeTruthy();

        expect(refreshTokenApi).toHaveBeenCalledOnce();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
        expect(navigate).toHaveBeenCalledWith("/login");
    });

    it("does not retry indefinitely — a 401 on the refresh endpoint logs out", async () => {
        useAuthStore.setState({ refreshToken: "refresh-token" });
        apiClient.defaults.adapter = (async (config: InternalAxiosRequestConfig) => {
            throw error401(config);
        }) as AxiosAdapter;

        // The refresh call itself 401s (auth endpoint) → no refresh attempt loop.
        vi.mocked(refreshTokenApi).mockRejectedValue(new Error("401"));

        await expect(apiClient.get("/products")).rejects.toBeTruthy();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
});
