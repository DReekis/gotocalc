export const SITE_URL = "https://gotocalc.online";
export const SITE_NAME = "GoToCalc";
export const SITE_DESCRIPTION = "Free online calculators — instant, private, zero ads. Financial, health and math tools engineered for speed.";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculatorMeta {
  slug: string;
  title: string;
  description: string;
  category: "finance" | "health" | "math" | "education";
  categoryLabel: string;
  applicationCategory: string;
  faqs: FAQItem[];
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "finance/sip-calculator",
    title: "SIP Calculator",
    description:
      "Calculate Systematic Investment Plan returns with the future value of annuity formula. Adjust monthly investment, tenure, and expected return rate.",
    category: "finance",
    categoryLabel: "Finance",
    applicationCategory: "FinanceApplication",
    faqs: [
      {
        question: "What is a SIP calculator?",
        answer:
          "A SIP calculator estimates the future value of regular monthly investments in mutual funds using the compound interest (future value of annuity) formula. It helps you plan your investment by showing how much your money can grow over time at a given expected rate of return.",
      },
      {
        question: "How is SIP return calculated?",
        answer:
          "SIP returns are calculated using the formula FV = P × [((1 + r)ⁿ − 1) / r] × (1 + r), where P is the monthly investment, r is the monthly rate of return (annual rate ÷ 12 ÷ 100), and n is the total number of months. This accounts for compounding on each instalment.",
      },
      {
        question: "Is SIP better than a lump sum investment?",
        answer:
          "SIP reduces market-timing risk through rupee cost averaging — you buy more units when prices are low and fewer when prices are high. Lump-sum investments may outperform in a consistently rising market, but SIP is generally considered safer for most retail investors.",
      },
    ],
  },
  {
    slug: "finance/gst-calculator",
    title: "GST Calculator",
    description:
      "Calculate inclusive and exclusive GST amounts using Indian tax slabs (5%, 12%, 18%, 28%). Get CGST, SGST, and IGST breakdowns instantly.",
    category: "finance",
    categoryLabel: "Finance",
    applicationCategory: "FinanceApplication",
    faqs: [
      {
        question: "What is GST and how is it calculated?",
        answer:
          "GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services in India. For exclusive GST, the tax is added on top of the net price. For inclusive GST, the tax is extracted from the total price using the formula: Tax = Price − (Price × 100) / (100 + Rate).",
      },
      {
        question: "What is the difference between CGST, SGST, and IGST?",
        answer:
          "CGST (Central GST) and SGST (State GST) are levied equally on intra-state transactions — each is half the total GST rate. IGST (Integrated GST) applies to inter-state transactions and equals the full GST rate. The total tax burden remains the same.",
      },
      {
        question: "What are the standard GST slab rates in India?",
        answer:
          "India has four primary GST slab rates: 5% for essential goods, 12% for standard goods, 18% for most services and goods, and 28% for luxury and demerit goods. Some items like unprocessed food attract 0% GST.",
      },
    ],
  },
  {
    slug: "finance/income-tax-calculator-india",
    title: "Income Tax Calculator India",
    description:
      "Compare your tax liability under the Indian New Tax Regime vs Old Tax Regime for FY 2024–25. Calculate exact tax, cess, and effective rate.",
    category: "finance",
    categoryLabel: "Finance",
    applicationCategory: "FinanceApplication",
    faqs: [
      {
        question: "What is the difference between the Old and New Tax Regime in India?",
        answer:
          "The Old Regime allows deductions under Section 80C, 80D, HRA, etc., but has fewer tax slabs. The New Regime (from Budget 2023-24) offers lower tax rates across more slabs but disallows most deductions. The calculator compares both to show which saves you more tax.",
      },
      {
        question: "Who should choose the New Tax Regime?",
        answer:
          "The New Tax Regime is typically better for taxpayers with fewer deductions and exemptions — for example, salaried individuals who don't claim HRA, Section 80C, or home loan interest. If your total deductions exceed ₹3-4 lakh, the Old Regime may be more beneficial.",
      },
      {
        question: "What is Health and Education Cess?",
        answer:
          "A 4% cess is levied on top of your computed income tax (including surcharge, if applicable). This means your total tax payable = Tax on income + 4% cess. The cess funds healthcare and education initiatives across India.",
      },
    ],
  },
  {
    slug: "finance/mortgage-calculator",
    title: "Mortgage Calculator",
    description:
      "Calculate monthly mortgage payments, total interest, and view a full amortization schedule. Factor in home price, down payment, interest rate, and loan term.",
    category: "finance",
    categoryLabel: "Finance",
    applicationCategory: "FinanceApplication",
    faqs: [
      {
        question: "How is a monthly mortgage payment calculated?",
        answer:
          "The monthly payment is calculated using: M = P[r(1+r)ⁿ] / [(1+r)ⁿ − 1], where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the total number of payments (years × 12). This is a standard amortization formula.",
      },
      {
        question: "What is an amortization schedule?",
        answer:
          "An amortization schedule is a table showing each monthly payment broken down into principal and interest portions. Early payments are mostly interest; as the loan matures, more of each payment goes toward the principal.",
      },
      {
        question: "How does a larger down payment affect my mortgage?",
        answer:
          "A larger down payment reduces the principal loan amount, which directly lowers your monthly payment and total interest paid over the loan term. A 20% down payment also typically avoids the need for Private Mortgage Insurance (PMI).",
      },
    ],
  },
  {
    slug: "health/bmi-calculator",
    title: "BMI Calculator",
    description:
      "Calculate your Body Mass Index (BMI) using the standard WHO formula. Get your BMI category and understand what your number means.",
    category: "health",
    categoryLabel: "Health",
    applicationCategory: "HealthApplication",
    faqs: [
      {
        question: "What is BMI and how is it calculated?",
        answer:
          "BMI (Body Mass Index) is a screening measure calculated as weight in kilograms divided by height in meters squared: BMI = kg / m². It provides a quick estimate of body fat based on height and weight, used by the WHO and medical professionals globally.",
      },
      {
        question: "What are the BMI categories?",
        answer:
          "The WHO classifies BMI as: Underweight (below 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (30 and above). These thresholds help assess health risk, though BMI does not distinguish between muscle and fat mass.",
      },
      {
        question: "Is BMI accurate for athletes or muscular individuals?",
        answer:
          "BMI can overestimate body fat in athletes or muscular individuals because it does not differentiate between lean muscle mass and fat. If you have a high BMI but are highly active, consider complementary measures like body fat percentage or waist-to-hip ratio.",
      },
      {
        question: "What is a healthy BMI for my age?",
        answer:
          "For adults (18+), a healthy BMI is generally between 18.5 and 24.9 regardless of age. However, older adults may be advised to maintain a slightly higher BMI (25-27) to protect against bone density loss and illness reserve. Always consult a healthcare provider for personalized advice.",
      },
    ],
  },
  {
    slug: "health/age-calculator",
    title: "Age Calculator",
    description:
      "Calculate your exact age in years, months, and days. Find out your precise chronological age from your date of birth to today or any target date.",
    category: "health",
    categoryLabel: "Health",
    applicationCategory: "HealthApplication",
    faqs: [
      {
        question: "How is exact age calculated in years, months, and days?",
        answer:
          "The calculator subtracts the birth date from the target date. It first calculates complete years, then remaining complete months, and finally remaining days. It correctly handles varying month lengths and leap years for accurate results.",
      },
      {
        question: "Does the age calculator handle leap years?",
        answer:
          "Yes. The calculator accounts for leap years (years divisible by 4, except centuries not divisible by 400). If your birthday is February 29, the calculator still provides an accurate age relative to the target date.",
      },
      {
        question: "Can I calculate my age on a specific date?",
        answer:
          "Absolutely. Use the target date field to calculate your age as of any past or future date — not just today. This is useful for determining eligibility for exams, retirement, legal age requirements, and more.",
      },
    ],
  },
  {
    slug: "math/percentage-calculator",
    title: "Percentage Calculator",
    description:
      "Calculate percentage increase, decrease, and ratios instantly. Find what percent X is of Y, compute X% of Y, or determine percentage change.",
    category: "math",
    categoryLabel: "Math",
    applicationCategory: "UtilitiesApplication",
    faqs: [
      {
        question: "How do I calculate percentage increase?",
        answer:
          "Percentage increase = ((New Value − Old Value) / Old Value) × 100. For example, if a price goes from ₹200 to ₹250, the increase is ((250 − 200) / 200) × 100 = 25%.",
      },
      {
        question: "How do I find what percent one number is of another?",
        answer:
          'To find what percent X is of Y, use the formula: (X / Y) × 100. For example, 45 is (45/200) × 100 = 22.5% of 200.',
      },
      {
        question: "What is the difference between percentage and percentile?",
        answer:
          "Percentage is a fraction of 100 (e.g., 85% means 85 out of 100). Percentile indicates the position of a value relative to a dataset — the 90th percentile means you scored better than 90% of all values. They measure different things.",
      },
    ],
  },
  {
    slug: "education/cgpa-to-percentage-calculator",
    title: "CGPA to Percentage Calculator",
    description:
      "Convert CGPA to percentage instantly using exact university formulas for CBSE, VTU, AKTU, and Mumbai University. Compare results across all boards.",
    category: "education",
    categoryLabel: "Education",
    applicationCategory: "EducationalApplication",
    faqs: [
      {
        question: "How do I convert CGPA to percentage for CBSE?",
        answer:
          "For CBSE and most Indian boards, multiply your CGPA by 9.5. For example, a CGPA of 8.2 equals 8.2 × 9.5 = 77.9%. This is the standard conversion recommended by CBSE.",
      },
      {
        question: "Why do different universities use different formulas?",
        answer:
          "Each university calibrates its grading system differently. VTU uses (CGPA − 0.75) × 10, AKTU uses (CGPA × 10) − 7.5, and Mumbai University uses 7.25 × CGPA + 11. These formulas account for differences in how internal grades are weighted.",
      },
      {
        question: "Can I use CGPA to percentage conversion for job applications?",
        answer:
          "Yes, many recruiters accept the standard CBSE formula (CGPA × 9.5) as a reasonable conversion. However, if your university provides an official conversion formula, always use that one for formal applications.",
      },
    ],
  },
  {
    slug: "math/scientific-calculator",
    title: "Scientific Calculator",
    description:
      "Free online scientific calculator with trigonometric functions, logarithms, square roots, exponents, and factorial. Keyboard & touch-friendly.",
    category: "math",
    categoryLabel: "Math",
    applicationCategory: "UtilitiesApplication",
    faqs: [
      {
        question: "What functions does this scientific calculator support?",
        answer:
          "This calculator supports trigonometric functions (sin, cos, tan in degrees), logarithms (log base 10 and natural log ln), square root (√), power/exponent (xʸ), factorial (!), percentage (%), and constants π and e.",
      },
      {
        question: "Does this calculator use degrees or radians?",
        answer:
          "Trigonometric functions (sin, cos, tan) use degrees by default, which is the standard for most academic use. For example, sin(90) = 1.",
      },
      {
        question: "Can I chain operations together?",
        answer:
          "Yes, you can build complex expressions using parentheses and chain multiple operations. After pressing =, typing a number starts a new calculation, while typing an operator continues from the result.",
      },
    ],
  },
];

export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

/* ─── Indian Tax Slabs (FY 2024-25) ─── */

export const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

export const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 5 },
  { min: 700001, max: 1000000, rate: 10 },
  { min: 1000001, max: 1200000, rate: 15 },
  { min: 1200001, max: 1500000, rate: 20 },
  { min: 1500001, max: Infinity, rate: 30 },
];

export const GST_RATES = [5, 12, 18, 28] as const;
