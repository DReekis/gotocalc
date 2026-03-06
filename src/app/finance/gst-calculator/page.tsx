import type { Metadata } from "next";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import GstCalculatorForm from "@/components/calculators/GstCalculatorForm";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const calc = getCalculatorBySlug("finance/gst-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function GstCalculatorPage() {
    return (
        <>
            <CalculatorSchema calc={calc} />
            <CalculatorShell
                title="GST Calculator"
                subtitle="Calculate GST instantly with inclusive and exclusive modes. Get CGST, SGST, and IGST breakdowns for all standard Indian tax slabs."
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Finance", href: "/finance/sip-calculator" },
                    { label: "GST Calculator", href: "/finance/gst-calculator" },
                ]}
                definitionTitle="What is GST (Goods and Services Tax)?"
                definitionContent={
                    <>
                        <p>
                            GST (Goods and Services Tax) is a comprehensive indirect tax levied on the supply of goods and
                            services in India, replacing multiple cascading taxes like VAT, Service Tax, and Excise Duty.
                            Implemented on July 1, 2017, GST follows a destination-based taxation model.
                        </p>
                        <p>
                            GST is divided into <strong>CGST</strong> (Central GST — collected by the Central Government),
                            <strong> SGST</strong> (State GST — collected by the State Government) for intra-state transactions,
                            and <strong>IGST</strong> (Integrated GST — collected by the Central Government) for inter-state transactions.
                        </p>
                        <p>
                            India has four primary GST slab rates: <strong>5%</strong> for essential goods, <strong>12%</strong> for
                            standard goods, <strong>18%</strong> for most services and goods, and <strong>28%</strong> for luxury
                            and demerit goods. Some essential items like unprocessed food and milk are exempt (0% GST).
                        </p>
                    </>
                }
                formulaTitle="GST Calculation Formulas"
                formulaContent={
                    <>
                        <h3>Exclusive GST (Adding GST to Net Price)</h3>
                        <div className="formula-block">
                            GST Amount = Net Price × (GST Rate / 100)<br />
                            Total Price = Net Price + GST Amount
                        </div>
                        <h3>Inclusive GST (Extracting GST from Total Price)</h3>
                        <div className="formula-block">
                            GST Amount = Total Price − [Total Price × 100 / (100 + GST Rate)]<br />
                            Net Price = Total Price − GST Amount
                        </div>
                        <h3>Tax Component Split</h3>
                        <ul>
                            <li><strong>Intra-state:</strong> CGST = GST/2, SGST = GST/2</li>
                            <li><strong>Inter-state:</strong> IGST = Full GST Amount</li>
                        </ul>
                    </>
                }
                exampleTitle="Step-by-Step GST Calculation Example"
                exampleContent={
                    <>
                        <p><strong>Scenario:</strong> A product costs ₹10,000 (net price) with 18% GST, sold within the same state.</p>
                        <h3>Step 1: Calculate GST Amount</h3>
                        <div className="formula-block">GST = ₹10,000 × 18/100 = ₹1,800</div>
                        <h3>Step 2: Split into Components</h3>
                        <ul>
                            <li>CGST (9%) = ₹900</li>
                            <li>SGST (9%) = ₹900</li>
                        </ul>
                        <h3>Step 3: Total Price</h3>
                        <div className="formula-block">Total = ₹10,000 + ₹1,800 = ₹11,800</div>
                        <p>For inter-state supply, the entire ₹1,800 would be collected as IGST instead of splitting into CGST and SGST.</p>
                    </>
                }
                faqs={calc.faqs}
            >
                <GstCalculatorForm />
            </CalculatorShell>
        </>
    );
}
