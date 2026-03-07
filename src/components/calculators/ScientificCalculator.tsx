"use client";

import { useState, useCallback } from "react";

type Btn = { label: string; value: string; className: string };

const BUTTONS: Btn[] = [
    { label: "sin", value: "sin(", className: "sci-btn fn" },
    { label: "cos", value: "cos(", className: "sci-btn fn" },
    { label: "tan", value: "tan(", className: "sci-btn fn" },
    { label: "log", value: "log(", className: "sci-btn fn" },
    { label: "ln", value: "ln(", className: "sci-btn fn" },

    { label: "x²", value: "^2", className: "sci-btn fn" },
    { label: "xʸ", value: "^", className: "sci-btn fn" },
    { label: "√", value: "sqrt(", className: "sci-btn fn" },
    { label: "(", value: "(", className: "sci-btn op" },
    { label: ")", value: ")", className: "sci-btn op" },

    { label: "π", value: "3.14159265358979", className: "sci-btn fn" },
    { label: "e", value: "2.71828182845905", className: "sci-btn fn" },
    { label: "±", value: "NEG", className: "sci-btn fn" },
    { label: "C", value: "CLEAR", className: "sci-btn danger" },
    { label: "⌫", value: "BACK", className: "sci-btn danger" },

    { label: "7", value: "7", className: "sci-btn num" },
    { label: "8", value: "8", className: "sci-btn num" },
    { label: "9", value: "9", className: "sci-btn num" },
    { label: "÷", value: "/", className: "sci-btn op" },
    { label: "%", value: "%", className: "sci-btn op" },

    { label: "4", value: "4", className: "sci-btn num" },
    { label: "5", value: "5", className: "sci-btn num" },
    { label: "6", value: "6", className: "sci-btn num" },
    { label: "×", value: "*", className: "sci-btn op" },
    { label: "1/x", value: "1/(", className: "sci-btn fn" },

    { label: "1", value: "1", className: "sci-btn num" },
    { label: "2", value: "2", className: "sci-btn num" },
    { label: "3", value: "3", className: "sci-btn num" },
    { label: "−", value: "-", className: "sci-btn op" },
    { label: "!", value: "!", className: "sci-btn fn" },

    { label: "0", value: "0", className: "sci-btn num span2" },
    { label: ".", value: ".", className: "sci-btn num" },
    { label: "+", value: "+", className: "sci-btn op" },
    { label: "=", value: "EVAL", className: "sci-btn eq" },
];

function factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function safeEvaluate(expr: string): number {
    // Pre-process expression
    let e = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/π/g, "3.14159265358979")
        .replace(/(\d+)!/g, (_, n) => String(factorial(parseInt(n))))
        .replace(/%/g, "/100");

    // Handle implicit multiplication: 2(3) → 2*(3), )(→)*(
    e = e.replace(/(\d)\(/g, "$1*(");
    e = e.replace(/\)\(/g, ")*(");

    // Replace math functions
    e = e.replace(/sin\(([^)]+)\)/g, (_, a) => String(Math.sin(parseFloat(a) * Math.PI / 180)));
    e = e.replace(/cos\(([^)]+)\)/g, (_, a) => String(Math.cos(parseFloat(a) * Math.PI / 180)));
    e = e.replace(/tan\(([^)]+)\)/g, (_, a) => String(Math.tan(parseFloat(a) * Math.PI / 180)));
    e = e.replace(/log\(([^)]+)\)/g, (_, a) => String(Math.log10(parseFloat(a))));
    e = e.replace(/ln\(([^)]+)\)/g, (_, a) => String(Math.log(parseFloat(a))));
    e = e.replace(/sqrt\(([^)]+)\)/g, (_, a) => String(Math.sqrt(parseFloat(a))));

    // Handle power: a^b
    while (/(\d+\.?\d*)\^(\d+\.?\d*)/.test(e)) {
        e = e.replace(/(\d+\.?\d*)\^(\d+\.?\d*)/, (_, a, b) => String(Math.pow(parseFloat(a), parseFloat(b))));
    }

    // Safe eval using Function constructor (no access to global scope)
    try {
        // Only allow numbers, operators, parentheses, dots, and spaces
        if (/[^0-9+\-*/().eE\s]/.test(e)) return NaN;
        const fn = new Function(`"use strict"; return (${e})`);
        const result = fn();
        return typeof result === "number" ? result : NaN;
    } catch {
        return NaN;
    }
}

