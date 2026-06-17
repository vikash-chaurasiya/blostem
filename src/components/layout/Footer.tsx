export default function Footer() {
    return (
        <footer style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--bg)" }}>
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                <span
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--text)",
                        letterSpacing: "-0.01em",
                        opacity: 0.8,
                    }}
                >
                    Blostem
                </span>
                <span
                    style={{
                        fontSize: "0.6875rem",
                        color: "var(--stone-400)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                    }}
                >
                    © {new Date().getFullYear()} All rights reserved
                </span>
            </div>
        </footer>
    );
}
