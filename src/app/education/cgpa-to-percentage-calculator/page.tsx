import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const CgpaForm = dynamic(() => import("@/components/calculators/CgpaForm"), {
  loading: () => <CalcSkeleton />,
});

const calc = getCalculatorBySlug("education/cgpa-to-percentage-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function CgpaToPercentagePage() {
  return (
    <>
      <CalculatorSchema calc={calc} />
      <CalculatorShell
        title="CGPA to Percentage Calculator"
        subtitle="Convert your CGPA to equivalent percentage using exact university-approved conversion formulas. Supports CBSE, VTU, AKTU, and Mumbai University."
        breadcrumbs={[
          { label: "Home", href: "/" },
          {
            label: "Education",
            href: "/education/cgpa-to-percentage-calculator",
          },
          {
            label: "CGPA to Percentage",
            href: "/education/cgpa-to-percentage-calculator",
          },
        ]}
        definitionTitle="What is CGPA?"
        definitionContent={
          <>
            <p>
              CGPA (Cumulative Grade Point Average) is a grading system used by
              schools and universities to evaluate academic performance on a
              scale of 0 to 10 (or sometimes 0 to 4). It averages the grade
              points earned in all subjects across semesters.
            </p>
            <p>
              Many employers, universities and competitive exams require
              percentage equivalents of CGPA. Since different institutions use
              different conversion formulas, using the correct formula for your
              university is important for accurate conversions.
            </p>
          </>
        }
        formulaTitle="CGPA to Percentage Conversion Formulas"
        formulaContent={
          <>
            <h3>CBSE / Standard Formula</h3>
            <div className="formula-block">Percentage = CGPA × 9.5</div>
            <p>Used by CBSE and most central boards. A CGPA of 8.5 = 80.75%.</p>

            <h3>VTU (Visvesvaraya Technological University)</h3>
            <div className="formula-block">Percentage = (CGPA − 0.75) × 10</div>
            <p>Used by VTU for engineering courses. A CGPA of 8.5 = 77.5%.</p>

            <h3>AKTU (APJ Abdul Kalam Technological University)</h3>
            <div className="formula-block">Percentage = (CGPA × 10) − 7.5</div>
            <p>Used by AKTU. A CGPA of 8.5 = 77.5%.</p>

            <h3>Mumbai University</h3>
            <div className="formula-block">Percentage = 7.25 × CGPA + 11</div>
            <p>Used by University of Mumbai. A CGPA of 8.5 = 72.625%.</p>
          </>
        }
        exampleTitle="Conversion Examples"
        exampleContent={
          <>
            <h3>Example: CGPA 9.2 (CBSE)</h3>
            <div className="formula-block">
              9.2 × 9.5 = <strong>87.4%</strong>
            </div>

            <h3>Example: CGPA 7.8 (VTU)</h3>
            <div className="formula-block">
              (7.8 − 0.75) × 10 = <strong>70.5%</strong>
            </div>

            <h3>Example: CGPA 8.0 (AKTU)</h3>
            <div className="formula-block">
              (8.0 × 10) − 7.5 = <strong>72.5%</strong>
            </div>
          </>
        }
        faqs={calc.faqs}
      >
        <CgpaForm />
      </CalculatorShell>
    </>
  );
}
