import type { Metadata } from "next";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import IncomeTaxForm from "@/components/calculators/IncomeTaxForm";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const calc = getCalculatorBySlug("finance/income-tax-calculator-india")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function IncomeTaxPage() {
    return (
        <>
            <CalculatorSchema calc={calc} />
            <CalculatorShell
                title="Income Tax Calculator India"
                subtitle="Compare your tax liability under the New Tax Regime vs Old Tax Regime for FY 2024-25. See which saves you more tax instantly."
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Finance", href: "/finance/sip-calculator" },
                    { label: "Income Tax Calculator", href: "/finance/income-tax-calculator-india" },
                ]}
                definitionTitle="Understanding Indian Income Tax Regimes"
                definitionContent={
                    <>
                        <p>
                            India offers two income tax regimes for individual taxpayers. The <strong>Old Tax Regime</strong> has
                            been the traditional system with higher tax rates but allows numerous deductions and exemptions
                            (Section 80C, 80D, HRA, LTA, home loan interest, etc.).
                        </p>
                        <p>
                            The <strong>New Tax Regime</strong>, introduced in Budget 2020 and made the default from FY 2023-24,
                            offers lower tax rates across more slabs but disallows most deductions and exemptions. The 2024
                            Budget increased the standard deduction under the new regime to ₹75,000.
                        </p>
                        <p>
                            Choosing the right regime depends on your total deductions. If your deductions are minimal, the
                            new regime typically results in lower tax. If you claim significant deductions (above ₹3-4 lakh),
                            the old regime may be more beneficial. This calculator compares both to help you decide.
                        </p>
                    </>
                }
                formulaTitle="Income Tax Slab Rates (FY 2024-25)"
                formulaContent={
                    <>
                        <h3>New Tax Regime (Default)</h3>
                        <div className="formula-block">
                            Up to ₹3,00,000 → Nil<br />
                            ₹3,00,001 – ₹7,00,000 → 5%<br />
                            ₹7,00,001 – ₹10,00,000 → 10%<br />
                            ₹10,00,001 – ₹12,00,000 → 15%<br />
                            ₹12,00,001 – ₹15,00,000 → 20%<br />
                            Above ₹15,00,000 → 30%<br />
                            Standard Deduction: ₹75,000<br />
                            Rebate u/s 87A: No tax if taxable income ≤ ₹7,00,000
                        </div>
                        <h3>Old Tax Regime</h3>
                        <div className="formula-block">
                            Up to ₹2,50,000 → Nil<br />
                            ₹2,50,001 – ₹5,00,000 → 5%<br />
                            ₹5,00,001 – ₹10,00,000 → 20%<br />
                            Above ₹10,00,000 → 30%<br />
                            Standard Deduction: ₹50,000<br />
                            Rebate u/s 87A: No tax if taxable income ≤ ₹5,00,000
                        </div>
                        <p><strong>Health &amp; Education Cess:</strong> 4% is added to the computed tax in both regimes.</p>
                    </>
                }
                exampleTitle="Example: Tax Comparison for ₹12,00,000 Income"
                exampleContent={
                    <>
                        <p><strong>Gross Annual Income:</strong> ₹12,00,000</p>
                        <h3>New Regime Calculation</h3>
                        <div className="formula-block">
                            Taxable = ₹12,00,000 − ₹75,000 = ₹11,25,000<br />
                            Tax = 0 + ₹20,000 + ₹30,000 + ₹18,750 = ₹68,750<br />
                            Cess = ₹68,750 × 4% = ₹2,750<br />
                            <strong>Total = ₹71,500</strong>
                        </div>
                        <h3>Old Regime Calculation (No Deductions)</h3>
                        <div className="formula-block">
                            Taxable = ₹12,00,000 − ₹50,000 = ₹11,50,000<br />
                            Tax = 0 + ₹12,500 + ₹1,00,000 + ₹45,000 = ₹1,57,500<br />
                            Cess = ₹1,57,500 × 4% = ₹6,300<br />
                            <strong>Total = ₹1,63,800</strong>
                        </div>
                        <p>
                            Without additional deductions, the <strong>New Regime saves ₹92,300</strong> for a ₹12 lakh income.
                            However, if you claim ₹3,00,000+ in deductions under the old regime, the gap narrows significantly.
                        </p>
                    </>
                }
                faqs={calc.faqs}
            >
                <IncomeTaxForm />
            </CalculatorShell>
        </>
    );
}
