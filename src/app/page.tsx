import HomeCalculatorDirectory from "@/components/home/HomeCalculatorDirectory";
import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";

const homeCalculators = CALCULATORS.map((calc) => ({
  slug: calc.slug,
  title: calc.title,
  description: calc.description,
  category: calc.category,
  categoryLabel: calc.categoryLabel,
}));

export default function HomePage() {

  return (
    <main
      style={{ margin: "0 auto", maxWidth: 960, padding: "2.5rem 1rem 4rem" }}
    >
      <section style={{ marginBottom: "2rem" }}>
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
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
          Popular tool:{" "}
          <Link href="/age-calculator" prefetch={false}>
            Age Calculator
          </Link>
          .
        </p>
      </section>

      <HomeCalculatorDirectory calculators={homeCalculators} />

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
          GoToCalc is built for the real world where internet connections are
          slow, data is expensive, and privacy matters. Every calculator runs
          entirely in your browser. No tracking, no external requests, no
          sign-up. Finance, health, math, and education tools that load fast on
          any device.
        </p>
      </section>
    </main>
  );
}
