import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import FavoriteButton from "./FavoriteButton";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="card-stem group"
            style={{
                position: "relative",
                display: "block",
                backgroundColor: "var(--bg-card)",
                overflow: "hidden",
                borderRadius: "3px",
                textDecoration: "none",
                transition: "box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px color-mix(in srgb, var(--text) 10%, transparent)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
        >
            {/* Product image — 3:4 portrait ratio */}
            <div style={{ position: "relative", paddingBottom: "75%", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 2 }}>
                    <FavoriteButton productId={product.id} title={product.title} />
                </div>
                <img
                    src={product.thumbnail}
                    alt={product.title}
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
            </div>

            {/* Card body */}
            <div style={{ padding: "0.75rem 0.875rem 0.875rem" }}>
                <h3
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--text)",
                        lineHeight: 1.35,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        marginBottom: "0.5rem",
                        opacity: 0.9,
                    }}
                >
                    {product.title}
                </h3>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p
                        style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            color: "var(--amber)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        ₹{product.price}
                    </p>
                    <span
                        style={{
                            fontSize: "0.6875rem",
                            color: "var(--stone-400)",
                            letterSpacing: "0.02em",
                        }}
                    >
                        ★ {product.rating}
                    </span>
                </div>
            </div>
        </Link>
    );
}
