"use client";

import { useState, useMemo } from "react";
import { percentOf, whatPercent, percentChange } from "@/lib/formulas";

type Mode = "percent_of" | "what_percent" | "change";

export default function PercentageForm() {
    const [mode, setMode] = useState<Mode>("percent_of");
    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");

    const result = useMemo(() => {
        const a = parseFloat(val1);
        const b = parseFloat(val2);
        if (isNaN(a) || isNaN(b)) return null;

        if (mode === "percent_of") {
            return `${a}% of ${b} = ${percentOf(a, b)}`;
        } else if (mode === "what_percent") {
            return `${a} is ${whatPercent(a, b)}% of ${b}`;
        } else {
            const change = percentChange(a, b);
            const direction = change >= 0 ? "increase" : "decrease";
            return `${Math.abs(change)}% ${direction} from ${a} to ${b}`;
        }
    }, [val1, val2, mode]);

    const labels: Record<Mode, [string, string]> = {
        percent_of: ["Percentage", "Value"],
        what_percent: ["Part", "Whole"],
        change: ["Old Value", "New Value"],
    };

    const placeholders: Record<Mode, [string, string]> = {
        percent_of: ["25", "200"],
        what_percent: ["45", "200"],
        change: ["100", "150"],
    };

    const icons: Record<Mode, [string, string]> = {
        percent_of: ["%", "#"],
        what_percent: ["#", "#"],
        change: ["#", "#"],
    };

    return (
        <div>
            <div className="tab-list">
                <button className={`tab-btn ${mode === "percent_of" ? "active" : ""}`} onClick={() => { setMode("percent_of"); setVal1(""); setVal2(""); }} type="button">
                    X% of Y
                </button>
                <button className={`tab-btn ${mode === "what_percent" ? "active" : ""}`} onClick={() => { setMode("what_percent"); setVal1(""); setVal2(""); }} type="button">
                    X is what % of Y
                </button>
                <button className={`tab-btn ${mode === "change" ? "active" : ""}`} onClick={() => { setMode("change"); setVal1(""); setVal2(""); }} type="button">
                    % Change
                </button>
            </div>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        {labels[mode][0]}
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            inputMode="decimal"
                            className="calc-input"
                            placeholder={placeholders[mode][0]}
                            value={val1}
                            onChange={(e) => setVal1(e.target.value.replace(/[^0-9.\-]/g, ""))}
                            id="pct-val1"
                        />
                        <span className="input-icon">{icons[mode][0]}</span>
                    </div>
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        {labels[mode][1]}
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            inputMode="decimal"
                            className="calc-input"
                            placeholder={placeholders[mode][1]}
                            value={val2}
                            onChange={(e) => setVal2(e.target.value.replace(/[^0-9.\-]/g, ""))}
                            id="pct-val2"
                        />
                        <span className="input-icon">{icons[mode][1]}</span>
                    </div>
                </div>
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
