import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Keep the import graph light (no Axios client / router singleton).
vi.mock("@/api/auth.api", () => ({
    login: vi.fn(),
    getMe: vi.fn(),
}));

import ProtectedRoute from "@/router/ProtectedRoute";
import GuestRoute from "@/router/GuestRoute";
import { useAuthStore } from "@/store/auth.store";

function setAuth(isAuthenticated: boolean, isInitialized = true) {
    useAuthStore.setState({ isAuthenticated, isInitialized });
}

function renderProtected() {
    return render(
        <MemoryRouter initialEntries={["/favorites"]}>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/favorites" element={<div>Favorites Content</div>} />
                </Route>
                <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
        </MemoryRouter>
    );
}

function renderGuest() {
    return render(
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<div>Login Page</div>} />
                </Route>
                <Route path="/" element={<div>Home Page</div>} />
            </Routes>
        </MemoryRouter>
    );
}

describe("ProtectedRoute", () => {
    beforeEach(() => {
        useAuthStore.setState({ isAuthenticated: false, isInitialized: false });
    });

    it("redirects an unauthenticated user to /login", () => {
        setAuth(false);
        renderProtected();
        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(screen.queryByText("Favorites Content")).not.toBeInTheDocument();
    });

    it("renders the protected content for an authenticated user", () => {
        setAuth(true);
        renderProtected();
        expect(screen.getByText("Favorites Content")).toBeInTheDocument();
        expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    });

    it("renders nothing until the session is initialized (no flash)", () => {
        setAuth(false, false);
        renderProtected();
        expect(screen.queryByText("Favorites Content")).not.toBeInTheDocument();
        expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    });
});

describe("GuestRoute", () => {
    beforeEach(() => {
        useAuthStore.setState({ isAuthenticated: false, isInitialized: false });
    });

    it("redirects an authenticated user away from /login", () => {
        setAuth(true);
        renderGuest();
        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    });

    it("shows the login page for a guest", () => {
        setAuth(false);
        renderGuest();
        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
});
