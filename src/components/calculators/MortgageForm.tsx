"use client";

import { useState, useMemo } from "react";
import { calculateMortgage } from "@/lib/formulas";

export default function MortgageForm() {
    const [price, setPrice] = useState("400000");
    const [downPct, setDownPct] = useState("20");
    const [rate, setRate] = useState("6.5");
    const [term, setTerm] = useState("30");
    const [showExtras, setShowExtras] = useState(false);
    const [annualTax, setAnnualTax] = useState("3600");
    const [annualIns, setAnnualIns] = useState("1200");
    const [pmi, setPmi] = useState("0");
    const [hoa, setHoa] = useState("0");
    const [schedView, setSchedView] = useState<"monthly" | "yearly">("yearly");

    const result = useMemo(() => {
        const p = parseFloat(price);
        const d = parseFloat(downPct);
        const r = parseFloat(rate);
        const t = parseFloat(term);
        if (isNaN(p) || isNaN(d) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) return null;

        const extras = showExtras ? {
            annualTax: parseFloat(annualTax) || 0,
            annualInsurance: parseFloat(annualIns) || 0,
            monthlyPMI: parseFloat(pmi) || 0,
            monthlyHOA: parseFloat(hoa) || 0,
        } : undefined;

        return calculateMortgage(p, d, r, t, extras);
    }, [price, downPct, rate, term, showExtras, annualTax, annualIns, pmi, hoa]);

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    const fmtExact = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

    // Build yearly schedule summary
    const yearlySchedule = useMemo(() => {
        if (!result) return [];
        const years: { year: number; principal: number; interest: number; balance: number }[] = [];
        let yrPrincipal = 0, yrInterest = 0;
        for (const row of result.schedule) {
            yrPrincipal += row.principal;
            yrInterest += row.interest;
            if (row.month % 12 === 0 || row.month === result.schedule.length) {
                years.push({
                    year: Math.ceil(row.month / 12),
                    principal: Math.round(yrPrincipal),
                    interest: Math.round(yrInterest),
                    balance: row.balance,
                });
                yrPrincipal = 0;
                yrInterest = 0;
            }
        }
        return years;
    }, [result]);

    return (
        <div>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Home Price
                    </label>
                    <div className="input-wrapper">
                        <input type="text" inputMode="decimal" className="calc-input" placeholder="400000" value={price}
                            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))} id="mort-price" />
                        <span className="input-icon">$</span>
                    </div>
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Down Payment
                    </label>
                    <div className="input-wrapper">
                        <input type="text" inputMode="decimal" className="calc-input" placeholder="20" value={downPct}
                            onChange={(e) => setDownPct(e.target.value.replace(/[^0-9.]/g, ""))} id="mort-down" />
                        <span className="input-icon">%</span>
                    </div>
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Interest Rate
                    </label>
                    <div className="input-wrapper">
                        <input type="text" inputMode="decimal" className="calc-input" placeholder="6.5" value={rate}
                            onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))} id="mort-rate" />
                        <span className="input-icon">%</span>
                    </div>
                </div>
                <div>
                    <label style={{ color: "var(--muted)", display: "block", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                        Loan Term
                    </label>
                    <div className="input-wrapper">
                        <input type="text" inputMode="numeric" className="calc-input" placeholder="30" value={term}
                            onChange={(e) => setTerm(e.target.value.replace(/[^0-9]/g, ""))} id="mort-term" />
                        <span className="input-icon">yr</span>
                    </div>
                </div>
            </div>

            {/* Additional Costs Toggle */}
            <div style={{ marginTop: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--muted)" }}>
                    <input type="checkbox" checked={showExtras} onChange={(e) => setShowExtras(e.target.checked)}
                        style={{ width: 20, height: 20, accentColor: "var(--primary)" }} />
                    Include Additional Costs (Tax, Insurance, PMI, HOA)
                </label>
            </div>

            {showExtras && (
                <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr", marginTop: "1rem", padding: "1rem", background: "var(--background)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div>
                        <label style={{ color: "var(--muted)", display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.3rem" }}>
                            Annual Property Tax
                        </label>
                        <div className="input-wrapper">
                            <input type="text" inputMode="decimal" className="calc-input" placeholder="3600" value={annualTax}
                                onChange={(e) => setAnnualTax(e.target.value.replace(/[^0-9.]/g, ""))} />
                            <span className="input-icon">$</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ color: "var(--muted)", display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.3rem" }}>
                            Annual Insurance
                        </label>
                        <div className="input-wrapper">
                            <input type="text" inputMode="decimal" className="calc-input" placeholder="1200" value={annualIns}
                                onChange={(e) => setAnnualIns(e.target.value.replace(/[^0-9.]/g, ""))} />
                            <span className="input-icon">$</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ color: "var(--muted)", display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.3rem" }}>
                            Monthly PMI
                        </label>
                        <div className="input-wrapper">
                            <input type="text" inputMode="decimal" className="calc-input" placeholder="0" value={pmi}
                                onChange={(e) => setPmi(e.target.value.replace(/[^0-9.]/g, ""))} />
                            <span className="input-icon">$</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ color: "var(--muted)", display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.3rem" }}>
                            Monthly HOA
                        </label>
                        <div className="input-wrapper">
                            <input type="text" inputMode="decimal" className="calc-input" placeholder="0" value={hoa}
                                onChange={(e) => setHoa(e.target.value.replace(/[^0-9.]/g, ""))} />
                            <span className="input-icon">$</span>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div className="calc-result">
                    <div className="result-grid">
                        <div className="result-item">
                            <div className="result-item-label">Monthly Payment</div>
                            <div className="result-item-value" style={{ color: "var(--accent)" }}>
                                {fmtExact(result.monthlyPayment)}
                            </div>
                            {showExtras && result.monthlyPayment !== result.monthlyPI && (
                                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                                    P&I: {fmtExact(result.monthlyPI)}
                                    {result.extras.tax > 0 && <> · Tax: {fmtExact(result.extras.tax)}</>}
                                    {result.extras.insurance > 0 && <> · Ins: {fmtExact(result.extras.insurance)}</>}
                                    {result.extras.pmi > 0 && <> · PMI: {fmtExact(result.extras.pmi)}</>}
                                    {result.extras.hoa > 0 && <> · HOA: {fmtExact(result.extras.hoa)}</>}
                                </div>
                            )}
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Loan Amount</div>
                            <div className="result-item-value">{fmt(result.loanAmount)}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Total Interest</div>
                            <div className="result-item-value" style={{ color: "var(--warning)" }}>{fmt(result.totalInterest)}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Total Cost (P&I)</div>
                            <div className="result-item-value">{fmt(result.totalPayment)}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                            <span>Principal ({Math.round((result.loanAmount / result.totalPayment) * 100)}%)</span>
                            <span>Interest ({Math.round((result.totalInterest / result.totalPayment) * 100)}%)</span>
                        </div>
                        <div className="progress-bar" style={{ height: 12 }}>
                            <div className="progress-fill" style={{ width: `${(result.loanAmount / result.totalPayment) * 100}%` }} />
                        </div>
                    </div>

                    {/* Amortization Schedule */}
                    <div style={{ marginTop: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, color: "var(--foreground)" }}>
                                Amortization Schedule
                            </h4>
                            <div className="tab-list" style={{ marginBottom: 0, padding: 3 }}>
                                <button className={`tab-btn ${schedView === "yearly" ? "active" : ""}`}
                                    onClick={() => setSchedView("yearly")} type="button" style={{ minHeight: 32, fontSize: "0.8rem", padding: "0.25rem 0.75rem" }}>
                                    Yearly
                                </button>
                                <button className={`tab-btn ${schedView === "monthly" ? "active" : ""}`}
                                    onClick={() => setSchedView("monthly")} type="button" style={{ minHeight: 32, fontSize: "0.8rem", padding: "0.25rem 0.75rem" }}>
                                    Monthly
                                </button>
                            </div>
                        </div>
                        <div className="scrollable-table">
                            <table className="calc-table">
                                <thead>
                                    <tr>
                                        <th>{schedView === "yearly" ? "Year" : "Month"}</th>
                                        <th>Principal</th>
                                        <th>Interest</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedView === "yearly"
                                        ? yearlySchedule.map((row) => (
                                            <tr key={row.year}>
                                                <td>{row.year}</td>
                                                <td>{fmt(row.principal)}</td>
                                                <td>{fmt(row.interest)}</td>
                                                <td>{fmt(row.balance)}</td>
                                            </tr>
                                        ))
                                        : result.schedule.slice(0, 60).map((row) => (
                                            <tr key={row.month}>
                                                <td>{row.month}</td>
                                                <td>{fmtExact(row.principal)}</td>
                                                <td>{fmtExact(row.interest)}</td>
                                                <td>{fmt(row.balance)}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