export default function ScientificCalculator() {
    const [expression, setExpression] = useState("0");
    const [result, setResult] = useState("");
    const [lastEvaluated, setLastEvaluated] = useState(false);

    const handleBtn = useCallback((value: string) => {
        if (value === "CLEAR") {
            setExpression("0");
            setResult("");
            setLastEvaluated(false);
            return;
        }

        if (value === "BACK") {
            setExpression((prev) => prev.length <= 1 ? "0" : prev.slice(0, -1));
            setResult("");
            setLastEvaluated(false);
            return;
        }

        if (value === "NEG") {
            setExpression((prev) => {
                if (prev.startsWith("-")) return prev.slice(1);
                return "-" + prev;
            });
            return;
        }

        if (value === "EVAL") {
            const r = safeEvaluate(expression);
            if (!isNaN(r) && isFinite(r)) {
                setResult(String(Math.round(r * 1e10) / 1e10));
                setLastEvaluated(true);
            } else {
                setResult("Error");
            }
            return;
        }

        setExpression((prev) => {
            if (lastEvaluated) {
                setLastEvaluated(false);
                // If typing a number after eval, start fresh; if operator, chain from result
                if (/[0-9.(]/.test(value)) {
                    setResult("");
                    return value;
                } else if (result && result !== "Error") {
                    setResult("");
                    return result + value;
                }
            }
            if (prev === "0" && value !== "." && !/[+\-*/^%]/.test(value)) return value;
            return prev + value;
        });
    }, [expression, result, lastEvaluated]);

    return (
        <div>
            <div className="sci-display" style={{ background: "var(--background)", border: "1.5px solid var(--border)", borderRadius: 12, marginBottom: "1rem", minHeight: 90, padding: "1rem 1.25rem", textAlign: "right" }}>
                <div className="sci-display-expr" style={{ color: "var(--muted)", fontFamily: "ui-monospace, monospace", fontSize: "0.9rem", minHeight: "1.2em", overflowX: "auto", whiteSpace: "nowrap" }}>{expression}</div>
                <div className="sci-display-result" style={{ color: "var(--accent)", fontFamily: "ui-monospace, monospace", fontSize: "2rem", fontWeight: 700, lineHeight: 1.3, overflowX: "auto", whiteSpace: "nowrap" }}>{result || "\u00A0"}</div>
            </div>
            <div className="sci-grid" style={{ display: "grid", gap: 6, gridTemplateColumns: "repeat(5, 1fr)" }}>
                {BUTTONS.map((btn, i) => (
                    <button
                        key={i}
                        type="button"
                        className={btn.className}
                        onClick={() => handleBtn(btn.value)}
                        title={btn.label}
                        style={{
                            alignItems: "center",
                            background: btn.className.includes("eq") ? "linear-gradient(135deg, var(--primary), var(--primary-light))" : btn.className.includes("num") ? "var(--background)" : "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            color: btn.className.includes("eq") ? "#fff" : btn.className.includes("danger") ? "#f87171" : btn.className.includes("op") ? "var(--primary-light)" : btn.className.includes("fn") ? "var(--accent)" : "var(--foreground)",
                            cursor: "pointer",
                            display: "flex",
                            fontFamily: "inherit",
                            fontSize: btn.className.includes("num") ? "1.1rem" : btn.className.includes("fn") ? "0.8rem" : "0.95rem",
                            fontWeight: btn.className.includes("num") || btn.className.includes("op") || btn.className.includes("eq") ? 600 : 500,
                            justifyContent: "center",
                            minHeight: 48,
                            padding: "0.5rem",
                            ...(btn.className.includes("span2") ? { gridColumn: "span 2" } : {}),
                        }}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
