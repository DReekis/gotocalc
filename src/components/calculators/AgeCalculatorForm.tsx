"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AgeFunFacts from "@/components/calculators/AgeFunFacts";
import NextBirthdayCountdown from "@/components/calculators/NextBirthdayCountdown";
import { EXAM_AGE_PRESETS } from "@/data/exam_age_presets";
import {
    calculateAgeEligibility,
    parseDateInput,
    type AgeLimitValue,
    type MaximumAgeComparison,
} from "@/lib/ageUtils";
import { calculateAge } from "@/lib/formulas";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
const PRESET_BY_ID = new Map(EXAM_AGE_PRESETS.map((preset) => [preset.id, preset]));

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

interface SearchParamReader {
    get(name: string): string | null;
}

interface InitialFormState {
    dob: string;
    targetDate: string;
    isEligibilityMode: boolean;
    selectedExamId: string;
    cutoffDate: string;
    minAgeYears: string;
    minAgeMonths: string;
    maxAgeYears: string;
    maxAgeMonths: string;
    maximumComparison: MaximumAgeComparison;
}

function formatInt(value: number) {
    return NUMBER_FORMATTER.format(value);
}

function sanitizeWholeNumberInput(value: string): string {
    return value.replace(/[^\d]/g, "");
}

function readValidDateParam(reader: SearchParamReader, key: string): string {
    const raw = reader.get(key);
    return raw && parseDateInput(raw) ? raw : "";
}

function readAgePartParam(
    reader: SearchParamReader,
    key: string,
    fallback?: number
): string {
    const raw = reader.get(key);

    if (raw !== null && /^\d+$/.test(raw)) {
        return raw;
    }

    return fallback !== undefined ? `${fallback}` : "";
}

function getInitialFormState(reader: SearchParamReader): InitialFormState {
    const selectedExamId = reader.get("exam") ?? "";
    const preset = PRESET_BY_ID.get(selectedExamId);

    const isEligibilityMode =
        reader.get("eligibility") === "1" ||
        Boolean(selectedExamId) ||
        Boolean(reader.get("cutoff"));

    return {
        dob: readValidDateParam(reader, "dob"),
        targetDate: readValidDateParam(reader, "target"),
        isEligibilityMode,
        selectedExamId: preset ? preset.id : "",
        cutoffDate: readValidDateParam(reader, "cutoff") || preset?.cutoffDate || "",
        minAgeYears: readAgePartParam(
            reader,
            "miny",
            preset?.minimumAge?.years
        ),
        minAgeMonths: readAgePartParam(
            reader,
            "minm",
            preset?.minimumAge?.months
        ),
        maxAgeYears: readAgePartParam(
            reader,
            "maxy",
            preset?.maximumAge?.years
        ),
        maxAgeMonths: readAgePartParam(
            reader,
            "maxm",
            preset?.maximumAge?.months
        ),
        maximumComparison:
            reader.get("maxcmp") === "under" || reader.get("maxcmp") === "at_most"
                ? (reader.get("maxcmp") as MaximumAgeComparison)
                : preset?.maximumComparison ?? "at_most",
    };
}

function parseAgeLimitInput(
    yearsInput: string,
    monthsInput: string,
    label: "Minimum" | "Maximum"
): { value: AgeLimitValue | null; error: string } {
    const hasYears = yearsInput.trim().length > 0;
    const hasMonths = monthsInput.trim().length > 0;

    if (!hasYears && !hasMonths) {
        return { value: null, error: "" };
    }

    const years = hasYears ? Number.parseInt(yearsInput, 10) : 0;
    const months = hasMonths ? Number.parseInt(monthsInput, 10) : 0;

    if (!Number.isInteger(years) || years < 0) {
        return {
            value: null,
            error: `Enter a valid ${label.toLowerCase()} age in years.`,
        };
    }

    if (!Number.isInteger(months) || months < 0 || months > 11) {
        return {
            value: null,
            error: `${label} age months should be between 0 and 11.`,
        };
    }

    return {
        value: { years, months },
        error: "",
    };
}

