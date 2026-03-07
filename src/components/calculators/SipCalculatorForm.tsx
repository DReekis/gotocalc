"use client";

import { useState, useMemo } from "react";
import { calculateSIP } from "@/lib/formulas";

export default function SipCalculatorForm() {
    const [monthly, setMonthly] = useState("5000");
    const [rate, setRate] = useState("12");
    const [years, setYears] = useState("10");
    const [stepUp, setStepUp] = useState("0");
    const [showInflation, setShowInflation] = useState(false);
    const [inflation, setInflation] = useState("6");

    const result = useMemo(() => {
        const m = parseFloat(monthly);
        const r = parseFloat(rate);
        const y = parseFloat(years);
        const s = parseFloat(stepUp) || 0;
        const inf = showInflation ? parseFloat(inflation) || null : null;
        if (isNaN(m) || isNaN(r) || isNaN(y) || m <= 0 || r < 0 || y <= 0) return null;
        return calculateSIP(m, r, y, s, inf);
    }, [monthly, rate, years, stepUp, showInflation, inflation]);

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    const investedPct = result ? Math.round((result.investedAmount / result.totalValue) * 100) : 0;

    return (
        <div>
            <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Monthly Investment
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            inputMode="decimal"
                            className="calc-input"
                            placeholder="5000"
                            value={monthly}
                            onChange={(e) => setMonthly(e.target.value.replace(/[^0-9.]/g, ""))}
                            id="sip-monthly"
                        />
                        <span className="input-icon">₹</span>
                    </div>
                </div>
                <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                    <div>
                        <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                            Expected Annual Return
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                inputMode="decimal"
                                className="calc-input"
                                placeholder="12"
                                value={rate}
                                onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
                                id="sip-rate"
                            />
                            <span className="input-icon">%</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                            Time Period
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                inputMode="numeric"
                                className="calc-input"
                                placeholder="10"
                                value={years}
                                onChange={(e) => setYears(e.target.value.replace(/[^0-9]/g, ""))}
                                id="sip-years"
                            />
                            <span className="input-icon">yr</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Annual Step-Up
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            inputMode="decimal"
                            className="calc-input"
                            placeholder="0"
                            value={stepUp}
                            onChange={(e) => setStepUp(e.target.value.replace(/[^0-9.]/g, ""))}
                            id="sip-stepup"
                        />
                        <span className="input-icon">%</span>
                    </div>
                    <p style={{ color: "var(--muted)", fontSize: "0.75rem", margin: "0.3rem 0 0" }}>
                        Increase your monthly SIP by this % each year
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--muted)" }}>
                        <input
                            type="checkbox"
                            checked={showInflation}
                            onChange={(e) => setShowInflation(e.target.checked)}
                            style={{ width: 20, height: 20, accentColor: "var(--primary)" }}
                        />
                        Adjust for Inflation
                    </label>
                    {showInflation && (
                        <div className="input-wrapper" style={{ maxWidth: 120 }}>
                            <input
                                type="text"
                                inputMode="decimal"
                                className="calc-input"
                                placeholder="6"
                                value={inflation}
                                onChange={(e) => setInflation(e.target.value.replace(/[^0-9.]/g, ""))}
                                style={{ minHeight: 40 }}
                            />
                            <span className="input-icon">%</span>
                        </div>
                    )}
                </div>
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
                        {result.inflationAdjustedValue !== null && (
                            <div className="result-item">
                                <div className="result-item-label">Inflation-Adjusted</div>
                                <div className="result-item-value" style={{ color: "var(--warning)" }}>
                                    {fmt(result.inflationAdjustedValue)}
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                            <span>Invested ({investedPct}%)</span>
                            <span>Returns ({100 - investedPct}%)</span>
                        </div>
                        <div className="progress-bar" style={{ height: 12 }}>
                            <div className="progress-fill" style={{ width: `${investedPct}%` }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
