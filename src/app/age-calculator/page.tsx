import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { SITE_NAME, SITE_URL, getCalculatorBySlug } from "@/lib/constants";

const AgeCalculatorForm = dynamic(
  () => import("@/components/calculators/AgeCalculatorForm"),
  { loading: () => <CalcSkeleton /> },
);

const calc = getCalculatorBySlug("age-calculator")!;

export function generateMetadata(): Metadata {
  const canonicalUrl = `${SITE_URL}/age-calculator`;

  return {
    title: "Age Calculator – Calculate Exact Age (Years, Months, Days)",
    description:
      "Calculate your exact age in years, months, days, hours and minutes from your date of birth instantly using our free online age calculator.",
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Age Calculator – Calculate Exact Age (Years, Months, Days)",
      description:
        "Calculate your exact age in years, months, days, hours and minutes from your date of birth instantly using our free online age calculator.",
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Age Calculator – Calculate Exact Age (Years, Months, Days)",
      description:
        "Calculate your exact age in years, months, days, hours and minutes from your date of birth instantly using our free online age calculator.",
    },
  };
}

const ageWebApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Age Calculator",
  applicationCategory: "Utility",
  operatingSystem: "Any",
  description: "Calculate exact age in years, months, days and more.",
  url: `${SITE_URL}/age-calculator`,
};

const ageHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to calculate age",
  step: [
    { "@type": "HowToStep", text: "Enter your date of birth." },
    { "@type": "HowToStep", text: "Select the target date if needed." },
    { "@type": "HowToStep", text: "Click calculate." },
    { "@type": "HowToStep", text: "View your exact age." },
  ],
};

export default function AgeCalculatorPage() {
  return (
    <>
      <CalculatorSchema calc={calc} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ageWebApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ageHowToSchema) }}
      />

      <CalculatorShell
        title="Age Calculator"
        subtitle="Calculate exact age with a full breakdown in years, months, weeks, days, hours, and minutes. See next birthday details and share your result URL."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Health", href: "/health/bmi-calculator" },
          { label: "Age Calculator", href: "/age-calculator" },
        ]}
        definitionTitle="What is an Age Calculator?"
        definitionContent={
          <>
            <p>
              An age calculator is a tool that tells you your exact age from your
              date of birth to today or any date you choose.
            </p>
            <p>
              Instead of giving only years, it can show detailed values like
              months, weeks, days, and even hours. This helps when exact age
              matters.
            </p>
            <p>
              The calculator on this page runs instantly in your browser and does
              not require sign-up or downloads.
            </p>
          </>
        }
        formulaTitle="How to Calculate Age from Date of Birth"
        formulaContent={
          <>
            <p>
              Start by entering your date of birth. If you leave target date
              empty, the calculator uses the current date automatically.
            </p>
            <p>
              The calculation compares years, months, and days separately, then
              adjusts values when borrowing is required from previous months.
            </p>
            <p>
              This method gives a practical calendar age result, not just a rough
              average.
            </p>
          </>
        }
        exampleTitle="Age Calculation Formula"
        exampleContent={
          <>
            <p>
              Age is calculated by subtracting birth date from target date with
              calendar correction.
            </p>
            <div className="formula-block">
              years = targetYear - birthYear
              <br />
              months = targetMonth - birthMonth
              <br />
              days = targetDay - birthDay
              <br />
              If days &lt; 0, borrow from previous month.
              <br />
              If months &lt; 0, borrow 12 months from years.
            </div>
            <p>
              Total days are computed from date difference in milliseconds, then
              converted into weeks, hours, and minutes.
            </p>
          </>
        }
        extraContent={
          <>
            <section>
              <h2>Calculate Age in Different Units</h2>
              <p>
                You can calculate age in exact calendar format and also convert
                it to total units for planning, eligibility checks, and records.
              </p>
              <ul>
                <li>Years</li>
                <li>Months</li>
                <li>Weeks</li>
                <li>Days</li>
                <li>Hours</li>
                <li>Minutes</li>
              </ul>
            </section>

            <section>
              <h2>How Leap Years Affect Age Calculation</h2>
              <p>
                Leap years add one extra day in February. Over many years, this
                changes day totals and next birthday countdown values.
              </p>
              <p>
                If a person is born near the end of February, leap years can
                shift age differences by one day compared to a simple 365-day
                assumption.
              </p>
              <p>
                This calculator uses native date handling so leap years are
                included automatically.
              </p>
            </section>

            <section>
              <h2>Why Age Calculations Matter</h2>
              <p>
                Exact age is important for school admissions, exam eligibility,
                insurance, legal verification, and retirement planning.
              </p>
              <p>
                In many cases, even a one-day difference can affect whether
                someone qualifies for an application or deadline.
              </p>
              <p>
                A precise age calculator reduces manual errors and saves time when
                handling official forms.
              </p>
            </section>
          </>
        }
        faqs={calc.faqs}
        faqTitle="FAQ"
      >
        <AgeCalculatorForm />
      </CalculatorShell>
    </>
  );
}

