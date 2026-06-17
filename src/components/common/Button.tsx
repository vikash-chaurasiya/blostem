import type { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    variant?: 'primary' | 'secondary'
}

export default function Button({
    loading,
    variant = 'primary',
    className = '',
    children,
    disabled,
    style,
    ...props
}: ButtonProps) {
    const isPrimary = variant === 'primary';

    return (
        <button
            className={className}
            disabled={disabled || loading}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                borderRadius: "4px",
                padding: "0.625rem 1.25rem",
                minHeight: "2.75rem",
                fontSize: "0.8125rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                cursor: disabled || loading ? "not-allowed" : "pointer",
                opacity: disabled || loading ? 0.5 : 1,
                border: "none",
                transition: "background-color 0.15s, color 0.15s",
                backgroundColor: isPrimary ? "var(--moss)" : "var(--bg-card)",
                color: isPrimary ? "var(--stone-50)" : "var(--text)",
                ...style,
            }}
            onMouseEnter={(e) => {
                if (disabled || loading) return;
                const el = e.currentTarget;
                el.style.backgroundColor = isPrimary ? "var(--moss-light)" : "var(--hover)";
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = isPrimary ? "var(--moss)" : "var(--bg-card)";
            }}
            {...props}
        >
            {loading && <Spinner size="sm" color={isPrimary ? "var(--stone-50)" : "var(--text)"} />}
            {children}
        </button>
    )
}
