interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
    if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "…", current - 1, current, current + 1, "…", total];
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(page, totalPages);

    const btnBase: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "2.25rem",
        height: "2.25rem",
        padding: "0 0.5rem",
        borderRadius: "4px",
        border: "1px solid var(--border)",
        backgroundColor: "transparent",
        fontSize: "0.875rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "border-color 0.15s, background-color 0.15s, color 0.15s",
        userSelect: "none",
    };

    const activeStyle: React.CSSProperties = {
        ...btnBase,
        backgroundColor: "var(--moss)",
        borderColor: "var(--moss)",
        color: "var(--stone-50)",
        cursor: "default",
    };

    const disabledStyle: React.CSSProperties = {
        ...btnBase,
        opacity: 0.35,
        cursor: "not-allowed",
        color: "var(--stone-400)",
    };

    const normalStyle: React.CSSProperties = {
        ...btnBase,
        color: "var(--stone-600)",
    };

    const arrowStyle = (disabled: boolean): React.CSSProperties =>
        disabled ? disabledStyle : { ...btnBase, color: "var(--stone-600)" };

    const hoverOn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.borderColor = "var(--moss)";
        e.currentTarget.style.color = "var(--moss)";
    };
    const hoverOff = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--stone-600)";
    };

    return (
        <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.375rem", flexWrap: "wrap" }}>

            {/* Prev arrow */}
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                style={arrowStyle(page === 1)}
                aria-label="Previous page"
                onMouseEnter={(e) => { if (page !== 1) hoverOn(e); }}
                onMouseLeave={(e) => { if (page !== 1) hoverOff(e); }}
            >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Page numbers */}
            {pages.map((p, i) =>
                p === "…" ? (
                    <span
                        key={`ellipsis-${i}`}
                        style={{ minWidth: "2.25rem", height: "2.25rem", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", color: "var(--stone-400)", userSelect: "none" }}
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => p !== page && onPageChange(p)}
                        style={p === page ? activeStyle : normalStyle}
                        aria-current={p === page ? "page" : undefined}
                        onMouseEnter={(e) => { if (p !== page) hoverOn(e); }}
                        onMouseLeave={(e) => { if (p !== page) hoverOff(e); }}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next arrow */}
            <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                style={arrowStyle(page >= totalPages)}
                aria-label="Next page"
                onMouseEnter={(e) => { if (page < totalPages) hoverOn(e); }}
                onMouseLeave={(e) => { if (page < totalPages) hoverOff(e); }}
            >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
