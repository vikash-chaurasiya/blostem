import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useFavoritesStore } from "@/store/favorites.store";

interface FavoriteButtonProps {
    productId: number;
    /** Product title — used for friendlier toast copy. */
    title?: string;
    /** Render a labeled button (detail page) instead of a floating icon (cards). */
    withLabel?: boolean;
}

export default function FavoriteButton({ productId, title, withLabel }: FavoriteButtonProps) {
    const navigate = useNavigate();
    const userId = useAuthStore((s) => s.user?.id);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isFav = useFavoritesStore((s) => (userId != null ? s.isFavorite(userId, productId) : false));
    const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

    const handleClick = (e: React.MouseEvent) => {
        // Prevent triggering the surrounding card link.
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated || userId == null) {
            toast.error("Please sign in to save favorites");
            navigate("/login");
            return;
        }

        const nowFav = toggleFavorite(userId, productId);
        const label = title ? `"${title}"` : "Product";
        if (nowFav) toast.success(`Added ${label} to favorites`);
        else toast(`Removed ${label} from favorites`);
    };

    const heart = (
        <svg
            width={withLabel ? 16 : 18}
            height={withLabel ? 16 : 18}
            viewBox="0 0 24 24"
            fill={isFav ? "var(--moss)" : "none"}
            stroke={isFav ? "var(--moss)" : "currentColor"}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );

    if (withLabel) {
        return (
            <button
                type="button"
                onClick={handleClick}
                aria-pressed={isFav}
                aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.625rem 1.25rem",
                    minHeight: "2.75rem",
                    borderRadius: "4px",
                    border: `1px solid ${isFav ? "var(--moss)" : "var(--border)"}`,
                    backgroundColor: isFav ? "var(--moss-pale)" : "transparent",
                    color: isFav ? "var(--moss)" : "var(--text)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    transition: "border-color 0.15s, color 0.15s, background-color 0.15s",
                }}
            >
                {heart}
                {isFav ? "Saved to favorites" : "Add to favorites"}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-pressed={isFav}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                color: "var(--stone-600)",
                backgroundColor: "color-mix(in srgb, var(--bg) 78%, transparent)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 1px 4px color-mix(in srgb, var(--text) 12%, transparent)",
                transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
            {heart}
        </button>
    );
}
