import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";

const categoryIcons: Record<string, React.ReactNode> = {
  finance: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  health: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  math: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

export default function HomePage() {
  const categories = [
    { key: "finance", label: "Finance", desc: "SIP, GST, Income Tax, Mortgage" },
    { key: "health", label: "Health", desc: "BMI, Age Calculator" },
    { key: "math", label: "Math", desc: "Percentage Calculator" },
  ];

  return (
    <main style={{ margin: "0 auto", maxWidth: 1200, padding: "3rem 1.5rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 1rem",
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Free Online Calculators
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1.125rem",
            lineHeight: 1.7,
            margin: "0 auto",
            maxWidth: 600,
          }}
        >
          Instant, private, zero ads. Financial, health, and math tools
          engineered for speed — works flawlessly on any network.
        </p>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          {[
            "100% Client-Side",
            "Zero Ads",
            "No Sign-Up",
            "Works Offline",
          ].map((badge) => (
            <span
              key={badge}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "999px",
                color: "var(--muted)",
                fontSize: "0.8rem",
                fontWeight: 500,
                padding: "0.4rem 1rem",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Category Sections */}
      {categories.map((cat) => {
        const calcs = CALCULATORS.filter((c) => c.category === cat.key);
        return (
          <section key={cat.key} style={{ marginBottom: "3rem" }}>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <span style={{ color: "var(--primary)" }}>
                {categoryIcons[cat.key]}
              </span>
              <div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {cat.label}
                </h2>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.85rem",
                    margin: 0,
                  }}
                >
                  {cat.desc}
                </p>
              </div>
            </div>

            <div className="calc-grid">
              {calcs.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/${calc.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="calc-card" style={{ height: "100%" }}>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        margin: "0 0 0.5rem",
                      }}
                    >
                      {calc.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {calc.description}
                    </p>
                    <span
                      style={{
                        color: "var(--primary)",
                        display: "inline-block",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        marginTop: "0.75rem",
                      }}
                    >
                      Open Calculator →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* Bottom SEO content */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          marginTop: "2rem",
          paddingTop: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Why GoToCalc?
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.95rem",
            lineHeight: 1.8,
            maxWidth: 700,
          }}
        >
          GoToCalc is built for the real world — where internet connections are
          slow, data is expensive, and privacy matters. Every calculator runs
          100% in your browser with zero external requests. No tracking, no ads,
          no sign-up. Just fast, accurate results on any device, any network.
          Our tools cover finance (SIP, GST, income tax, mortgage), health (BMI,
          age), and math (percentages) — with more coming soon.
        </p>
      </section>
    </main>
  );
}
