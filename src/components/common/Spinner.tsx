interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    /** Arc color. Defaults to the moss brand accent; pass a contrasting
        color (e.g. on a colored button) so the spinner stays visible. */
    color?: string
}

const sizeMap = {
    sm: 16,
    md: 24,
    lg: 40,
}

export default function Spinner({ size = 'md', color = 'var(--moss)' }: SpinnerProps) {
    const px = sizeMap[size];
    const r = 10;
    const circumference = 2 * Math.PI * r;
    // A quarter-circle arc over a faint full track of the same hue.
    const arc = circumference * 0.28;

    return (
        <span
            role="status"
            aria-label="Loading"
            style={{ display: "inline-flex", lineHeight: 0, color }}
        >
            <svg
                className="animate-spin"
                width={px}
                height={px}
                viewBox="0 0 24 24"
                fill="none"
            >
                <circle
                    cx="12"
                    cy="12"
                    r={r}
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.2"
                />
                <circle
                    cx="12"
                    cy="12"
                    r={r}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${arc} ${circumference}`}
                />
            </svg>
        </span>
    );
}
