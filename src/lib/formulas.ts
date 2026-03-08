/* ──────────────────────────────────────────────
   Pure math functions — no side effects, no deps
   ────────────────────────────────────────────── */

import { OLD_REGIME_SLABS, NEW_REGIME_SLABS } from "./constants";

/* ─── SIP (Step-Up & Inflation-Adjusted) ─── */

export interface SIPResult {
    investedAmount: number;
    estimatedReturns: number;
    totalValue: number;
    inflationAdjustedValue: number | null;
}

export function calculateSIP(
    monthlyInvestment: number,
    annualReturnRate: number,
    years: number,
    stepUpPercent: number = 0,
    inflationRate: number | null = null
): SIPResult {
    const r = annualReturnRate / 12 / 100;
    let totalInvested = 0;
    let totalValue = 0;
    let currentMonthly = monthlyInvestment;

    for (let year = 1; year <= years; year++) {
        for (let month = 1; month <= 12; month++) {
            totalInvested += currentMonthly;
            const remainingMonths = (years - year) * 12 + (12 - month);
            if (r === 0) {
                totalValue += currentMonthly;
            } else {
                totalValue += currentMonthly * Math.pow(1 + r, remainingMonths + 1);
            }
        }
        if (year < years) {
            currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
        }
    }

    const investedAmount = Math.round(totalInvested);
    const tv = Math.round(totalValue);
    const estimatedReturns = tv - investedAmount;

    let inflationAdjustedValue: number | null = null;
    if (inflationRate !== null && inflationRate > 0) {
        inflationAdjustedValue = Math.round(tv / Math.pow(1 + inflationRate / 100, years));
    }

    return { investedAmount, estimatedReturns, totalValue: tv, inflationAdjustedValue };
}

/* ─── GST ─── */

export interface GSTResult {
    netAmount: number;
    totalAmount: number;
    totalTax: number;
    cgst: number;
    sgst: number;
    igst: number;
}

