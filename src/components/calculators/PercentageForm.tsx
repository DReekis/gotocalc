"use client";

import { useState } from "react";
import { percentOf, whatPercent, percentChange } from "@/lib/formulas";

type Mode = "percent_of" | "what_percent" | "change";

export default function PercentageForm() {
    const [mode, setMode] = useState<Mode>("percent_of");
    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");
    const [result, setResult] = useState<string | null>(null);

    function handleCalculate() {
        const a = parseFloat(val1);
        const b = parseFloat(val2);
        if (isNaN(a) || isNaN(b)) return;

        if (mode === "percent_of") {
            setResult(`${a}% of ${b} = ${percentOf(a, b)}`);
        } else if (mode === "what_percent") {
            setResult(`${a} is ${whatPercent(a, b)}% of ${b}`);
        } else {
            const change = percentChange(a, b);
            const direction = change >= 0 ? "increase" : "decrease";
            setResult(`${Math.abs(change)}% ${direction} from ${a} to ${b}`);
        }
    }

    function handleReset() {
        setVal1("");
        setVal2("");
        setResult(null);
    }

    const labels: Record<Mode, [string, string]> = {
        percent_of: ["Percentage (%)", "Value"],
        what_percent: ["Part", "Whole"],
        change: ["Old Value", "New Value"],
    };

    const placeholders: Record<Mode, [string, string]> = {
        percent_of: ["e.g. 25", "e.g. 200"],
        what_percent: ["e.g. 45", "e.g. 200"],
        change: ["e.g. 100", "e.g. 150"],
    };

    return (
        <div>
            <div className="tab-list">
                <button
                    className={`tab-btn ${mode === "percent_of" ? "active" : ""}`}
                    onClick={() => { setMode("percent_of"); setResult(null); }}
                    type="button"
                >
                    X% of Y
                </button>
                <button
                    className={`tab-btn ${mode === "what_percent" ? "active" : ""}`}
                    onClick={() => { setMode("what_percent"); setResult(null); }}
                    type="button"
                >
                    X is what % of Y
                </button>
                <button
                    className={`tab-btn ${mode === "change" ? "active" : ""}`}
                    onClick={() => { setMode("change"); setResult(null); }}
                    type="button"
                >
                    % Change
                </button>
            </div>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        {labels[mode][0]}
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder={placeholders[mode][0]}
                        value={val1}
                        onChange={(e) => setVal1(e.target.value)}
                        id="pct-val1"
                    />
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        {labels[mode][1]}
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder={placeholders[mode][1]}
                        value={val2}
                        onChange={(e) => setVal2(e.target.value)}
                        id="pct-val2"
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="calc-btn" onClick={handleCalculate} id="pct-calculate">
                    Calculate
                </button>
                <button className="calc-btn-outline" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {result && (
                <div className="calc-result" style={{ textAlign: "center" }}>
                    <p className="calc-result-value" style={{ fontSize: "1.5rem", margin: 0 }}>
                        {result}
                    </p>
                </div>
            )}
        </div>
    );
}
