import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CalculatorShell from "@/components/ui/CalculatorShell";
import CalcSkeleton from "@/components/ui/CalcSkeleton";
import { getCalculatorBySlug } from "@/lib/constants";

const UnitConverterForm = dynamic(
  () => import("@/components/calculators/UnitConverterForm"),
  { loading: () => <CalcSkeleton /> }
);

const calc = getCalculatorBySlug("tools/unit-converter")!;

export const metadata: Metadata = {
  title: "Unit Converter — kg to lbs, cm to inches, °C to °F & More | GoToCalc",
  description:
    "Free online unit converter. Convert length, weight, temperature, area, volume, speed, pressure, time, and data storage units instantly. kg to lbs, cm to inches, Celsius to Fahrenheit, km to miles — 200+ conversions, no sign-up.",
  alternates: { canonical: "https://gotocalc.online/tools/unit-converter" },
  openGraph: {
    title: "Unit Converter — kg to lbs, cm to inches, Celsius to Fahrenheit & More",
    description:
      "Convert any unit instantly — length, weight, temperature, volume, area, speed, pressure, time, data storage. Free, private, works in your browser.",
    url: "https://gotocalc.online/tools/unit-converter",
    siteName: "GoToCalc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Converter | GoToCalc",
    description:
      "kg to lbs, cm to inches, Celsius to Fahrenheit, km to miles and 200+ more conversions — free and instant.",
  },
};

