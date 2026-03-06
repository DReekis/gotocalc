"use client";

import { useState } from "react";
import { calculateMortgage, type MortgageResult } from "@/lib/formulas";

export default function MortgageForm() {
    const [price, setPrice] = useState("");
    const [downPct, setDownPct] = useState("20");
    const [rate, setRate] = useState("");
    const [term, setTerm] = useState("30");
    const [result, setResult] = useState<MortgageResult | null>(null);

    function handleCalculate() {
        const p = parseFloat(price);
        const d = parseFloat(downPct);
        const r = parseFloat(rate);
        const t = parseFloat(term);
        if (isNaN(p) || isNaN(d) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) return;
        setResult(calculateMortgage(p, d, r, t));
    }

    function handleReset() {
        setPrice("");
        setDownPct("20");
        setRate("");
        setTerm("30");
        setResult(null);
    }

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    const fmtExact = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

    return (
        <div>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Home Price ($)
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="e.g. 400000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        id="mort-price"
                    />
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Down Payment (%)
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="e.g. 20"
                        value={downPct}
                        onChange={(e) => setDownPct(e.target.value)}
                        min="0"
                        max="100"
                        id="mort-down"
                    />
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Interest Rate (%)
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="e.g. 6.5"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        min="0"
                        step="0.01"
                        id="mort-rate"
                    />
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Loan Term (Years)
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="e.g. 30"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        min="1"
                        id="mort-term"
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="calc-btn" onClick={handleCalculate} id="mort-calculate">
                    Calculate Mortgage
                </button>
                <button className="calc-btn-outline" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {result && (
                <div className="calc-result">
                    <div className="result-grid">
                        <div className="result-item">
                            <div className="result-item-label">Monthly Payment</div>
                            <div className="result-item-value" style={{ color: "var(--accent)" }}>
                                {fmtExact(result.monthlyPayment)}
                            </div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Loan Amount</div>
                            <div className="result-item-value">{fmt(result.loanAmount)}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Total Interest</div>
                            <div className="result-item-value" style={{ color: "var(--warning)" }}>
                                {fmt(result.totalInterest)}
                            </div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Total Cost</div>
                            <div className="result-item-value">{fmt(result.totalPayment)}</div>
                        </div>
                    </div>

                    {/* Principal vs Interest bar */}
                    <div style={{ marginTop: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                            <span>Principal ({Math.round((result.loanAmount / result.totalPayment) * 100)}%)</span>
                            <span>Interest ({Math.round((result.totalInterest / result.totalPayment) * 100)}%)</span>
                        </div>
                        <div className="progress-bar" style={{ height: 12 }}>
                            <div
                                className="progress-fill"
                                style={{ width: `${(result.loanAmount / result.totalPayment) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Amortization Schedule (first 12 months) */}
                    <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: "0 0 0.75rem", color: "var(--foreground)" }}>
                            Amortization Schedule (First 12 Months)
                        </h4>
                        <table className="calc-table">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Payment</th>
                                    <th>Principal</th>
                                    <th>Interest</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.schedule.map((row) => (
                                    <tr key={row.month}>
                                        <td>{row.month}</td>
                                        <td>{fmtExact(row.payment)}</td>
                                        <td>{fmtExact(row.principal)}</td>
                                        <td>{fmtExact(row.interest)}</td>
                                        <td>{fmt(row.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