export function calculateGST(
    amount: number,
    rate: number,
    mode: "exclusive" | "inclusive",
    isInterState: boolean
): GSTResult {
    let netAmount: number;
    let totalTax: number;

    if (mode === "exclusive") {
        netAmount = amount;
        totalTax = (amount * rate) / 100;
    } else {
        totalTax = amount - (amount * 100) / (100 + rate);
        netAmount = amount - totalTax;
    }

    const totalAmount = netAmount + totalTax;

    return {
        netAmount: Math.round(netAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        cgst: isInterState ? 0 : Math.round((totalTax / 2) * 100) / 100,
        sgst: isInterState ? 0 : Math.round((totalTax / 2) * 100) / 100,
        igst: isInterState ? Math.round(totalTax * 100) / 100 : 0,
    };
}

/* ─── Income Tax (India) ─── */

export interface TaxResult {
    taxableIncome: number;
    taxBeforeCess: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
}

function computeSlabTax(
    income: number,
    slabs: { min: number; max: number; rate: number }[]
): number {
    let tax = 0;
    for (const slab of slabs) {
        if (income <= 0) break;
        const taxableInSlab = Math.min(income, slab.max - slab.min + 1);
        tax += (taxableInSlab * slab.rate) / 100;
        income -= taxableInSlab;
    }
    return tax;
}

export function calculateIncomeTax(
    grossIncome: number,
    regime: "old" | "new"
): TaxResult {
    const slabs = regime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;
    const standardDeduction = regime === "new" ? 75000 : 50000;
    const taxableIncome = Math.max(0, grossIncome - standardDeduction);

    let taxBeforeCess = computeSlabTax(taxableIncome, slabs);

    if (regime === "new" && taxableIncome <= 700000) taxBeforeCess = 0;
    if (regime === "old" && taxableIncome <= 500000) taxBeforeCess = 0;

    const cess = Math.round(taxBeforeCess * 0.04 * 100) / 100;
    const totalTax = Math.round((taxBeforeCess + cess) * 100) / 100;
    const effectiveRate =
        grossIncome > 0 ? Math.round((totalTax / grossIncome) * 10000) / 100 : 0;

    return {
        taxableIncome,
        taxBeforeCess: Math.round(taxBeforeCess * 100) / 100,
        cess,
        totalTax,
        effectiveRate,
    };
}

/* ─── BMI + Waist-to-Height Ratio ─── */

export interface BMIResult {
    bmi: number;
    category: string;
    categoryColor: string;
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
    const heightM = heightCm / 100;
    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

    let category: string;
    let categoryColor: string;

    if (bmi < 18.5) {
        category = "Underweight";
        categoryColor = "#60a5fa";
    } else if (bmi < 25) {
        category = "Normal weight";
        categoryColor = "#34d399";
    } else if (bmi < 30) {
        category = "Overweight";
        categoryColor = "#fbbf24";
    } else {
        category = "Obese";
        categoryColor = "#f87171";
    }

    return { bmi, category, categoryColor };
}

export interface WtHRResult {
    ratio: number;
    category: string;
    categoryColor: string;
}

export function calculateWtHR(waistCm: number, heightCm: number): WtHRResult {
    const ratio = Math.round((waistCm / heightCm) * 1000) / 1000;

    let category: string;
    let categoryColor: string;

    if (ratio < 0.4) {
        category = "Underweight";
        categoryColor = "#60a5fa";
    } else if (ratio <= 0.5) {
        category = "Healthy";
        categoryColor = "#34d399";
    } else if (ratio <= 0.6) {
        category = "Increased Risk";
        categoryColor = "#fbbf24";
    } else {
        category = "High Risk";
        categoryColor = "#f87171";
    }

    return { ratio, category, categoryColor };
}

/* ─── Age ─── */

export interface AgeResult {
    years: number;
    months: number;
    days: number;
    totalYears: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    nextBirthdayDays: number;
    nextBirthdayDate: Date;
    nextBirthdayDayName: string;
    planetAges: {
        mercury: number;
        venus: number;
        earth: number;
        mars: number;
        jupiter: number;
        saturn: number;
        uranus: number;
        neptune: number;
    };
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const EARTH_DAYS_PER_YEAR = 365.2425;
const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;

function toUtcDateOnly(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function calculateAge(
    birthDate: Date,
    targetDate: Date = new Date()
): AgeResult {
    const birth = toUtcDateOnly(birthDate);
    const target = toUtcDateOnly(targetDate);

    let years = target.getUTCFullYear() - birth.getUTCFullYear();
    let months = target.getUTCMonth() - birth.getUTCMonth();
    let days = target.getUTCDate() - birth.getUTCDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), 0));
        days += prevMonth.getUTCDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / MS_PER_DAY);
    const totalYears = years;
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    const nextBirthday = new Date(
        Date.UTC(
            target.getUTCFullYear(),
            birth.getUTCMonth(),
            birth.getUTCDate()
        )
    );
    if (nextBirthday <= target) {
        nextBirthday.setUTCFullYear(nextBirthday.getUTCFullYear() + 1);
    }
    const nextBirthdayDays = Math.ceil(
        (nextBirthday.getTime() - target.getTime()) / MS_PER_DAY
    );

    const earthAgeYears = totalDays / EARTH_DAYS_PER_YEAR;
    const planetAges = {
        mercury: earthAgeYears / 0.2408467,
        venus: earthAgeYears / 0.61519726,
        earth: earthAgeYears,
        mars: earthAgeYears / 1.8808158,
        jupiter: earthAgeYears / 11.862615,
        saturn: earthAgeYears / 29.447498,
        uranus: earthAgeYears / 84.016846,
        neptune: earthAgeYears / 164.79132,
    };

    return {
        years,
        months,
        days,
        totalYears,
        totalMonths,
        totalWeeks,
        totalDays,
        totalHours,
        totalMinutes,
        nextBirthdayDays,
        nextBirthdayDate: nextBirthday,
        nextBirthdayDayName: DAY_NAMES[nextBirthday.getUTCDay()],
        planetAges,
    };
}

/* ─── Percentage ─── */

export function percentOf(percent: number, value: number): number {
    return Math.round(((percent / 100) * value) * 100) / 100;
}

export function whatPercent(part: number, whole: number): number {
    if (whole === 0) return 0;
    return Math.round((part / whole) * 10000) / 100;
}

export function percentChange(oldVal: number, newVal: number): number {
    if (oldVal === 0) return 0;
    return Math.round(((newVal - oldVal) / Math.abs(oldVal)) * 10000) / 100;
}

/* ─── Mortgage (Full Cost + Full Amortization) ─── */

/* --- Price Per Weight --- */

export type WeightUnit = "kg" | "g" | "lb" | "oz";

export const WEIGHT_UNIT_FACTORS_IN_GRAMS: Record<WeightUnit, number> = {
    kg: 1000,
    g: 1,
    lb: 453.59237,
    oz: 28.349523125,
};

export interface PriceByWeightResult {
    totalPrice: number;
    pricePerKg: number;
    pricePerG: number;
    pricePerLb: number;
    pricePerOz: number;
    pricePerGram: number;
    quantityInGrams: number;
}

