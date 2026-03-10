"use client";

import { useState, useCallback } from "react";

/**
 * FE Exam Scientific Calculator
 * Replicates the Pearson VUE on-screen calculator used during the NCEES FE exam.
 *
 * Features: basic arithmetic, trig (deg/rad), log/ln, powers, roots,
 * constants (π, e), memory, parentheses, factorial, reciprocal, EE notation.
 */

type AngleMode = "DEG" | "RAD";

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}
function toDegrees(rad: number) {
  return (rad * 180) / Math.PI;
}

export default function Calculator({
  onClose,
}: {
  onClose: () => void;
}) {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [newEntry, setNewEntry] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: -1, y: -1 });

  // Initialize position on first render (centered)
  const initPosition = useCallback((el: HTMLDivElement | null) => {
    if (el && position.x === -1) {
      const rect = el.getBoundingClientRect();
      setPosition({
        x: Math.max(0, (window.innerWidth - rect.width) / 2),
        y: Math.max(0, (window.innerHeight - rect.height) / 2),
      });
    }
  }, [position.x]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = () => setIsDragging(false);

  const appendToDisplay = (val: string) => {
    if (newEntry) {
      setDisplay(val === "." ? "0." : val);
      setNewEntry(false);
    } else {
      if (val === "." && display.includes(".")) return;
      setDisplay(display === "0" && val !== "." ? val : display + val);
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
    setLastResult(null);
    setNewEntry(true);
  };

  const clearEntry = () => {
    setDisplay("0");
    setNewEntry(true);
  };

  const toggleSign = () => {
    if (display === "0") return;
    setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
  };

  const currentValue = () => parseFloat(display) || 0;

  const applyOperator = (op: string) => {
    const val = currentValue();
    if (lastResult !== null && expression && !newEntry) {
      // Chain: evaluate previous operation first
      const result = evaluate(lastResult, val, expression);
      setDisplay(formatResult(result));
      setLastResult(result);
    } else {
      setLastResult(val);
    }
    setExpression(op);
    setNewEntry(true);
  };

  const evaluate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : NaN;
      case "^": return Math.pow(a, b);
      case "ʸ√": return Math.pow(b, 1 / a);
      default: return b;
    }
  };

  const equals = () => {
    if (lastResult === null || !expression) return;
    const val = currentValue();
    const result = evaluate(lastResult, val, expression);
    setDisplay(formatResult(result));
    setLastResult(null);
    setExpression("");
    setNewEntry(true);
  };

  const formatResult = (n: number): string => {
    if (isNaN(n)) return "Error";
    if (!isFinite(n)) return "Error";
    // Use toPrecision for very large/small numbers
    if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-8 && n !== 0)) {
      return n.toExponential(8);
    }
    // Remove trailing zeros but keep reasonable precision
    const str = n.toPrecision(12);
    return parseFloat(str).toString();
  };

  // Scientific functions
  const applyUnary = (fn: (x: number) => number) => {
    const val = currentValue();
    const result = fn(val);
    setDisplay(formatResult(result));
    setNewEntry(true);
  };

  const trigFn = (fn: (x: number) => number) => {
    return (x: number) => {
      const input = angleMode === "DEG" ? toRadians(x) : x;
      return fn(input);
    };
  };

  const invTrigFn = (fn: (x: number) => number) => {
    return (x: number) => {
      const result = fn(x);
      return angleMode === "DEG" ? toDegrees(result) : result;
    };
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const insertConstant = (val: number) => {
    setDisplay(formatResult(val));
    setNewEntry(true);
  };

  const applyEE = () => {
    const val = currentValue();
    setLastResult(val);
    setExpression("EE");
    setDisplay("0");
    setNewEntry(true);
  };

  const equalsEE = () => {
    if (expression === "EE" && lastResult !== null) {
      const exp = currentValue();
      const result = lastResult * Math.pow(10, exp);
      setDisplay(formatResult(result));
      setLastResult(null);
      setExpression("");
      setNewEntry(true);
    } else {
      equals();
    }
  };

  // Button component
  const Btn = ({
    label,
    onClick,
    className = "",
    wide = false,
  }: {
    label: string;
    onClick: () => void;
    className?: string;
    wide?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`
        ${wide ? "col-span-2" : ""}
        px-1 py-2 rounded text-sm font-medium
        border border-gray-300
        active:scale-95 transition-transform
        select-none
        ${className}
      `}
    >
      {label}
    </button>
  );

  const expressionLabel =
    expression === "EE"
      ? `${lastResult} × 10^`
      : expression
        ? `${lastResult} ${expression}`
        : "";

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      <div
        ref={initPosition}
        className="pointer-events-auto absolute shadow-2xl rounded-lg border border-gray-400 bg-gray-100 select-none"
        style={{
          left: position.x === -1 ? "50%" : position.x,
          top: position.y === -1 ? "50%" : position.y,
          transform: position.x === -1 ? "translate(-50%, -50%)" : undefined,
          width: 340,
        }}
      >
        {/* Title bar (draggable) */}
        <div
          onMouseDown={handleMouseDown}
          className="flex items-center justify-between px-3 py-2 bg-indigo-700 text-white rounded-t-lg cursor-move"
        >
          <span className="text-sm font-semibold">FE Exam Calculator</span>
          <button
            onClick={onClose}
            className="text-white hover:text-red-300 text-lg leading-none font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-2 space-y-2">
          {/* Display */}
          <div className="bg-white border border-gray-400 rounded p-2 text-right font-mono">
            <div className="text-xs text-gray-400 h-4 truncate">
              {expressionLabel}
            </div>
            <div className="text-2xl truncate min-h-[2rem]">{display}</div>
          </div>

          {/* Mode / Memory indicators */}
          <div className="flex items-center justify-between text-xs px-1">
            <button
              onClick={() => setAngleMode(angleMode === "DEG" ? "RAD" : "DEG")}
              className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold border border-indigo-300 hover:bg-indigo-200"
            >
              {angleMode}
            </button>
            <span className="text-gray-500">
              {memory !== 0 && `M = ${formatResult(memory)}`}
            </span>
          </div>

          {/* Row 1: Memory & Clear */}
          <div className="grid grid-cols-6 gap-1">
            <Btn label="MC" onClick={() => setMemory(0)} className="bg-gray-200 text-gray-700 text-xs" />
            <Btn label="MR" onClick={() => { setDisplay(formatResult(memory)); setNewEntry(true); }} className="bg-gray-200 text-gray-700 text-xs" />
            <Btn label="M+" onClick={() => setMemory(memory + currentValue())} className="bg-gray-200 text-gray-700 text-xs" />
            <Btn label="M−" onClick={() => setMemory(memory - currentValue())} className="bg-gray-200 text-gray-700 text-xs" />
            <Btn label="CE" onClick={clearEntry} className="bg-red-100 text-red-700 text-xs" />
            <Btn label="C" onClick={clear} className="bg-red-200 text-red-800 text-xs font-bold" />
          </div>

          {/* Row 2: Scientific functions top */}
          <div className="grid grid-cols-6 gap-1">
            <Btn label="sin" onClick={() => applyUnary(trigFn(Math.sin))} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="cos" onClick={() => applyUnary(trigFn(Math.cos))} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="tan" onClick={() => applyUnary(trigFn(Math.tan))} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="ln" onClick={() => applyUnary(Math.log)} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="log" onClick={() => applyUnary(Math.log10)} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="n!" onClick={() => applyUnary(factorial)} className="bg-blue-50 text-blue-800 text-xs" />
          </div>

          {/* Row 3: Inverse trig + powers */}
          <div className="grid grid-cols-6 gap-1">
            <Btn label="sin⁻¹" onClick={() => applyUnary(invTrigFn(Math.asin))} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="cos⁻¹" onClick={() => applyUnary(invTrigFn(Math.acos))} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="tan⁻¹" onClick={() => applyUnary(invTrigFn(Math.atan))} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="eˣ" onClick={() => applyUnary(Math.exp)} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="10ˣ" onClick={() => applyUnary((x) => Math.pow(10, x))} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="1/x" onClick={() => applyUnary((x) => x !== 0 ? 1 / x : NaN)} className="bg-blue-50 text-blue-800 text-xs" />
          </div>

          {/* Row 4: More functions + top number row */}
          <div className="grid grid-cols-6 gap-1">
            <Btn label="x²" onClick={() => applyUnary((x) => x * x)} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="√x" onClick={() => applyUnary(Math.sqrt)} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="xʸ" onClick={() => applyOperator("^")} className="bg-blue-50 text-blue-800 text-xs" />
            <Btn label="π" onClick={() => insertConstant(Math.PI)} className="bg-purple-50 text-purple-800 text-xs" />
            <Btn label="e" onClick={() => insertConstant(Math.E)} className="bg-purple-50 text-purple-800 text-xs" />
            <Btn label="EE" onClick={applyEE} className="bg-purple-50 text-purple-800 text-xs" />
          </div>

          {/* Number pad + operators */}
          <div className="grid grid-cols-5 gap-1">
            {/* Row: ( ) ± ÷ */}
            <Btn label="(" onClick={() => appendToDisplay("(")} className="bg-gray-200 text-gray-800" />
            <Btn label=")" onClick={() => appendToDisplay(")")} className="bg-gray-200 text-gray-800" />
            <Btn label="±" onClick={toggleSign} className="bg-gray-200 text-gray-800" />
            <Btn label="÷" onClick={() => applyOperator("÷")} className="bg-amber-100 text-amber-900 font-bold" />
            <Btn label="⌫" onClick={() => {
              if (display.length > 1) setDisplay(display.slice(0, -1));
              else { setDisplay("0"); setNewEntry(true); }
            }} className="bg-red-100 text-red-700 text-xs" />

            {/* Row: 7 8 9 × */}
            <Btn label="7" onClick={() => appendToDisplay("7")} className="bg-white text-gray-900" />
            <Btn label="8" onClick={() => appendToDisplay("8")} className="bg-white text-gray-900" />
            <Btn label="9" onClick={() => appendToDisplay("9")} className="bg-white text-gray-900" />
            <Btn label="×" onClick={() => applyOperator("×")} className="bg-amber-100 text-amber-900 font-bold" />
            <Btn label="%" onClick={() => applyUnary((x) => x / 100)} className="bg-gray-200 text-gray-700 text-xs" />

            {/* Row: 4 5 6 - */}
            <Btn label="4" onClick={() => appendToDisplay("4")} className="bg-white text-gray-900" />
            <Btn label="5" onClick={() => appendToDisplay("5")} className="bg-white text-gray-900" />
            <Btn label="6" onClick={() => appendToDisplay("6")} className="bg-white text-gray-900" />
            <Btn label="−" onClick={() => applyOperator("-")} className="bg-amber-100 text-amber-900 font-bold" />
            <Btn label="³√x" onClick={() => applyUnary(Math.cbrt)} className="bg-blue-50 text-blue-800 text-xs" />

            {/* Row: 1 2 3 + */}
            <Btn label="1" onClick={() => appendToDisplay("1")} className="bg-white text-gray-900" />
            <Btn label="2" onClick={() => appendToDisplay("2")} className="bg-white text-gray-900" />
            <Btn label="3" onClick={() => appendToDisplay("3")} className="bg-white text-gray-900" />
            <Btn label="+" onClick={() => applyOperator("+")} className="bg-amber-100 text-amber-900 font-bold" />
            <Btn label="ʸ√x" onClick={() => applyOperator("ʸ√")} className="bg-blue-50 text-blue-800 text-xs" />

            {/* Row: 0 . = */}
            <Btn label="0" onClick={() => appendToDisplay("0")} className="bg-white text-gray-900" wide />
            <Btn label="." onClick={() => appendToDisplay(".")} className="bg-white text-gray-900" />
            <Btn label="=" onClick={equalsEE} className="bg-indigo-600 text-white font-bold" wide />
          </div>
        </div>
      </div>
    </div>
  );
}
