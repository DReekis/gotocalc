"use client";

import { useMemo, useState } from "react";
import {
    calculatePriceByWeight,
    type WeightUnit,
    WEIGHT_UNIT_FACTORS_IN_GRAMS,
} from "@/lib/formulas";

const UNIT_OPTIONS: { value: WeightUnit; label: string }[] = [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
    { value: "lb", label: "Pound (lb)" },
    { value: "oz", label: "Ounce (oz)" },
];

const UNIT_SHORT_LABEL: Record<WeightUnit, string> = {
    kg: "kg",
    g: "g",
    lb: "lb",
    oz: "oz",
};

function sanitizeNumberInput(value: string): string {
    return value.replace(/[^0-9.]/g, "");
}

function formatAmount(value: number): string {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

function formatRate(value: number): string {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(value);
}

export default function PricePerWeightCalculatorForm() {
    const [pricePerUnit, setPricePerUnit] = useState("200");
    const [priceUnit, setPriceUnit] = useState<WeightUnit>("kg");
    const [quantity, setQuantity] = useState("750");
    const [quantityUnit, setQuantityUnit] = useState<WeightUnit>("g");

    const result = useMemo(() => {
        const unitPrice = parseFloat(pricePerUnit);
        const amount = parseFloat(quantity);
        if (!Number.isFinite(unitPrice) || !Number.isFinite(amount)) return null;
        if (unitPrice <= 0 || amount <= 0) return null;

        return calculatePriceByWeight(unitPrice, priceUnit, amount, quantityUnit);
    }, [pricePerUnit, priceUnit, quantity, quantityUnit]);

    return (
        <div>
            <div style={{ display: "grid", gap: "1rem" }}>
                <div
                    style={{
                        display: "grid",
                        gap: "1rem",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    }}
                >
                    <div>
                        <label
                            htmlFor="ppw-unit-price"
                            className="calc-label"
                        >
                            Price
                        </label>
                        <div className="input-wrapper">
                            <input
                                id="ppw-unit-price"
                                type="text"
                                inputMode="decimal"
                                className="calc-input"
                                placeholder="200"
                                value={pricePerUnit}
                                onChange={(e) =>
                                    setPricePerUnit(sanitizeNumberInput(e.target.value))
                                }
                            />
                            <span className="input-icon">/unit</span>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="ppw-price-unit"
                            className="calc-label"
                        >
                            Per Unit
                        </label>
                        <select
                            id="ppw-price-unit"
                            className="calc-select"
                            value={priceUnit}
                            onChange={(e) => setPriceUnit(e.target.value as WeightUnit)}
                        >
                            {UNIT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gap: "1rem",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    }}
                >
                    <div>
                        <label
                            htmlFor="ppw-quantity"
                            className="calc-label"
                        >
                            Quantity Needed
                        </label>
                        <input
                            id="ppw-quantity"
                            type="text"
                            inputMode="decimal"
                            className="calc-input"
                            placeholder="750"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(sanitizeNumberInput(e.target.value))
                            }
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="ppw-quantity-unit"
                            className="calc-label"
                        >
                            Quantity Unit
                        </label>
                        <select
                            id="ppw-quantity-unit"
                            className="calc-select"
                            value={quantityUnit}
                            onChange={(e) => setQuantityUnit(e.target.value as WeightUnit)}
                        >
                            {UNIT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {result && (
                <div className="calc-result">
                    <p
                        className="calc-result-value"
                        style={{ fontSize: "1.6rem", marginBottom: "1rem" }}
                    >
                        Total Price: {formatAmount(result.totalPrice)}
                    </p>

                    <div className="result-grid">
                        <div className="result-item">
                            <div className="result-item-label">Price Per kg</div>
                            <div className="result-item-value">{formatRate(result.pricePerKg)}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Price Per g</div>
                            <div className="result-item-value">{formatRate(result.pricePerG)}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Price Per lb</div>
                            <div className="result-item-value">{formatRate(result.pricePerLb)}</div>
                        </div>
                        <div className="result-item">
                            <div className="result-item-label">Price Per oz</div>
                            <div className="result-item-value">{formatRate(result.pricePerOz)}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem" }} className="formula-block">
                        {quantity} {UNIT_SHORT_LABEL[quantityUnit]} at {pricePerUnit} per{" "}
                        {UNIT_SHORT_LABEL[priceUnit]} = {formatAmount(result.totalPrice)}
                        <br />
                        Quantity in grams = {quantity} x{" "}
                        {WEIGHT_UNIT_FACTORS_IN_GRAMS[quantityUnit]} ={" "}
                        {result.quantityInGrams}
                        <br />
                        Price per gram = {pricePerUnit} /{" "}
                        {WEIGHT_UNIT_FACTORS_IN_GRAMS[priceUnit]} ={" "}
                        {result.pricePerGram}
                    </div>
                </div>
            )}
        </div>
    );
}
