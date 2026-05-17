"use client";

import { useState, useEffect, useMemo, useRef } from "react";

interface Unit {
  id: string;
  label: string;
  symbol: string;
  factor?: number;
  isSpecial?: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  units: Unit[];
}

const CATEGORIES: Category[] = [
  {
    id: "length",
    label: "Length",
    icon: "📏",
    units: [
      { id: "mm", label: "Millimetre", symbol: "mm", factor: 0.001 },
      { id: "cm", label: "Centimetre", symbol: "cm", factor: 0.01 },
      { id: "m", label: "Metre", symbol: "m", factor: 1 },
      { id: "km", label: "Kilometre", symbol: "km", factor: 1000 },
      { id: "in", label: "Inch", symbol: "in", factor: 0.0254 },
      { id: "ft", label: "Foot", symbol: "ft", factor: 0.3048 },
      { id: "yd", label: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "mi", label: "Mile", symbol: "mi", factor: 1609.344 },
      { id: "nmi", label: "Nautical mile", symbol: "nmi", factor: 1852 },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    icon: "⚖️",
    units: [
      { id: "mg", label: "Milligram", symbol: "mg", factor: 0.000001 },
      { id: "g", label: "Gram", symbol: "g", factor: 0.001 },
      { id: "kg", label: "Kilogram", symbol: "kg", factor: 1 },
      { id: "t", label: "Metric tonne", symbol: "t", factor: 1000 },
      { id: "oz", label: "Ounce", symbol: "oz", factor: 0.0283495 },
      { id: "lb", label: "Pound", symbol: "lb", factor: 0.453592 },
      { id: "st", label: "Stone", symbol: "st", factor: 6.35029 },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    icon: "🌡️",
    units: [
      { id: "c", label: "Celsius", symbol: "°C", isSpecial: true },
      { id: "f", label: "Fahrenheit", symbol: "°F", isSpecial: true },
      { id: "k", label: "Kelvin", symbol: "K", isSpecial: true },
    ],
  },
  {
    id: "area",
    label: "Area",
    icon: "📐",
    units: [
      { id: "mm2", label: "Square millimetre", symbol: "mm²", factor: 0.000001 },
      { id: "cm2", label: "Square centimetre", symbol: "cm²", factor: 0.0001 },
      { id: "m2", label: "Square metre", symbol: "m²", factor: 1 },
      { id: "km2", label: "Square kilometre", symbol: "km²", factor: 1000000 },
      { id: "in2", label: "Square inch", symbol: "sq in", factor: 0.00064516 },
      { id: "ft2", label: "Square foot", symbol: "sq ft", factor: 0.092903 },
      { id: "yd2", label: "Square yard", symbol: "sq yd", factor: 0.836127 },
      { id: "ac", label: "Acre", symbol: "ac", factor: 4046.86 },
      { id: "ha", label: "Hectare", symbol: "ha", factor: 10000 },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    icon: "💧",
    units: [
      { id: "ml", label: "Millilitre", symbol: "ml", factor: 0.001 },
      { id: "cl", label: "Centilitre", symbol: "cl", factor: 0.01 },
      { id: "l", label: "Litre", symbol: "l", factor: 1 },
      { id: "m3", label: "Cubic metre", symbol: "m³", factor: 1000 },
      { id: "tsp", label: "Teaspoon (US)", symbol: "tsp", factor: 0.00492892 },
      { id: "tbsp", label: "Tablespoon (US)", symbol: "tbsp", factor: 0.0147868 },
      { id: "floz", label: "Fluid ounce (US)", symbol: "fl oz", factor: 0.0295735 },
      { id: "cup", label: "Cup (US)", symbol: "cup", factor: 0.236588 },
      { id: "pt", label: "Pint (US)", symbol: "pt", factor: 0.473176 },
      { id: "qt", label: "Quart (US)", symbol: "qt", factor: 0.946353 },
      { id: "gal", label: "Gallon (US)", symbol: "gal", factor: 3.78541 },
      { id: "galuk", label: "Gallon (UK)", symbol: "gal UK", factor: 4.54609 },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    icon: "🏎️",
    units: [
      { id: "ms", label: "Metres per second", symbol: "m/s", factor: 1 },
      { id: "kmh", label: "Kilometres per hour", symbol: "km/h", factor: 0.277778 },
      { id: "mph", label: "Miles per hour", symbol: "mph", factor: 0.44704 },
      { id: "kn", label: "Knot", symbol: "kn", factor: 0.514444 },
      { id: "fts", label: "Feet per second", symbol: "ft/s", factor: 0.3048 },
    ],
  },
  {
    id: "pressure",
    label: "Pressure",
    icon: "🎈",
    units: [
      { id: "pa", label: "Pascal", symbol: "Pa", factor: 1 },
      { id: "kpa", label: "Kilopascal", symbol: "kPa", factor: 1000 },
      { id: "bar", label: "Bar", symbol: "bar", factor: 100000 },
      { id: "psi", label: "Pound per square inch", symbol: "psi", factor: 6894.76 },
      { id: "atm", label: "Standard atmosphere", symbol: "atm", factor: 101325 },
      { id: "mmhg", label: "Millimetre of mercury", symbol: "mmHg", factor: 133.322 },
      { id: "inhg", label: "Inch of mercury", symbol: "inHg", factor: 3386.39 },
    ],
  },
  {
    id: "time",
    label: "Time",
    icon: "⏱️",
    units: [
      { id: "ms", label: "Millisecond", symbol: "ms", factor: 0.001 },
      { id: "s", label: "Second", symbol: "s", factor: 1 },
      { id: "min", label: "Minute", symbol: "min", factor: 60 },
      { id: "h", label: "Hour", symbol: "hr", factor: 3600 },
      { id: "d", label: "Day", symbol: "d", factor: 86400 },
      { id: "wk", label: "Week", symbol: "wk", factor: 604800 },
      { id: "mo", label: "Month", symbol: "mo", factor: 2629800 },
      { id: "yr", label: "Year", symbol: "yr", factor: 31536000 },
    ],
  },
  {
    id: "energy",
    label: "Energy",
    icon: "⚡",
    units: [
      { id: "j", label: "Joule", symbol: "J", factor: 1 },
      { id: "kj", label: "Kilojoule", symbol: "kJ", factor: 1000 },
      { id: "cal", label: "Gram calorie", symbol: "cal", factor: 4.184 },
      { id: "kcal", label: "Kilocalorie", symbol: "kcal", factor: 4184 },
      { id: "kwh", label: "Kilowatt-hour", symbol: "kWh", factor: 3600000 },
      { id: "btu", label: "British Thermal Unit", symbol: "BTU", factor: 1055.06 },
      { id: "ev", label: "Electronvolt", symbol: "eV", factor: 1.60218e-19 },
    ],
  },
  {
    id: "storage",
    label: "Data Storage",
    icon: "💾",
    units: [
      { id: "bit", label: "Bit", symbol: "bit", factor: 0.125 },
      { id: "B", label: "Byte", symbol: "B", factor: 1 },
      { id: "KB", label: "Kilobyte", symbol: "KB", factor: 1024 },
      { id: "MB", label: "Megabyte", symbol: "MB", factor: 1048576 },
      { id: "GB", label: "Gigabyte", symbol: "GB", factor: 1073741824 },
      { id: "TB", label: "Terabyte", symbol: "TB", factor: 1099511627776 },
      { id: "PB", label: "Petabyte", symbol: "PB", factor: 1125899906842624 },
    ],
  },
];

const QUICK_PAIRS: Record<string, [string, string][]> = {
  length: [
    ["cm", "in"],
    ["km", "mi"],
    ["m", "ft"],
    ["mm", "in"],
    ["mi", "km"],
  ],
  weight: [
    ["kg", "lb"],
    ["lb", "kg"],
    ["g", "oz"],
    ["oz", "g"],
    ["st", "kg"],
  ],
  temperature: [
    ["c", "f"],
    ["f", "c"],
    ["c", "k"],
    ["k", "c"],
  ],
  area: [
    ["m2", "ft2"],
    ["ft2", "m2"],
    ["ac", "ha"],
    ["ha", "ac"],
  ],
  volume: [
    ["l", "gal"],
    ["gal", "l"],
    ["ml", "floz"],
    ["cup", "ml"],
  ],
  speed: [
    ["kmh", "mph"],
    ["mph", "kmh"],
    ["ms", "kmh"],
    ["kn", "kmh"],
  ],
  pressure: [
    ["bar", "psi"],
    ["psi", "bar"],
    ["atm", "pa"],
    ["kpa", "psi"],
  ],
  time: [
    ["h", "min"],
    ["d", "h"],
    ["wk", "d"],
    ["yr", "d"],
  ],
  energy: [
    ["kcal", "kj"],
    ["kj", "kcal"],
    ["kwh", "j"],
    ["btu", "j"],
  ],
  storage: [
    ["MB", "GB"],
    ["GB", "MB"],
    ["GB", "TB"],
    ["KB", "MB"],
  ],
};

function formatResult(value: number): string {
  if (!Number.isFinite(value)) return "";
  const str = value.toPrecision(8);
  return Number.parseFloat(str).toString(); 
}

function sanitizeDecimalInput(value: string): string {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const parts = cleaned.split(".");
  const hasMinusAtStart = cleaned.startsWith("-");
  const withoutMinuses = parts.map(p => p.replace(/-/g, ""));
  
  let result = withoutMinuses[0];
  if (withoutMinuses.length > 1) {
    result += "." + withoutMinuses.slice(1).join("");
  }
  return hasMinusAtStart ? "-" + result : result;
}

export default function UnitConverterForm({
  defaultCategory,
  embedMode,
}: {
  defaultCategory: string;
  embedMode: boolean;
}) {
  const initialCategory = CATEGORIES.find((c) => c.id === defaultCategory) || CATEGORIES[0];

  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory.id);
  const [fromUnitId, setFromUnitId] = useState(initialCategory.units[0].id);
  const [toUnitId, setToUnitId] = useState(initialCategory.units[1].id);
  const [inputValue, setInputValue] = useState("");
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  const [embedOpen, setEmbedOpen] = useState(false);
  
  const [copyCodeStatus, setCopyCodeStatus] = useState("Copy code");
  const [copyResultStatus, setCopyResultStatus] = useState("Copy result");

  useEffect(() => {
    const category = CATEGORIES.find((c) => c.id === selectedCategoryId)!;
    setFromUnitId(category.units[0].id);
    setToUnitId(category.units[1].id);
    setInputValue("");
    setActiveInput("from");
  }, [selectedCategoryId]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategoryId)!;
  const fromUnit = activeCategory.units.find((u) => u.id === fromUnitId)!;
  const toUnit = activeCategory.units.find((u) => u.id === toUnitId)!;

  const performConversion = (val: number, fromU: Unit, toU: Unit): number => {
    if (activeCategory.id === "temperature") {
      let celsius = 0;
      if (fromU.id === "c") celsius = val;
      else if (fromU.id === "f") celsius = ((val - 32) * 5) / 9;
      else if (fromU.id === "k") celsius = val - 273.15;

      if (toU.id === "c") return celsius;
      if (toU.id === "f") return (celsius * 9) / 5 + 32;
      if (toU.id === "k") return celsius + 273.15;
    }
    return val * (fromU.factor! / toU.factor!);
  };

  const numericInput = Number.parseFloat(inputValue);
  const isInputValid = !Number.isNaN(numericInput);

  let fromValueNum = 0;
  let toValueNum = 0;
  let displayFromStr = "";
  let displayToStr = "";

  if (isInputValid) {
    if (activeInput === "from") {
      fromValueNum = numericInput;
      toValueNum = performConversion(fromValueNum, fromUnit, toUnit);
      displayFromStr = inputValue;
      displayToStr = formatResult(toValueNum);
    } else {
      toValueNum = numericInput;
      fromValueNum = performConversion(toValueNum, toUnit, fromUnit);
      displayToStr = inputValue;
      displayFromStr = formatResult(fromValueNum);
    }
  }

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    if (activeInput === "from") {
      setInputValue(displayToStr);
    } else {
      setInputValue(displayFromStr);
    }
    setActiveInput("from");
  };

  const handleQuickPair = (pair: [string, string]) => {
    setFromUnitId(pair[0]);
    setToUnitId(pair[1]);
    setActiveInput("from");
  };

  const copyToClipboard = (text: string, setter: (val: string) => void) => {
    navigator.clipboard.writeText(text);
    setter("Copied!");
    setTimeout(() => setter(setter === setCopyCodeStatus ? "Copy code" : "Copy result"), 2000);
  };

  const quickTableInputs = activeCategory.id === "temperature"
    ? [0, 10, 20, 37, 100]
    : activeCategory.id === "storage"
      ? [1, 10, 100, 500, 1000]
      : [1, 5, 10, 25, 50, 100];

  const quickPairs = QUICK_PAIRS[activeCategory.id] || [];

  return (
    <section>
      {!embedMode && (
        <div className="tab-list grade-tab-list" style={{ overflowX: "auto", flexWrap: "nowrap", WebkitOverflowScrolling: "touch" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`tab-btn grade-tab-btn ${selectedCategoryId === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategoryId(cat.id)}
              style={{ whiteSpace: "nowrap" }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      )}

      {embedMode && (
        <div style={{ marginBottom: "1rem", fontWeight: 600, fontSize: "1.2rem", color: "var(--fg)" }}>
          {activeCategory.icon} {activeCategory.label} Converter
        </div>
      )}

      <div className="grade-panel-stack">
        <div className="grade-editor-card">
          <div className="grade-field-grid compact" style={{ position: "relative" }}>
            <div>
              <label className="calc-label" htmlFor="from-unit-select">From</label>
              <select
                id="from-unit-select"
                className="calc-select"
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
              >
                {activeCategory.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label} ({u.symbol})
                  </option>
                ))}
              </select>
              <input
                type="text"
                inputMode="decimal"
                className="calc-input"
                style={{ fontSize: "1.5rem", height: "3.5rem", marginTop: "0.5rem" }}
                value={activeInput === "from" ? inputValue : displayFromStr}
                onChange={(e) => {
                  setInputValue(sanitizeDecimalInput(e.target.value));
                  setActiveInput("from");
                }}
                placeholder="0"
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <button
                type="button"
                className="calc-btn-outline"
                style={{ width: "48px", height: "48px", borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", margin: "1rem 0" }}
                onClick={handleSwap}
                aria-label="Swap units"
              >
                ⇄
              </button>
            </div>

            <div>
              <label className="calc-label" htmlFor="to-unit-select">To</label>
              <select
                id="to-unit-select"
                className="calc-select"
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
              >
                {activeCategory.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label} ({u.symbol})
                  </option>
                ))}
              </select>
              <input
                type="text"
                inputMode="decimal"
                className="calc-input"
                style={{ fontSize: "1.5rem", height: "3.5rem", marginTop: "0.5rem" }}
                value={activeInput === "to" ? inputValue : displayToStr}
                onChange={(e) => {
                  setInputValue(sanitizeDecimalInput(e.target.value));
                  setActiveInput("to");
                }}
                placeholder="0"
              />
            </div>
          </div>

          {quickPairs.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {quickPairs.map((pair) => (
                <button
                  key={`${pair[0]}-${pair[1]}`}
                  type="button"
                  className="calc-btn-outline"
                  style={{ padding: "0.25rem 0.75rem", fontSize: "0.85rem", borderRadius: "100px" }}
                  onClick={() => handleQuickPair(pair)}
                >
                  {activeCategory.units.find(u => u.id === pair[0])?.symbol} → {activeCategory.units.find(u => u.id === pair[1])?.symbol}
                </button>
              ))}
            </div>
          )}
        </div>

        {isInputValid && inputValue && (
          <div className="grade-result-card answer">
            <p className="grade-result-eyebrow">Result</p>
            <p className="grade-result-number" style={{ fontSize: "1.5rem" }}>
              {activeInput === "from" ? displayFromStr : displayToStr} {activeInput === "from" ? fromUnit.symbol : toUnit.symbol} = {activeInput === "from" ? displayToStr : displayFromStr} {activeInput === "from" ? toUnit.symbol : fromUnit.symbol}
            </p>
            <button
              type="button"
              className="calc-btn-outline grade-inline-btn"
              style={{ marginTop: "1rem" }}
              onClick={() => copyToClipboard(activeInput === "from" ? displayToStr : displayFromStr, setCopyResultStatus)}
            >
              {copyResultStatus}
            </button>
          </div>
        )}

        <div className="grade-table-card">
          <div className="grade-section-head">
            <h3>Common {activeCategory.label} conversions</h3>
          </div>
          <div className="scrollable-table">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>{fromUnit.label} ({fromUnit.symbol})</th>
                  <th>{toUnit.label} ({toUnit.symbol})</th>
                </tr>
              </thead>
              <tbody>
                {quickTableInputs.map(val => (
                  <tr key={val}>
                    <td>{val}</td>
                    <td style={{ fontWeight: 700, color: "var(--fg)" }}>
                      {formatResult(performConversion(val, fromUnit, toUnit))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!embedMode && (
          <div className="grade-context-card">
            <button
              type="button"
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, fontSize: "1rem", cursor: "pointer", width: "100%", textAlign: "left" }}
              onClick={() => setEmbedOpen(!embedOpen)}
            >
              Embed this calculator on your website {embedOpen ? "↑" : "↓"}
            </button>
            {embedOpen && (
              <div style={{ marginTop: "1rem" }}>
                <p className="grade-context-copy">
                  Copy the code below and paste it anywhere in your HTML. The embedded converter will automatically show the {activeCategory.label.toLowerCase()} category. Change the <code>category=</code> value to show any other unit type.
                </p>
                <pre
                  style={{
                    background: "var(--surface)",
                    color: "var(--fg)",
                    border: "1px solid var(--border)",
                    padding: "1rem",
                    borderRadius: "8px",
                    overflowX: "auto",
                    fontSize: "0.9rem",
                    fontFamily: "monospace",
                    marginTop: "1rem",
                    marginBottom: "1rem"
                  }}
                >
{`<iframe 
  src="https://gotocalc.online/tools/unit-converter?embed=1&category=${activeCategory.id}" 
  width="100%" 
  height="480" 
  frameborder="0" 
  style="border-radius:12px;border:1px solid #e5e5e5"
  title="Unit Converter by GoToCalc"
></iframe>`}
                </pre>
                <button
                  type="button"
                  className="calc-btn-outline grade-inline-btn"
                  onClick={() =>
                    copyToClipboard(
                      `<iframe \n  src="https://gotocalc.online/tools/unit-converter?embed=1&category=${activeCategory.id}" \n  width="100%" \n  height="480" \n  frameborder="0" \n  style="border-radius:12px;border:1px solid #e5e5e5"\n  title="Unit Converter by GoToCalc"\n></iframe>`,
                      setCopyCodeStatus
                    )
                  }
                >
                  {copyCodeStatus}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {embedMode && (
        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem" }}>
          <a href="https://gotocalc.online/tools/unit-converter" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Powered by GoToCalc
          </a>
        </div>
      )}
    </section>
  );
}
