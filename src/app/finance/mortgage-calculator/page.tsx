import type { Metadata } from "next";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import MortgageForm from "@/components/calculators/MortgageForm";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const calc = getCalculatorBySlug("finance/mortgage-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function MortgageCalculatorPage() {
    return (
        <>
            <CalculatorSchema calc={calc} />
            <CalculatorShell
                title="Mortgage Calculator"
                subtitle="Calculate your monthly mortgage payment, total interest, and view a detailed amortization schedule. Plan your home purchase with precision."
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Finance", href: "/finance/sip-calculator" },
                    { label: "Mortgage Calculator", href: "/finance/mortgage-calculator" },
                ]}
                definitionTitle="What is a Mortgage?"
                definitionContent={
                    <>
                        <p>
                            A mortgage is a type of loan used to purchase real estate, where the property itself serves as
                            collateral. The borrower agrees to pay back the loan, plus interest, over a set period (typically
                            15 or 30 years) through regular monthly payments.
                        </p>
                        <p>
                            Each monthly payment consists of two parts: <strong>principal</strong> (reducing the loan balance) and
                            <strong> interest</strong> (the cost of borrowing). In the early years, a larger portion goes toward
                            interest; as the loan matures, more goes toward principal. This is known as <strong>amortization</strong>.
                        </p>
                        <p>
                            The <strong>down payment</strong> is the upfront amount paid by the buyer. A 20% down payment
                            is standard and typically avoids the need for Private Mortgage Insurance (PMI). A larger
                            down payment reduces both the monthly payment and total interest paid.
                        </p>
                    </>
                }
                formulaTitle="Mortgage Payment Formula"
                formulaContent={
                    <>
                        <p>
                            Monthly mortgage payments are calculated using the standard amortization formula:
                        </p>
                        <div className="formula-block">
                            M = P × [r(1 + r)<sup>n</sup>] / [(1 + r)<sup>n</sup> − 1]
                        </div>
                        <p>Where:</p>
                        <ul>
                            <li><strong>M</strong> = Monthly payment</li>
                            <li><strong>P</strong> = Principal loan amount (home price minus down payment)</li>
                            <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
                            <li><strong>n</strong> = Total number of payments (years × 12)</li>
                        </ul>
                    </>
                }
                exampleTitle="Example: $400,000 Home at 6.5% Interest"
                exampleContent={
                    <>
                        <p><strong>Scenario:</strong> Purchase a $400,000 home with 20% down at 6.5% interest over 30 years.</p>
                        <h3>Step 1: Calculate Loan Amount</h3>
                        <div className="formula-block">
                            Down Payment = $400,000 × 20% = $80,000<br />
                            Loan = $400,000 − $80,000 = $320,000
                        </div>
                        <h3>Step 2: Convert Rate</h3>
                        <div className="formula-block">r = 6.5% ÷ 12 ÷ 100 = 0.005417</div>
                        <h3>Step 3: Calculate Monthly Payment</h3>
                        <div className="formula-block">
                            n = 30 × 12 = 360 months<br />
                            M = $320,000 × [0.005417 × 1.005417³⁶⁰] / [1.005417³⁶⁰ − 1]<br />
                            <strong>M ≈ $2,023/month</strong>
                        </div>
                        <h3>Result</h3>
                        <ul>
                            <li><strong>Monthly Payment:</strong> $2,023</li>
                            <li><strong>Total Paid:</strong> $728,280 over 30 years</li>
                            <li><strong>Total Interest:</strong> $408,280</li>
                        </ul>
                    </>
                }
                faqs={calc.faqs}
            >
                <MortgageForm />
            </CalculatorShell>
        </>
    );
}
