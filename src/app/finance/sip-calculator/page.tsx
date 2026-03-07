import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const SipCalculatorForm = dynamic(
  () => import("@/components/calculators/SipCalculatorForm"),
  { loading: () => <CalcSkeleton /> },
);

const calc = getCalculatorBySlug("finance/sip-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function SipCalculatorPage() {
  return (
    <>
      <CalculatorSchema calc={calc} />
      <CalculatorShell
        title="SIP Calculator"
        subtitle="Calculate Systematic Investment Plan returns instantly. See how your monthly investments grow over time with the power of compounding."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Finance", href: "/" },
          { label: "SIP Calculator", href: "/finance/sip-calculator" },
        ]}
        definitionTitle="What is a SIP (Systematic Investment Plan)?"
        definitionContent={
          <>
            <p>
              A Systematic Investment Plan (SIP) is an investment strategy
              offered by mutual funds in India, allowing investors to invest a
              fixed amount at regular intervals — typically monthly. Instead of
              making a lump-sum investment, SIP lets you invest small amounts
              periodically, making it accessible for salaried individuals and
              disciplined investors.
            </p>
            <p>
              SIPs leverage <strong>rupee cost averaging</strong> — when markets
              are down, your fixed amount buys more units; when markets are up,
              it buys fewer. Over time, this averages out the cost per unit,
              reducing the impact of market volatility on your investment.
            </p>
            <p>
              SIPs are widely used in equity mutual funds, ELSS (tax-saving
              funds), and hybrid funds. They are ideal for long-term wealth
              creation goals like retirement planning, children&apos;s
              education, or building an emergency fund.
            </p>
          </>
        }
        formulaTitle="SIP Calculation Formula"
        formulaContent={
          <>
            <p>
              The SIP calculator uses the{" "}
              <strong>Future Value of Annuity</strong> formula, which accounts
              for compounding on each monthly instalment:
            </p>
            <div className="formula-block">
              FV = P × [((1 + r)<sup>n</sup> − 1) / r] × (1 + r)
            </div>
            <p>Where:</p>
            <ul>
              <li>
                <strong>FV</strong> = Future Value (total maturity amount)
              </li>
              <li>
                <strong>P</strong> = Monthly investment amount
              </li>
              <li>
                <strong>r</strong> = Monthly rate of return (annual rate ÷ 12 ÷
                100)
              </li>
              <li>
                <strong>n</strong> = Total number of instalments (years × 12)
              </li>
            </ul>
          </>
        }
        exampleTitle="Step-by-Step SIP Calculation Example"
        exampleContent={
          <>
            <p>
              <strong>Scenario:</strong> You invest ₹5,000 per month for 10
              years at an expected annual return of 12%.
            </p>
            <h3>Step 1: Convert Annual Rate to Monthly</h3>
            <p>r = 12% ÷ 12 ÷ 100 = 0.01</p>
            <h3>Step 2: Calculate Total Months</h3>
            <p>n = 10 × 12 = 120 months</p>
            <h3>Step 3: Apply the Formula</h3>
            <div className="formula-block">
              FV = 5000 × [((1.01)<sup>120</sup> − 1) / 0.01] × 1.01
              <br />
              FV ≈ ₹11,61,695
            </div>
            <h3>Result</h3>
            <ul>
              <li>
                <strong>Total Invested:</strong> ₹6,00,000 (₹5,000 × 120)
              </li>
              <li>
                <strong>Estimated Returns:</strong> ₹5,61,695
              </li>
              <li>
                <strong>Total Value:</strong> ₹11,61,695
              </li>
            </ul>
          </>
        }
        faqs={calc.faqs}
      >
        <SipCalculatorForm />
      </CalculatorShell>
    </>
  );
}
