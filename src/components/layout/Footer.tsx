import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";

export default function Footer() {
    const byCategory = {
        finance: CALCULATORS.filter((c) => c.category === "finance"),
        health: CALCULATORS.filter((c) => c.category === "health"),
        math: CALCULATORS.filter((c) => c.category === "math"),
    };

    return (
        <footer
            style={{
                background: "var(--surface)",
                borderTop: "1px solid var(--border)",
                marginTop: "4rem",
                padding: "3rem 1.5rem 2rem",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gap: "2rem",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    margin: "0 auto",
                    maxWidth: 1200,
                }}
            >
                {/* Brand */}
                <div>
                    <p
                        style={{
                            color: "var(--foreground)",
                            fontWeight: 700,
                            fontSize: "1.125rem",
                            margin: "0 0 0.5rem",
                        }}
                    >
                        GoToCalc
                    </p>
                    <p
                        style={{
                            color: "var(--muted)",
                            fontSize: "0.875rem",
                            lineHeight: 1.6,
                            margin: 0,
                        }}
                    >
                        Free online calculators — instant, private, zero ads. Built for
                        speed on every network.
                    </p>
                </div>

                {/* Finance */}
                <div>
                    <p
                        style={{
                            color: "var(--foreground)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            margin: "0 0 0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Finance
                    </p>
                    {byCategory.finance.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/${c.slug}`}
                            style={{
                                color: "var(--muted)",
                                display: "block",
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                                textDecoration: "none",
                            }}
                        >
                            {c.title}
                        </Link>
                    ))}
                </div>

                {/* Health */}
                <div>
                    <p
                        style={{
                            color: "var(--foreground)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            margin: "0 0 0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Health
                    </p>
                    {byCategory.health.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/${c.slug}`}
                            style={{
                                color: "var(--muted)",
                                display: "block",
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                                textDecoration: "none",
                            }}
                        >
                            {c.title}
                        </Link>
                    ))}
                </div>

                {/* Math */}
                <div>
                    <p
                        style={{
                            color: "var(--foreground)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            margin: "0 0 0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Math
                    </p>
                    {byCategory.math.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/${c.slug}`}
                            style={{
                                color: "var(--muted)",
                                display: "block",
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                                textDecoration: "none",
                            }}
                        >
                            {c.title}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bottom footer */}
            <div
                style={{
                    borderTop: "1px solid var(--border)",
                    color: "var(--muted)",
                    fontSize: "0.8rem",
                    margin: "2rem auto 0",
                    maxWidth: 1200,
                    paddingTop: "1.5rem",
                    textAlign: "center",
                }}
            >
                © {new Date().getFullYear()} GoToCalc. All calculations run
                100% in your browser — your data never leaves your device.
            </div>
        </footer>
    );
}
