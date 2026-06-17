import { useProfile } from "@/queries/useProfile";
import { useAuthStore } from "@/store/auth.store";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import Button from "@/components/common/Button";

export default function ProfilePage() {
    const { data: profile, isLoading, isError, error, refetch } = useProfile();
    const logout = useAuthStore((s) => s.logout);

    useDocumentTitle(
        profile ? `${profile.firstName} ${profile.lastName}` : "Profile"
    );

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError || !profile) {
        return <ErrorState message={(error as Error)?.message ?? "Could not load your profile."} onRetry={() => refetch()} />;
    }

    const fullName = `${profile.firstName} ${profile.lastName}`;
    const birthDate = formatDate(profile.birthDate);

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: "60rem", margin: "0 auto" }}>

                {/* ── Header card ── */}
                <header
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "1.5rem",
                        padding: "1.75rem",
                        backgroundColor: "var(--bg-card)",
                        borderRadius: "6px",
                        borderLeft: "2px solid var(--moss)",
                        marginBottom: "2rem",
                    }}
                >
                    <img
                        src={profile.image}
                        alt={fullName}
                        style={{
                            height: "5.5rem",
                            width: "5.5rem",
                            borderRadius: "50%",
                            objectFit: "cover",
                            backgroundColor: "var(--bg)",
                            border: "2px solid var(--moss-light)",
                            flexShrink: 0,
                        }}
                    />

                    <div style={{ flex: 1, minWidth: "12rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem", flexWrap: "wrap" }}>
                            <h1
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                                    fontWeight: 700,
                                    color: "var(--text)",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.1,
                                }}
                            >
                                {fullName}
                            </h1>
                            {profile.role && <RoleBadge role={profile.role} />}
                        </div>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8125rem", color: "var(--moss)" }}>
                            @{profile.username}
                        </p>
                        <p style={{ fontSize: "0.8125rem", color: "var(--stone-400)", marginTop: "0.25rem" }}>
                            {profile.email}
                        </p>
                    </div>

                    <Button variant="secondary" onClick={logout} style={{ flexShrink: 0 }}>
                        Sign out
                    </Button>
                </header>

                {/* ── Detail sections ── */}
                <div className="profile-grid">
                    <Section title="Personal">
                        <Field label="Full name" value={`${profile.firstName} ${profile.maidenName ? profile.maidenName + " " : ""}${profile.lastName}`} />
                        <Field label="Gender" value={capitalize(profile.gender)} />
                        <Field label="Age" value={String(profile.age)} mono />
                        <Field label="Birth date" value={birthDate} />
                        <Field label="Blood group" value={profile.bloodGroup} mono />
                        <Field label="Eye color" value={capitalize(profile.eyeColor)} />
                    </Section>

                    <Section title="Contact">
                        <Field label="Email" value={profile.email} />
                        <Field label="Phone" value={profile.phone} mono />
                        <Field
                            label="Address"
                            value={`${profile.address.address}, ${profile.address.city}`}
                        />
                        <Field
                            label="Region"
                            value={`${profile.address.state} ${profile.address.stateCode}, ${profile.address.postalCode}`}
                        />
                        <Field label="Country" value={profile.address.country} />
                    </Section>

                    <Section title="Work">
                        <Field label="Company" value={profile.company.name} />
                        <Field label="Title" value={profile.company.title} />
                        <Field label="Department" value={profile.company.department} />
                        <Field label="Office" value={`${profile.company.address.city}, ${profile.company.address.stateCode}`} />
                    </Section>

                    <Section title="Education">
                        <Field label="University" value={profile.university} />
                        <Field label="Height" value={`${profile.height} cm`} mono />
                        <Field label="Weight" value={`${profile.weight} kg`} mono />
                        <Field label="User ID" value={`#${profile.id}`} mono />
                    </Section>
                </div>
            </div>
        </div>
    );
}

/* ── Sub-components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section
            style={{
                padding: "1.5rem",
                backgroundColor: "var(--bg-card)",
                borderRadius: "6px",
            }}
        >
            <h2
                style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--amber)",
                    marginBottom: "1.25rem",
                    paddingBottom: "0.625rem",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                {title}
            </h2>
            <dl style={{ display: "flex", flexDirection: "column", gap: "0.875rem", margin: 0 }}>
                {children}
            </dl>
        </section>
    );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
            <dt
                style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--stone-400)",
                    flexShrink: 0,
                }}
            >
                {label}
            </dt>
            <dd
                style={{
                    margin: 0,
                    fontFamily: mono ? "'DM Mono', monospace" : undefined,
                    fontSize: mono ? "0.8125rem" : "0.875rem",
                    color: "var(--text)",
                    textAlign: "right",
                    wordBreak: "break-word",
                }}
            >
                {value || "—"}
            </dd>
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    return (
        <span
            style={{
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--moss)",
                backgroundColor: "var(--moss-pale)",
                padding: "0.2rem 0.5rem",
                borderRadius: "3px",
            }}
        >
            {role}
        </span>
    );
}

/* ── Helpers ── */

function capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
