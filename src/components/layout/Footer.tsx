import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";

export default function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid var(--border)",
                marginTop: "4rem",
                padding: "2rem 1rem 1.5rem",
            }}
        >
            <div
                style={{
                    margin: "0 auto",
                    maxWidth: 960,
                }}
            >
                {/* Links row */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem 1.5rem",
                        fontSize: "0.8rem",
                        marginBottom: "1.5rem",
                    }}
                >
                    {CALCULATORS.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/${c.slug}`}
                            style={{ color: "var(--muted)" }}
                        >
                            {c.title}
                        </Link>
                    ))}
                </div>

                {/* Bottom line */}
                <div
                    style={{
                        borderTop: "1px solid var(--border)",
                        color: "var(--muted)",
                        fontSize: "0.75rem",
                        paddingTop: "1rem",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                    }}
                >
                    <span>
                        © {new Date().getFullYear()} GoToCalc
                    </span>
                    <span>
                        All calculations run in your browser — your data never leaves your device.
                    </span>
                </div>
            </div>
        </footer>
    );
}
