import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const ScientificCalculator = dynamic(
  () => import("@/components/calculators/ScientificCalculator"),
  { loading: () => <CalcSkeleton /> }
);

const calc = getCalculatorBySlug("math/scientific-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function ScientificCalculatorPage() {
  return (
    <>
      <CalculatorSchema calc={calc} />
      <CalculatorShell
        title="Scientific Calculator"
        subtitle="A full-featured scientific calculator with trigonometric functions, logarithms, exponents, and more — right in your browser."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Math", href: "/math/percentage-calculator" },
          { label: "Scientific Calculator", href: "/math/scientific-calculator" },
        ]}
        definitionTitle="What is a Scientific Calculator?"
        definitionContent={
          <>
            <p>
              A scientific calculator is an advanced calculator that performs mathematical
              operations beyond basic arithmetic. It handles trigonometric functions
              (sin, cos, tan), logarithmic functions (log, ln), exponentiation, roots,
              and factorials — making it essential for students in algebra, calculus,
              physics, and engineering.
            </p>
            <p>
              This online scientific calculator works exactly like a physical Casio or
              Texas Instruments unit, with the added convenience of being accessible
              from any device. All calculations run in your browser — nothing is sent
              to any server.
            </p>
          </>
        }
        formulaTitle="Supported Functions"
        formulaContent={
          <>
            <h3>Trigonometric (Degrees)</h3>
            <div className="formula-block">
              sin(θ) &nbsp; cos(θ) &nbsp; tan(θ)
            </div>
            <p>All trig functions use degrees. Example: sin(90) = 1, cos(60) = 0.5.</p>

            <h3>Logarithmic</h3>
            <div className="formula-block">
              log(x) = log₁₀(x) &nbsp;&nbsp; ln(x) = logₑ(x)
            </div>

            <h3>Powers & Roots</h3>
            <div className="formula-block">
              x² &nbsp; xʸ &nbsp; √x &nbsp; 1/x
            </div>

            <h3>Special</h3>
            <div className="formula-block">
              n! (factorial) &nbsp; π = 3.14159... &nbsp; e = 2.71828...
            </div>
          </>
        }
        exampleTitle="Usage Examples"
        exampleContent={
          <>
            <h3>Pythagorean Hypotenuse</h3>
            <div className="formula-block">sqrt(3^2 + 4^2) = <strong>5</strong></div>

            <h3>Compound Interest Factor</h3>
            <div className="formula-block">1.05^10 = <strong>1.6288946...</strong></div>

            <h3>Factorial</h3>
            <div className="formula-block">10! = <strong>3628800</strong></div>
          </>
        }
        faqs={calc.faqs}
      >
        <ScientificCalculator />
      </CalculatorShell>
    </>
  );
}
