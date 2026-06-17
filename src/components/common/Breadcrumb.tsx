import { Fragment } from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
    label: string;
    /** Omit `to` for the current (non-clickable) page. */
    to?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const linkStyle = {
    fontSize: "0.75rem",
    color: "var(--stone-400)",
    textDecoration: "none",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}
        >
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <Fragment key={i}>
                        {item.to && !isLast ? (
                            <Link
                                to={item.to}
                                style={linkStyle}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--moss)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--stone-400)"; }}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                aria-current={isLast ? "page" : undefined}
                                style={{ fontSize: "0.75rem", color: isLast ? "var(--stone-600)" : "var(--stone-400)", letterSpacing: "0.04em", textTransform: "uppercase" }}
                            >
                                {item.label}
                            </span>
                        )}
                        {!isLast && <span style={{ fontSize: "0.75rem", color: "var(--stone-300)" }}>›</span>}
                    </Fragment>
                );
            })}
        </nav>
    );
}
