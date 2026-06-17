import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/common/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    useDocumentTitle(user ? `${user.firstName} ${user.lastName}` : "Account");

    return (
        <div
            style={{
                minHeight: "calc(100vh - 3.5rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--bg)",
                padding: "1.5rem",
            }}
        >
            <div style={{ width: "100%", maxWidth: "22rem", textAlign: "center" }}>

                {user?.image && (
                    <img
                        src={user.image}
                        alt={user.firstName}
                        style={{
                            height: "4rem",
                            width: "4rem",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid var(--moss-light)",
                            margin: "0 auto 1.25rem",
                            display: "block",
                        }}
                    />
                )}

                <h1
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        letterSpacing: "-0.02em",
                        marginBottom: "0.5rem",
                    }}
                >
                    {user ? `${user.firstName} ${user.lastName}` : "Your account"}
                </h1>

                {user?.email && (
                    <p
                        style={{
                            fontSize: "0.8125rem",
                            color: "var(--stone-400)",
                            marginBottom: "2rem",
                        }}
                    >
                        {user.email}
                    </p>
                )}

                <Button variant="secondary" onClick={logout}>
                    Sign out
                </Button>
            </div>
        </div>
    );
}
