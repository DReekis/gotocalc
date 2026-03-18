import universityFormulaData from "@/data/cgpa_calc.json";
import gradingScaleData from "@/data/grading_scales.json";
import { SITE_URL } from "./constants";

export interface GradeScaleDefinition {
    id: string;
    name: string;
    max: number;
    conversion: string;
    formulaDisplay: string;
    description: string;
    exampleValues: number[];
}

export interface UniversityFormulaDefinition {
    id: string;
    name: string;
    formula: string;
    formulaDisplay: string;
    scale: number;
    notes?: string;
    description: string;
    explanation: string;
    verificationStatus?: "generic" | "official" | "mirror";
    scope?: string;
    sourceTitle?: string;
    sourceUrl?: string;
    verifiedOn?: string;
}

export interface ResolvedGradeFormula {
    university: UniversityFormulaDefinition;
    scale: GradeScaleDefinition;
    expression: string;
    formulaDisplay: string;
    explanation: string;
    note: string;
    usesScaleFallback: boolean;
}

export interface GradeConversionResult {
    value: number;
    formula: string;
    explanation: string;
    note: string;
    scale: GradeScaleDefinition;
    university: UniversityFormulaDefinition;
    usesScaleFallback: boolean;
}

export interface GradeReverseConversionResult {
    value: number | null;
    formula: string;
    explanation: string;
    note: string;
    scale: GradeScaleDefinition;
    university: UniversityFormulaDefinition;
    usesScaleFallback: boolean;
    isInRange: boolean;
    supportedRange: {
        min: number;
        max: number;
    };
}

export interface WeightedGradeRow {
    score: number;
    credits: number;
}

export interface ExampleConversionRow {
    input: number;
    output: number;
}

const gradeScales = gradingScaleData.scales as GradeScaleDefinition[];
const universityFormulas =
    universityFormulaData.universities as UniversityFormulaDefinition[];

const gradeScaleMap = new Map(gradeScales.map((scale) => [scale.id, scale]));
const universityFormulaMap = new Map(
    universityFormulas.map((university) => [university.id, university])
);

