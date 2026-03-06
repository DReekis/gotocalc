import type { Metadata } from "next";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import BmiCalculatorForm from "@/components/calculators/BmiCalculatorForm";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const calc = getCalculatorBySlug("health/bmi-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function BmiCalculatorPage() {
    return (
        <>
            <CalculatorSchema calc={calc} />
            <CalculatorShell
                title="BMI Calculator"
                subtitle="Calculate your Body Mass Index instantly. Supports both metric (kg/cm) and imperial (lbs/in) units with WHO category classification."
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Health", href: "/health/bmi-calculator" },
                    { label: "BMI Calculator", href: "/health/bmi-calculator" },
                ]}
                definitionTitle="What is Body Mass Index (BMI)?"
                definitionContent={
                    <>
                        <p>
                            Body Mass Index (BMI) is a simple, widely used screening measure for categorizing individuals
                            based on their body weight relative to height. Developed by Belgian mathematician Adolphe Quetelet
                            in the 1830s, it provides a quick estimate of whether a person has a healthy body weight.
                        </p>
                        <p>
                            BMI is used by the <strong>World Health Organization (WHO)</strong>, healthcare providers, and
                            insurance companies as an initial screening tool. However, it does not measure body fat directly, nor
                            does it distinguish between fat mass and lean muscle mass. Athletes, elderly individuals, and pregnant
                            women may need alternative assessments.
                        </p>
                        <h3>WHO BMI Categories</h3>
                        <ul>
                            <li><strong>Underweight:</strong> BMI below 18.5</li>
                            <li><strong>Normal weight:</strong> BMI 18.5 – 24.9</li>
                            <li><strong>Overweight:</strong> BMI 25.0 – 29.9</li>
                            <li><strong>Obese:</strong> BMI 30.0 and above</li>
                        </ul>
                    </>
                }
                formulaTitle="BMI Formula"
                formulaContent={
                    <>
                        <h3>Metric Formula</h3>
                        <div className="formula-block">
                            BMI = Weight (kg) ÷ Height (m)²
                        </div>
                        <h3>Imperial Formula</h3>
                        <div className="formula-block">
                            BMI = [Weight (lbs) ÷ Height (in)²] × 703
                        </div>
                        <p>Both formulas yield the same result — the unit conversion factor of 703 bridges the difference between metric and imperial systems.</p>
                    </>
                }
                exampleTitle="Step-by-Step BMI Calculation"
                exampleContent={
                    <>
                        <p><strong>Scenario:</strong> A person weighing 70 kg and standing 175 cm tall.</p>
                        <h3>Step 1: Convert Height to Meters</h3>
                        <div className="formula-block">175 cm ÷ 100 = 1.75 m</div>
                        <h3>Step 2: Square the Height</h3>
                        <div className="formula-block">1.75 × 1.75 = 3.0625 m²</div>
                        <h3>Step 3: Divide Weight by Height²</h3>
                        <div className="formula-block">70 ÷ 3.0625 = <strong>22.9</strong></div>
                        <h3>Result</h3>
                        <p>
                            A BMI of <strong>22.9</strong> falls in the <strong>Normal weight</strong> range (18.5 – 24.9).
                            This suggests a healthy body weight for this height, though individual health assessments should
                            also consider factors like body composition, fitness level, and medical history.
                        </p>
                    </>
                }
                faqs={calc.faqs}
            >
                <BmiCalculatorForm />
            </CalculatorShell>
        </>
    );
}
