import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const PercentageForm = dynamic(
  () => import("@/components/calculators/PercentageForm"),
  { loading: () => <CalcSkeleton /> },
);

const calc = getCalculatorBySlug("math/percentage-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function PercentageCalculatorPage() {
  return (
    <>
      <CalculatorSchema calc={calc} />
      <CalculatorShell
        title="Percentage Calculator"
        subtitle="Instantly calculate percentages: X is what % of Y? What is X% of Y? Fast, private, and works entirely in your browser."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Math", href: "/math/percentage-calculator" },
          {
            label: "Percentage Calculator",
            href: "/math/percentage-calculator",
          },
        ]}
        definitionTitle="What is a Percentage?"
        definitionContent={
          <>
            <p>
              A percentage is a number or ratio expressed as a fraction of 100.
              It is often denoted using the percent sign, &ldquo;%&rdquo;. For
              example, 45% (read as &ldquo;forty-five percent&rdquo;) is equal
              to 45/100, or 0.45.
            </p>
            <p>
              Percentages are widely used in daily life to calculate discounts,
              tips in restaurants, interest rates, tax calculations, and
              interpreting statistics. They provide a standard way of expressing
              proportions, making it easier to compare different quantities.
            </p>
          </>
        }
        formulaTitle="Common Percentage Formulas"
        formulaContent={
          <>
            <h3>1. What is X% of Y?</h3>
            <div className="formula-block">Result = (X / 100) × Y</div>
            <p>Example: 20% of 150 = (20 / 100) × 150 = 30</p>

            <h3>2. X is what percent of Y?</h3>
            <div className="formula-block">Result = (X / Y) × 100</div>
            <p>Example: 45 is what percent of 90? = (45 / 90) × 100 = 50%</p>

            <h3>3. Percentage Change (Increase/Decrease)</h3>
            <div className="formula-block">
              Result = ((New Value - Old Value) / |Old Value|) × 100
            </div>
            <p>
              Example: Price goes from $40 to $50. Change = ((50 - 40) / 40) ×
              100 = +25% (Increase)
            </p>
          </>
        }
        exampleTitle="Real-World Examples"
        exampleContent={
          <>
            <h3>Tip Calculation</h3>
            <p>
              If your restaurant bill is $85 and you want to leave a 15% tip:
              <br />
              Tip = 15% of $85 = $12.75.
              <br />
              Total to pay = $85 + $12.75 = $97.75.
            </p>
            <h3>Discount Calculation</h3>
            <p>
              A jacket originally costs $120 and is on a 25% discount.
              <br />
              Discount = 25% of $120 = $30.
              <br />
              Final Price = $120 - $30 = $90.
            </p>
          </>
        }
        faqs={calc.faqs}
      >
        <PercentageForm />
      </CalculatorShell>
    </>
  );
}
