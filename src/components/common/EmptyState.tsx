interface EmptyStateProps {
    message?: string;
}

export default function EmptyState({
    message = "Nothing here yet.",
}: EmptyStateProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0", textAlign: "center" }}>
            <div
                style={{
                    width: "3rem",
                    height: "3rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Minimal botanical mark — a small leaf outline */}
                <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14 34 C14 34 14 18 14 14 C14 6 3 2 3 2 C3 2 3 14 10 20 M14 14 C14 6 25 2 25 2 C25 2 25 14 18 20"
                        stroke="var(--stone-300)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <p
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1rem",
                    fontStyle: "italic",
                    color: "var(--stone-400)",
                }}
            >
                {message}
            </p>
        </div>
    );
}