export default function UnitConverterPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const embedMode = searchParams?.embed === "1";
  const defaultCategory =
    typeof searchParams?.category === "string" ? searchParams.category : "length";

  const schema1 = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Unit Converter",
    url: "https://gotocalc.online/tools/unit-converter",
    description:
      "Free online unit converter supporting length, weight, temperature, area, volume, speed, pressure, time, energy, and digital storage — 200+ unit pairs.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    featureList: [
      "Length converter — mm, cm, m, km, inch, foot, yard, mile",
      "Weight converter — mg, g, kg, tonne, oz, lb, stone",
      "Temperature converter — Celsius, Fahrenheit, Kelvin",
      "Area converter — m², km², ft², acre, hectare",
      "Volume converter — ml, l, fl oz, cup, pint, gallon (US & UK)",
      "Speed converter — m/s, km/h, mph, knot",
      "Pressure converter — Pa, bar, psi, atm, mmHg",
      "Time converter — ms, s, min, hr, day, week, month, year",
      "Energy converter — joule, calorie, kcal, kWh, BTU",
      "Digital storage converter — bit, byte, KB, MB, GB, TB, PB",
      "Bidirectional conversion with instant swap",
      "Formula shown for every conversion",
      "Embeddable iframe widget",
      "Works offline after first load",
    ],
  };

  const schema2 = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calc.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const schema3_1 = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to convert kg to lbs",
    step: [
      {
        "@type": "HowToStep",
        text: "Enter the kg value in the input field.",
      },
      {
        "@type": "HowToStep",
        text: "Select Weight as the category.",
      },
      {
        "@type": "HowToStep",
        text: "Set From unit to Kilograms, To unit to Pounds.",
      },
      {
        "@type": "HowToStep",
        text: "The result appears instantly — 1 kg = 2.20462 lbs.",
      },
    ],
  };

  const schema3_2 = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to convert Celsius to Fahrenheit",
    step: [
      {
        "@type": "HowToStep",
        text: "Select Temperature category.",
      },
      {
        "@type": "HowToStep",
        text: "Set From unit to Celsius, To unit to Fahrenheit.",
      },
      {
        "@type": "HowToStep",
        text: "Enter the temperature.",
      },
      {
        "@type": "HowToStep",
        text: "Result shown instantly using formula °F = (°C × 9/5) + 32.",
      },
    ],
  };

  const schema3_3 = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to convert km to miles",
    step: [
      {
        "@type": "HowToStep",
        text: "Select Length category.",
      },
      {
        "@type": "HowToStep",
        text: "Set From unit to Kilometres, To unit to Miles.",
      },
      {
        "@type": "HowToStep",
        text: "Enter the distance.",
      },
      {
        "@type": "HowToStep",
        text: "Result shown instantly — 1 km = 0.621371 miles.",
      },
    ],
  };

  if (embedMode) {
    return (
      <main style={{ padding: "16px" }}>
        <UnitConverterForm
          defaultCategory={defaultCategory}
          embedMode={embedMode}
        />
      </main>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema1) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema3_1) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema3_2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema3_3) }}
      />

      <CalculatorShell
        title="Unit Converter"
        subtitle="Convert length, weight, temperature, area, volume, speed, pressure, time, energy, and digital storage units instantly. Supports metric, imperial, and US customary units — 200+ conversion pairs, formula shown for every result."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools/" },
          { label: "Unit Converter", href: "/tools/unit-converter" },
        ]}
        definitionTitle="What is a Unit Converter?"
        definitionContent={
          <>
            <p>
              A unit converter is a tool that translates a measurement expressed
              in one unit into its equivalent in another unit. The world uses
              two primary measurement systems — the metric system (SI), used by
              most countries, and the imperial / US customary system, still used
              widely in the United States, the UK for some purposes, and in
              trade contexts globally. Converting between them — kilograms to
              pounds, kilometres to miles, Celsius to Fahrenheit — is a daily
              need for students, travellers, engineers, cooks, and fitness
              enthusiasts.
            </p>
            <p>
              This converter supports ten categories and over 200 unit pairs.
              Every result includes the conversion formula so you understand how
              the number was derived, not just what it is. All calculations run
              in your browser — no data is sent to any server. The calculator
              also supports an embeddable iframe widget so bloggers, teachers,
              and developers can embed any category on their own website with a
              single line of HTML.
            </p>
          </>
        }
        formulaTitle="Conversion Formulas Reference"
        formulaContent={
          <div className="grade-content-grid">
            <article className="grade-content-card">
              <h3>LENGTH</h3>
              <div className="formula-block">
                1 inch = 2.54 cm<br />
                1 foot = 30.48 cm<br />
                1 mile = 1.60934 km<br />
                1 yard = 0.9144 m<br />
                1 nautical mile = 1.852 km
              </div>
            </article>

            <article className="grade-content-card">
              <h3>WEIGHT</h3>
              <div className="formula-block">
                1 kg = 2.20462 lbs<br />
                1 lb = 0.453592 kg<br />
                1 oz = 28.3495 g<br />
                1 stone = 6.35029 kg<br />
                1 metric tonne = 1000 kg
              </div>
            </article>

            <article className="grade-content-card">
              <h3>TEMPERATURE</h3>
              <div className="formula-block">
                °F = (°C × 9/5) + 32<br />
                °C = (°F − 32) × 5/9<br />
                K = °C + 273.15
              </div>
            </article>

            <article className="grade-content-card">
              <h3>AREA</h3>
              <div className="formula-block">
                1 hectare = 10,000 m²<br />
                1 acre = 4,046.86 m²<br />
                1 sq ft = 0.092903 m²<br />
                1 sq mile = 2.58999 km²
              </div>
            </article>

            <article className="grade-content-card">
              <h3>VOLUME</h3>
              <div className="formula-block">
                1 litre = 0.264172 US gallons<br />
                1 US gallon = 3.78541 litres<br />
                1 fl oz (US) = 29.5735 ml<br />
                1 cup (US) = 236.588 ml
              </div>
            </article>

            <article className="grade-content-card">
              <h3>SPEED</h3>
              <div className="formula-block">
                1 mph = 1.60934 km/h<br />
                1 knot = 1.852 km/h<br />
                1 m/s = 3.6 km/h
              </div>
            </article>

            <article className="grade-content-card">
              <h3>PRESSURE</h3>
              <div className="formula-block">
                1 bar = 100,000 Pa<br />
                1 atm = 101,325 Pa<br />
                1 psi = 6,894.76 Pa<br />
                1 mmHg = 133.322 Pa
              </div>
            </article>

            <article className="grade-content-card">
              <h3>TIME</h3>
              <div className="formula-block">
                1 hr = 3,600 s<br />
                1 day = 86,400 s<br />
                1 year ≈ 31,536,000 s (365 days)
              </div>
            </article>

            <article className="grade-content-card">
              <h3>ENERGY</h3>
              <div className="formula-block">
                1 kcal = 4,184 J<br />
                1 kWh = 3,600,000 J<br />
                1 BTU = 1,055.06 J
              </div>
            </article>

            <article className="grade-content-card">
              <h3>DIGITAL STORAGE</h3>
              <div className="formula-block">
                1 KB = 1,024 bytes<br />
                1 MB = 1,024 KB = 1,048,576 bytes<br />
                1 GB = 1,024 MB<br />
                1 TB = 1,024 GB
              </div>
            </article>
          </div>
        }
        exampleTitle="Common Conversion Reference Tables"
        exampleContent={
          <>
            <div className="scrollable-table">
              <table className="calc-table">
                <thead>
                  <tr>
                    <th colSpan={8}>Weight — Kilograms to Pounds</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1kg=2.205lb</td>
                    <td>5kg=11.023lb</td>
                    <td>10kg=22.046lb</td>
                    <td>25kg=55.116lb</td>
                    <td>50kg=110.231lb</td>
                    <td>70kg=154.324lb</td>
                    <td>80kg=176.37lb</td>
                    <td>100kg=220.462lb</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="scrollable-table" style={{ marginTop: "1rem" }}>
              <table className="calc-table">
                <thead>
                  <tr>
                    <th colSpan={8}>Temperature — Celsius to Fahrenheit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>-40°C=-40°F</td>
                    <td>0°C=32°F</td>
                    <td>10°C=50°F</td>
                    <td>20°C=68°F</td>
                    <td>25°C=77°F</td>
                    <td>37°C=98.6°F</td>
                    <td>100°C=212°F</td>
                    <td>180°C=356°F</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="scrollable-table" style={{ marginTop: "1rem" }}>
              <table className="calc-table">
                <thead>
                  <tr>
                    <th colSpan={8}>Length — Centimetres to Inches</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1cm=0.394in</td>
                    <td>2.54cm=1in</td>
                    <td>5cm=1.969in</td>
                    <td>10cm=3.937in</td>
                    <td>30cm=11.811in</td>
                    <td>100cm=39.37in</td>
                    <td>150cm=59.055in</td>
                    <td>180cm=70.866in</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="scrollable-table" style={{ marginTop: "1rem" }}>
              <table className="calc-table">
                <thead>
                  <tr>
                    <th colSpan={8}>Distance — Kilometres to Miles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1km=0.621mi</td>
                    <td>5km=3.107mi</td>
                    <td>10km=6.214mi</td>
                    <td>21.1km=13.109mi</td>
                    <td>42.2km=26.219mi</td>
                    <td>50km=31.069mi</td>
                    <td>100km=62.137mi</td>
                    <td>200km=124.274mi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        }
        extraContent={
          <>
            <section>
              <h2>Length Converter — Metric and Imperial</h2>
              <p>
                People often need to convert length units for travel, construction, or recipe sizing. Common pairs include cm to inches, meters to feet, km to miles, mm to inches, and yards to metres. The most searched length conversion globally is cm to inches (1 cm = 0.3937 inches) and km to miles (1 km = 0.621371 miles).
              </p>
            </section>

            <section>
              <h2>Weight Converter — kg, lbs, grams, stone, ounces</h2>
              <p>
                Weight conversions are crucial for gym routines, cooking, shipping, and medical dosages. Remember that 1 kilogram = 2.20462 pounds. To convert lbs to kg, divide by 2.20462. Stone is used in the UK and Ireland for body weight — 1 stone = 14 lbs = 6.35 kg.
              </p>
            </section>

            <section>
              <h2>Temperature Converter — Celsius, Fahrenheit, Kelvin</h2>
              <p>
                The Celsius scale is used almost everywhere, while Fahrenheit is primary in the USA. Kelvin is used in scientific contexts. To convert between them, use these formulas: °F = (°C × 9/5) + 32, °C = (°F − 32) × 5/9, and K = °C + 273.15. Keep in mind that 37°C = 98.6°F (normal human body temperature) and 0°C = 32°F (freezing point of water).
              </p>
            </section>

            <section>
              <h2>Digital Storage Converter — Bits, Bytes, KB, MB, GB, TB</h2>
              <p>
                Digital storage conversion can be confusing due to binary prefix (1 KB = 1,024 bytes) vs SI prefix (1 kB = 1,000 bytes). This is why storage manufacturers use SI (making drives seem larger) while operating systems use binary. Common searches include MB to GB, GB to TB, and bits to bytes.
              </p>
            </section>

            <section>
              <h2>Embed This Unit Converter on Your Website</h2>
              <p>
                You can embed any category of this unit converter on your website, blog, or app for free using an iframe. When visitors use the embedded calculator they see a Powered by GoToCalc link. No API key required.
              </p>
              <pre
                style={{
                  background: "var(--surface)",
                  color: "var(--fg)",
                  border: "1px solid var(--border)",
                  padding: "1rem",
                  borderRadius: "8px",
                  overflowX: "auto",
                  fontSize: "0.9rem",
                  fontFamily: "monospace",
                  marginTop: "1rem"
                }}
              >
{`<iframe 
  src="https://gotocalc.online/tools/unit-converter?embed=1&category=length" 
  width="100%" 
  height="480" 
  frameborder="0" 
  style="border-radius:12px;border:1px solid #e5e5e5"
  title="Unit Converter by GoToCalc"
></iframe>`}
              </pre>
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--muted)" }}>
                Note that category can be replaced with: weight, temperature, area, volume, speed, pressure, time, energy, storage.
              </p>
            </section>
          </>
        }
        faqs={calc.faqs}
      >
        <UnitConverterForm
          defaultCategory={defaultCategory}
          embedMode={embedMode}
        />
      </CalculatorShell>
    </>
  );
}
