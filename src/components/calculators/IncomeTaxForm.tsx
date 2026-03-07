"use client";

import { useState, useMemo } from "react";
import { calculateIncomeTax } from "@/lib/formulas";

export default function IncomeTaxForm() {
    const [income, setIncome] = useState("1000000");

    const oldResult = useMemo(() => {
        const i = parseFloat(income);
        if (isNaN(i) || i <= 0) return null;
        return calculateIncomeTax(i, "old");
    }, [income]);

    const newResult = useMemo(() => {
        const i = parseFloat(income);
        if (isNaN(i) || i <= 0) return null;
        return calculateIncomeTax(i, "new");
    }, [income]);

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    const betterRegime = oldResult && newResult
        ? oldResult.totalTax <= newResult.totalTax ? "old" : "new"
        : null;

    return (
        <div>
            <div>
                <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                    Gross Annual Income
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        inputMode="decimal"
                        className="calc-input"
                        placeholder="1000000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value.replace(/[^0-9.]/g, ""))}
                        id="tax-income"
                    />
                    <span className="input-icon">₹</span>
                </div>
            </div>

            {oldResult && newResult && (
                <div style={{ marginTop: "1.5rem" }}>
                    <div className="compare-grid">
                        <div className={`compare-card ${betterRegime === "old" ? "recommended" : ""}`}>
                            {betterRegime === "old" && <span className="compare-badge">Better</span>}
                            <h4 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 600 }}>Old Regime</h4>
                            <div style={{ display: "grid", gap: "0.75rem" }}>
                                <div className="result-item">
                                    <div className="result-item-label">Taxable Income</div>
                                    <div className="result-item-value" style={{ fontSize: "1.1rem" }}>{fmt(oldResult.taxableIncome)}</div>
                                </div>
                                <div className="result-item">
                                    <div className="result-item-label">Tax</div>
                                    <div className="result-item-value" style={{ fontSize: "1.1rem" }}>{fmt(oldResult.taxBeforeCess)}</div>
                                </div>
                                <div className="result-item">
                                    <div className="result-item-label">Cess (4%)</div>
                                    <div className="result-item-value" style={{ fontSize: "1.1rem" }}>{fmt(oldResult.cess)}</div>
                                </div>
                                <div className="result-item" style={{ borderColor: "var(--primary)" }}>
                                    <div className="result-item-label">Total Tax Payable</div>
                                    <div className="result-item-value" style={{ fontSize: "1.25rem", color: "var(--accent)" }}>{fmt(oldResult.totalTax)}</div>
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                                    Effective Rate: {oldResult.effectiveRate}%
                                </div>
                            </div>
                        </div>
                        <div className={`compare-card ${betterRegime === "new" ? "recommended" : ""}`}>
                            {betterRegime === "new" && <span className="compare-badge">Better</span>}
                            <h4 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 600 }}>New Regime</h4>
                            <div style={{ display: "grid", gap: "0.75rem" }}>
                                <div className="result-item">
                                    <div className="result-item-label">Taxable Income</div>
                                    <div className="result-item-value" style={{ fontSize: "1.1rem" }}>{fmt(newResult.taxableIncome)}</div>
                                </div>
                                <div className="result-item">
                                    <div className="result-item-label">Tax</div>
                                    <div className="result-item-value" style={{ fontSize: "1.1rem" }}>{fmt(newResult.taxBeforeCess)}</div>
                                </div>
                                <div className="result-item">
                                    <div className="result-item-label">Cess (4%)</div>
                                    <div className="result-item-value" style={{ fontSize: "1.1rem" }}>{fmt(newResult.cess)}</div>
                                </div>
                                <div className="result-item" style={{ borderColor: "var(--primary)" }}>
                                    <div className="result-item-label">Total Tax Payable</div>
                                    <div className="result-item-value" style={{ fontSize: "1.25rem", color: "var(--accent)" }}>{fmt(newResult.totalTax)}</div>
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                                    Effective Rate: {newResult.effectiveRate}%
                                </div>
                            </div>
                        </div>
                    </div>
                    {betterRegime && (
                        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--success)", textAlign: "center" }}>
                            You save {fmt(Math.abs(oldResult.totalTax - newResult.totalTax))} with the {betterRegime === "old" ? "Old" : "New"} Regime
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
