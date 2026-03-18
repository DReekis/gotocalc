import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";
import {
  buildUniversityFormulaSchema,
  convertCgpaToPercentage,
  getGradeScales,
  getUniversityFormulas,
} from "@/lib/gradeCalculators";

const CgpaForm = dynamic(() => import("@/components/calculators/CgpaForm"), {
  loading: () => <CalcSkeleton />,
});

const calc = getCalculatorBySlug("education/cgpa-to-percentage-calculator")!;
const pagePath = "/education/cgpa-to-percentage-calculator";
const universities = getUniversityFormulas();
const gradeScales = getGradeScales();
const exampleValues = [6, 7.5, 8.5, 9.2];
const comparisonUniversities = universities.filter((university) =>
  ["default", "vtu", "anna", "sppu"].includes(university.id)
);

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function CgpaToPercentagePage() {
  return (
    <>
      <CalculatorSchema
        calc={calc}
        extraGraph={buildUniversityFormulaSchema(pagePath)}
      />
      <CalculatorShell
        title="CGPA to Percentage Calculator"
        subtitle="Convert CGPA to percentage with a JSON-backed university formula database, switch between 4.0, 5.0, and 10.0 scales, and open six related grade calculators from the same tabbed interface."
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
              schools and universities to summarize academic performance across
              subjects or semesters. Depending on the institution, the same
              academic record may be published on a 4.0, 5.0, or 10.0 grading
              scale.
            </p>
            <p>
              Recruiters, postgraduate applications, scholarship forms, and
              credential evaluators often ask for percentage equivalents. This
              page keeps every calculation client-side and lets you switch
              between university formulas, scale-based fallbacks, SGPA tools,
              GPA tools, and final-grade planning without leaving the page.
            </p>
          </>
        }
        formulaTitle="University Formulas and Scale Rules"
        formulaContent={
          <>
            <p>
              The calculator reads formula strings from a local JSON database.
              When a university has a matching formula for the selected scale,
              that university rule is applied directly. If you switch to a
              different scale, the calculator falls back to the generic scale
              conversion stored in the scale database.
            </p>
            <p>
              The university list on this page is maintained from the formula
              database used by the calculator. It combines university-specific
              entries with generic scale fallbacks so users can pick the rule
              that matches their transcript.
            </p>

            <div className="grade-content-grid">
              {universities.map((university) => (
                <article key={university.id} className="grade-content-card">
                  <h3>{university.name}</h3>
                  <div className="formula-block">
                    Percentage = {university.formulaDisplay}
                  </div>
                  <p>{university.description}</p>
                </article>
              ))}
            </div>

            <h3>Generic scale fallbacks</h3>
            <div className="grade-content-grid">
              {gradeScales.map((scale) => (
                <article key={scale.id} className="grade-content-card">
                  <h3>{scale.name} scale</h3>
                  <div className="formula-block">
                    Percentage = {scale.formulaDisplay}
                  </div>
                  <p>{scale.description}</p>
                </article>
              ))}
            </div>
          </>
        }
        exampleTitle="Example CGPA Conversions"
        exampleContent={
          <>
            <p>
              Inside the calculator, the example table updates whenever you
              change the university or scale. The reference table below shows
              how the same CGPA can map differently across common university
              formulas.
            </p>

            <div className="scrollable-table">
              <table className="calc-table">
                <thead>
                  <tr>
                    <th>CGPA</th>
                    {comparisonUniversities.map((university) => (
                      <th key={university.id}>{university.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exampleValues.map((value) => (
                    <tr key={value}>
                      <td>{value}</td>
                      {comparisonUniversities.map((university) => (
                        <td key={university.id}>
                          {convertCgpaToPercentage(value, university.id, "10.0").value}
                          %
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        }
        extraContent={
          <>
            <section>
              <h2>How to Pick the Right Formula</h2>
              <p>
                Start with the university listed on your transcript. If the
                transcript or official academic handbook already specifies a
                conversion formula, use that option first. If your institution
                only publishes a grading scale and not a dedicated conversion
                rule, the scale-based fallback is the safer approximation.
              </p>
              <p>
                The tabbed layout is designed so you can move between CGPA to
                percentage, SGPA to CGPA, SGPA to percentage, and percentage to
                CGPA without a reload. Marks percentage, GPA, and final-grade
                planning tools are also available in the same calculator card.
              </p>
            </section>

            <section>
              <h2>University-Specific Notes</h2>
              <div className="grade-content-grid">
                {universities.map((university) => (
                  <article key={university.id} className="grade-content-card">
                    <h3>{university.name}</h3>
                    <p>{university.explanation}</p>
                    <p>{university.notes}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        }
        faqs={calc.faqs}
      >
        <CgpaForm />
      </CalculatorShell>
    </>
  );
}
