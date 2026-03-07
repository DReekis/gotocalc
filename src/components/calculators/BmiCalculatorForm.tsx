"use client";

import { useState, useMemo } from "react";
import { calculateBMI, calculateWtHR } from "@/lib/formulas";

export default function BmiCalculatorForm() {
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [waist, setWaist] = useState("");
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");

    const result = useMemo(() => {
        let w = parseFloat(weight);
        let h = parseFloat(height);
        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;

        if (unit === "imperial") {
            w = w * 0.453592;
            h = h * 2.54;
        }

        const bmi = calculateBMI(w, h);

        let waistCm = parseFloat(waist);
        if (unit === "imperial" && !isNaN(waistCm)) waistCm = waistCm * 2.54;
        const wthr = !isNaN(waistCm) && waistCm > 0 ? calculateWtHR(waistCm, h) : null;

        return { bmi, wthr };
    }, [weight, height, waist, unit]);

    const categories = [
        { label: "Underweight", max: 18.5, color: "#60a5fa" },
        { label: "Normal", max: 25, color: "#34d399" },
        { label: "Overweight", max: 30, color: "#fbbf24" },
        { label: "Obese", max: 40, color: "#f87171" },
    ];

    const bmiPos = result ? Math.min(Math.max(result.bmi.bmi, 10), 40) : 0;
    const markerPct = result ? ((bmiPos - 10) / 30) * 100 : 0;

    return (
        <div>
            <div className="tab-list" style={{ marginBottom: "1rem" }}>
                <button className={`tab-btn ${unit === "metric" ? "active" : ""}`} onClick={() => setUnit("metric")} type="button">
                    Metric (kg / cm)
                </button>
                <button className={`tab-btn ${unit === "imperial" ? "active" : ""}`} onClick={() => setUnit("imperial")} type="button">
                    Imperial (lbs / in)
                </button>
            </div>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Weight
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            inputMode="decimal"
                            className="calc-input"
                            placeholder={unit === "metric" ? "70" : "154"}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
                            id="bmi-weight"
                        />
                        <span className="input-icon">{unit === "metric" ? "kg" : "lbs"}</span>
                    </div>
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Height
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            inputMode="decimal"
                            className="calc-input"
                            placeholder={unit === "metric" ? "175" : "69"}
                            value={height}
                            onChange={(e) => setHeight(e.target.value.replace(/[^0-9.]/g, ""))}
                            id="bmi-height"
                        />
                        <span className="input-icon">{unit === "metric" ? "cm" : "in"}</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                    Waist Circumference (optional)
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        inputMode="decimal"
                        className="calc-input"
                        placeholder={unit === "metric" ? "80" : "31.5"}
                        value={waist}
                        onChange={(e) => setWaist(e.target.value.replace(/[^0-9.]/g, ""))}
                        id="bmi-waist"
                    />
                    <span className="input-icon">{unit === "metric" ? "cm" : "in"}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.75rem", margin: "0.3rem 0 0" }}>
                    For Waist-to-Height Ratio (WtHR) — a more accurate health risk indicator
                </p>
            </div>

            {result && (
                <div className="calc-result">
                    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                        <p className="calc-result-value" style={{ fontSize: "3rem", margin: "0 0 0.25rem" }}>
                            {result.bmi.bmi}
                        </p>
                        <span
                            style={{
                                background: result.bmi.categoryColor + "22",
                                borderRadius: 999,
                                color: result.bmi.categoryColor,
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                padding: "0.3rem 1rem",
                            }}
                        >
                            {result.bmi.category}
                        </span>
                    </div>

                    {/* BMI Scale */}
                    <div style={{ position: "relative", marginTop: "1.5rem" }}>
                        <div style={{ display: "flex", borderRadius: 999, height: 12, overflow: "hidden" }}>
                            {categories.map((cat, i) => (
                                <div
                                    key={cat.label}
                                    style={{
                                        background: cat.color,
                                        flex: i === 3 ? 1 : (cat.max - (i === 0 ? 10 : categories[i - 1].max)) / 30,
                                    }}
                                />
                            ))}
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                left: `${markerPct}%`,
                                top: -6,
                                transform: "translateX(-50%)",
                                width: 0, height: 0,
                                borderLeft: "6px solid transparent",
                                borderRight: "6px solid transparent",
                                borderTop: "8px solid var(--foreground)",
                            }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                        </div>
                    </div>

                    {/* WtHR Result */}
                    {result.wthr && (
                        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--background)", borderRadius: 10, border: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ color: "var(--muted)", fontSize: "0.8rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.025em" }}>
                                        Waist-to-Height Ratio
                                    </div>
                                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)" }}>
                                        {result.wthr.ratio}
                                    </div>
                                </div>
                                <span
                                    style={{
                                        background: result.wthr.categoryColor + "22",
                                        borderRadius: 999,
                                        color: result.wthr.categoryColor,
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        padding: "0.3rem 1rem",
                                    }}
                                >
                                    {result.wthr.category}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
