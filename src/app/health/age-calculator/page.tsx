import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const AgeCalculatorForm = dynamic(
  () => import("@/components/calculators/AgeCalculatorForm"),
  { loading: () => <CalcSkeleton /> },
);

const calc = getCalculatorBySlug("health/age-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function AgeCalculatorPage() {
  return (
    <>
      <CalculatorSchema calc={calc} />
      <CalculatorShell
        title="Age Calculator"
        subtitle="Calculate your exact chronological age in years, months, and days. Find total days lived and countdown to your next birthday."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Health", href: "/health/bmi-calculator" },
          { label: "Age Calculator", href: "/health/age-calculator" },
        ]}
        definitionTitle="How Age Calculation Works"
        definitionContent={
          <>
            <p>
              Chronological age is the amount of time elapsed from a
              person&apos;s date of birth to a given date (usually today). While
              it seems simple, precise age calculation must account for varying
              month lengths (28–31 days) and leap years.
            </p>
            <p>
              This calculator computes your age by first determining the
              difference in years, then adjusting for remaining months and days.
              It handles edge cases like being born on February 29 (leap day)
              and months with different day counts correctly.
            </p>
            <p>
              Knowing your exact age is essential for government exams (age
              eligibility), passport applications, school admissions, retirement
              planning, insurance calculations, and legal age verification.
            </p>
          </>
        }
        formulaTitle="Age Calculation Algorithm"
        formulaContent={
          <>
            <p>The calculator follows this step-by-step algorithm:</p>
            <div className="formula-block">
              1. years = targetYear − birthYear
              <br />
              2. months = targetMonth − birthMonth
              <br />
              3. days = targetDay − birthDay
              <br />
              4. If days &lt; 0 → borrow from previous month
              <br />
              5. If months &lt; 0 → borrow 12 from years
              <br />
              6. totalDays = absolute difference in milliseconds ÷ (1000 × 60 ×
              60 × 24)
            </div>
            <p>
              The &ldquo;borrowing&rdquo; logic ensures that partial months and
              days are correctly handled, similar to how subtraction works with
              carrying in arithmetic.
            </p>
          </>
        }
        exampleTitle="Example: Age as of March 5, 2026"
        exampleContent={
          <>
            <p>
              <strong>Date of Birth:</strong> August 15, 2001
            </p>
            <p>
              <strong>Target Date:</strong> March 5, 2026
            </p>
            <h3>Step 1: Subtract Years</h3>
            <div className="formula-block">
              2026 − 2001 = 25 years (preliminary)
            </div>
            <h3>Step 2: Subtract Months</h3>
            <div className="formula-block">
              March (3) − August (8) = −5 → Borrow: 24 years, 7 months
            </div>
            <h3>Step 3: Subtract Days</h3>
            <div className="formula-block">
              5 − 15 = −10 → Borrow from Feb: 24 years, 6 months, 18 days
            </div>
            <h3>Result</h3>
            <ul>
              <li>
                <strong>Exact Age:</strong> 24 years, 6 months, 18 days
              </li>
              <li>
                <strong>Total Days Lived:</strong> ~8,968 days
              </li>
              <li>
                <strong>Next Birthday:</strong> ~163 days away
              </li>
            </ul>
          </>
        }
        faqs={calc.faqs}
      >
        <AgeCalculatorForm />
      </CalculatorShell>
    </>
  );
}
