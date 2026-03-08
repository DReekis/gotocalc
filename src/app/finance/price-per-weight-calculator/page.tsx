import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { getCalculatorBySlug } from "@/lib/constants";
import { generateCalculatorMetadata } from "@/lib/seo";

const PricePerWeightCalculatorForm = dynamic(
  () => import("@/components/calculators/PricePerWeightCalculatorForm"),
  { loading: () => <CalcSkeleton /> },
);

const calc = getCalculatorBySlug("finance/price-per-weight-calculator")!;

export const metadata: Metadata = generateCalculatorMetadata(calc);

export default function PricePerWeightCalculatorPage() {
  return (
    <>
      <CalculatorSchema calc={calc} />
      <CalculatorShell
        title="Price Per Weight Calculator"
        subtitle="Calculate grocery or meat cost instantly for kg, g, lb, and oz. Enter a unit rate and required quantity to get the exact payable amount."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Finance", href: "/finance/sip-calculator" },
          {
            label: "Price Per Weight Calculator",
            href: "/finance/price-per-weight-calculator",
          },
        ]}
        definitionTitle="What is a Price Per Weight Calculator?"
        definitionContent={
          <>
            <p>
              A price per weight calculator helps you convert a known rate, such
              as 200 per kilogram, into the total amount payable for any other
              quantity like 750 grams or 1.5 pounds.
            </p>
            <p>
              It is useful for groceries, meat, seafood, produce, and bulk
              shopping where sellers and buyers may use different weight units.
              This tool supports kilogram (kg), gram (g), pound (lb), and ounce
              (oz) conversions.
            </p>
          </>
        }
        formulaTitle="Price Per Weight Formula"
        formulaContent={
          <>
            <div className="formula-block">
              Total Price = (Price Per Base Unit / Base Unit In Grams) x
              Quantity In Grams
            </div>
            <p>Where:</p>
            <ul>
              <li>
                <strong>Price Per Base Unit</strong> is the shop rate (for
                example 200 per kg)
              </li>
              <li>
                <strong>Base Unit In Grams</strong> converts kg, lb, or oz into
                grams
              </li>
              <li>
                <strong>Quantity In Grams</strong> converts the required amount
                into grams
              </li>
            </ul>
          </>
        }
        exampleTitle="Example: 200 per kg for 750 g"
        exampleContent={
          <>
            <p>
              <strong>Step 1:</strong> Convert the base rate to per gram:
            </p>
            <div className="formula-block">200 / 1000 = 0.2 per gram</div>
            <p>
              <strong>Step 2:</strong> Multiply by required quantity:
            </p>
            <div className="formula-block">0.2 x 750 = 150</div>
            <p>
              So, if meat is priced at 200 per kg, the price for 750 g is{" "}
              <strong>150</strong>.
            </p>
          </>
        }
        faqs={calc.faqs}
      >
        <PricePerWeightCalculatorForm />
      </CalculatorShell>
    </>
  );
}
