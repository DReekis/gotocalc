import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";

export default function HomePage() {
  const categories = [
    { key: "finance", label: "Finance" },
    { key: "health", label: "Health" },
    { key: "math", label: "Math" },
    { key: "education", label: "Education" },
  ] as const;

  return (
    <main
      style={{ margin: "0 auto", maxWidth: 960, padding: "2.5rem 1rem 4rem" }}
    >
      {/* Hero */}
      <section style={{ marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: "0 0 0.75rem",
          }}
        >
          Free Online Calculators
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1rem",
            lineHeight: 1.6,
            maxWidth: 520,
            margin: 0,
          }}
        >
          Instant results, zero ads, 100% private. Works on any network.
        </p>
      </section>

      {/* Category Sections */}
      {categories.map((cat) => {
        const calcs = CALCULATORS.filter((c) => c.category === cat.key);
        if (calcs.length === 0) return null;
        return (
          <section key={cat.key} style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                color: "var(--muted)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                margin: "0 0 0.75rem",
                textTransform: "uppercase",
              }}
            >
              {cat.label}
            </h2>

            <div
              className="calc-grid"
              style={{
                display: "grid",
                gap: "1px",
                gridTemplateColumns: "1fr",
                background: "var(--border)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              {calcs.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/${calc.slug}`}
                  style={{
                    background: "var(--surface)",
                    color: "inherit",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        marginBottom: "0.125rem",
                      }}
                    >
                      {calc.title}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.8rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {calc.description.length > 80
                        ? calc.description.slice(0, 80) + "…"
                        : calc.description}
                    </div>
                  </div>
                  <span
                    style={{
                      color: "var(--muted)",
                      fontSize: "1rem",
                      flexShrink: 0,
                      marginLeft: "1rem",
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* SEO content */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          marginTop: "1rem",
          paddingTop: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}
        >
          Why GoToCalc?
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            maxWidth: 600,
          }}
        >
          GoToCalc is built for the real world — where internet connections are
          slow, data is expensive, and privacy matters. Every calculator runs
          entirely in your browser. No tracking, no external requests, no
          sign-up. Finance, health, math, and education tools that load
          instantly on any device.
        </p>
      </section>
    </main>
  );
}
