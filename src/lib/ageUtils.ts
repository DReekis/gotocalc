import { calculateAge, type AgeResult } from "@/lib/formulas";

export const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;
const MINUTE_MS = 1000 * 60;

export interface AgeLimitValue {
    years: number;
    months: number;
}

export type MaximumAgeComparison = "at_most" | "under";

export interface ExamAgePreset {
    id: string;
    label: string;
    category: string;
    cutoffDate: string;
    minimumAge?: AgeLimitValue;
    maximumAge?: AgeLimitValue;
    maximumComparison?: MaximumAgeComparison;
    note?: string;
    sourceLabel?: string;
    sourceUrl?: string;
    verifiedOn?: string;
}

export interface AgeFunFactsResult {
    totalDaysLived: number;
    totalWeeksLived: number;
    estimatedHeartbeats: number;
    totalSleepHours: number;
    totalSleepDays: number;
    zodiacSign: string;
    nextDayMilestone: {
        targetDays: number;
        milestoneDate: Date;
        daysUntilMilestone: number;
    };
}

export interface BirthdayCountdownResult {
    nextBirthdayDate: Date;
    isBirthdayToday: boolean;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface EligibilityBoundary {
    limit: AgeLimitValue;
    boundaryDate: Date;
    comparison: "at_least" | MaximumAgeComparison;
    daysFromBoundary: number;
    passed: boolean;
}

export interface AgeEligibilityResult {
    isEligible: boolean;
    cutoffDate: Date;
    ageOnCutoff: AgeResult;
    minimumBoundary: EligibilityBoundary | null;
    maximumBoundary: EligibilityBoundary | null;
}

function toUtcDateOnly(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function addUtcDays(date: Date, days: number): Date {
    const next = toUtcDateOnly(date);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
}

function addMonthsInLocalTime(date: Date, months: number): Date {
    const next = new Date(date.getTime());
    next.setMonth(next.getMonth() + months);
    return next;
}

function addDaysInLocalTime(date: Date, days: number): Date {
    const next = new Date(date.getTime());
    next.setDate(next.getDate() + days);
    return next;
}

function differenceInCalendarDays(laterDate: Date, earlierDate: Date): number {
    const later = toUtcDateOnly(laterDate);
    const earlier = toUtcDateOnly(earlierDate);
    return Math.floor((later.getTime() - earlier.getTime()) / DAY_MS);
}

function getZodiacSign(month: number, day: number): string {
    if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return "Aquarius";
    if ((month === 1 && day >= 19) || (month === 2 && day <= 20)) return "Pisces";
    if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return "Aries";
    if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return "Taurus";
    if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return "Gemini";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return "Cancer";
    if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return "Leo";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Virgo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Libra";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) return "Scorpio";
    if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) return "Sagittarius";
    return "Capricorn";
}

function getNextMajorDayMilestone(totalDaysLived: number): number {
    if (totalDaysLived < 10_000) {
        return 10_000;
    }

    return Math.floor(totalDaysLived / 5_000) * 5_000 + 5_000;
}

function subtractAgeFromCutoff(cutoffDate: Date, limit: AgeLimitValue): Date {
    const cutoff = toUtcDateOnly(cutoffDate);
    return new Date(
        Date.UTC(
            cutoff.getUTCFullYear() - limit.years,
            cutoff.getUTCMonth() - limit.months,
            cutoff.getUTCDate()
        )
    );
}

export function parseDateInput(value: string): Date | null {
    if (!DATE_INPUT_PATTERN.test(value)) {
        return null;
    }

    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    if (
        Number.isNaN(parsed.getTime()) ||
        parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day
    ) {
        return null;
    }

    return parsed;
}

export function formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function calculateAgeFunFacts(
    birthDate: Date,
    referenceDate: Date = new Date()
): AgeFunFactsResult | null {
    if (referenceDate < birthDate) {
        return null;
    }

    const totalDaysLived = differenceInCalendarDays(referenceDate, birthDate);
    const totalWeeksLived = Math.floor(totalDaysLived / 7);
    const estimatedHeartbeats = totalDaysLived * 24 * 60 * 80;
    const totalSleepHours = totalDaysLived * 8;
    const totalSleepDays = totalSleepHours / 24;
    const milestoneDays = getNextMajorDayMilestone(totalDaysLived);
    const milestoneDate = addUtcDays(birthDate, milestoneDays);

    return {
        totalDaysLived,
        totalWeeksLived,
        estimatedHeartbeats,
        totalSleepHours,
        totalSleepDays,
        zodiacSign: getZodiacSign(birthDate.getMonth(), birthDate.getDate()),
        nextDayMilestone: {
            targetDays: milestoneDays,
            milestoneDate,
            daysUntilMilestone: differenceInCalendarDays(milestoneDate, referenceDate),
        },
    };
}

export function getNextBirthdayDate(
    birthMonth: number,
    birthDay: number,
    referenceDate: Date = new Date()
): Date {
    const nextBirthday = new Date(
        referenceDate.getFullYear(),
        birthMonth,
        birthDay,
        0,
        0,
        0,
        0
    );

    if (nextBirthday <= referenceDate) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    return nextBirthday;
}

export function calculateBirthdayCountdown(
    birthMonth: number,
    birthDay: number,
    referenceDate: Date = new Date()
): BirthdayCountdownResult {
    const nextBirthdayDate = getNextBirthdayDate(birthMonth, birthDay, referenceDate);
    const isBirthdayToday =
        referenceDate.getMonth() === birthMonth && referenceDate.getDate() === birthDay;

    let cursor = new Date(referenceDate.getTime());
    let months = 0;

    while (months < 11) {
        const next = addMonthsInLocalTime(cursor, 1);
        if (next <= nextBirthdayDate) {
            months += 1;
            cursor = next;
            continue;
        }
        break;
    }

    let days = 0;
    while (days < 31) {
        const next = addDaysInLocalTime(cursor, 1);
        if (next <= nextBirthdayDate) {
            days += 1;
            cursor = next;
            continue;
        }
        break;
    }

    const remainingMs = Math.max(0, nextBirthdayDate.getTime() - cursor.getTime());
    const hours = Math.floor(remainingMs / HOUR_MS);
    const minutes = Math.floor((remainingMs % HOUR_MS) / MINUTE_MS);
    const seconds = Math.floor((remainingMs % MINUTE_MS) / 1000);

    return {
        nextBirthdayDate,
        isBirthdayToday,
        months,
        days,
        hours,
        minutes,
        seconds,
    };
}

export function calculateAgeEligibility(
    birthDate: Date,
    cutoffDate: Date,
    minimumAge?: AgeLimitValue | null,
    maximumAge?: AgeLimitValue | null,
    maximumComparison: MaximumAgeComparison = "at_most"
): AgeEligibilityResult {
    const minimumBoundary = minimumAge
        ? (() => {
              const latestEligibleDob = subtractAgeFromCutoff(cutoffDate, minimumAge);
              const passed = birthDate <= latestEligibleDob;
              const daysFromBoundary = passed
                  ? differenceInCalendarDays(latestEligibleDob, birthDate)
                  : differenceInCalendarDays(birthDate, latestEligibleDob);

              return {
                  limit: minimumAge,
                  boundaryDate: latestEligibleDob,
                  comparison: "at_least" as const,
                  daysFromBoundary,
                  passed,
              };
          })()
        : null;

    const maximumBoundary = maximumAge
        ? (() => {
              const baseBoundary = subtractAgeFromCutoff(cutoffDate, maximumAge);
              const earliestEligibleDob =
                  maximumComparison === "under"
                      ? addUtcDays(baseBoundary, 1)
                      : baseBoundary;
              const passed = birthDate >= earliestEligibleDob;
              const daysFromBoundary = passed
                  ? differenceInCalendarDays(birthDate, earliestEligibleDob)
                  : differenceInCalendarDays(earliestEligibleDob, birthDate);

              return {
                  limit: maximumAge,
                  boundaryDate: earliestEligibleDob,
                  comparison: maximumComparison,
                  daysFromBoundary,
                  passed,
              };
          })()
        : null;

    return {
        isEligible:
            (minimumBoundary ? minimumBoundary.passed : true) &&
            (maximumBoundary ? maximumBoundary.passed : true),
        cutoffDate,
        ageOnCutoff: calculateAge(birthDate, cutoffDate),
        minimumBoundary,
        maximumBoundary,
    };
}
