import type { Metadata } from "next";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import PercentageForm from "@/components/calculators/PercentageForm";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const calc = getCalculatorBySlug("math/percentage-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function PercentageCalculatorPage() {
    return (
        <>
            <CalculatorSchema calc={calc} />
            <CalculatorShell
                title="Percentage Calculator"
                subtitle="Calculate percentages instantly — find X% of Y, determine what percent X is of Y, or compute percentage increase and decrease."
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Math", href: "/math/percentage-calculator" },
                    { label: "Percentage Calculator", href: "/math/percentage-calculator" },
                ]}
                definitionTitle="What is a Percentage?"
                definitionContent={
                    <>
                        <p>
                            A percentage is a way of expressing a number as a fraction of 100. The word comes from the Latin
                            &ldquo;per centum,&rdquo; meaning &ldquo;by the hundred.&rdquo; Percentages are used everywhere —
                            in finance (interest rates, tax), science (concentrations), retail (discounts), and everyday life.
                        </p>
                        <p>
                            There are three common types of percentage calculations:
                        </p>
                        <ul>
                            <li><strong>X% of Y</strong> — e.g., &ldquo;What is 15% of 200?&rdquo; → 30</li>
                            <li><strong>X is what % of Y</strong> — e.g., &ldquo;45 is what percent of 200?&rdquo; → 22.5%</li>
                            <li><strong>Percentage Change</strong> — e.g., &ldquo;Change from 100 to 125&rdquo; → 25% increase</li>
                        </ul>
                    </>
                }
                formulaTitle="Percentage Formulas"
                formulaContent={
                    <>
                        <h3>Finding X% of Y</h3>
                        <div className="formula-block">
                            Result = (X / 100) × Y
                        </div>
                        <h3>Finding What Percent X is of Y</h3>
                        <div className="formula-block">
                            Percentage = (X / Y) × 100
                        </div>
                        <h3>Percentage Change (Increase or Decrease)</h3>
                        <div className="formula-block">
                            Change % = [(New Value − Old Value) / |Old Value|] × 100
                        </div>
                        <p>
                            A positive result indicates an increase; a negative result indicates a decrease.
                        </p>
                    </>
                }
                exampleTitle="Percentage Calculation Examples"
                exampleContent={
                    <>
                        <h3>Example 1: Finding 25% of 200</h3>
                        <div className="formula-block">(25 / 100) × 200 = <strong>50</strong></div>

                        <h3>Example 2: 45 is what percent of 200?</h3>
                        <div className="formula-block">(45 / 200) × 100 = <strong>22.5%</strong></div>

                        <h3>Example 3: Percentage change from ₹200 to ₹250</h3>
                        <div className="formula-block">
                            [(250 − 200) / 200] × 100 = <strong>25% increase</strong>
                        </div>

                        <h3>Example 4: Percentage change from ₹300 to ₹225</h3>
                        <div className="formula-block">
                            [(225 − 300) / 300] × 100 = <strong>−25% (25% decrease)</strong>
                        </div>
                    </>
                }
                faqs={calc.faqs}
            >
                <PercentageForm />
            </CalculatorShell>
        </>
    );
}
