"use client";

import { useState } from "react";
import { calculateSIP, type SIPResult } from "@/lib/formulas";

export default function SipCalculatorForm() {
    const [monthly, setMonthly] = useState("");
    const [rate, setRate] = useState("");
    const [years, setYears] = useState("");
    const [result, setResult] = useState<SIPResult | null>(null);

    function handleCalculate() {
        const m = parseFloat(monthly);
        const r = parseFloat(rate);
        const y = parseFloat(years);
        if (isNaN(m) || isNaN(r) || isNaN(y) || m <= 0 || r < 0 || y <= 0) return;
        setResult(calculateSIP(m, r, y));
    }

    function handleReset() {
        setMonthly("");
        setRate("");
        setYears("");
        setResult(null);
    }

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    const investedPct = result
        ? Math.round((result.investedAmount / result.totalValue) * 100)
        : 0;

    return (
        <div>
            <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Monthly Investment (₹)
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="e.g. 5000"
                        value={monthly}
                        onChange={(e) => setMonthly(e.target.value)}
                        min="0"
                        id="sip-monthly"
                    />
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Expected Annual Return (%)
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="e.g. 12"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        min="0"
                        step="0.1"
                        id="sip-rate"
                    />
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Time Period (Years)
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="e.g. 10"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        min="0"
                        id="sip-years"
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="calc-btn" onClick={handleCalculate} id="sip-calculate">
                    Calculate
                </button>
                <button className="calc-btn-outline" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {result && (
                <div className="calc-result">
                    <div className="result-grid">
                        <div className="result-item">
                            <div className="result-item-label">Invested Amount</div>
                            <div className="result-item-value">{fmt(result.investedAmount)}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Estimated Returns</div>
                            <div className="result-item-value" style={{ color: "var(--success)" }}>
                                {fmt(result.estimatedReturns)}
                            </div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Total Value</div>
                            <div className="result-item-value" style={{ color: "var(--accent)" }}>
                                {fmt(result.totalValue)}
                            </div>
                        </div>
                    </div>

                    {/* Growth bar */}
                    <div style={{ marginTop: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                            <span>Invested ({investedPct}%)</span>
                            <span>Returns ({100 - investedPct}%)</span>
                        </div>
                        <div className="progress-bar" style={{ height: 12 }}>
                            <div
                                className="progress-fill"
                                style={{ width: `${investedPct}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