function roundTo(value: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

function evaluateExpression(
    expression: string,
    values: Record<string, number>
): number {
    const keys = Object.keys(values);
    const fn = new Function(...keys, `return ${expression};`) as (
        ...args: number[]
    ) => number;
    const result = fn(...keys.map((key) => values[key]));
    return Number.isFinite(result) ? result : Number.NaN;
}

export function getGradeScales(): GradeScaleDefinition[] {
    return gradeScales;
}

export function getUniversityFormulas(): UniversityFormulaDefinition[] {
    return universityFormulas;
}

export function getDefaultUniversityId(): string {
    return universityFormulas[0]?.id ?? "default";
}

export function getDefaultScaleId(): string {
    return gradeScales[2]?.id ?? "10.0";
}

function getScale(scaleId: string): GradeScaleDefinition {
    return gradeScaleMap.get(scaleId) ?? gradeScales[gradeScales.length - 1]!;
}

function getUniversity(universityId: string): UniversityFormulaDefinition {
    return universityFormulaMap.get(universityId) ?? universityFormulas[0]!;
}

function formatScaleId(scaleValue: number): string {
    return scaleValue.toFixed(1);
}

export function resolveGradeFormula(
    universityId: string,
    scaleId: string
): ResolvedGradeFormula {
    const scale = getScale(scaleId);
    const university = getUniversity(universityId);
    const universityScaleId = formatScaleId(university.scale);

    if (universityScaleId === scale.id) {
        return {
            university,
            scale,
            expression: university.formula,
            formulaDisplay: university.formulaDisplay,
            explanation: university.explanation,
            note:
                university.notes ??
                `${university.name} uses a ${scale.name} scale conversion.`,
            usesScaleFallback: false,
        };
    }

    return {
        university,
        scale,
        expression: scale.conversion,
        formulaDisplay: scale.formulaDisplay,
        explanation: `${university.name} is stored with an official ${universityScaleId} formula. For the selected ${scale.name} scale, the calculator falls back to the generic scale conversion from the JSON database.`,
        note: scale.description,
        usesScaleFallback: true,
    };
}

export function convertCgpaToPercentage(
    cgpa: number,
    universityId: string,
    scaleId: string
): GradeConversionResult {
    const resolved = resolveGradeFormula(universityId, scaleId);

    return {
        value: roundTo(
            evaluateExpression(resolved.expression, {
                cgpa,
            })
        ),
        formula: resolved.formulaDisplay,
        explanation: resolved.explanation,
        note: resolved.note,
        scale: resolved.scale,
        university: resolved.university,
        usesScaleFallback: resolved.usesScaleFallback,
    };
}

export function convertSgpaToPercentage(
    sgpa: number,
    universityId: string,
    scaleId: string
): GradeConversionResult {
    const resolved = resolveGradeFormula(universityId, scaleId);

    return {
        value: roundTo(
            evaluateExpression(resolved.expression, {
                cgpa: sgpa,
            })
        ),
        formula: resolved.formulaDisplay,
        explanation: resolved.explanation,
        note: resolved.note,
        scale: resolved.scale,
        university: resolved.university,
        usesScaleFallback: resolved.usesScaleFallback,
    };
}

function invertFormula(
    expression: string,
    targetPercentage: number,
    scaleMax: number
): number {
    let low = 0;
    let high = scaleMax;

    for (let i = 0; i < 60; i++) {
        const mid = (low + high) / 2;
        const value = evaluateExpression(expression, { cgpa: mid });

        if (value < targetPercentage) {
            low = mid;
        } else {
            high = mid;
        }
    }

    return (low + high) / 2;
}

export function convertPercentageToCgpa(
    percentage: number,
    universityId: string,
    scaleId: string
): GradeReverseConversionResult {
    const resolved = resolveGradeFormula(universityId, scaleId);
    const min = roundTo(
        evaluateExpression(resolved.expression, {
            cgpa: 0,
        })
    );
    const max = roundTo(
        evaluateExpression(resolved.expression, {
            cgpa: resolved.scale.max,
        })
    );
    const lower = Math.max(0, Math.min(min, max));
    const upper = Math.max(min, max);
    const isInRange = percentage >= lower && percentage <= upper;

    return {
        value: isInRange
            ? roundTo(invertFormula(resolved.expression, percentage, resolved.scale.max))
            : null,
        formula: resolved.formulaDisplay,
        explanation: resolved.explanation,
        note: resolved.note,
        scale: resolved.scale,
        university: resolved.university,
        usesScaleFallback: resolved.usesScaleFallback,
        isInRange,
        supportedRange: {
            min: lower,
            max: upper,
        },
    };
}

export function calculateWeightedAverage(rows: WeightedGradeRow[]): number | null {
    const validRows = rows.filter(
        (row) =>
            Number.isFinite(row.score) &&
            Number.isFinite(row.credits) &&
            row.score >= 0 &&
            row.credits > 0
    );

    const totalCredits = validRows.reduce((sum, row) => sum + row.credits, 0);
    if (totalCredits === 0) {
        return null;
    }

    const weightedTotal = validRows.reduce(
        (sum, row) => sum + row.score * row.credits,
        0
    );

    return roundTo(weightedTotal / totalCredits);
}

export function calculateMarksPercentage(
    marksObtained: number,
    totalMarks: number
): number | null {
    if (!Number.isFinite(marksObtained) || !Number.isFinite(totalMarks) || totalMarks <= 0) {
        return null;
    }

    return roundTo((marksObtained / totalMarks) * 100);
}

export function calculateFinalGradeRequirement(
    currentGrade: number,
    completedWeight: number,
    targetGrade: number
): {
    requiredScore: number | null;
    remainingWeight: number;
    status: "invalid" | "required" | "already-secured" | "unreachable";
} {
    if (
        !Number.isFinite(currentGrade) ||
        !Number.isFinite(completedWeight) ||
        !Number.isFinite(targetGrade) ||
        completedWeight < 0 ||
        completedWeight >= 100
    ) {
        return {
            requiredScore: null,
            remainingWeight: Math.max(0, 100 - completedWeight),
            status: "invalid",
        };
    }

    const remainingWeight = 100 - completedWeight;
    const requiredScore =
        (targetGrade - (currentGrade * completedWeight) / 100) /
        (remainingWeight / 100);

    return {
        requiredScore: roundTo(requiredScore),
        remainingWeight: roundTo(remainingWeight),
        status:
            requiredScore < 0
                ? "already-secured"
                : requiredScore <= 100
                    ? "required"
                    : "unreachable",
    };
}

export function createExampleRows(
    universityId: string,
    scaleId: string
): ExampleConversionRow[] {
    const scale = getScale(scaleId);

    return scale.exampleValues.map((value) => ({
        input: value,
        output: convertCgpaToPercentage(value, universityId, scaleId).value,
    }));
}

export function createPercentageToCgpaRows(
    universityId: string,
    scaleId: string
): ExampleConversionRow[] {
    const percentageSamples = [40, 50, 60, 70, 80, 90];

    return percentageSamples
        .map((value) => {
            const result = convertPercentageToCgpa(value, universityId, scaleId);
            return result.value === null
                ? null
                : {
                    input: value,
                    output: result.value,
                };
        })
        .filter((row): row is ExampleConversionRow => row !== null);
}

export function getUniversityExplainer(universityId: string): {
    title: string;
    description: string;
    note: string;
} {
    const university = getUniversity(universityId);

    return {
        title: university.name,
        description: university.explanation,
        note: university.description,
    };
}

export function buildUniversityFormulaSchema(pagePath: string) {
    const pageUrl = `${SITE_URL}${pagePath}`;

    return [
        {
            "@type": "ItemList",
            "@id": `${pageUrl}#university-formulas`,
            name: "University CGPA conversion formulas",
            itemListElement: universityFormulas.map((university, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "DefinedTerm",
                    "@id": `${pageUrl}#formula-${university.id}`,
                    name: `${university.name} CGPA Formula`,
                    termCode: university.id,
                    description: `${university.name} uses ${university.formulaDisplay} on a ${formatScaleId(university.scale)} scale. ${university.description}`,
                },
            })),
        },
        ...universityFormulas.map((university) => ({
            "@type": "HowTo",
            "@id": `${pageUrl}#howto-${university.id}`,
            name: `${university.name} CGPA to Percentage Conversion`,
            description: university.explanation,
            step: [
                {
                    "@type": "HowToStep",
                    name: "Choose your university",
                    text: `Select ${university.name} from the university list.`,
                },
                {
                    "@type": "HowToStep",
                    name: "Enter your CGPA",
                    text: `Use the ${formatScaleId(university.scale)} grading scale and enter your CGPA value.`,
                },
                {
                    "@type": "HowToStep",
                    name: "Apply the formula",
                    text: `Calculate percentage with ${university.formulaDisplay}.`,
                },
            ],
        })),
    ];
}
