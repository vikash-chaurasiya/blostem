import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCategories, getCategoryThumbnail } from "@/api/product.api";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

function CategoryCard({ slug, name }: { slug: string; name: string }) {
    const { data: thumbnail, isLoading } = useQuery({
        queryKey: ["category-thumb", slug],
        queryFn: () => getCategoryThumbnail(slug),
        staleTime: Infinity,
    });

    return (
        <Link
            to={`/?category=${slug}`}
            className="card-stem"
            style={{
                display: "block",
                textDecoration: "none",
                backgroundColor: "var(--bg-card)",
                borderRadius: "4px",
                overflow: "hidden",
                transition: "box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 24px color-mix(in srgb, var(--text) 10%, transparent)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
        >
            {/* Image */}
            <div style={{ position: "relative", paddingBottom: "75%", backgroundColor: "var(--bg-card)", overflow: "hidden" }}>
                {isLoading ? (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Spinner size="sm" />
                    </div>
                ) : thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={name}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        }}
                        className="group-hover:scale-[1.04]"
                    />
                ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--stone-300)" }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
                            <path d="M3 9l4-4 4 4 4-4 4 4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Name */}
            <div style={{ padding: "0.75rem 0.875rem" }}>
                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    lineHeight: 1.3,
                }}>
                    {name}
                </p>
                <p style={{
                    fontSize: "0.75rem",
                    color: "var(--moss)",
                    marginTop: "0.25rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                }}>
                    Browse →
                </p>
            </div>
        </Link>
    );
}

export default function CategoriesPage() {
    const { data: categories, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["categories-meta"],
        queryFn: getCategories,
        staleTime: Infinity,
    });

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;
    }

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: "80rem", margin: "0 auto" }}>

                {/* Header */}
                <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)" }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                        fontWeight: 700,
                        color: "var(--text)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                        marginBottom: "0.25rem",
                    }}>
                        All Categories
                    </h1>
                    <p style={{ fontSize: "0.75rem", color: "var(--stone-400)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {categories?.length ?? 0} categories
                    </p>
                </div>

                {/* Grid */}
                <div className="categories-grid">
                    {categories?.map((cat) => (
                        <CategoryCard key={cat.slug} slug={cat.slug} name={cat.name} />
                    ))}
                </div>
            </div>
        </div>
    );
}
