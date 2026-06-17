import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', style, ...props }, ref) => {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {label && (
                    <label
                        style={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--stone-600)",
                        }}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={className}
                    style={{
                        width: "100%",
                        borderRadius: "4px",
                        border: `1px solid ${error ? "var(--red-err)" : "var(--border)"}`,
                        padding: "0.75rem 0.875rem",
                    minHeight: "2.75rem",
                        fontSize: "0.9375rem",
                        backgroundColor: "var(--bg-input)",
                        color: "var(--text)",
                        outline: "none",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                        ...style,
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = error ? "var(--red-err)" : "var(--moss)";
                        e.currentTarget.style.boxShadow = error
                            ? "0 0 0 3px color-mix(in srgb, var(--red-err) 15%, transparent)"
                            : "0 0 0 3px color-mix(in srgb, var(--moss) 15%, transparent)";
                        if (props.onFocus) props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = error ? "var(--red-err)" : "var(--border)";
                        e.currentTarget.style.boxShadow = "none";
                        if (props.onBlur) props.onBlur(e);
                    }}
                    {...props}
                />
                {error && (
                    <p style={{ fontSize: "0.75rem", color: "var(--red-err)" }}>{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
export default Input
