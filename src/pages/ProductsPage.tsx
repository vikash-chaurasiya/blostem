import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductsByCategory, searchProducts } from "@/api/product.api";
import ProductCard from "@/components/product/ProductCard";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const LIMIT = 10;

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category") ?? "";
    const search = searchParams.get("search") ?? "";
    const page = Number(searchParams.get("page") ?? "1");

    const skip = (page - 1) * LIMIT;

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["products", page, category, search],
        queryFn: () => {
            if (search) return searchProducts(search, LIMIT, skip);
            if (category) return getProductsByCategory(category, LIMIT, skip);
            return getProducts(LIMIT, skip);
        },
    });

    const heading = search
        ? `"${search}"`
        : category
        ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "All Products";

    useDocumentTitle(heading);

    const setPage = (next: number) => {
        const p: Record<string, string> = {};
        if (category) p.category = category;
        if (search) p.search = search;
        if (next > 1) p.page = String(next);
        setSearchParams(p);
    };

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

    const products = data?.products ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / LIMIT);

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

                        {/* Pagination */}
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    );
}
