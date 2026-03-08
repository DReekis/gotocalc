"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { calculateAge } from "@/lib/formulas";

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

const RELATED_CALCULATORS = [
    { label: "Date Difference Calculator", href: "/date-difference-calculator" },
    { label: "Time Duration Calculator", href: "/time-duration-calculator" },
    { label: "Birthday Countdown Calculator", href: "/birthday-countdown-calculator" },
    { label: "Life Expectancy Calculator", href: "/life-expectancy-calculator" },
] as const;

const PLANET_LABELS = [
    { key: "mercury", label: "Mercury" },
    { key: "venus", label: "Venus" },
    { key: "earth", label: "Earth" },
    { key: "mars", label: "Mars" },
    { key: "jupiter", label: "Jupiter" },
    { key: "saturn", label: "Saturn" },
    { key: "uranus", label: "Uranus" },
    { key: "neptune", label: "Neptune" },
] as const;

function parseDateInput(value: string): Date | null {
    if (!DATE_INPUT_PATTERN.test(value)) return null;

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

function formatInt(value: number) {
    return NUMBER_FORMATTER.format(value);
}

export default function AgeCalculatorForm() {
    const [dob, setDob] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [dobEdited, setDobEdited] = useState(false);
    const [targetEdited, setTargetEdited] = useState(false);
    const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
    const searchParams = useSearchParams();

    const queryDob = useMemo(() => {
        const raw = searchParams.get("dob");
        return raw && parseDateInput(raw) ? raw : "";
    }, [searchParams]);

    const queryTargetDate = useMemo(() => {
        const raw = searchParams.get("target");
        return raw && parseDateInput(raw) ? raw : "";
    }, [searchParams]);

    const effectiveDob = dobEdited ? dob : queryDob;
    const effectiveTargetDate = targetEdited ? targetDate : queryTargetDate;

    const result = useMemo(() => {
        if (!effectiveDob) return null;

        const birth = parseDateInput(effectiveDob);
        if (!birth) return null;

        const target = effectiveTargetDate ? parseDateInput(effectiveTargetDate) : new Date();
        if (!target || target < birth) return null;

        return calculateAge(birth, target);
    }, [effectiveDob, effectiveTargetDate]);

    const validationMessage = useMemo(() => {
        if (!effectiveDob) return "";

        const birth = parseDateInput(effectiveDob);
        if (!birth) return "Please enter a valid date of birth.";

        if (effectiveTargetDate) {
            const target = parseDateInput(effectiveTargetDate);
            if (!target) return "Please enter a valid target date.";
            if (target < birth) return "Target date must be the same as or after date of birth.";
        }

        return "";
    }, [effectiveDob, effectiveTargetDate]);

    const sharePath = useMemo(() => {
        if (!effectiveDob || !parseDateInput(effectiveDob)) return "";

        const query = new URLSearchParams({ dob: effectiveDob });
        if (effectiveTargetDate && parseDateInput(effectiveTargetDate)) {
            query.set("target", effectiveTargetDate);
        }

        return `/age-calculator?${query.toString()}`;
    }, [effectiveDob, effectiveTargetDate]);

    const shareUrl = sharePath;

    useEffect(() => {
        if (copyState === "idle") return;
        const timeout = window.setTimeout(() => setCopyState("idle"), 2200);
        return () => window.clearTimeout(timeout);
    }, [copyState]);

    const copyResultLink = async () => {
        if (!sharePath) return;

        const absoluteLink = `${window.location.origin}${sharePath}`;

        try {
            await navigator.clipboard.writeText(absoluteLink);
            setCopyState("copied");
        } catch {
            try {
                const temp = document.createElement("textarea");
                temp.value = absoluteLink;
                temp.setAttribute("readonly", "true");
                temp.style.position = "absolute";
                temp.style.left = "-9999px";
                document.body.appendChild(temp);
                temp.select();
                document.execCommand("copy");
                document.body.removeChild(temp);
                setCopyState("copied");
            } catch {
                setCopyState("error");
            }
        }
    };

    return (
        <div>
            <div className="age-input-grid">
                <div>
                    <label className="calc-label" htmlFor="age-dob">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        className="calc-input"
                        value={effectiveDob}
                        aria-label="Date of birth"
                        onChange={(e) => {
                            setDobEdited(true);
                            setDob(e.target.value);
                        }}
                        id="age-dob"
                    />
                </div>
                <div>
                    <label className="calc-label" htmlFor="age-target">
                        Target Date (optional)
                    </label>
                    <input
                        type="date"
                        className="calc-input"
                        value={effectiveTargetDate}
                        aria-label="Target date"
                        onChange={(e) => {
                            setTargetEdited(true);
                            setTargetDate(e.target.value);
                        }}
                        id="age-target"
                    />
                    <p className="age-input-note">
                        Defaults to today if blank
                    </p>
                </div>
            </div>

            {validationMessage && (
                <p className="age-validation-error" role="alert">
                    {validationMessage}
                </p>
            )}

            {result && (
                <div className="calc-result age-result-stack">
                    <section className="age-panel">
                        <p className="age-section-label">Your Age</p>
                        <p className="age-primary-value">
                            {result.years} years {result.months} months {result.days} days
                        </p>
                    </section>

                    <section className="age-panel">
                        <h3 className="age-panel-title">Detailed Breakdown</h3>
                        <div className="result-grid">
                            <div className="result-item">
                                <div className="result-item-label">Total Years</div>
                                <div className="result-item-value">{formatInt(result.totalYears)}</div>
                            </div>
                            <div className="result-item">
                                <div className="result-item-label">Total Months</div>
                                <div className="result-item-value">{formatInt(result.totalMonths)}</div>
                            </div>
                            <div className="result-item">
                                <div className="result-item-label">Total Weeks</div>
                                <div className="result-item-value">{formatInt(result.totalWeeks)}</div>
                            </div>
                            <div className="result-item">
                                <div className="result-item-label">Total Days</div>
                                <div className="result-item-value">{formatInt(result.totalDays)}</div>
                            </div>
                            <div className="result-item">
                                <div className="result-item-label">Total Hours</div>
                                <div className="result-item-value">{formatInt(result.totalHours)}</div>
                            </div>
                            <div className="result-item">
                                <div className="result-item-label">Total Minutes</div>
                                <div className="result-item-value">{formatInt(result.totalMinutes)}</div>
                            </div>
                        </div>
                    </section>

                    <section className="age-panel">
                        <h3 className="age-panel-title">Next Birthday</h3>
                        <p className="age-next-birthday-value">
                            {formatInt(result.nextBirthdayDays)} days remaining
                        </p>
                        <p className="age-small-line">
                            Next Birthday Date: {DATE_FORMATTER.format(result.nextBirthdayDate)}
                        </p>
                        <p className="age-small-line">Day of Week: {result.nextBirthdayDayName}</p>
                    </section>

                    <section className="age-panel">
                        <h3 className="age-panel-title">Your Age on Other Planets</h3>
                        <div className="result-grid">
                            {PLANET_LABELS.map((planet) => (
                                <div className="result-item" key={planet.key}>
                                    <div className="result-item-label">{planet.label}</div>
                                    <div className="result-item-value">
                                        {result.planetAges[planet.key].toFixed(2)} years
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="age-panel">
                        <h3 className="age-panel-title">Shareable Result URL</h3>
                        <div className="age-share-row">
                            <input
                                type="text"
                                className="calc-input"
                                value={shareUrl}
                                readOnly
                                aria-label="Shareable age calculator result link"
                            />
                            <button
                                type="button"
                                className="calc-btn-outline"
                                onClick={copyResultLink}
                                aria-label="Copy age calculator result link"
                            >
                                Copy Result Link
                            </button>
                        </div>
                        <p className="age-copy-feedback" aria-live="polite">
                            {copyState === "copied" && "Link copied."}
                            {copyState === "error" && "Unable to copy automatically. Please copy the link manually."}
                        </p>
                    </section>

                    <section className="age-panel">
                        <h3 className="age-panel-title">Related Calculators</h3>
                        <div className="age-related-grid">
                            {RELATED_CALCULATORS.map((item) => (
                                <Link key={item.href} href={item.href} prefetch={false} className="age-related-card">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
