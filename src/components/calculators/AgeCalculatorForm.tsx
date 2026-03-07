"use client";

import { useState, useMemo } from "react";
import { calculateAge } from "@/lib/formulas";

export default function AgeCalculatorForm() {
    const [dob, setDob] = useState("");
    const [targetDate, setTargetDate] = useState("");

    const result = useMemo(() => {
        if (!dob) return null;
        const birth = new Date(dob);
        if (isNaN(birth.getTime())) return null;
        const target = targetDate ? new Date(targetDate) : new Date();
        if (isNaN(target.getTime()) || target < birth) return null;
        return calculateAge(birth, target);
    }, [dob, targetDate]);

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

            {result && (
                <div className="calc-result">
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

                    <div className="result-grid">
                        <div className="result-item">
                            <div className="result-item-label">Total Days Lived</div>
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
