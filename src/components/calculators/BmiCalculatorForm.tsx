"use client";

import { useState } from "react";
import { calculateBMI, type BMIResult } from "@/lib/formulas";

export default function BmiCalculatorForm() {
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");
    const [result, setResult] = useState<BMIResult | null>(null);

    function handleCalculate() {
        let w = parseFloat(weight);
        let h = parseFloat(height);
        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

        if (unit === "imperial") {
            w = w * 0.453592; // lbs to kg
            h = h * 2.54; // inches to cm
        }

        setResult(calculateBMI(w, h));
    }

    function handleReset() {
        setWeight("");
        setHeight("");
        setResult(null);
    }

    // BMI scale categories for visual bar
    const categories = [
        { label: "Underweight", max: 18.5, color: "#60a5fa" },
        { label: "Normal", max: 25, color: "#34d399" },
        { label: "Overweight", max: 30, color: "#fbbf24" },
        { label: "Obese", max: 40, color: "#f87171" },
    ];

    // Position on 0-40 scale
    const bmiPos = result ? Math.min(Math.max(result.bmi, 10), 40) : 0;
    const markerPct = result ? ((bmiPos - 10) / 30) * 100 : 0;

    return (
        <div>
            {/* Unit toggle */}
            <div className="tab-list" style={{ marginBottom: "1rem" }}>
                <button
                    className={`tab-btn ${unit === "metric" ? "active" : ""}`}
                    onClick={() => setUnit("metric")}
                    type="button"
                >
                    Metric (kg / cm)
                </button>
                <button
                    className={`tab-btn ${unit === "imperial" ? "active" : ""}`}
                    onClick={() => setUnit("imperial")}
                    type="button"
                >
                    Imperial (lbs / in)
                </button>
            </div>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Weight ({unit === "metric" ? "kg" : "lbs"})
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        min="0"
                        step="0.1"
                        id="bmi-weight"
                    />
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Height ({unit === "metric" ? "cm" : "inches"})
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        min="0"
                        step="0.1"
                        id="bmi-height"
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="calc-btn" onClick={handleCalculate} id="bmi-calculate">
                    Calculate BMI
                </button>
                <button className="calc-btn-outline" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {result && (
                <div className="calc-result">
                    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                        <p className="calc-result-value" style={{ fontSize: "3rem", margin: "0 0 0.25rem" }}>
                            {result.bmi}
                        </p>
                        <span
                            style={{
                                background: result.categoryColor + "22",
                                borderRadius: 999,
                                color: result.categoryColor,
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                padding: "0.3rem 1rem",
                            }}
                        >
                            {result.category}
                        </span>
                    </div>

                    {/* BMI Scale */}
                    <div style={{ position: "relative", marginTop: "1.5rem" }}>
                        <div
                            style={{
                                display: "flex",
                                borderRadius: 999,
                                height: 12,
                                overflow: "hidden",
                            }}
                        >
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
                        {/* Marker */}
                        <div
                            style={{
                                position: "absolute",
                                left: `${markerPct}%`,
                                top: -6,
                                transform: "translateX(-50%)",
                                width: 0,
                                height: 0,
                                borderLeft: "6px solid transparent",
                                borderRight: "6px solid transparent",
                                borderTop: "8px solid var(--foreground)",
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.7rem",
                                color: "var(--muted)",
                                marginTop: "0.5rem",
                            }}
                        >
                            <span>Underweight</span>
                            <span>Normal</span>
                            <span>Overweight</span>
                            <span>Obese</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
