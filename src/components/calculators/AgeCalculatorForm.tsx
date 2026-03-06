"use client";

import { useState } from "react";
import { calculateAge, type AgeResult } from "@/lib/formulas";

export default function AgeCalculatorForm() {
    const [dob, setDob] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [result, setResult] = useState<AgeResult | null>(null);

    function handleCalculate() {
        if (!dob) return;
        const birth = new Date(dob);
        const target = targetDate ? new Date(targetDate) : new Date();
        if (isNaN(birth.getTime())) return;
        if (target < birth) return;
        setResult(calculateAge(birth, target));
    }

    function handleReset() {
        setDob("");
        setTargetDate("");
        setResult(null);
    }

    return (
        <div>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        className="calc-input"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        id="age-dob"
                    />
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Target Date (optional)
                    </label>
                    <input
                        type="date"
                        className="calc-input"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        id="age-target"
                    />
                    <p style={{ color: "var(--muted)", fontSize: "0.75rem", margin: "0.35rem 0 0" }}>
                        Defaults to today if blank
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="calc-btn" onClick={handleCalculate} id="age-calculate">
                    Calculate Age
                </button>
                <button className="calc-btn-outline" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {result && (
                <div className="calc-result">
                    {/* Main age display */}
                    <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                            <div>
                                <p className="calc-result-value" style={{ margin: 0 }}>{result.years}</p>
                                <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Years</span>
                            </div>
                            <div>
                                <p className="calc-result-value" style={{ margin: 0 }}>{result.months}</p>
                                <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Months</span>
                            </div>
                            <div>
                                <p className="calc-result-value" style={{ margin: 0 }}>{result.days}</p>
                                <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional details */}
                    <div className="result-grid">
                        <div className="result-item">
                            <div className="result-item-label">Total Days</div>
                            <div className="result-item-value">{result.totalDays.toLocaleString()}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Next Birthday In</div>
                            <div className="result-item-value" style={{ color: "var(--success)" }}>
                                {result.nextBirthdayDays} days
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
