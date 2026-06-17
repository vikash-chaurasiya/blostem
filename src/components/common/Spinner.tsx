interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
    const px = sizeMap[size];
    return (
        <svg
            className="animate-spin"
            width={px}
            height={px}
            fill="none"
            viewBox="0 0 24 24"
            style={{ color: "var(--moss)" }}
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}
