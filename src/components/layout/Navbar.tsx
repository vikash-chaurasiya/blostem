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
    const debouncedSearch = useDebounce(searchValue, 400);

    const { data: categories = [] } = useCategories();

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
    };

    const handleCategory = (slug: string) => {
        setSearchValue("");
        if (slug === activeCategory) {
            navigate("/");
        } else {
            navigate(`/?category=${slug}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">

            {/* Main bar */}
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-lg font-bold text-gray-900 dark:text-white tracking-tight shrink-0"
                >
                    Blostem
                </Link>

                {/* Nav links */}
                <nav className="hidden sm:flex items-center gap-1">
                    {isAuthenticated && (
                        <>
                            <NavLink
                                to="/favorites"
                                className={({ isActive }) =>
                                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-white"
                                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                    }`
                                }
                            >
                                Favorites
                            </NavLink>

                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-white"
                                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                    }`
                                }
                            >
                                Profile
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Search */}
                <div className="flex-1 max-w-sm ml-6">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            {user?.image && (
                                <img
                                    src={user.image}
                                    alt={user.firstName}
                                    className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-slate-700"
                                />
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-1.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Category bar */}
            {categories.length > 0 && (
                <div className="border-t border-gray-100 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
                            <button
                                onClick={() => navigate("/")}
                                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                    activeCategory === ""
                                        ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-800"
                                }`}
                            >
                                All
                            </button>

                            {categories.map((slug) => (
                                <button
                                    key={slug}
                                    onClick={() => handleCategory(slug)}
                                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                        activeCategory === slug
                                            ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-800"
                                    }`}
                                >
                                    {formatCategory(slug)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
