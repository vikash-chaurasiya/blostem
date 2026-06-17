import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the API module so the store never hits the network (and so importing
// it doesn't pull in the Axios client / router singleton).
vi.mock("@/api/auth.api", () => ({
    login: vi.fn(),
    getMe: vi.fn(),
}));

import { useAuthStore } from "@/store/auth.store";
import { useFavoritesStore } from "@/store/favorites.store";
import { queryClient } from "@/lib/queryClient";
import { login as loginApi, getMe } from "@/api/auth.api";
import type { AuthResponse, User } from "@/types/auth";

const mockUser: User = {
    id: 1,
    username: "emilys",
    email: "emily@example.com",
    firstName: "Emily",
    lastName: "Stone",
    image: "",
};

const mockAuthResponse: AuthResponse = {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    ...mockUser,
};

function resetStores() {
    useAuthStore.setState({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isInitialized: false,
    });
    useFavoritesStore.setState({ favoritesByUser: {} });
}

describe("auth.store", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetStores();
    });

    it("login stores tokens + user and marks the session authenticated", async () => {
        vi.mocked(loginApi).mockResolvedValue(mockAuthResponse);

        await useAuthStore.getState().login("emilys", "emilyspass");

        const state = useAuthStore.getState();
        expect(loginApi).toHaveBeenCalledWith("emilys", "emilyspass");
        expect(state.accessToken).toBe("access-token");
        expect(state.refreshToken).toBe("refresh-token");
        expect(state.user).toMatchObject({ id: 1, username: "emilys" });
        expect(state.isAuthenticated).toBe(true);
    });

    it("logout clears auth, the user's favorites, and the query cache", () => {
        useAuthStore.setState({
            accessToken: "access-token",
            refreshToken: "refresh-token",
            user: mockUser,
            isAuthenticated: true,
        });
        useFavoritesStore.getState().addFavorite(mockUser.id, 42);
        expect(useFavoritesStore.getState().getFavorites(mockUser.id)).toEqual([42]);
        const clearSpy = vi.spyOn(queryClient, "clear");

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.accessToken).toBeNull();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(useFavoritesStore.getState().getFavorites(mockUser.id)).toEqual([]);
        expect(clearSpy).toHaveBeenCalled();
    });

    it("restoreSession with no token: stays logged out but initializes", async () => {
        await useAuthStore.getState().restoreSession();

        const state = useAuthStore.getState();
        expect(getMe).not.toHaveBeenCalled();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isInitialized).toBe(true);
    });

    it("restoreSession with a valid token: fetches /auth/me and restores the user", async () => {
        useAuthStore.setState({ accessToken: "access-token" });
        vi.mocked(getMe).mockResolvedValue(mockUser);

        await useAuthStore.getState().restoreSession();

        const state = useAuthStore.getState();
        expect(getMe).toHaveBeenCalledOnce();
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.isInitialized).toBe(true);
    });

    it("restoreSession with a bad token: clears the session but still initializes", async () => {
        useAuthStore.setState({ accessToken: "bad-token" });
        vi.mocked(getMe).mockRejectedValue(new Error("401"));

        await useAuthStore.getState().restoreSession();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isInitialized).toBe(true);
    });
});
