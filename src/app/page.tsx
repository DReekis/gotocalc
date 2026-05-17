import { Metadata } from "next";
import HomeCalculatorDirectory from "@/components/home/HomeCalculatorDirectory";
import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";
import styles from "./page.module.css";

// SVG Icons
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
const HeartPulseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>;
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const GraduationCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const ToolsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;

export const metadata: Metadata = {
  title: "GoToCalc — Free Online Calculators | SIP, GST, BMI, Age, Income Tax & More",
  description:
    "Free online calculators for finance, health, math, and education. SIP calculator, GST calculator, income tax calculator India, BMI, age calculator, CGPA to percentage and more — instant results, no ads, no sign-up.",
  alternates: {
    canonical: "https://gotocalc.online",
  },
  openGraph: {
    title: "GoToCalc — Free Online Calculators | SIP, GST, BMI, Age, Income Tax & More",
    description:
      "Free online calculators for finance, health, math, and education. SIP calculator, GST calculator, income tax calculator India, BMI, age calculator, CGPA to percentage and more — instant results, no ads, no sign-up.",
    url: "https://gotocalc.online",
    siteName: "GoToCalc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoToCalc — Free Online Calculators | SIP, GST, BMI, Age, Income Tax & More",
    description:
      "Free online calculators for finance, health, math, and education. SIP calculator, GST calculator, income tax calculator India, BMI, age calculator, CGPA to percentage and more — instant results, no ads, no sign-up.",
  },
};

const homeCalculators = CALCULATORS.map((calc) => ({
  slug: calc.slug,
  title: calc.title,
  description: calc.description,
  category: calc.category,
  categoryLabel: calc.categoryLabel,
}));

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GoToCalc",
    url: "https://gotocalc.online",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://gotocalc.online/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, url: "https://gotocalc.online/finance/sip-calculator" },
      { "@type": "ListItem", position: 2, url: "https://gotocalc.online/finance/gst-calculator" },
      { "@type": "ListItem", position: 3, url: "https://gotocalc.online/finance/income-tax-calculator-india" },
      { "@type": "ListItem", position: 4, url: "https://gotocalc.online/finance/mortgage-calculator" },
      { "@type": "ListItem", position: 5, url: "https://gotocalc.online/finance/price-per-weight-calculator" },
      { "@type": "ListItem", position: 6, url: "https://gotocalc.online/health/bmi-calculator" },
      { "@type": "ListItem", position: 7, url: "https://gotocalc.online/age-calculator" },
      { "@type": "ListItem", position: 8, url: "https://gotocalc.online/math/percentage-calculator" },
      { "@type": "ListItem", position: 9, url: "https://gotocalc.online/education/cgpa-to-percentage-calculator" },
      { "@type": "ListItem", position: 10, url: "https://gotocalc.online/math/scientific-calculator" },
      { "@type": "ListItem", position: 11, url: "https://gotocalc.online/tools/unit-converter" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Free Online Calculators</h1>
          <p className={styles.heroSubtitle}>
            Explore our collection of free online calculators designed for everyday financial, health, and math needs. Quickly plan your investments with the <Link href="/finance/sip-calculator">SIP calculator</Link>, accurately assess your business taxes using the <Link href="/finance/gst-calculator">GST calculator</Link>, or track personal metrics using the <Link href="/health/bmi-calculator">BMI calculator</Link> and <Link href="/age-calculator">age calculator</Link>. Every tool runs entirely in your browser — your data never leaves your device.
          </p>
          <div className={styles.heroChips}>
            <span className={styles.chipLabel}>Popular:</span>
            <Link href="/tools/unit-converter" className={styles.chip}>Unit Converter</Link>
            <Link href="/age-calculator" className={styles.chip}>Age Calculator</Link>
            <Link href="/finance/sip-calculator" className={styles.chip}>SIP Calculator</Link>
            <Link href="/finance/gst-calculator" className={styles.chip}>GST Calculator</Link>
            <Link href="/education/cgpa-to-percentage-calculator" className={styles.chip}>CGPA to Percentage</Link>
          </div>
        </section>

        {/* Directory */}
        <HomeCalculatorDirectory calculators={homeCalculators} />

        {/* Why GoToCalc Grid */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why GoToCalc?</h2>
            <p className={styles.sectionSubtitle}>Engineered for speed, privacy, and true utility.</p>
          </div>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ShieldIcon />
              </div>
              <h3 className={styles.featureTitle}>Lightning Fast & Private</h3>
              <p className={styles.featureText}>
                GoToCalc is built for the real world where internet connections are slow, data is expensive, and privacy matters. Every calculator runs entirely in your browser. No tracking, no external requests, no sign-up. 
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <MapIcon />
              </div>
              <h3 className={styles.featureTitle}>India-Specific Tools</h3>
              <p className={styles.featureText}>
                We focus heavily on Indian financial and educational models, including a <Link href="/finance/sip-calculator">SIP calculator</Link> (with step-up), a detailed <Link href="/finance/gst-calculator">GST calculator</Link> (CGST/SGST/IGST), an <Link href="/finance/income-tax-calculator-india">income tax calculator</Link>, and a <Link href="/education/cgpa-to-percentage-calculator">CGPA to percentage</Link> converter for 25+ universities.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BookIcon />
              </div>
              <h3 className={styles.featureTitle}>Complete Understanding</h3>
              <p className={styles.featureText}>
                Every page is more than just a tool. It includes the full underlying formula, a step-by-step worked example, and clear answers to frequently searched questions so you always understand the math behind your result.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What we cover</h2>
            <p className={styles.sectionSubtitle}>Tools categorized for easy access.</p>
          </div>

          <div className={styles.categoryGrid}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}><WalletIcon /></div>
                <h3 className={styles.categoryTitle}>Finance calculators</h3>
              </div>
              <p className={styles.categoryText}>SIP returns, GST with CGST/SGST/IGST breakdown, New vs Old income tax regime, home loan EMI, and price-per-weight for groceries.</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}><HeartPulseIcon /></div>
                <h3 className={styles.categoryTitle}>Health calculators</h3>
              </div>
              <p className={styles.categoryText}>BMI with WHO and Asia-Pacific thresholds, and an age calculator with exam eligibility mode and live birthday countdown.</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}><CalculatorIcon /></div>
                <h3 className={styles.categoryTitle}>Math calculators</h3>
              </div>
              <p className={styles.categoryText}>Percentage increase, decrease, and ratio finder, a comprehensive unit converter, plus a full-featured scientific calculator with trig, logarithms, powers, and factorials.</p>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}><GraduationCapIcon /></div>
                <h3 className={styles.categoryTitle}>Education calculators</h3>
              </div>
              <p className={styles.categoryText}>CGPA to percentage for 25+ Indian universities, SGPA to CGPA, GPA calculator, marks percentage, and final grade planner — all in one page.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
