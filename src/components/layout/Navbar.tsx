import Link from "next/link";

export default function Navbar() {
    return (
        <nav
            style={{
                background: "var(--surface)",
                borderBottom: "1px solid var(--border)",
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}
        >
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "0 auto",
                    maxWidth: 1200,
                    padding: "0.75rem 1.5rem",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        alignItems: "center",
                        color: "var(--foreground)",
                        display: "flex",
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        gap: "0.5rem",
                        textDecoration: "none",
                    }}
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        aria-hidden="true"
                    >
                        <rect
                            width="28"
                            height="28"
                            rx="7"
                            fill="url(#logo-grad)"
                        />
                        <path
                            d="M8 9h12M8 14h12M8 19h8"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient
                                id="logo-grad"
                                x1="0"
                                y1="0"
                                x2="28"
                                y2="28"
                            >
                                <stop stopColor="#6366f1" />
                                <stop offset="1" stopColor="#22d3ee" />
                            </linearGradient>
                        </defs>
                    </svg>
                    GoToCalc
                </Link>

                {/* Nav links */}
                <div
                    style={{
                        alignItems: "center",
                        display: "flex",
                        gap: "1.5rem",
                        fontSize: "0.9rem",
                    }}
                >
                    <Link
                        href="/finance/sip-calculator"
                        style={{ color: "var(--muted)", textDecoration: "none" }}
                    >
                        Finance
                    </Link>
                    <Link
                        href="/health/bmi-calculator"
                        style={{ color: "var(--muted)", textDecoration: "none" }}
                    >
                        Health
                    </Link>
                    <Link
                        href="/math/percentage-calculator"
                        style={{ color: "var(--muted)", textDecoration: "none" }}
                    >
                        Math
                    </Link>
                </div>
            </div>
        </nav>
    );
}
