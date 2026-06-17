import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useCategories } from "@/queries/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import ThemeToggle from "@/components/common/ThemeToggle";

function formatCategory(slug: string) {
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const activeCategory = params.get("category") ?? "";

    const [searchValue, setSearchValue] = useState(params.get("search") ?? "");
    const [searchOpen, setSearchOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const debouncedSearch = useDebounce(searchValue, 400);

    const { data: categories = [] } = useCategories();

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname, location.search]);

    useEffect(() => {
        if (debouncedSearch.trim()) {
            navigate(`/?search=${encodeURIComponent(debouncedSearch.trim())}`);
        } else if (location.pathname === "/" && new URLSearchParams(location.search).has("search")) {
            navigate("/");
        }
    }, [debouncedSearch, navigate, location.pathname, location.search]);

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
    };

    const handleCategory = (slug: string) => {
        setSearchValue("");
        setMenuOpen(false);
        if (slug === activeCategory) {
            navigate("/");
        } else {
            navigate(`/?category=${slug}`);
        }
    };

    const navLinkStyle = (isActive: boolean) => ({
        fontSize: "0.8125rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
        textTransform: "uppercase" as const,
        color: isActive ? "var(--moss)" : "var(--stone-600)",
        textDecoration: "none",
        transition: "color 0.15s",
    });

    return (
        <header
            className="sticky top-0 z-50 w-full"
            style={{
                backgroundColor: "color-mix(in srgb, var(--bg) 90%, transparent)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--border)",
            }}
        >
            {/* ── Main bar ── */}
            <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem" }}>
                <div style={{ height: "3.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>

                    {/* Logo */}
                    <Link
                        to="/"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            color: "var(--text)",
                            letterSpacing: "-0.01em",
                            flexShrink: 0,
                            textDecoration: "none",
                        }}
                    >
                        Blostem
                    </Link>

                    {/* Desktop search box */}
                    <div className="desktop-search" style={{ flex: 1, maxWidth: "20rem", marginLeft: "0.5rem" }}>
                        <SearchBox value={searchValue} onChange={setSearchValue} />
                    </div>

                    {/* Spacer pushes right-side items to the end */}
                    <div style={{ flex: 1 }} />

                    {/* Mobile search toggle */}
                    <button
                        onClick={() => setSearchOpen((o) => !o)}
                        aria-label="Search"
                        className="mobile-search-btn"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.375rem", background: "none", border: "none", cursor: "pointer", color: searchOpen ? "var(--moss)" : "var(--stone-600)", borderRadius: "4px" }}
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                    </button>

                    <ThemeToggle />

                    {isAuthenticated ? (
                        <>
                            {/* Desktop: nav links + avatar + logout button */}
                            <div className="desktop-auth" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                                <NavLink
                                    to="/favorites"
                                    style={({ isActive }) => navLinkStyle(isActive)}
                                >
                                    Saved
                                </NavLink>
                                <NavLink
                                    to="/profile"
                                    style={({ isActive }) => navLinkStyle(isActive)}
                                >
                                    Profile
                                </NavLink>

                                {/* Divider */}
                                <span style={{ width: "1px", height: "1.25rem", backgroundColor: "var(--border)", flexShrink: 0 }} />

                                {user?.image && (
                                    <img
                                        src={user.image}
                                        alt={user.firstName}
                                        style={{ height: "2rem", width: "2rem", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--moss-light)", flexShrink: 0 }}
                                    />
                                )}

                                <button
                                    onClick={handleLogout}
                                    style={{ padding: "0.375rem 0.875rem", borderRadius: "4px", border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--stone-600)", fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.02em", cursor: "pointer", transition: "border-color 0.15s, color 0.15s", whiteSpace: "nowrap" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--moss)"; e.currentTarget.style.color = "var(--moss)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--stone-600)"; }}
                                >
                                    Logout
                                </button>
                            </div>

                            {/* Mobile: hamburger */}
                            <button
                                onClick={() => setMenuOpen((o) => !o)}
                                aria-label="Menu"
                                className="mobile-menu-btn"
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.375rem", background: "none", border: "none", cursor: "pointer", color: menuOpen ? "var(--moss)" : "var(--stone-600)", borderRadius: "4px" }}
                            >
                                {menuOpen ? (
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            style={{ padding: "0.375rem 0.875rem", borderRadius: "4px", backgroundColor: "var(--moss)", color: "var(--stone-50)", fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.02em", textDecoration: "none", transition: "background-color 0.15s", whiteSpace: "nowrap" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--moss-light)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--moss)"; }}
                        >
                            Sign in
                        </Link>
                    )}
                </div>

                {/* Mobile search row */}
                {searchOpen && (
                    <div className="mobile-search-row" style={{ paddingBottom: "0.625rem" }}>
                        <SearchBox value={searchValue} onChange={setSearchValue} autoFocus />
                    </div>
                )}
            </div>

            {/* ── Mobile dropdown menu (authenticated) ── */}
            {menuOpen && (
                <div
                    className="mobile-menu"
                    style={{
                        borderTop: "1px solid var(--border)",
                        backgroundColor: "var(--bg)",
                        padding: "0.75rem 1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0",
                    }}
                >
                    <NavLink
                        to="/favorites"
                        style={({ isActive }) => ({
                            ...navLinkStyle(isActive),
                            display: "block",
                            padding: "0.75rem 0",
                            borderBottom: "1px solid var(--border)",
                        })}
                    >
                        Saved
                    </NavLink>
                    <NavLink
                        to="/profile"
                        style={({ isActive }) => ({
                            ...navLinkStyle(isActive),
                            display: "block",
                            padding: "0.75rem 0",
                            borderBottom: "1px solid var(--border)",
                        })}
                    >
                        Profile
                    </NavLink>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "0.75rem" }}>
                        {user?.image && (
                            <img src={user.image} alt={user.firstName} style={{ height: "1.75rem", width: "1.75rem", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--moss-light)" }} />
                        )}
                        <button
                            onClick={handleLogout}
                            style={{ fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--stone-600)", background: "none", border: "none", cursor: "pointer" }}
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}

            {/* ── Category bar ── */}
            {categories.length > 0 && (
                <div style={{ borderTop: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem", position: "relative" }}>

                        {/* Scrollable category list */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1.25rem",
                                overflowX: "auto",
                                padding: "0.5rem 5rem 0.5rem 0",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}
                        >
                            <button
                                onClick={() => navigate("/")}
                                className={`cat-tab${activeCategory === "" ? " active" : ""}`}
                                style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: activeCategory === "" ? "var(--moss)" : "var(--stone-600)", background: "none", border: "none", cursor: "pointer", padding: "0.25rem 0", flexShrink: 0, transition: "color 0.15s" }}
                            >
                                All
                            </button>

                            {categories.map((slug) => (
                                <button
                                    key={slug}
                                    onClick={() => handleCategory(slug)}
                                    className={`cat-tab${activeCategory === slug ? " active" : ""}`}
                                    style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: activeCategory === slug ? "var(--moss)" : "var(--stone-600)", background: "none", border: "none", cursor: "pointer", padding: "0.25rem 0", flexShrink: 0, transition: "color 0.15s" }}
                                >
                                    {formatCategory(slug)}
                                </button>
                            ))}
                        </div>

                        {/* Fade + "More" button — always pinned at right edge */}
                        <div style={{
                            position: "absolute",
                            right: "1rem",
                            top: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "3rem",
                            background: "linear-gradient(to right, transparent, var(--bg) 55%)",
                            pointerEvents: "none",
                        }}>
                            <Link
                                to="/categories"
                                style={{
                                    pointerEvents: "all",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    fontSize: "0.6875rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.07em",
                                    textTransform: "uppercase",
                                    color: "var(--moss)",
                                    textDecoration: "none",
                                    whiteSpace: "nowrap",
                                    transition: "opacity 0.15s",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                            >
                                More
                                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

function SearchBox({ value, onChange, autoFocus }: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
    return (
        <div style={{ position: "relative", width: "100%" }}>
            <svg
                style={{ position: "absolute", left: "0.625rem", top: "50%", transform: "translateY(-50%)", color: "var(--stone-400)", pointerEvents: "none" }}
                width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search…"
                autoFocus={autoFocus}
                style={{
                    width: "100%",
                    paddingLeft: "2rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.4rem",
                    paddingBottom: "0.4rem",
                    fontSize: "0.875rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text)",
                    outline: "none",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    boxSizing: "border-box",
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--moss)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--moss) 15%, transparent)";
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            />
        </div>
    );
}
