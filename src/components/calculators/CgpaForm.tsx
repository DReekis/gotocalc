"use client";

import { useMemo, useState } from "react";
import {
    calculateFinalGradeRequirement,
    calculateMarksPercentage,
    calculateWeightedAverage,
    convertCgpaToPercentage,
    convertPercentageToCgpa,
    convertSgpaToPercentage,
    createExampleRows,
    createPercentageToCgpaRows,
    getDefaultScaleId,
    getDefaultUniversityId,
    getGradeScales,
    getUniversityFormulas,
    resolveGradeFormula,
} from "@/lib/gradeCalculators";

type TabId =
    | "cgpa-percentage"
    | "sgpa-cgpa"
    | "sgpa-percentage"
    | "percentage-cgpa"
    | "marks-percentage"
    | "gpa-calculator"
    | "final-grade";

interface EditableWeightedRow {
    id: string;
    score: string;
    credits: string;
}

interface ParsedWeightedRow {
    hasAnyInput: boolean;
    score: number | null;
    credits: number | null;
}

const TABS: { id: TabId; label: string }[] = [
    { id: "cgpa-percentage", label: "CGPA → Percentage" },
    { id: "sgpa-cgpa", label: "SGPA → CGPA" },
    { id: "sgpa-percentage", label: "SGPA → Percentage" },
    { id: "percentage-cgpa", label: "Percentage → CGPA" },
    { id: "marks-percentage", label: "Marks Percentage Calculator" },
    { id: "gpa-calculator", label: "GPA Calculator" },
    { id: "final-grade", label: "Final Grade Calculator" },
];

const GRADE_SCALES = getGradeScales();
const UNIVERSITIES = getUniversityFormulas();
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
});
let nextRowId = 1;

function createEditableRow(): EditableWeightedRow {
    return {
        id: `row-${nextRowId++}`,
        score: "",
        credits: "",
    };
}

function sanitizeDecimalInput(value: string): string {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const [integerPart, ...decimals] = cleaned.split(".");
    return decimals.length > 0
        ? `${integerPart}.${decimals.join("")}`
        : integerPart;
}

function parseNumber(value: string): number | null {
    if (!value || value === ".") {
        return null;
    }

    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number): string {
    return NUMBER_FORMATTER.format(value);
}

function parseWeightedRows(rows: EditableWeightedRow[]): ParsedWeightedRow[] {
    return rows.map((row) => ({
        hasAnyInput: row.score.trim().length > 0 || row.credits.trim().length > 0,
        score: parseNumber(row.score),
        credits: parseNumber(row.credits),
    }));
}

function FormulaContextCard({
    universityName,
    scaleName,
    formula,
    explanation,
    note,
    usesFallback,
}: {
    universityName: string;
    scaleName: string;
    formula: string;
    explanation: string;
    note: string;
    usesFallback: boolean;
}) {
    return (
        <div className="grade-context-card">
            <div className="grade-context-head">
                <p className="grade-context-title">
                    {universityName} / {scaleName} scale
                </p>
                {usesFallback && (
                    <span className="grade-badge">Scale fallback</span>
                )}
            </div>
            <p className="grade-context-formula">{formula}</p>
            <p className="grade-context-copy">{explanation}</p>
            <p className="grade-context-note">{note}</p>
        </div>
    );
}

function ResultCard({
    eyebrow,
    value,
    helper,
    formula,
    explanation,
    note,
    warning,
    emphasis,
}: {
    eyebrow: string;
    value: string;
    helper?: string;
    formula?: string;
    explanation?: string;
    note?: string;
    warning?: boolean;
    emphasis?: "primary";
}) {
    return (
        <div
            className={`grade-result-card ${warning ? "warning" : ""} ${emphasis === "primary" ? "answer" : ""}`}
        >
            <p className="grade-result-eyebrow">{eyebrow}</p>
            <p className="grade-result-number">{value}</p>
            {helper && <p className="grade-result-helper">{helper}</p>}
            {formula && (
                <p className="grade-result-meta">
                    Formula used: <span>{formula}</span>
                </p>
            )}
            {explanation && <p className="grade-result-copy">{explanation}</p>}
            {note && <p className="grade-result-note">{note}</p>}
        </div>
    );
}

