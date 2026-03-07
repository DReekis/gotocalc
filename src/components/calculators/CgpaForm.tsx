"use client";

import { useState, useMemo } from "react";
import { cgpaToPercentage, type CGPAScheme } from "@/lib/formulas";

const SCHEMES: { key: CGPAScheme; label: string }[] = [
    { key: "standard", label: "CBSE / Standard" },
    { key: "vtu", label: "VTU" },
    { key: "aktu", label: "AKTU" },
    { key: "mumbai", label: "Mumbai Univ." },
];

export default function CgpaForm() {
    const [cgpa, setCgpa] = useState("");
    const [scheme, setScheme] = useState<CGPAScheme>("standard");

    const result = useMemo(() => {
        const c = parseFloat(cgpa);
        if (isNaN(c) || c <= 0 || c > 10) return null;
        return cgpaToPercentage(c, scheme);
    }, [cgpa, scheme]);

    return (
        <div>
            <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Your CGPA
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            inputMode="decimal"
                            className="calc-input"
                            placeholder="8.5"
                            value={cgpa}
                            onChange={(e) => setCgpa(e.target.value.replace(/[^0-9.]/g, ""))}
                            id="cgpa-value"
                            style={{ fontSize: "1.25rem", fontWeight: 600 }}
                        />
                        <span className="input-icon">/10</span>
                    </div>
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        University / Board
                    </label>
                    <div className="chip-group">
                        {SCHEMES.map((s) => (
                            <button
                                key={s.key}
                                type="button"
                                className={`chip ${scheme === s.key ? "active" : ""}`}
                                onClick={() => setScheme(s.key)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {result && (
                <div className="calc-result" style={{ textAlign: "center" }}>
                    <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>
                        Equivalent Percentage
                    </p>
                    <p className="calc-result-value" style={{ fontSize: "3rem", margin: "0 0 0.25rem" }}>
                        {result.percentage}%
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: 0 }}>
                        Formula: {result.formula}
                    </p>
                </div>
            )}

            {/* All formulas reference */}
            <div style={{ marginTop: "1.5rem" }}>
                <table className="calc-table">
                    <thead>
                        <tr>
                            <th>University / Board</th>
                            <th>Formula</th>
                            <th>{cgpa ? `Result (${cgpa})` : "Example (8.5)"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SCHEMES.map((s) => {
                            const c = parseFloat(cgpa) || 8.5;
                            const r = c > 0 && c <= 10 ? cgpaToPercentage(c, s.key) : null;
                            return (
                                <tr key={s.key} style={scheme === s.key ? { background: "var(--surface-hover)" } : undefined}>
                                    <td style={{ fontWeight: scheme === s.key ? 600 : 400 }}>{s.label}</td>
                                    <td style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.8rem" }}>
                                        {cgpaToPercentage(1, s.key).formula}
                                    </td>
                                    <td style={{ fontWeight: 600, color: "var(--accent)" }}>
                                        {r ? `${r.percentage}%` : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
