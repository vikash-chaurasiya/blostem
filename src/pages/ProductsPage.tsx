import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProducts } from "@/queries/useProducts";
import { useSearchProducts } from "@/queries/useSearchProducts";

export default function ProductsPage() {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") ?? "";
    const search = searchParams.get("search") ?? "";

    const isSearching = search.trim().length > 0;
    const productsQuery = useProducts(category, !isSearching);
    const searchQuery = useSearchProducts(search, isSearching);
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = isSearching ? searchQuery : productsQuery;

    const heading = search
        ? `"${search}"`
        : category
        ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "All Products";

    useDocumentTitle(heading);

    // Load the next page when the sentinel scrolls into view.
    const loadMoreRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el || !hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: "300px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0" }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;
    }

    const products = data?.pages.flatMap((p) => p.products) ?? [];
    const total = data?.pages[0]?.total ?? 0;

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: "80rem", margin: "0 auto" }}>

                {/* Page header */}
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
                        {heading}
                    </h1>
                    <p
                        style={{
                            fontSize: "0.75rem",
                            color: "var(--stone-400)",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                        }}
                    >
                        {total} {total === 1 ? "item" : "items"}
                    </p>
                </div>

                {products.length === 0 ? (
                    <EmptyState message="Nothing here yet." />
                ) : (
                    <>
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Infinite-scroll sentinel + loading indicator */}
                        <div
                            ref={loadMoreRef}
                            style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2.5rem 0 1rem", minHeight: "1px" }}
                        >
                            {isFetchingNextPage ? (
                                <Spinner size="md" />
                            ) : !hasNextPage ? (
                                <span style={{ fontSize: "0.75rem", color: "var(--stone-400)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                    You've reached the end
                                </span>
                            ) : null}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