export function calculatePriceByWeight(
    pricePerUnit: number,
    priceUnit: WeightUnit,
    quantity: number,
    quantityUnit: WeightUnit
): PriceByWeightResult {
    const unitInGrams = WEIGHT_UNIT_FACTORS_IN_GRAMS[priceUnit];
    const quantityInGrams = quantity * WEIGHT_UNIT_FACTORS_IN_GRAMS[quantityUnit];
    const pricePerGram = pricePerUnit / unitInGrams;
    const totalPrice = pricePerGram * quantityInGrams;

    return {
        totalPrice: Math.round(totalPrice * 100) / 100,
        pricePerKg: Math.round(pricePerGram * WEIGHT_UNIT_FACTORS_IN_GRAMS.kg * 100) / 100,
        pricePerG: Math.round(pricePerGram * WEIGHT_UNIT_FACTORS_IN_GRAMS.g * 10000) / 10000,
        pricePerLb: Math.round(pricePerGram * WEIGHT_UNIT_FACTORS_IN_GRAMS.lb * 100) / 100,
        pricePerOz: Math.round(pricePerGram * WEIGHT_UNIT_FACTORS_IN_GRAMS.oz * 100) / 100,
        pricePerGram: Math.round(pricePerGram * 1000000) / 1000000,
        quantityInGrams: Math.round(quantityInGrams * 1000) / 1000,
    };
}

export interface MortgageExtras {
    annualTax: number;
    annualInsurance: number;
    monthlyPMI: number;
    monthlyHOA: number;
}

export interface MortgageResult {
    monthlyPI: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    loanAmount: number;
    extras: { tax: number; insurance: number; pmi: number; hoa: number };
    schedule: AmortizationRow[];
}

export interface AmortizationRow {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

export function calculateMortgage(
    homePrice: number,
    downPaymentPercent: number,
    annualRate: number,
    termYears: number,
    extras?: MortgageExtras
): MortgageResult {
    const downPayment = (homePrice * downPaymentPercent) / 100;
    const loanAmount = homePrice - downPayment;
    const r = annualRate / 12 / 100;
    const n = termYears * 12;

    let monthlyPI: number;
    if (r === 0) {
        monthlyPI = loanAmount / n;
    } else {
        monthlyPI = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }
    monthlyPI = Math.round(monthlyPI * 100) / 100;

    const tax = extras ? Math.round((extras.annualTax / 12) * 100) / 100 : 0;
    const insurance = extras ? Math.round((extras.annualInsurance / 12) * 100) / 100 : 0;
    const pmi = extras?.monthlyPMI ?? 0;
    const hoa = extras?.monthlyHOA ?? 0;
    const monthlyPayment = Math.round((monthlyPI + tax + insurance + pmi + hoa) * 100) / 100;

    const schedule: AmortizationRow[] = [];
    let balance = loanAmount;

    for (let i = 1; i <= n; i++) {
        const interest = Math.round(balance * r * 100) / 100;
        const principal = Math.round((monthlyPI - interest) * 100) / 100;
        balance = Math.round((balance - principal) * 100) / 100;
        schedule.push({ month: i, payment: monthlyPI, principal, interest, balance: Math.max(0, balance) });
    }

    const totalPayment = Math.round(monthlyPI * n * 100) / 100;
    const totalInterest = Math.round((totalPayment - loanAmount) * 100) / 100;

    return {
        monthlyPI,
        monthlyPayment,
        totalPayment,
        totalInterest,
        loanAmount: Math.round(loanAmount * 100) / 100,
        extras: { tax, insurance, pmi, hoa },
        schedule,
    };
}

/* ─── CGPA to Percentage ─── */

export type CGPAScheme = "standard" | "vtu" | "aktu" | "mumbai";

export interface CGPAResult {
    percentage: number;
    formula: string;
}

export function cgpaToPercentage(cgpa: number, scheme: CGPAScheme): CGPAResult {
    switch (scheme) {
        case "standard":
            return { percentage: Math.round(cgpa * 9.5 * 100) / 100, formula: "CGPA × 9.5" };
        case "vtu":
            return { percentage: Math.round((cgpa - 0.75) * 10 * 100) / 100, formula: "(CGPA − 0.75) × 10" };
        case "aktu":
            return { percentage: Math.round((cgpa * 10 - 7.5) * 100) / 100, formula: "(CGPA × 10) − 7.5" };
        case "mumbai":
            return { percentage: Math.round((7.25 * cgpa + 11) * 100) / 100, formula: "7.25 × CGPA + 11" };
    }
}
