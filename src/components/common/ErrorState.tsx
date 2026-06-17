interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    message = "Something went wrong.",
    onRetry,
}: ErrorStateProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0", textAlign: "center" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--red-err)", marginBottom: "0.75rem", opacity: 0.7 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p style={{ fontSize: "0.875rem", color: "var(--stone-600)", marginBottom: "1rem" }}>{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: "var(--moss)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                    }}
                >
                    Try again
                </button>
            )}
        </div>
    );
}
