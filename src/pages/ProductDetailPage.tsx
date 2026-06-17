import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "@/queries/useProduct";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import StarRating from "@/components/common/StarRating";
import Breadcrumb from "@/components/common/Breadcrumb";
import CustomerReviews from "@/components/product/CustomerReviews";
import FavoriteButton from "@/components/product/FavoriteButton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading, isError, error, refetch } = useProduct(Number(id));
    const [activeImage, setActiveImage] = useState(0);

    useDocumentTitle(product?.title ?? (isLoading ? "Loading…" : "Product"));

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError || !product) {
        return <ErrorState message={(error as Error)?.message ?? "Product not found."} onRetry={() => refetch()} />;
    }

    const images = product.images?.length ? product.images : [product.thumbnail];
    const discountedPrice = product.price * (1 - (product.discountPercentage ?? 0) / 100);
    const hasDiscount = (product.discountPercentage ?? 0) > 0;
    const stockLow = (product.stock ?? 0) <= 10;

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: "Shop", to: "/" },
                        { label: product.category.replace(/-/g, " "), to: `/?category=${product.category}` },
                        { label: product.title },
                    ]}
                />

                {/* Main layout: images + info */}
                <div className="product-detail-layout">

                    {/* ── Left: image gallery ── */}
                    <div>
                        {/* Main image */}
                        <div style={{
                            position: "relative",
                            backgroundColor: "var(--bg-card)",
                            borderRadius: "4px",
                            overflow: "hidden",
                            paddingBottom: "100%",
                        }}>
                            <img
                                key={activeImage}
                                src={images[activeImage]}
                                alt={product.title}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "opacity 0.25s ease",
                                }}
                            />
                        </div>

                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        style={{
                                            width: "4rem",
                                            height: "4rem",
                                            flexShrink: 0,
                                            borderRadius: "3px",
                                            overflow: "hidden",
                                            border: `2px solid ${i === activeImage ? "var(--moss)" : "transparent"}`,
                                            padding: 0,
                                            cursor: "pointer",
                                            backgroundColor: "var(--bg-card)",
                                            transition: "border-color 0.15s",
                                        }}
                                    >
                                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: product info ── */}
                    <div>
                        {/* Brand + category */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.625rem" }}>
                            {product.brand && (
                                <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--moss)" }}>
                                    {product.brand}
                                </span>
                            )}
                            <span style={{ fontSize: "0.6875rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--stone-400)" }}>
                                {product.category.replace(/-/g, " ")}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.4rem, 3vw, 2rem)",
                            fontWeight: 700,
                            color: "var(--text)",
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            marginBottom: "1rem",
                        }}>
                            {product.title}
                        </h1>

                        {/* Rating */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                            <StarRating rating={product.rating} />
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "var(--stone-600)" }}>
                                {product.rating.toFixed(2)}
                            </span>
                            {product.reviews?.length && (
                                <span style={{ fontSize: "0.75rem", color: "var(--stone-400)" }}>
                                    ({product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"})
                                </span>
                            )}
                        </div>

                        {/* Price */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.5rem" }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.75rem", fontWeight: 500, color: "var(--amber)", letterSpacing: "-0.03em" }}>
                                ₹{discountedPrice.toFixed(2)}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", color: "var(--stone-400)", textDecoration: "line-through" }}>
                                        ₹{product.price.toFixed(2)}
                                    </span>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--moss)", backgroundColor: "var(--moss-pale)", padding: "0.125rem 0.5rem", borderRadius: "2px" }}>
                                        −{product.discountPercentage.toFixed(0)}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Stock status */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <span style={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                color: stockLow ? "var(--amber)" : "var(--moss)",
                            }}>
                                {product.availabilityStatus ?? (stockLow ? `Only ${product.stock} left` : "In stock")}
                            </span>
                        </div>

                        {/* Favorite */}
                        <div style={{ marginBottom: "2rem" }}>
                            <FavoriteButton productId={product.id} title={product.title} withLabel />
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--stone-600)", marginBottom: "2rem" }}>
                            {product.description}
                        </p>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "2rem" }}>
                                {product.tags.map((tag) => (
                                    <span key={tag} style={{
                                        fontSize: "0.6875rem",
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        color: "var(--stone-600)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "2px",
                                        padding: "0.2rem 0.5rem",
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Divider */}
                        <div style={{ borderTop: "1px solid var(--border)", marginBottom: "1.5rem" }} />

                        {/* Meta grid */}
                        <div className="product-meta-grid">
                            {product.sku && <MetaItem label="SKU" value={product.sku} mono />}
                            {product.weight && <MetaItem label="Weight" value={`${product.weight} g`} />}
                            {product.warrantyInformation && <MetaItem label="Warranty" value={product.warrantyInformation} />}
                            {product.shippingInformation && <MetaItem label="Shipping" value={product.shippingInformation} />}
                            {product.returnPolicy && <MetaItem label="Returns" value={product.returnPolicy} />}
                            {product.minimumOrderQuantity && <MetaItem label="Min. order" value={`${product.minimumOrderQuantity} units`} />}
                        </div>

                        {/* Dimensions */}
                        {product.dimensions && (
                            <div style={{ marginTop: "1rem" }}>
                                <p style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--stone-400)", marginBottom: "0.375rem" }}>
                                    Dimensions (cm)
                                </p>
                                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8125rem", color: "var(--stone-600)" }}>
                                    {product.dimensions.width} W × {product.dimensions.height} H × {product.dimensions.depth} D
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Reviews ── */}
                {product.reviews && <CustomerReviews reviews={product.reviews} />}
            </div>
        </div>
    );
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--stone-400)", marginBottom: "0.2rem" }}>
                {label}
            </p>
            <p style={{ fontFamily: mono ? "'DM Mono', monospace" : undefined, fontSize: "0.875rem", color: "var(--stone-600)" }}>
                {value}
            </p>
        </div>
    );
}
