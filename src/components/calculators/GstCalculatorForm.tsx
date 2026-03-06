"use client";

import { useState } from "react";
import { calculateGST, type GSTResult } from "@/lib/formulas";
import { GST_RATES } from "@/lib/constants";

export default function GstCalculatorForm() {
    const [amount, setAmount] = useState("");
    const [rate, setRate] = useState<number>(18);
    const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
    const [isInterState, setIsInterState] = useState(false);
    const [result, setResult] = useState<GSTResult | null>(null);

    function handleCalculate() {
        const a = parseFloat(amount);
        if (isNaN(a) || a <= 0) return;
        setResult(calculateGST(a, rate, mode, isInterState));
    }

    function handleReset() {
        setAmount("");
        setRate(18);
        setMode("exclusive");
        setIsInterState(false);
        setResult(null);
    }

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

    return (
        <div>
            <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Amount (₹)
                    </label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="e.g. 10000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        id="gst-amount"
                    />
                </div>

                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        GST Rate
                    </label>
                    <select
                        className="calc-select"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        id="gst-rate"
                    >
                        {GST_RATES.map((r) => (
                            <option key={r} value={r}>
                                {r}%
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Calculation Mode
                    </label>
                    <div className="tab-list">
                        <button
                            className={`tab-btn ${mode === "exclusive" ? "active" : ""}`}
                            onClick={() => setMode("exclusive")}
                            type="button"
                        >
                            GST Exclusive (Add GST)
                        </button>
                        <button
                            className={`tab-btn ${mode === "inclusive" ? "active" : ""}`}
                            onClick={() => setMode("inclusive")}
                            type="button"
                        >
                            GST Inclusive (Extract GST)
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--muted)" }}>
                        <input
                            type="checkbox"
                            checked={isInterState}
                            onChange={(e) => setIsInterState(e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: "var(--primary)" }}
                            id="gst-interstate"
                        />
                        Inter-State Supply (IGST)
                    </label>
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button className="calc-btn" onClick={handleCalculate} id="gst-calculate">
                    Calculate GST
                </button>
                <button className="calc-btn-outline" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {result && (
                <div className="calc-result">
                    <div className="result-grid">
                        <div className="result-item">
                            <div className="result-item-label">Net Amount</div>
                            <div className="result-item-value">{fmt(result.netAmount)}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Total Tax ({rate}%)</div>
                            <div className="result-item-value" style={{ color: "var(--warning)" }}>
                                {fmt(result.totalTax)}
                            </div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Total Amount</div>
                            <div className="result-item-value" style={{ color: "var(--accent)" }}>
                                {fmt(result.totalAmount)}
                            </div>
                        </div>
                    </div>

                    {/* Tax breakdown */}
                    <div style={{ marginTop: "1.25rem", background: "var(--background)", borderRadius: 10, padding: "1rem" }}>
                        <p style={{ color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 600, margin: "0 0 0.75rem" }}>
                            Tax Breakdown
                        </p>
                        <table className="calc-table">
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Rate</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isInterState ? (
                                    <tr>
                                        <td>IGST</td>
                                        <td>{rate}%</td>
                                        <td>{fmt(result.igst)}</td>
                                    </tr>
                                ) : (
                                    <>
                                        <tr>
                                            <td>CGST</td>
                                            <td>{rate / 2}%</td>
                                            <td>{fmt(result.cgst)}</td>
                                        </tr>
                                        <tr>
                                            <td>SGST</td>
                                            <td>{rate / 2}%</td>
                                            <td>{fmt(result.sgst)}</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
