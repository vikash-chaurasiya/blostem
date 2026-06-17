interface StarRatingProps {
    rating: number;
    small?: boolean;
}

export default function StarRating({ rating, small }: StarRatingProps) {
    const size = small ? 12 : 14;
    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = rating >= star;
                const half = !filled && rating >= star - 0.5;
                return (
                    <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={filled || half ? "var(--amber)" : "none"} stroke="var(--amber)" strokeWidth={1.5}>
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                );
            })}
        </div>
    );
}