function ExamplesTable({
    title,
    inputLabel,
    outputLabel,
    rows,
    inputSuffix = "",
    outputSuffix = "",
}: {
    title: string;
    inputLabel: string;
    outputLabel: string;
    rows: { input: number; output: number }[];
    inputSuffix?: string;
    outputSuffix?: string;
}) {
    if (rows.length === 0) {
        return null;
    }

    return (
        <div className="grade-table-card">
            <div className="grade-section-head">
                <h3>{title}</h3>
                <p>Built dynamically from the active formula and grading scale.</p>
            </div>
            <div className="scrollable-table">
                <table className="calc-table">
                    <thead>
                        <tr>
                            <th>{inputLabel}</th>
                            <th>{outputLabel}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={`${row.input}-${row.output}`}>
                                <td>
                                    {formatNumber(row.input)}
                                    {inputSuffix}
                                </td>
                                <td style={{ fontWeight: 700, color: "var(--fg)" }}>
                                    {formatNumber(row.output)}
                                    {outputSuffix}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function WeightedRowsEditor({
    title,
    scoreLabel,
    scorePlaceholder,
    creditLabel,
    addLabel,
    rows,
    maxScore,
    onRowChange,
    onAddRow,
    onRemoveRow,
    minimumRows,
}: {
    title: string;
    scoreLabel: string;
    scorePlaceholder: string;
    creditLabel: string;
    addLabel: string;
    rows: EditableWeightedRow[];
    maxScore: number;
    onRowChange: (
        rowId: string,
        field: "score" | "credits",
        value: string
    ) => void;
    onAddRow: () => void;
    onRemoveRow: (rowId: string) => void;
    minimumRows: number;
}) {
    return (
        <div className="grade-editor-card">
            <div className="grade-section-head">
                <h3>{title}</h3>
                <p>Use credits for weighted averages instead of a plain semester count.</p>
            </div>

            <div className="grade-row-stack">
                {rows.map((row, index) => (
                    <div key={row.id} className="grade-row-card">
                        <div className="grade-row-head">
                            <p>{title.split(" ")[0]} {index + 1}</p>
                            {rows.length > minimumRows && (
                                <button
                                    type="button"
                                    className="calc-btn-outline grade-inline-btn"
                                    onClick={() => onRemoveRow(row.id)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <div className="grade-field-grid compact">
                            <div>
                                <label className="calc-label">{scoreLabel}</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        className="calc-input"
                                        placeholder={scorePlaceholder}
                                        value={row.score}
                                        onChange={(event) =>
                                            onRowChange(
                                                row.id,
                                                "score",
                                                sanitizeDecimalInput(event.target.value)
                                            )
                                        }
                                    />
                                    <span className="input-icon">/{maxScore}</span>
                                </div>
                            </div>
                            <div>
                                <label className="calc-label">{creditLabel}</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    className="calc-input"
                                    placeholder="20"
                                    value={row.credits}
                                    onChange={(event) =>
                                        onRowChange(
                                            row.id,
                                            "credits",
                                            sanitizeDecimalInput(event.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                className="calc-btn-outline grade-inline-btn"
                onClick={onAddRow}
            >
                {addLabel}
            </button>
        </div>
    );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
    return <div className="grade-field-grid">{children}</div>;
}

export default function CgpaForm() {
    const [activeTab, setActiveTab] = useState<TabId>("cgpa-percentage");
    const [selectedUniversity, setSelectedUniversity] = useState(
        getDefaultUniversityId()
    );
    const [selectedScale, setSelectedScale] = useState(getDefaultScaleId());
    const [cgpa, setCgpa] = useState("");
    const [sgpa, setSgpa] = useState("");
    const [percentage, setPercentage] = useState("");
    const [marksObtained, setMarksObtained] = useState("");
    const [totalMarks, setTotalMarks] = useState("");
    const [semesterRows, setSemesterRows] = useState<EditableWeightedRow[]>(() => [
        createEditableRow(),
        createEditableRow(),
    ]);
    const [courseRows, setCourseRows] = useState<EditableWeightedRow[]>(() => [
        createEditableRow(),
        createEditableRow(),
        createEditableRow(),
    ]);
    const [currentGrade, setCurrentGrade] = useState("");
    const [completedWeight, setCompletedWeight] = useState("");
    const [targetGrade, setTargetGrade] = useState("");

    const activeScale = useMemo(
        () =>
            GRADE_SCALES.find((scale) => scale.id === selectedScale) ??
            GRADE_SCALES[GRADE_SCALES.length - 1]!,
        [selectedScale]
    );

    const resolvedFormula = useMemo(
        () => resolveGradeFormula(selectedUniversity, selectedScale),
        [selectedScale, selectedUniversity]
    );

    const cgpaValue = parseNumber(cgpa);
    const sgpaValue = parseNumber(sgpa);
    const percentageValue = parseNumber(percentage);
    const marksObtainedValue = parseNumber(marksObtained);
    const totalMarksValue = parseNumber(totalMarks);
    const currentGradeValue = parseNumber(currentGrade);
    const completedWeightValue = parseNumber(completedWeight);
    const targetGradeValue = parseNumber(targetGrade);

    const cgpaError =
        cgpaValue !== null && (cgpaValue < 0 || cgpaValue > activeScale.max)
            ? `Enter a CGPA between 0 and ${activeScale.max}.`
            : null;

    const sgpaError =
        sgpaValue !== null && (sgpaValue < 0 || sgpaValue > activeScale.max)
            ? `Enter an SGPA between 0 and ${activeScale.max}.`
            : null;

    const percentageError =
        percentageValue !== null && (percentageValue < 0 || percentageValue > 100)
            ? "Enter a percentage between 0 and 100."
            : null;

    const marksError =
        marksObtainedValue !== null &&
        totalMarksValue !== null &&
        marksObtainedValue > totalMarksValue
            ? "Obtained marks should not exceed total marks."
            : totalMarksValue !== null && totalMarksValue <= 0
                ? "Total marks should be greater than 0."
            : null;

    const cgpaResult = useMemo(() => {
        if (cgpaValue === null || cgpaError) {
            return null;
        }

        return convertCgpaToPercentage(cgpaValue, selectedUniversity, selectedScale);
    }, [cgpaError, cgpaValue, selectedScale, selectedUniversity]);

    const sgpaPercentageResult = useMemo(() => {
        if (sgpaValue === null || sgpaError) {
            return null;
        }

        return convertSgpaToPercentage(sgpaValue, selectedUniversity, selectedScale);
    }, [selectedScale, selectedUniversity, sgpaError, sgpaValue]);

    const percentageToCgpaResult = useMemo(() => {
        if (percentageValue === null || percentageError) {
            return null;
        }

        return convertPercentageToCgpa(
            percentageValue,
            selectedUniversity,
            selectedScale
        );
    }, [percentageError, percentageValue, selectedScale, selectedUniversity]);

    const cgpaExampleRows = useMemo(
        () => createExampleRows(selectedUniversity, selectedScale),
        [selectedScale, selectedUniversity]
    );

    const percentageExampleRows = useMemo(
        () => createPercentageToCgpaRows(selectedUniversity, selectedScale),
        [selectedScale, selectedUniversity]
    );

    const parsedSemesterRows = useMemo(
        () => parseWeightedRows(semesterRows),
        [semesterRows]
    );
    const parsedCourseRows = useMemo(() => parseWeightedRows(courseRows), [courseRows]);

    const semesterRowsError = parsedSemesterRows.some(
        (row) =>
            row.hasAnyInput &&
            (row.score === null ||
                row.credits === null ||
                row.score < 0 ||
                row.score > activeScale.max ||
                row.credits <= 0)
    )
        ? `Enter semester SGPA values between 0 and ${activeScale.max}, with credits greater than 0.`
        : null;

    const gpaRowsError = parsedCourseRows.some(
        (row) =>
            row.hasAnyInput &&
            (row.score === null ||
                row.credits === null ||
                row.score < 0 ||
                row.score > activeScale.max ||
                row.credits <= 0)
    )
        ? `Enter grade points between 0 and ${activeScale.max}, with credits greater than 0.`
        : null;

    const validSemesterRows = parsedSemesterRows
        .filter(
            (row) =>
                row.score !== null &&
                row.credits !== null &&
                row.score >= 0 &&
                row.score <= activeScale.max &&
                row.credits > 0
        )
        .map((row) => ({
            score: row.score!,
            credits: row.credits!,
        }));

    const validCourseRows = parsedCourseRows
        .filter(
            (row) =>
                row.score !== null &&
                row.credits !== null &&
                row.score >= 0 &&
                row.score <= activeScale.max &&
                row.credits > 0
        )
        .map((row) => ({
            score: row.score!,
            credits: row.credits!,
        }));

    const sgpaToCgpaResult =
        semesterRowsError || validSemesterRows.length === 0
            ? null
            : calculateWeightedAverage(validSemesterRows);

    const totalSemesterCredits = validSemesterRows.reduce(
        (sum, row) => sum + row.credits,
        0
    );

    const gpaResult =
        gpaRowsError || validCourseRows.length === 0
            ? null
            : calculateWeightedAverage(validCourseRows);

    const totalCourseCredits = validCourseRows.reduce(
        (sum, row) => sum + row.credits,
        0
    );

    const marksPercentage =
        marksError ||
        marksObtainedValue === null ||
        totalMarksValue === null ||
        totalMarksValue <= 0
            ? null
            : calculateMarksPercentage(marksObtainedValue, totalMarksValue);

    const finalGradeError =
        currentGradeValue !== null &&
        (currentGradeValue < 0 || currentGradeValue > 100)
            ? "Current grade should be between 0 and 100."
            : completedWeightValue !== null &&
                (completedWeightValue < 0 || completedWeightValue >= 100)
                ? "Completed weight must be at least 0 and below 100."
                : targetGradeValue !== null &&
                    (targetGradeValue < 0 || targetGradeValue > 100)
                    ? "Target grade should be between 0 and 100."
                    : null;

    const finalGradeResult =
        finalGradeError ||
        currentGradeValue === null ||
        completedWeightValue === null ||
        targetGradeValue === null
            ? null
            : calculateFinalGradeRequirement(
                currentGradeValue,
                completedWeightValue,
                targetGradeValue
            );

    function updateWeightedRow(
        kind: "semester" | "course",
        rowId: string,
        field: "score" | "credits",
        value: string
    ) {
        const updater = (rows: EditableWeightedRow[]) =>
            rows.map((row) =>
                row.id === rowId
                    ? {
                        ...row,
                        [field]: value,
                    }
                    : row
            );

        if (kind === "semester") {
            setSemesterRows(updater);
            return;
        }

        setCourseRows(updater);
    }

    function renderUniversityAndScaleFields() {
        return (
            <>
                <div>
                    <label className="calc-label" htmlFor="university-select">
                        University
                    </label>
                    <select
                        id="university-select"
                        className="calc-select"
                        value={selectedUniversity}
                        onChange={(event) => setSelectedUniversity(event.target.value)}
                    >
                        {UNIVERSITIES.map((university) => (
                            <option key={university.id} value={university.id}>
                                {university.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="calc-label" htmlFor="scale-select">
                        Grading scale
                    </label>
                    <select
                        id="scale-select"
                        className="calc-select"
                        value={selectedScale}
                        onChange={(event) => setSelectedScale(event.target.value)}
                    >
                        {GRADE_SCALES.map((scale) => (
                            <option key={scale.id} value={scale.id}>
                                {scale.name}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        );
    }

    function renderScaleField(inputId: string) {
        return (
            <div>
                <label className="calc-label" htmlFor={inputId}>
                    Grading scale
                </label>
                <select
                    id={inputId}
                    className="calc-select"
                    value={selectedScale}
                    onChange={(event) => setSelectedScale(event.target.value)}
                >
                    {GRADE_SCALES.map((scale) => (
                        <option key={scale.id} value={scale.id}>
                            {scale.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    function renderActiveCalculator() {
        switch (activeTab) {
            case "cgpa-percentage":
                return (
                    <div className="grade-panel-stack">
                        <FieldGrid>
                            <div>
                                <label className="calc-label" htmlFor="cgpa-value">
                                    CGPA
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="cgpa-value"
                                        type="text"
                                        inputMode="decimal"
                                        className="calc-input"
                                        placeholder="8.5"
                                        value={cgpa}
                                        onChange={(event) =>
                                            setCgpa(
                                                sanitizeDecimalInput(event.target.value)
                                            )
                                        }
                                    />
                                    <span className="input-icon">/{activeScale.max}</span>
                                </div>
                            </div>
                            {renderUniversityAndScaleFields()}
                        </FieldGrid>

                        <FormulaContextCard
                            universityName={resolvedFormula.university.name}
                            scaleName={resolvedFormula.scale.name}
                            formula={resolvedFormula.formulaDisplay}
                            explanation={resolvedFormula.explanation}
                            note={resolvedFormula.note}
                            usesFallback={resolvedFormula.usesScaleFallback}
                        />

                        {cgpaError && <p className="grade-error">{cgpaError}</p>}

                        {cgpaResult && (
                            <>
                                <ResultCard
                                    eyebrow="Equivalent percentage"
                                    value={`${formatNumber(cgpaResult.value)}%`}
                                    helper={`${formatNumber(cgpaValue!)} CGPA on ${cgpaResult.scale.name} scale`}
                                    formula={cgpaResult.formula}
                                    explanation={cgpaResult.explanation}
                                    note={cgpaResult.note}
                                    emphasis="primary"
                                />
                                <ExamplesTable
                                    title="Example conversion table"
                                    inputLabel="CGPA"
                                    outputLabel="Percentage"
                                    rows={cgpaExampleRows}
                                    outputSuffix="%"
                                />
                            </>
                        )}
                    </div>
                );

            case "sgpa-cgpa":
                return (
                    <div className="grade-panel-stack">
                        <FieldGrid>{renderScaleField("sgpa-cgpa-scale")}</FieldGrid>

                        <WeightedRowsEditor
                            title="Semester"
                            scoreLabel="SGPA"
                            scorePlaceholder="8.1"
                            creditLabel="Credits"
                            addLabel="Add semester"
                            rows={semesterRows}
                            maxScore={activeScale.max}
                            onRowChange={(rowId, field, value) =>
                                updateWeightedRow("semester", rowId, field, value)
                            }
                            onAddRow={() =>
                                setSemesterRows((current) => [
                                    ...current,
                                    createEditableRow(),
                                ])
                            }
                            onRemoveRow={(rowId) =>
                                setSemesterRows((current) =>
                                    current.filter((row) => row.id !== rowId)
                                )
                            }
                            minimumRows={2}
                        />

                        {semesterRowsError && (
                            <p className="grade-error">{semesterRowsError}</p>
                        )}

                        {sgpaToCgpaResult !== null && (
                            <ResultCard
                                eyebrow="Weighted CGPA"
                                value={formatNumber(sgpaToCgpaResult)}
                                helper={`${validSemesterRows.length} semesters • ${formatNumber(totalSemesterCredits)} total credits`}
                                formula="CGPA = Σ(SGPA × Credits) ÷ ΣCredits"
                                explanation="Semester credits are used as weights so larger semesters influence the final CGPA proportionally."
                                note={`Result is shown on the active ${activeScale.name} scale.`}
                            />
                        )}
                    </div>
                );

            case "sgpa-percentage":
                return (
                    <div className="grade-panel-stack">
                        <FieldGrid>
                            <div>
                                <label className="calc-label" htmlFor="sgpa-value">
                                    SGPA
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="sgpa-value"
                                        type="text"
                                        inputMode="decimal"
                                        className="calc-input"
                                        placeholder="8.2"
                                        value={sgpa}
                                        onChange={(event) =>
                                            setSgpa(
                                                sanitizeDecimalInput(event.target.value)
                                            )
                                        }
                                    />
                                    <span className="input-icon">/{activeScale.max}</span>
                                </div>
                            </div>
                            {renderUniversityAndScaleFields()}
                        </FieldGrid>

                        <FormulaContextCard
                            universityName={resolvedFormula.university.name}
                            scaleName={resolvedFormula.scale.name}
                            formula={resolvedFormula.formulaDisplay}
                            explanation={resolvedFormula.explanation}
                            note={resolvedFormula.note}
                            usesFallback={resolvedFormula.usesScaleFallback}
                        />

                        {sgpaError && <p className="grade-error">{sgpaError}</p>}

                        {sgpaPercentageResult && (
                            <>
                                <ResultCard
                                    eyebrow="Equivalent percentage"
                                    value={`${formatNumber(sgpaPercentageResult.value)}%`}
                                    helper={`${formatNumber(sgpaValue!)} SGPA on ${sgpaPercentageResult.scale.name} scale`}
                                    formula={sgpaPercentageResult.formula}
                                    explanation={sgpaPercentageResult.explanation}
                                    note={sgpaPercentageResult.note}
                                    emphasis="primary"
                                />
                                <ExamplesTable
                                    title="Example SGPA conversions"
                                    inputLabel="SGPA"
                                    outputLabel="Percentage"
                                    rows={cgpaExampleRows}
                                    outputSuffix="%"
                                />
                            </>
                        )}
                    </div>
                );

            case "percentage-cgpa":
                return (
                    <div className="grade-panel-stack">
                        <FieldGrid>
                            <div>
                                <label className="calc-label" htmlFor="percentage-value">
                                    Percentage
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="percentage-value"
                                        type="text"
                                        inputMode="decimal"
                                        className="calc-input"
                                        placeholder="78"
                                        value={percentage}
                                        onChange={(event) =>
                                            setPercentage(
                                                sanitizeDecimalInput(event.target.value)
                                            )
                                        }
                                    />
                                    <span className="input-icon">%</span>
                                </div>
                            </div>
                            {renderUniversityAndScaleFields()}
                        </FieldGrid>

                        <FormulaContextCard
                            universityName={resolvedFormula.university.name}
                            scaleName={resolvedFormula.scale.name}
                            formula={resolvedFormula.formulaDisplay}
                            explanation={resolvedFormula.explanation}
                            note={resolvedFormula.note}
                            usesFallback={resolvedFormula.usesScaleFallback}
                        />

                        {percentageError && (
                            <p className="grade-error">{percentageError}</p>
                        )}

                        {percentageToCgpaResult && !percentageToCgpaResult.isInRange && (
                            <p className="grade-error">
                                The selected formula supports roughly{" "}
                                {formatNumber(
                                    percentageToCgpaResult.supportedRange.min
                                )}
                                % to{" "}
                                {formatNumber(
                                    percentageToCgpaResult.supportedRange.max
                                )}
                                %.
                            </p>
                        )}

                        {percentageToCgpaResult &&
                            percentageToCgpaResult.value !== null && (
                            <>
                                <ResultCard
                                    eyebrow="Equivalent CGPA"
                                    value={formatNumber(percentageToCgpaResult.value)}
                                    helper={`${formatNumber(percentageValue!)}% on ${percentageToCgpaResult.scale.name} scale`}
                                    formula={percentageToCgpaResult.formula}
                                    explanation={percentageToCgpaResult.explanation}
                                    note={percentageToCgpaResult.note}
                                    emphasis="primary"
                                />
                                <ExamplesTable
                                    title="Example reverse conversions"
                                    inputLabel="Percentage"
                                    outputLabel="CGPA"
                                    rows={percentageExampleRows}
                                    inputSuffix="%"
                                />
                            </>
                        )}
                    </div>
                );

            case "marks-percentage":
                return (
                    <div className="grade-panel-stack">
                        <FieldGrid>
                            <div>
                                <label className="calc-label" htmlFor="marks-obtained">
                                    Marks obtained
                                </label>
                                <input
                                    id="marks-obtained"
                                    type="text"
                                    inputMode="decimal"
                                    className="calc-input"
                                    placeholder="425"
                                    value={marksObtained}
                                    onChange={(event) =>
                                        setMarksObtained(
                                            sanitizeDecimalInput(event.target.value)
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="calc-label" htmlFor="marks-total">
                                    Total marks
                                </label>
                                <input
                                    id="marks-total"
                                    type="text"
                                    inputMode="decimal"
                                    className="calc-input"
                                    placeholder="500"
                                    value={totalMarks}
                                    onChange={(event) =>
                                        setTotalMarks(
                                            sanitizeDecimalInput(event.target.value)
                                        )
                                    }
                                />
                            </div>
                        </FieldGrid>

                        {marksError && <p className="grade-error">{marksError}</p>}

                        {marksPercentage !== null && (
                            <ResultCard
                                eyebrow="Marks percentage"
                                value={`${formatNumber(marksPercentage)}%`}
                                helper={`${formatNumber(marksObtainedValue!)} out of ${formatNumber(totalMarksValue!)}`}
                                formula="Percentage = (Marks Obtained ÷ Total Marks) × 100"
                                explanation="This is the direct marks-to-percentage conversion used for report cards, entrance cutoffs, and merit lists."
                                emphasis="primary"
                            />
                        )}
                    </div>
                );

            case "gpa-calculator":
                return (
                    <div className="grade-panel-stack">
                        <FieldGrid>{renderScaleField("gpa-scale-select")}</FieldGrid>

                        <WeightedRowsEditor
                            title="Course"
                            scoreLabel="Grade point"
                            scorePlaceholder="3.7"
                            creditLabel="Credits"
                            addLabel="Add course"
                            rows={courseRows}
                            maxScore={activeScale.max}
                            onRowChange={(rowId, field, value) =>
                                updateWeightedRow("course", rowId, field, value)
                            }
                            onAddRow={() =>
                                setCourseRows((current) => [
                                    ...current,
                                    createEditableRow(),
                                ])
                            }
                            onRemoveRow={(rowId) =>
                                setCourseRows((current) =>
                                    current.filter((row) => row.id !== rowId)
                                )
                            }
                            minimumRows={3}
                        />

                        {gpaRowsError && <p className="grade-error">{gpaRowsError}</p>}

                        {gpaResult !== null && (
                            <ResultCard
                                eyebrow="Weighted GPA"
                                value={formatNumber(gpaResult)}
                                helper={`${validCourseRows.length} courses • ${formatNumber(totalCourseCredits)} credits`}
                                formula="GPA = Σ(Grade Point × Credits) ÷ ΣCredits"
                                explanation="Each course contributes in proportion to its credits, so high-credit subjects move the GPA more."
                                note={`Grade points are evaluated on the active ${activeScale.name} scale.`}
                            />
                        )}
                    </div>
                );

            case "final-grade":
                return (
                    <div className="grade-panel-stack">
                        <FieldGrid>
                            <div>
                                <label className="calc-label" htmlFor="current-grade">
                                    Current grade
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="current-grade"
                                        type="text"
                                        inputMode="decimal"
                                        className="calc-input"
                                        placeholder="74"
                                        value={currentGrade}
                                        onChange={(event) =>
                                            setCurrentGrade(
                                                sanitizeDecimalInput(event.target.value)
                                            )
                                        }
                                    />
                                    <span className="input-icon">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="calc-label" htmlFor="completed-weight">
                                    Completed weight
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="completed-weight"
                                        type="text"
                                        inputMode="decimal"
                                        className="calc-input"
                                        placeholder="60"
                                        value={completedWeight}
                                        onChange={(event) =>
                                            setCompletedWeight(
                                                sanitizeDecimalInput(event.target.value)
                                            )
                                        }
                                    />
                                    <span className="input-icon">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="calc-label" htmlFor="target-grade">
                                    Target final grade
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="target-grade"
                                        type="text"
                                        inputMode="decimal"
                                        className="calc-input"
                                        placeholder="80"
                                        value={targetGrade}
                                        onChange={(event) =>
                                            setTargetGrade(
                                                sanitizeDecimalInput(event.target.value)
                                            )
                                        }
                                    />
                                    <span className="input-icon">%</span>
                                </div>
                            </div>
                        </FieldGrid>

                        {finalGradeError && (
                            <p className="grade-error">{finalGradeError}</p>
                        )}

                        {finalGradeResult && finalGradeResult.requiredScore !== null && (
                            <ResultCard
                                eyebrow="Required score on remaining assessment"
                                value={`${formatNumber(
                                    Math.max(finalGradeResult.requiredScore, 0)
                                )}%`}
                                helper={`${formatNumber(
                                    finalGradeResult.remainingWeight
                                )}% weight still available`}
                                formula="Required Score = (Target Final Grade − Current Grade × Completed Weight) ÷ Remaining Weight"
                                explanation={
                                    finalGradeResult.status === "already-secured"
                                        ? "You have already locked in the target with the work completed so far."
                                        : finalGradeResult.status === "unreachable"
                                            ? "The required score is above 100%, so the target is not reachable with the remaining weight."
                                            : "This shows the score needed on the remaining assessment weight to finish at your target."
                                }
                                note={
                                    finalGradeResult.status === "required"
                                        ? "A required score between 0% and 100% is achievable."
                                        : finalGradeResult.status === "already-secured"
                                            ? "Any score at or above zero on the remaining work keeps you on track."
                                            : "Lower the target or increase current weighted performance to bring the requirement into range."
                                }
                                warning={finalGradeResult.status === "unreachable"}
                            />
                        )}
                    </div>
                );
        }
    }

    return (
        <section>
            <div className="grade-shell-head">
                <div>
                    <p className="grade-shell-kicker">Academic grade tools</p>
                    <h2 className="grade-shell-title">One page, seven calculators</h2>
                </div>
                <p className="grade-shell-copy">
                    Formula-driven conversions, live results, and no reloads.
                </p>
            </div>

            <div
                className="tab-list grade-tab-list"
                role="tablist"
                aria-label="Grade calculators"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`tab-btn grade-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {renderActiveCalculator()}
        </section>
    );
}
