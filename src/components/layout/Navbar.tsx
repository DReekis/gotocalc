import Link from "next/link";

export default function Navbar() {
    return (
        <nav
            style={{
                borderBottom: "1px solid var(--border)",
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "var(--bg)",
            }}
        >
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "0 auto",
                    maxWidth: 960,
                    padding: "0.75rem 1rem",
                }}
            >
                <Link
                    href="/"
                    prefetch={false}
                    style={{
                        color: "var(--fg)",
                        fontWeight: 800,
                        fontSize: "1.125rem",
                        letterSpacing: "-0.02em",
                    }}
                >
                    GoToCalc<span style={{ color: "var(--muted)" }}>.</span>
                </Link>

                <div
                    style={{
                        alignItems: "center",
                        display: "flex",
                        gap: "1.25rem",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE
                    }}
                >
                    <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
                    <Link href="/finance/sip-calculator" prefetch={false} style={{ color: "var(--muted)" }}>
                        Finance
                    </Link>
                    <Link href="/health/bmi-calculator" prefetch={false} style={{ color: "var(--muted)" }}>
                        Health
                    </Link>
                    <Link href="/math/percentage-calculator" prefetch={false} style={{ color: "var(--muted)" }}>
                        Math
                    </Link>
                    <Link href="/education/cgpa-to-percentage-calculator" prefetch={false} style={{ color: "var(--muted)" }}>
                        Education
                    </Link>
                </div>
            </div>
        </nav>
    );
}
