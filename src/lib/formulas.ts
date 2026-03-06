/* ──────────────────────────────────────────────
   Pure math functions — no side effects, no deps
   ────────────────────────────────────────────── */

import { OLD_REGIME_SLABS, NEW_REGIME_SLABS } from "./constants";

/* ─── SIP (Future Value of Annuity) ─── */

export interface SIPResult {
    investedAmount: number;
    estimatedReturns: number;
    totalValue: number;
}

export function calculateSIP(
    monthlyInvestment: number,
    annualReturnRate: number,
    years: number
): SIPResult {
    const n = years * 12;
    const r = annualReturnRate / 12 / 100;
    const investedAmount = monthlyInvestment * n;

    if (r === 0) {
        return { investedAmount, estimatedReturns: 0, totalValue: investedAmount };
    }

    const totalValue = monthlyInvestment * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const estimatedReturns = totalValue - investedAmount;

    return {
        investedAmount: Math.round(investedAmount),
        estimatedReturns: Math.round(estimatedReturns),
        totalValue: Math.round(totalValue),
    };
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

    // Standard deduction for new regime (₹75,000 from Budget 2024)
    const standardDeduction = regime === "new" ? 75000 : 50000;
    const taxableIncome = Math.max(0, grossIncome - standardDeduction);

    let taxBeforeCess = computeSlabTax(taxableIncome, slabs);

    // New regime rebate u/s 87A: No tax up to ₹7L taxable income
    if (regime === "new" && taxableIncome <= 700000) {
        taxBeforeCess = 0;
    }
    // Old regime rebate u/s 87A: No tax up to ₹5L taxable income
    if (regime === "old" && taxableIncome <= 500000) {
        taxBeforeCess = 0;
    }

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

/* ─── BMI ─── */

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
        categoryColor = "#60a5fa"; // blue
    } else if (bmi < 25) {
        category = "Normal weight";
        categoryColor = "#34d399"; // green
    } else if (bmi < 30) {
        category = "Overweight";
        categoryColor = "#fbbf24"; // yellow
    } else {
        category = "Obese";
        categoryColor = "#f87171"; // red
    }

    return { bmi, category, categoryColor };
}

/* ─── Age ─── */

export interface AgeResult {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthdayDays: number;
}

export function calculateAge(
    birthDate: Date,
    targetDate: Date = new Date()
): AgeResult {
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const diffTime = Math.abs(targetDate.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Next birthday
    const nextBirthday = new Date(
        targetDate.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    );
    if (nextBirthday <= targetDate) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const nextBirthdayDays = Math.ceil(
        (nextBirthday.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { years, months, days, totalDays, nextBirthdayDays };
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

/* ─── Mortgage (Amortization) ─── */

export interface MortgageResult {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    loanAmount: number;
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
    termYears: number
): MortgageResult {
    const downPayment = (homePrice * downPaymentPercent) / 100;
    const loanAmount = homePrice - downPayment;
    const r = annualRate / 12 / 100;
    const n = termYears * 12;

    let monthlyPayment: number;

    if (r === 0) {
        monthlyPayment = loanAmount / n;
    } else {
        monthlyPayment =
            (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    monthlyPayment = Math.round(monthlyPayment * 100) / 100;

    const schedule: AmortizationRow[] = [];
    let balance = loanAmount;

    for (let i = 1; i <= Math.min(n, 12); i++) {
        const interest = Math.round(balance * r * 100) / 100;
        const principal = Math.round((monthlyPayment - interest) * 100) / 100;
        balance = Math.round((balance - principal) * 100) / 100;
        schedule.push({ month: i, payment: monthlyPayment, principal, interest, balance: Math.max(0, balance) });
    }

    const totalPayment = Math.round(monthlyPayment * n * 100) / 100;
    const totalInterest = Math.round((totalPayment - loanAmount) * 100) / 100;

    return { monthlyPayment, totalPayment, totalInterest, loanAmount: Math.round(loanAmount * 100) / 100, schedule };
}