function compareAgeLimits(left: AgeLimitValue, right: AgeLimitValue): number {
    if (left.years !== right.years) {
        return left.years - right.years;
    }

    return left.months - right.months;
}

function formatAgeLimit(limit: AgeLimitValue): string {
    return `${limit.years} years, ${limit.months} months`;
}

export default function AgeCalculatorForm() {
    const searchParams = useSearchParams();
    const initialState = getInitialFormState(searchParams);

    const [dob, setDob] = useState(initialState.dob);
    const [targetDate, setTargetDate] = useState(initialState.targetDate);
    const [isEligibilityMode, setIsEligibilityMode] = useState(
        initialState.isEligibilityMode
    );
    const [selectedExamId, setSelectedExamId] = useState(initialState.selectedExamId);
    const [cutoffDate, setCutoffDate] = useState(initialState.cutoffDate);
    const [minAgeYears, setMinAgeYears] = useState(initialState.minAgeYears);
    const [minAgeMonths, setMinAgeMonths] = useState(initialState.minAgeMonths);
    const [maxAgeYears, setMaxAgeYears] = useState(initialState.maxAgeYears);
    const [maxAgeMonths, setMaxAgeMonths] = useState(initialState.maxAgeMonths);
    const [maximumComparison, setMaximumComparison] = useState(
        initialState.maximumComparison
    );
    const [toast, setToast] = useState<{
        tone: "success" | "error";
        message: string;
    } | null>(null);

    const birthDate = useMemo(() => parseDateInput(dob), [dob]);
    const parsedTargetDate = useMemo(() => parseDateInput(targetDate), [targetDate]);
    const parsedCutoffDate = useMemo(() => parseDateInput(cutoffDate), [cutoffDate]);
    const minimumAge = useMemo(
        () => parseAgeLimitInput(minAgeYears, minAgeMonths, "Minimum"),
        [minAgeMonths, minAgeYears]
    );
    const maximumAge = useMemo(
        () => parseAgeLimitInput(maxAgeYears, maxAgeMonths, "Maximum"),
        [maxAgeMonths, maxAgeYears]
    );
    const selectedPreset = useMemo(
        () => PRESET_BY_ID.get(selectedExamId) ?? null,
        [selectedExamId]
    );

    const result = useMemo(() => {
        if (!birthDate) {
            return null;
        }

        const target = targetDate ? parsedTargetDate : new Date();
        if (!target || target < birthDate) {
            return null;
        }

        return calculateAge(birthDate, target);
    }, [birthDate, parsedTargetDate, targetDate]);

    const todayBirthdaySnapshot = useMemo(() => {
        if (!birthDate) {
            return null;
        }

        return calculateAge(birthDate, new Date());
    }, [birthDate]);

    const validationMessage = useMemo(() => {
        if (!dob) {
            return "";
        }

        if (!birthDate) {
            return "Please enter a valid date of birth.";
        }

        if (targetDate && !parsedTargetDate) {
            return "Please enter a valid target date.";
        }

        if (parsedTargetDate && parsedTargetDate < birthDate) {
            return "Target date must be the same as or after date of birth.";
        }

        return "";
    }, [birthDate, dob, parsedTargetDate, targetDate]);

    const eligibilityValidationMessage = useMemo(() => {
        if (!isEligibilityMode) {
            return "";
        }

        if (!birthDate) {
            return "";
        }

        if (!cutoffDate) {
            return "Enter a cut-off date to check exam or admissions eligibility.";
        }

        if (!parsedCutoffDate) {
            return "Please enter a valid cut-off date.";
        }

        if (parsedCutoffDate < birthDate) {
            return "Cut-off date must be the same as or after date of birth.";
        }

        if (minimumAge.error) {
            return minimumAge.error;
        }

        if (maximumAge.error) {
            return maximumAge.error;
        }

        if (!minimumAge.value && !maximumAge.value) {
            return "Enter at least one age limit to evaluate eligibility.";
        }

        if (
            minimumAge.value &&
            maximumAge.value &&
            compareAgeLimits(minimumAge.value, maximumAge.value) > 0
        ) {
            return "Minimum age cannot be greater than maximum age.";
        }

        if (
            minimumAge.value &&
            maximumAge.value &&
            compareAgeLimits(minimumAge.value, maximumAge.value) === 0 &&
            maximumComparison === "under"
        ) {
            return "This combination leaves no valid age range. Increase the maximum limit or switch the rule to 'At most'.";
        }

        return "";
    }, [
        birthDate,
        cutoffDate,
        isEligibilityMode,
        maximumAge.error,
        maximumAge.value,
        maximumComparison,
        minimumAge.error,
        minimumAge.value,
        parsedCutoffDate,
    ]);

    const eligibilityResult = useMemo(() => {
        if (
            !isEligibilityMode ||
            !birthDate ||
            !parsedCutoffDate ||
            eligibilityValidationMessage
        ) {
            return null;
        }

        return calculateAgeEligibility(
            birthDate,
            parsedCutoffDate,
            minimumAge.value,
            maximumAge.value,
            maximumComparison
        );
    }, [
        birthDate,
        eligibilityValidationMessage,
        isEligibilityMode,
        maximumAge.value,
        maximumComparison,
        minimumAge.value,
        parsedCutoffDate,
    ]);

    const sharePath = useMemo(() => {
        const query = new URLSearchParams();

        if (birthDate && dob) {
            query.set("dob", dob);
        }

        if (targetDate && parsedTargetDate) {
            query.set("target", targetDate);
        }

        if (isEligibilityMode) {
            query.set("eligibility", "1");

            if (selectedExamId) {
                query.set("exam", selectedExamId);
            }

            if (parsedCutoffDate && cutoffDate) {
                query.set("cutoff", cutoffDate);
            }

            if (minAgeYears) {
                query.set("miny", minAgeYears);
            }

            if (minAgeMonths) {
                query.set("minm", minAgeMonths);
            }

            if (maxAgeYears) {
                query.set("maxy", maxAgeYears);
            }

            if (maxAgeMonths) {
                query.set("maxm", maxAgeMonths);
            }

            if (maximumAge.value) {
                query.set("maxcmp", maximumComparison);
            }
        }

        const queryString = query.toString();
        return queryString ? `/age-calculator?${queryString}` : "/age-calculator";
    }, [
        birthDate,
        cutoffDate,
        dob,
        isEligibilityMode,
        maxAgeMonths,
        maxAgeYears,
        maximumAge.value,
        maximumComparison,
        minAgeMonths,
        minAgeYears,
        parsedCutoffDate,
        parsedTargetDate,
        selectedExamId,
        targetDate,
    ]);

    const shareUrl = useMemo(() => {
        if (typeof window === "undefined") {
            return sharePath;
        }

        return `${window.location.origin}${sharePath}`;
    }, [sharePath]);

    const hasShareableState = sharePath !== "/age-calculator";

    useEffect(() => {
        const current = `${window.location.pathname}${window.location.search}`;
        if (current !== sharePath) {
            window.history.replaceState(window.history.state, "", sharePath);
        }
    }, [sharePath]);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeout = window.setTimeout(() => setToast(null), 2200);
        return () => window.clearTimeout(timeout);
    }, [toast]);

    const copyResultLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setToast({
                tone: "success",
                message: "Share link copied to your clipboard.",
            });
        } catch {
            try {
                const temp = document.createElement("textarea");
                temp.value = shareUrl;
                temp.setAttribute("readonly", "true");
                temp.style.position = "absolute";
                temp.style.left = "-9999px";
                document.body.appendChild(temp);
                temp.select();
                document.execCommand("copy");
                document.body.removeChild(temp);
                setToast({
                    tone: "success",
                    message: "Share link copied to your clipboard.",
                });
            } catch {
                setToast({
                    tone: "error",
                    message: "Copy failed. You can still use the share URL field below.",
                });
            }
        }
    };

    const applyPreset = (presetId: string) => {
        const preset = PRESET_BY_ID.get(presetId);
        setSelectedExamId(presetId);

        if (!preset) {
            return;
        }

        setIsEligibilityMode(true);
        setCutoffDate(preset.cutoffDate);
        setMinAgeYears(`${preset.minimumAge?.years ?? ""}`);
        setMinAgeMonths(`${preset.minimumAge?.months ?? ""}`);
        setMaxAgeYears(`${preset.maximumAge?.years ?? ""}`);
        setMaxAgeMonths(`${preset.maximumAge?.months ?? ""}`);
        setMaximumComparison(preset.maximumComparison ?? "at_most");
    };

    const markPresetAsCustom = () => {
        if (selectedExamId) {
            setSelectedExamId("");
        }
    };

    return (
        <div className="age-form-root">
            <div className="age-input-grid">
                <div>
                    <label className="calc-label" htmlFor="age-dob">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        className="calc-input"
                        value={dob}
                        aria-label="Date of birth"
                        onChange={(event) => setDob(event.target.value)}
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
                        value={targetDate}
                        aria-label="Target date"
                        onChange={(event) => setTargetDate(event.target.value)}
                        id="age-target"
                    />
                    <p className="age-input-note">Defaults to today if blank</p>
                </div>
            </div>

            <div className="age-mode-card">
                <label className="age-toggle-row" htmlFor="age-eligibility-mode">
                    <div>
                        <p className="age-toggle-title">Exam / Admissions Eligibility</p>
                        <p className="age-toggle-copy">
                            Compare your birth date against age cut-offs, save the setup in the
                            URL, and share the exact rule set with others.
                        </p>
                    </div>
                    <input
                        id="age-eligibility-mode"
                        type="checkbox"
                        className="age-toggle-input"
                        checked={isEligibilityMode}
                        onChange={(event) => setIsEligibilityMode(event.target.checked)}
                    />
                </label>

                {isEligibilityMode && (
                    <div className="age-mode-stack">
                        <div>
                            <label className="calc-label" htmlFor="age-exam-preset">
                                Exam Preset (optional)
                            </label>
                            <select
                                id="age-exam-preset"
                                className="calc-select"
                                value={selectedExamId}
                                onChange={(event) => applyPreset(event.target.value)}
                            >
                                <option value="">Custom age rule</option>
                                {EXAM_AGE_PRESETS.map((preset) => (
                                    <option key={preset.id} value={preset.id}>
                                        {preset.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="age-eligibility-grid">
                            <div>
                                <label className="calc-label" htmlFor="age-cutoff-date">
                                    Cut-off Date
                                </label>
                                <input
                                    id="age-cutoff-date"
                                    type="date"
                                    className="calc-input"
                                    value={cutoffDate}
                                    onChange={(event) => {
                                        markPresetAsCustom();
                                        setCutoffDate(event.target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="calc-label" htmlFor="age-max-rule">
                                    Maximum Rule
                                </label>
                                <select
                                    id="age-max-rule"
                                    className="calc-select"
                                    value={maximumComparison}
                                    onChange={(event) => {
                                        markPresetAsCustom();
                                        setMaximumComparison(
                                            event.target.value as MaximumAgeComparison
                                        );
                                    }}
                                >
                                    <option value="at_most">At most the limit</option>
                                    <option value="under">Must be under the limit</option>
                                </select>
                            </div>
                        </div>

                        <div className="age-limit-grid">
                            <div className="age-limit-card">
                                <p className="age-limit-title">Minimum Age Limit</p>
                                <div className="age-limit-fields">
                                    <div>
                                        <label className="calc-label" htmlFor="age-min-years">
                                            Years
                                        </label>
                                        <input
                                            id="age-min-years"
                                            type="text"
                                            inputMode="numeric"
                                            className="calc-input"
                                            placeholder="18"
                                            value={minAgeYears}
                                            onChange={(event) => {
                                                markPresetAsCustom();
                                                setMinAgeYears(
                                                    sanitizeWholeNumberInput(
                                                        event.target.value
                                                    )
                                                );
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="calc-label" htmlFor="age-min-months">
                                            Months
                                        </label>
                                        <input
                                            id="age-min-months"
                                            type="text"
                                            inputMode="numeric"
                                            className="calc-input"
                                            placeholder="0"
                                            value={minAgeMonths}
                                            onChange={(event) => {
                                                markPresetAsCustom();
                                                setMinAgeMonths(
                                                    sanitizeWholeNumberInput(
                                                        event.target.value
                                                    )
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="age-limit-card">
                                <p className="age-limit-title">Maximum Age Limit</p>
                                <div className="age-limit-fields">
                                    <div>
                                        <label className="calc-label" htmlFor="age-max-years">
                                            Years
                                        </label>
                                        <input
                                            id="age-max-years"
                                            type="text"
                                            inputMode="numeric"
                                            className="calc-input"
                                            placeholder="25"
                                            value={maxAgeYears}
                                            onChange={(event) => {
                                                markPresetAsCustom();
                                                setMaxAgeYears(
                                                    sanitizeWholeNumberInput(
                                                        event.target.value
                                                    )
                                                );
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="calc-label" htmlFor="age-max-months">
                                            Months
                                        </label>
                                        <input
                                            id="age-max-months"
                                            type="text"
                                            inputMode="numeric"
                                            className="calc-input"
                                            placeholder="0"
                                            value={maxAgeMonths}
                                            onChange={(event) => {
                                                markPresetAsCustom();
                                                setMaxAgeMonths(
                                                    sanitizeWholeNumberInput(
                                                        event.target.value
                                                    )
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="age-mode-note">
                            Choose <strong>Must be under the limit</strong> for notices that say a
                            candidate must not have attained a given age.
                        </p>

                        {selectedPreset && (
                            <p className="age-mode-note">
                                {selectedPreset.note}{" "}
                                {selectedPreset.sourceUrl && (
                                    <a
                                        href={selectedPreset.sourceUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {selectedPreset.sourceLabel ?? "Open source notice"}
                                    </a>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {validationMessage && (
                <p className="age-validation-error" role="alert">
                    {validationMessage}
                </p>
            )}

            {!validationMessage && eligibilityValidationMessage && (
                <p className="age-validation-error" role="alert">
                    {eligibilityValidationMessage}
                </p>
            )}

            {(result || eligibilityResult) && (
                <div className="calc-result age-result-stack">
                    {eligibilityResult && (
                        <section
                            className={`age-alert-banner ${eligibilityResult.isEligible ? "eligible" : "ineligible"}`}
                            role="alert"
                        >
                            <p className="age-alert-title">
                                {eligibilityResult.isEligible
                                    ? "Eligible on the entered cut-off"
                                    : "Not eligible on the entered cut-off"}
                            </p>
                            <p className="age-alert-copy">
                                Age on {DATE_FORMATTER.format(eligibilityResult.cutoffDate)}:{" "}
                                {eligibilityResult.ageOnCutoff.years} years{" "}
                                {eligibilityResult.ageOnCutoff.months} months{" "}
                                {eligibilityResult.ageOnCutoff.days} days.
                            </p>
                            {eligibilityResult.minimumBoundary && (
                                <p className="age-alert-copy">
                                    {eligibilityResult.minimumBoundary.passed
                                        ? `Minimum age cleared by ${formatInt(eligibilityResult.minimumBoundary.daysFromBoundary)} days for the ${formatAgeLimit(eligibilityResult.minimumBoundary.limit)} rule.`
                                        : `Missed the minimum age by ${formatInt(eligibilityResult.minimumBoundary.daysFromBoundary)} days for the ${formatAgeLimit(eligibilityResult.minimumBoundary.limit)} rule.`}
                                </p>
                            )}
                            {eligibilityResult.maximumBoundary && (
                                <p className="age-alert-copy">
                                    {eligibilityResult.maximumBoundary.passed
                                        ? `Still within the maximum age boundary by ${formatInt(eligibilityResult.maximumBoundary.daysFromBoundary)} days for the ${formatAgeLimit(eligibilityResult.maximumBoundary.limit)} rule.`
                                        : `Exceeded the maximum age by ${formatInt(eligibilityResult.maximumBoundary.daysFromBoundary)} days for the ${formatAgeLimit(eligibilityResult.maximumBoundary.limit)} rule.`}
                                </p>
                            )}
                        </section>
                    )}

                    {result && (
                        <>
                            <section className="age-panel">
                                <p className="age-section-label">Your Age</p>
                                <p className="age-primary-value">
                                    {result.years} years {result.months} months {result.days} days
                                </p>
                            </section>

                            <section className="age-panel">
                                <div className="age-panel-head">
                                    <div>
                                        <h3 className="age-panel-title">Next Birthday</h3>
                                        <p className="age-panel-copy">
                                            {formatInt(todayBirthdaySnapshot!.nextBirthdayDays)} days
                                            remaining from today until{" "}
                                            {DATE_FORMATTER.format(
                                                todayBirthdaySnapshot!.nextBirthdayDate
                                            )}
                                            .
                                        </p>
                                    </div>
                                </div>
                                <p className="age-small-line">
                                    Day of Week: {todayBirthdaySnapshot!.nextBirthdayDayName}
                                </p>
                                <NextBirthdayCountdown
                                    birthMonth={birthDate!.getMonth()}
                                    birthDay={birthDate!.getDate()}
                                />
                            </section>

                            <AgeFunFacts birthDate={birthDate!} />

                            <section className="age-panel">
                                <h3 className="age-panel-title">Detailed Breakdown</h3>
                                <div className="result-grid">
                                    <div className="result-item">
                                        <div className="result-item-label">Total Years</div>
                                        <div className="result-item-value">
                                            {formatInt(result.totalYears)}
                                        </div>
                                    </div>
                                    <div className="result-item">
                                        <div className="result-item-label">Total Months</div>
                                        <div className="result-item-value">
                                            {formatInt(result.totalMonths)}
                                        </div>
                                    </div>
                                    <div className="result-item">
                                        <div className="result-item-label">Total Weeks</div>
                                        <div className="result-item-value">
                                            {formatInt(result.totalWeeks)}
                                        </div>
                                    </div>
                                    <div className="result-item">
                                        <div className="result-item-label">Total Days</div>
                                        <div className="result-item-value">
                                            {formatInt(result.totalDays)}
                                        </div>
                                    </div>
                                    <div className="result-item">
                                        <div className="result-item-label">Total Hours</div>
                                        <div className="result-item-value">
                                            {formatInt(result.totalHours)}
                                        </div>
                                    </div>
                                    <div className="result-item">
                                        <div className="result-item-label">Total Minutes</div>
                                        <div className="result-item-value">
                                            {formatInt(result.totalMinutes)}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="age-panel">
                                <h3 className="age-panel-title">Your Age on Other Planets</h3>
                                <div className="result-grid">
                                    {PLANET_LABELS.map((planet) => (
                                        <div className="result-item" key={planet.key}>
                                            <div className="result-item-label">
                                                {planet.label}
                                            </div>
                                            <div className="result-item-value">
                                                {result.planetAges[planet.key].toFixed(2)} years
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {hasShareableState && (
                        <section className="age-panel">
                            <div className="age-panel-head">
                                <div>
                                    <h3 className="age-panel-title">Shareable Result URL</h3>
                                    <p className="age-panel-copy">
                                        This link preserves the current calculator state, including
                                        eligibility mode.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="calc-btn-outline"
                                    onClick={copyResultLink}
                                    aria-label="Copy age calculator result link"
                                >
                                    Copy Link to Share
                                </button>
                            </div>
                            <div className="age-share-row compact">
                                <input
                                    type="text"
                                    className="calc-input"
                                    value={shareUrl}
                                    readOnly
                                    aria-label="Shareable age calculator result link"
                                />
                            </div>
                        </section>
                    )}

                    <section className="age-panel">
                        <h3 className="age-panel-title">Related Calculators</h3>
                        <div className="age-related-grid">
                            {RELATED_CALCULATORS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={false}
                                    className="age-related-card"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {toast && (
                <div
                    className={`age-toast ${toast.tone === "success" ? "success" : "error"}`}
                    aria-live="polite"
                    role="status"
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
