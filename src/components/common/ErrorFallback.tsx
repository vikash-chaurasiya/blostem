interface ErrorFallbackProps {
    /** Optional error message shown in a monospace box under the heading. */
    detail?: string;
    onReset: () => void;
}

/** Shared full-screen crash UI for both the React error boundary and the router errorElement. */
export default function ErrorFallback({ detail, onReset }: ErrorFallbackProps) {
    return (
        <div
            role="alert"
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
            }}
        >
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="var(--red-err)" style={{ marginBottom: "1rem", opacity: 0.8 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <h1
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    marginBottom: "0.5rem",
                }}
            >
                Something went wrong
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--stone-600)", marginBottom: detail ? "1rem" : "1.5rem", maxWidth: "26rem" }}>
                An unexpected error occurred. You can return to the shop and try again.
            </p>
            {detail && (
                <pre
                    style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        color: "var(--red-err)",
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        padding: "0.75rem 1rem",
                        marginBottom: "1.5rem",
                        maxWidth: "32rem",
                        maxHeight: "8rem",
                        overflow: "auto",
                        textAlign: "left",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    }}
                >
                    {detail}
                </pre>
            )}
            <button
                onClick={onReset}
                style={{
                    padding: "0.625rem 1.5rem",
                    minHeight: "2.75rem",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "var(--moss)",
                    color: "var(--stone-50)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                }}
            >
                Back to shop
            </button>
        </div>
    );
}
