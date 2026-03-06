"use client";

import { useState } from "react";
import { calculateIncomeTax, type TaxResult } from "@/lib/formulas";
import { OLD_REGIME_SLABS, NEW_REGIME_SLABS } from "@/lib/constants";

export default function IncomeTaxForm() {
    const [income, setIncome] = useState("");
    const [result, setResult] = useState<{ old: TaxResult; new: TaxResult } | null>(null);

    function handleCalculate() {
        const val = parseFloat(income);
        if (isNaN(val) || val <= 0) return;
        setResult({
            old: calculateIncomeTax(val, "old"),
            new: calculateIncomeTax(val, "new"),
        });
    }

    function handleReset() {
        setIncome("");
        setResult(null);
    }

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    const betterRegime = result
        ? result.old.totalTax <= result.new.totalTax ? "old" : "new"
        : null;

    return (
        <div>
            <div>
                <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                    Annual Gross Income (₹)
                </label>
                <input
                    type="number"
                    className="calc-input"
                    placeholder="e.g. 1200000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    min="0"
                    id="tax-income"
                />
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "0.5rem 0 0" }}>
                    Enter your total income before any deductions. We apply standard deduction automatically.
                </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="calc-btn" onClick={handleCalculate} id="tax-calculate">
                    Compare Tax Regimes
                </button>
                <button className="calc-btn-outline" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {result && (
                <div style={{ marginTop: "1.5rem" }}>
                    <div className="compare-grid">
                        {/* Old Regime */}
                        <div className={`compare-card ${betterRegime === "old" ? "recommended" : ""}`}>
                            {betterRegime === "old" && (
                                <span className="compare-badge">💰 Saves More</span>
                            )}
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem", color: "var(--foreground)" }}>
                                Old Tax Regime
                            </h3>
                            <div style={{ display: "grid", gap: "0.75rem" }}>
                                <div>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Taxable Income</span>
                                    <p style={{ color: "var(--foreground)", fontSize: "1.1rem", fontWeight: 600, margin: "0.15rem 0 0" }}>
                                        {fmt(result.old.taxableIncome)}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Tax Before Cess</span>
                                    <p style={{ color: "var(--foreground)", fontSize: "1.1rem", fontWeight: 600, margin: "0.15rem 0 0" }}>
                                        {fmt(result.old.taxBeforeCess)}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Health &amp; Education Cess (4%)</span>
                                    <p style={{ color: "var(--foreground)", fontSize: "1.1rem", fontWeight: 600, margin: "0.15rem 0 0" }}>
                                        {fmt(result.old.cess)}
                                    </p>
                                </div>
                                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Total Tax Payable</span>
                                    <p className="calc-result-value" style={{ fontSize: "1.5rem", margin: "0.15rem 0 0" }}>
                                        {fmt(result.old.totalTax)}
                                    </p>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                                        Effective Rate: {result.old.effectiveRate}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* New Regime */}
                        <div className={`compare-card ${betterRegime === "new" ? "recommended" : ""}`}>
                            {betterRegime === "new" && (
                                <span className="compare-badge">💰 Saves More</span>
                            )}
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem", color: "var(--foreground)" }}>
                                New Tax Regime
                            </h3>
                            <div style={{ display: "grid", gap: "0.75rem" }}>
                                <div>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Taxable Income</span>
                                    <p style={{ color: "var(--foreground)", fontSize: "1.1rem", fontWeight: 600, margin: "0.15rem 0 0" }}>
                                        {fmt(result.new.taxableIncome)}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Tax Before Cess</span>
                                    <p style={{ color: "var(--foreground)", fontSize: "1.1rem", fontWeight: 600, margin: "0.15rem 0 0" }}>
                                        {fmt(result.new.taxBeforeCess)}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Health &amp; Education Cess (4%)</span>
                                    <p style={{ color: "var(--foreground)", fontSize: "1.1rem", fontWeight: 600, margin: "0.15rem 0 0" }}>
                                        {fmt(result.new.cess)}
                                    </p>
                                </div>
                                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Total Tax Payable</span>
                                    <p className="calc-result-value" style={{ fontSize: "1.5rem", margin: "0.15rem 0 0" }}>
                                        {fmt(result.new.totalTax)}
                                    </p>
                                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                                        Effective Rate: {result.new.effectiveRate}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Savings summary */}
                    {result.old.totalTax !== result.new.totalTax && (
                        <div
                            style={{
                                background: "var(--surface)",
                                border: "1px solid var(--success)",
                                borderRadius: 12,
                                marginTop: "1.25rem",
                                padding: "1rem 1.25rem",
                                textAlign: "center",
                            }}
                        >
                            <p style={{ color: "var(--success)", fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>
                                You save{" "}
                                <strong>
                                    {fmt(Math.abs(result.old.totalTax - result.new.totalTax))}
                                </strong>{" "}
                                with the {betterRegime === "old" ? "Old" : "New"} Tax Regime
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
