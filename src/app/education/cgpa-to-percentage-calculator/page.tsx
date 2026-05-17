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
        subtitle="Convert CGPA to percentage using official university formulas for 25+ Indian universities. Supports 4.0, 5.0, and 10.0 scales. Also includes SGPA to CGPA, SGPA to percentage, percentage to CGPA, GPA calculator, marks percentage, and final grade planner."
        breadcrumbs={[
          { label: "Home", href: "/" },
          {
            label: "Education",
            href: "/education/",
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
              Recruiters, postgraduate applications, scholarship forms, and government job applications in India often require a percentage equivalent of your CGPA. Different universities publish different conversion formulas — the UGC recommends CGPA × 9.5 as a default for 10-point scales, but institutions like Anna University, VTU, AKTU, SPPU, and Mumbai University (Engineering) each have their own officially notified rules. This calculator reads from a university formula database and applies the correct rule for your institution, keeping every calculation client-side so your data never leaves your device.
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
              <h2>What Does My CGPA Mean — Classification Guide</h2>
              <p>Most Indian universities follow a classification system based on CGPA ranges. The table below shows the standard bands used by UGC-affiliated institutions on a 10-point scale.</p>
              <div className="scrollable-table">
                <table className="calc-table">
                  <thead>
                    <tr>
                      <th>Classification</th>
                      <th>CGPA range (10-pt)</th>
                      <th>Approx. percentage</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Outstanding / O</td>
                      <td>9.0 – 10.0</td>
                      <td>&ge; 90%</td>
                      <td>Highest distinction; equivalent to summa cum laude</td>
                    </tr>
                    <tr>
                      <td>Distinction / A+</td>
                      <td>8.5 – 8.99</td>
                      <td>85% – 89%</td>
                      <td>Required for many competitive fellowships</td>
                    </tr>
                    <tr>
                      <td>First Class / A</td>
                      <td>7.5 – 8.49</td>
                      <td>75% – 84%</td>
                      <td>Required for most PSU jobs and PG admissions</td>
                    </tr>
                    <tr>
                      <td>Second Class / B+</td>
                      <td>6.5 – 7.49</td>
                      <td>65% – 74%</td>
                      <td>Meets most mass-recruiter cutoffs</td>
                    </tr>
                    <tr>
                      <td>Pass Class / B</td>
                      <td>5.0 – 6.49</td>
                      <td>50% – 64%</td>
                      <td>Minimum passing standard</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>CGPA Cutoffs for Campus Placements</h2>
              <p>Most Indian companies use CGPA as an initial eligibility filter during campus placements. Percentage equivalents use the 10&times; multiplier — use the calculator above for university-specific percentages.</p>
              <div className="scrollable-table">
                <table className="calc-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Min CGPA (10-pt)</th>
                      <th>Approx. percentage</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>TCS</td><td>6.0</td><td>60%</td><td>—</td></tr>
                    <tr><td>Infosys</td><td>6.0</td><td>60%</td><td>—</td></tr>
                    <tr><td>Wipro</td><td>6.0</td><td>60%</td><td>—</td></tr>
                    <tr><td>Cognizant (CTS)</td><td>6.0</td><td>60%</td><td>—</td></tr>
                    <tr><td>HCL Technologies</td><td>6.0</td><td>60%</td><td>—</td></tr>
                    <tr><td>Capgemini</td><td>6.0</td><td>60%</td><td>—</td></tr>
                    <tr><td>Accenture</td><td>6.5</td><td>65%</td><td>—</td></tr>
                    <tr><td>LTIMindtree</td><td>6.5</td><td>65%</td><td>—</td></tr>
                    <tr><td>Deloitte USI</td><td>7.0</td><td>70%</td><td>—</td></tr>
                    <tr><td>Amazon (SDE/SDET)</td><td>7.0</td><td>70%</td><td>Varies by role</td></tr>
                    <tr><td>Microsoft</td><td>7.5</td><td>75%</td><td>Campus hiring</td></tr>
                    <tr><td>Goldman Sachs</td><td>7.5</td><td>75%</td><td>Engineering roles</td></tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>Cutoffs change each hiring cycle. Always confirm on the company's official careers page or your placement cell notice.</p>
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
        faqs={[
          ...calc.faqs,
          {
            question: "What CGPA is required for campus placements at top Indian companies?",
            answer: "Most mass recruiters — TCS, Infosys, Wipro, Cognizant, HCL, Capgemini — require a minimum CGPA of 6.0 on a 10-point scale (approximately 60%). Mid-tier companies like Accenture and LTIMindtree typically need 6.5 CGPA. Deloitte USI and Amazon usually require 7.0+, while Microsoft campus hiring is generally 7.5+. Always verify on the company's official careers page or your placement cell notice.",
          },
          {
            question: "What CGPA is considered first class in India?",
            answer: "On a 10-point CGPA scale, most Indian universities classify 7.5 CGPA and above as First Class (approximately 75% equivalent). A CGPA of 8.5+ is generally considered Distinction, and 9.0+ is Outstanding or O-grade. The exact cutoffs differ by university — verify with your official academic regulations.",
          },
          {
            question: "Can I use the CGPA percentage for job applications and government forms?",
            answer: "Yes, but formal applications should follow the conversion method specified by the university or employer. For UGC-affiliated universities without a published formula, CGPA × 9.5 is the UGC-recommended default and is widely accepted. Use this calculator to get your working equivalent, then confirm with your academic office if the application explicitly requires a certified percentage.",
          }
        ]}
      >
        <CgpaForm />
      </CalculatorShell>
    </>
  );
}
