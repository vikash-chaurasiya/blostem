import type { ProductReview } from "@/types/product";
import StarRating from "@/components/common/StarRating";

interface CustomerReviewsProps {
    reviews: ProductReview[];
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
    if (!reviews.length) return null;

    return (
        <section style={{ marginTop: "4rem" }}>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2.5rem" }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                    marginBottom: "1.75rem",
                }}>
                    Customer reviews
                </h2>

                <div className="reviews-grid">
                    {reviews.map((review, i) => (
                        <div key={i} style={{
                            padding: "1.25rem",
                            backgroundColor: "var(--bg-card)",
                            borderRadius: "4px",
                            borderLeft: "2px solid var(--border)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                                <StarRating rating={review.rating} small />
                                <time style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6875rem", color: "var(--stone-400)" }}>
                                    {new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </time>
                            </div>
                            <p style={{ fontSize: "0.9375rem", color: "var(--text)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                                "{review.comment}"
                            </p>
                            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--stone-600)" }}>
                                {review.reviewerName}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
