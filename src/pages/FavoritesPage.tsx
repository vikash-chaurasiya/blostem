import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { getProduct } from "@/api/product.api";
import { useAuthStore } from "@/store/auth.store";
import { useFavoritesStore } from "@/store/favorites.store";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import ProductCard from "@/components/product/ProductCard";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import type { Product } from "@/types/product";

const EMPTY: number[] = [];

export default function FavoritesPage() {
    useDocumentTitle("Favorites");

    const userId = useAuthStore((s) => s.user?.id);
    const favoriteIds = useFavoritesStore((s) =>
        userId != null ? s.favoritesByUser[userId] ?? EMPTY : EMPTY
    );

    const results = useQueries({
        queries: favoriteIds.map((id) => ({
            queryKey: ["product", id],
            queryFn: () => getProduct(id),
        })),
    });

    const isLoading = results.some((r) => r.isLoading);
    const isError = results.some((r) => r.isError);
    const products = results
        .map((r) => r.data)
        .filter((p): p is Product => Boolean(p));

    if (favoriteIds.length === 0) {
        return (
            <div className="page-wrapper">
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <PageHeader count={0} />
                    <EmptyState
                        message="No favorites yet. Browse the shop and tap the heart to save products here."
                    />
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        <Link
                            to="/"
                            style={{
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                color: "var(--moss)",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                            }}
                        >
                            Browse products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError && products.length === 0) {
        return (
            <ErrorState
                message="Could not load your favorites."
                onRetry={() => results.forEach((r) => r.refetch())}
            />
        );
    }

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                <PageHeader count={products.length} />
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PageHeader({ count }: { count: number }) {
    return (
        <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)" }}>
            <h1
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    fontWeight: 700,
                    color: "var(--text)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    marginBottom: "0.25rem",
                }}
            >
                Favorites
            </h1>
            <p style={{ fontSize: "0.75rem", color: "var(--stone-400)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {count} {count === 1 ? "item" : "items"}
            </p>
        </div>
    );
}
