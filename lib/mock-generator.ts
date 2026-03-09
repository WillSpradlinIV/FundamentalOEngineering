import { Question } from "./types";

const DEFAULT_POOL_SIZE = 400;

// Mock question templates per FE section - no API calls needed
const questionPools: Record<string, Question[]> = {
  "Mathematics": [
    {
      id: "math-001",
      section: "Mathematics",
      difficulty: "easy",
      type: "mcq",
      prompt: "Solve for x: 2x + 5 = 13",
      choices: ["A) 2", "B) 4", "C) 6", "D) 8"],
      correctAnswer: "B",
      solutionOutline: "2x + 5 = 13 → 2x = 8 → x = 4",
      explanationCorrect: "Subtract 5 from both sides, then divide by 2",
      explanationCommonWrong: [
        "Forgetting to subtract 5 first",
        "Dividing 13 by 2 instead of solving step-by-step",
        "Sign error when subtracting"
      ],
      tags: ["linear-equations", "algebra"],
    },
    {
      id: "math-002",
      section: "Mathematics",
      difficulty: "medium",
      type: "mcq",
      prompt: "What is the derivative of f(x) = 3x² + 2x + 1?",
      choices: ["A) 6x + 1", "B) 6x + 2", "C) 3x + 2", "D) 9x + 2"],
      correctAnswer: "B",
      solutionOutline: "Apply power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(1) = 0",
      explanationCorrect: "Power rule: d/dx(x^n) = nx^(n-1)",
      explanationCommonWrong: [
        "Forgetting constant term disappears",
        "Miscounting coefficient in power rule",
        "Leaving constant coefficient in result"
      ],
      tags: ["calculus", "derivatives"],
    },
    {
      id: "math-004",
      section: "Mathematics",
      difficulty: "easy",
      type: "mcq",

      prompt: "Evaluate the integral: ∫ 4x dx",
      choices: ["A) 2x² + C", "B) 4x² + C", "C) 2x + C", "D) x² + C"],
      correctAnswer: "A",
      solutionOutline: "∫ 4x dx = 4 * (x²/2) + C = 2x² + C",
      explanationCorrect: "Apply the power rule for integration",
      explanationCommonWrong: [
        "Forgetting to divide by the new exponent",
        "Treating the integral like a derivative",
        "Dropping the constant of integration"
      ],
      tags: ["calculus", "integration"],
    },
    {
      id: "math-005",
      section: "Mathematics",
      difficulty: "easy",
      type: "mcq",
      prompt: "Solve for x: 5x − 15 = 0",
      choices: ["A) 0", "B) 3", "C) 5", "D) -3"],
      correctAnswer: "B",
      solutionOutline: "5x − 15 = 0 → 5x = 15 → x = 3",
      explanationCorrect: "Isolate x by adding 15, then divide by 5",
      explanationCommonWrong: [
        "Sign error when moving terms",
        "Dividing by the wrong coefficient",
        "Arithmetic mistake"
      ],
      tags: ["linear-equations", "algebra"],
    },
    {
      id: "math-003",
      section: "Mathematics",
      difficulty: "hard",
      type: "numeric",
      prompt: "A matrix A = [[2, 1], [1, 2]]. Calculate the determinant of A.",
      correctAnswer: 3,
      tolerance: 0.01,
      acceptedUnits: [],
      solutionOutline: "det(A) = (2)(2) - (1)(1) = 4 - 1 = 3",
      explanationCorrect: "For 2×2 matrix [[a,b],[c,d]], det = ad - bc",
      explanationCommonWrong: [
        "Confusing determinant formula with matrix multiplication",
        "Sign error in subtraction",
        "Incorrect element selection"
      ],
      tags: ["linear-algebra", "matrices"],
    },
  ],
  "Probability and Statistics": [
    {
      id: "stats-002",
      section: "Probability and Statistics",
      difficulty: "easy",
      type: "mcq",
      prompt: "A fair die is rolled once. What is the probability of rolling a number greater than 4?",
      choices: ["A) 1/6", "B) 1/3", "C) 1/2", "D) 2/3"],
      correctAnswer: "B",
      solutionOutline: "Outcomes >4 are {5,6} → 2 out of 6 = 1/3",
      explanationCorrect: "Count favorable outcomes over total outcomes",
      explanationCommonWrong: [
        "Counting only one favorable outcome",
        "Using 4 as a favorable outcome",
        "Inverting the fraction"
      ],
      tags: ["probability", "discrete"],
    },
    {
      id: "stats-003",
      section: "Probability and Statistics",
      difficulty: "medium",
      type: "mcq",
      prompt: "For a normal distribution, approximately what percentage of data lies within one standard deviation of the mean?",
      choices: ["A) 50%", "B) 68%", "C) 95%", "D) 99.7%"],
      correctAnswer: "B",
      solutionOutline: "Empirical rule: 68-95-99.7",
      explanationCorrect: "Within 1σ is about 68%",
      explanationCommonWrong: [
        "Confusing 1σ with 2σ",
        "Using the median rule instead of empirical rule",
        "Mixing up percentages"
      ],
      tags: ["statistics", "normal-distribution"],
    },
  ],
  "Engineering Economics": [
    {
      id: "econ-001",
      section: "Engineering Economics",
      difficulty: "medium",
      type: "numeric",
      prompt: "Calculate the present worth of a $1000 payment due in 3 years at 5% annual interest rate.",
      correctAnswer: 863.84,
      tolerance: 0.05,
      acceptedUnits: ["$"],
      solutionOutline: "PW = FV / (1 + r)^n = 1000 / (1.05)^3 = 1000 / 1.1576 ≈ 863.84",
      explanationCorrect: "Use present worth formula for future amount",
      explanationCommonWrong: [
        "Multiplying instead of dividing by discount factor",
        "Using wrong interest rate formula",
        "Miscalculating compound interest"
      ],
      tags: ["economics", "present-worth"],
    },
  ],
  "Statics": [
    {
      id: "statics-001",
      section: "Statics",
      difficulty: "medium",
      type: "numeric",
      prompt: "A 100 N force acts at 30° above the horizontal. What is the vertical component?",
      correctAnswer: 50,
      tolerance: 0.05,
      acceptedUnits: ["N"],
      solutionOutline: "F_y = F × sin(θ) = 100 × sin(30°) = 100 × 0.5 = 50 N",
      explanationCorrect: "Use sin for vertical (y) component",
      explanationCommonWrong: [
        "Using cos instead of sin",
        "Confusing angle reference (measured from horizontal vs vertical)",
        "Using wrong angle in calculation"
      ],
      tags: ["force-resolution", "components"],
    },
  ],
  "Fluid Mechanics": [
    {
      id: "fluid-001",
      section: "Fluid Mechanics",
      difficulty: "medium",
      type: "numeric",
      prompt: "Water flows through a pipe at velocity 2 m/s. If the pipe diameter is 100 mm, calculate the volumetric flow rate.",
      correctAnswer: 0.0157,
      tolerance: 0.05,
      acceptedUnits: ["m³/s"],
      solutionOutline: "Q = V × A = 2 m/s × π(0.05)² = 2 × 0.00785 ≈ 0.0157 m³/s",
      explanationCorrect: "Volumetric flow rate is velocity times cross-sectional area",
      explanationCommonWrong: [
        "Using diameter instead of radius in area calculation",
        "Forgetting π in circular area formula",
        "Unit conversion errors"
      ],
      tags: ["flow-rate", "continuity"],
    },
  ],
  "Thermodynamics and Heat Transfer": [
    {
      id: "thermo-001",
      section: "Thermodynamics and Heat Transfer",
      difficulty: "medium",
      type: "numeric",
      prompt: "Calculate heat transfer Q for 5 kg of water heated from 20°C to 80°C. (c = 4.18 kJ/kg·K)",
      correctAnswer: 1254,
      tolerance: 0.05,
      acceptedUnits: ["kJ"],
      solutionOutline: "Q = m × c × ΔT = 5 × 4.18 × (80-20) = 5 × 4.18 × 60 = 1,254 kJ",
      explanationCorrect: "Heat transfer: Q = mcΔT",
      explanationCommonWrong: [
        "Using temperature difference as Celsius instead of Kelvin",
        "Wrong specific heat value",
        "Forgetting to multiply by mass"
      ],
      tags: ["heat-transfer", "specific-heat"],
    },
  ],
  "Basic Electrical Engineering": [
    {
      id: "elec-001",
      section: "Basic Electrical Engineering",
      difficulty: "easy",
      type: "mcq",
      prompt: "A 12V battery supplies current to a 4Ω resistor. What is the current?",
      choices: ["A) 2 A", "B) 3 A", "C) 4 A", "D) 6 A"],
      correctAnswer: "B",
      solutionOutline: "V = IR → I = V/R = 12V / 4Ω = 3 A",
      explanationCorrect: "Ohm's Law: V = IR",
      explanationCommonWrong: [
        "Multiplying voltage and resistance instead of dividing",
        "Wrong formula arrangement",
        "Unit confusion"
      ],
      tags: ["ohms-law", "dc-circuits"],
    },
  ],
  "Chemistry": [
    {
      id: "chem-001",
      section: "Chemistry",
      difficulty: "easy",
      type: "mcq",
      prompt: "How many moles are in 18 grams of water (H₂O)? (Molar mass = 18 g/mol)",
      choices: ["A) 0.5 mol", "B) 1 mol", "C) 2 mol", "D) 18 mol"],
      correctAnswer: "B",
      solutionOutline: "n = mass / molar mass = 18 g / 18 g/mol = 1 mol",
      explanationCorrect: "Use molar mass to convert grams to moles",
      explanationCommonWrong: [
        "Confusing grams with moles directly",
        "Using wrong molar mass",
        "Dividing incorrectly"
      ],
      tags: ["stoichiometry", "molar-mass"],
    },
    {
      id: "chem-002",
      section: "Chemistry",
      difficulty: "medium",
      type: "mcq",
      prompt: "What is the pH of a solution with hydrogen ion concentration [H⁺] = 1×10⁻⁴ M?",
      choices: ["A) 2", "B) 3", "C) 4", "D) 10"],
      correctAnswer: "C",
      solutionOutline: "pH = −log10([H+]) = −log10(1×10⁻⁴) = 4",
      explanationCorrect: "Use the definition of pH",
      explanationCommonWrong: [
        "Using natural log instead of log10",
        "Dropping the negative sign",
        "Mistaking 10⁻⁴ for 10⁴"
      ],
      tags: ["chemistry", "ph"],
    },
  ],
  "Instrumentation and Controls": [
    {
      id: "inst-001",
      section: "Instrumentation and Controls",
      difficulty: "easy",
      type: "mcq",
      prompt: "A temperature sensor outputs 10 mV/°C. What voltage should it output at 25°C?",
      choices: ["A) 0.10 V", "B) 0.25 V", "C) 2.5 V", "D) 25 V"],
      correctAnswer: "B",
      solutionOutline: "V = (10 mV/°C) × 25°C = 250 mV = 0.25 V",
      explanationCorrect: "Multiply the sensitivity by temperature",
      explanationCommonWrong: [
        "Forgetting to convert mV to V",
        "Using 10 V/°C instead of 10 mV/°C",
        "Arithmetic error"
      ],
      tags: ["sensors", "calibration"],
    },
    {
      id: "inst-002",
      section: "Instrumentation and Controls",
      difficulty: "medium",
      type: "mcq",
      prompt: "A first-order system has time constant τ = 5 s. Approximately how long to reach 63.2% of final value?",
      choices: ["A) 1 s", "B) 5 s", "C) 10 s", "D) 15 s"],
      correctAnswer: "B",
      solutionOutline: "First-order response reaches 63.2% at t = τ",
      explanationCorrect: "Definition of time constant",
      explanationCommonWrong: [
        "Using 2τ or 3τ for 63.2%",
        "Confusing with 95% time",
        "Unit confusion"
      ],
      tags: ["controls", "first-order"],
    },
  ],
};

type Difficulty = "easy" | "medium" | "hard";
type TemplateFn = (seed: number, difficulty: Difficulty) => Question;

const DIFFICULTY_RATING: Record<Difficulty, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
};

const ESTIMATED_TIME_SEC: Record<Difficulty, number> = {
  easy: 120,
  medium: 150,
  hard: 180,
};

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}

function makeId(section: string, index: number) {
  const safe = section.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${safe}-${index}-${Date.now()}`;
}

function createMcqQuestion(params: {
  id: string;
  section: string;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  correctIndex: number;
  solutionOutline: string;
  explanationCorrect: string;
  explanationCommonWrong: string[];
  tags: string[];
}): Question {
  const letters = ["A", "B", "C", "D"];
  return {
    id: params.id,
    section: params.section as Question["section"],
    difficulty: params.difficulty,
    type: "mcq",
    prompt: params.prompt,
    choices: params.choices.map((c, i) => `${letters[i]}) ${c}`),
    correctAnswer: letters[params.correctIndex],
    solutionOutline: params.solutionOutline,
    explanationCorrect: params.explanationCorrect,
    explanationCommonWrong: params.explanationCommonWrong,
    tags: params.tags,
    generatedAt: new Date().toISOString(),
  };
}

function createNumericQuestion(params: {
  id: string;
  section: string;
  difficulty: Difficulty;
  prompt: string;
  correctAnswer: number;
  tolerance: number;
  acceptedUnits: string[];
  solutionOutline: string;
  explanationCorrect: string;
  explanationCommonWrong: string[];
  tags: string[];
}): Question {
  return {
    id: params.id,
    section: params.section as Question["section"],
    difficulty: params.difficulty,
    type: "numeric",
    prompt: params.prompt,
    correctAnswer: params.correctAnswer,
    tolerance: params.tolerance,
    acceptedUnits: params.acceptedUnits,
    solutionOutline: params.solutionOutline,
    explanationCorrect: params.explanationCorrect,
    explanationCommonWrong: params.explanationCommonWrong,
    tags: params.tags,
    generatedAt: new Date().toISOString(),
  };
}

const sectionTemplates: Record<string, TemplateFn[]> = {
  "Mathematics": [
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const a = Math.floor(rng() * 8) + 2;
      const b = Math.floor(rng() * 12) + 1;
      const x = Math.floor(rng() * 11) - 5; // -5 to 5
      const c = a * x + b;
      const choices = [x, x + 1, x - 1, x + 2].map((v) => v.toString());
      return createMcqQuestion({
        id: makeId("Mathematics", seed),
        section: "Mathematics",
        difficulty,
        prompt: `Solve for x: ${a}x + ${b} = ${c}`,
        choices,
        correctIndex: 0,
        solutionOutline: `${a}x + ${b} = ${c} → ${a}x = ${c - b} → x = ${x}`,
        explanationCorrect: "Isolate x by subtracting and dividing.",
        explanationCommonWrong: [
          "Forgetting to subtract b",
          "Dividing by the wrong coefficient",
          "Arithmetic error"
        ],
        tags: ["algebra", "linear-equations"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const k = Math.floor(rng() * 5) + 2;
      const choices = [`${2 * k}x`, `${k}x`, `${k}x^2`, `${2 * k}`];
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 1),
        section: "Mathematics",
        difficulty,
        prompt: `What is the derivative of f(x) = ${k}x²?`,
        choices,
        correctIndex: 0,
        solutionOutline: `d/dx(${k}x²) = ${2 * k}x`,
        explanationCorrect: "Apply the power rule.",
        explanationCommonWrong: [
          "Forgetting the exponent",
          "Leaving x² unchanged",
          "Dropping the coefficient"
        ],
        tags: ["calculus", "derivatives"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const h = Math.floor(rng() * 6) + 2;
      const k = Math.floor(rng() * 6) - 3;
      const r = Math.floor(rng() * 6) + 1;
      const choices = [r, r + 1, r - 1, r + 2].map((v) => v.toString());
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 2),
        section: "Mathematics",
        difficulty,
        prompt: `A circle has equation x² + y² - ${2 * h}x - ${2 * k}y + ${h * h + k * k - r * r} = 0. What is its radius?`,
        choices,
        correctIndex: 0,
        solutionOutline: `Complete the square to get (x-${h})² + (y-${k})² = ${r * r}. Radius = ${r}.`,
        explanationCorrect: "Complete the square to identify center and radius. Handbook: Mathematics → Analytic Geometry. Ctrl+F: circle equation.",
        explanationCommonWrong: [
          "Using h or k as the radius",
          "Sign error when completing the square",
          "Arithmetic mistake"
        ],
        tags: ["analytic-geometry", "circles"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const a = Math.floor(rng() * 6) + 1;
      const b = Math.floor(rng() * 6) + 1;
      const c = Math.floor(rng() * 6) + 1;
      const mag = Math.sqrt(a * a + b * b + c * c);
      const choices = [mag, mag + 1, mag - 1, mag + 2].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 3),
        section: "Mathematics",
        difficulty,
        prompt: `Find the magnitude of vector v = <${a}, ${b}, ${c}>.`,
        choices,
        correctIndex: 0,
        solutionOutline: `|v| = √(${a}²+${b}²+${c}²) = ${mag.toFixed(2)}`,
        explanationCorrect: "Use the 3D vector magnitude formula. Handbook: Mathematics → Vector Algebra. Ctrl+F: vector magnitude.",
        explanationCommonWrong: [
          "Adding components without squaring",
          "Forgetting the square root",
          "Arithmetic error"
        ],
        tags: ["vectors", "magnitude"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const a = Math.floor(rng() * 4) + 1;
      const b = Math.floor(rng() * 4) + 1;
      const c = Math.floor(rng() * 4) + 1;
      const d = Math.floor(rng() * 4) + 1;
      const e = Math.floor(rng() * 4) + 1;
      const f = Math.floor(rng() * 4) + 1;
      const m11 = a * d + b * f;
      const m12 = a * e + b * f;
      const m21 = c * d + d * f;
      const m22 = c * e + d * f;
      const choices = [
        `[${m11}, ${m12}; ${m21}, ${m22}]`,
        `[${m11 + 1}, ${m12}; ${m21}, ${m22}]`,
        `[${m11}, ${m12 + 1}; ${m21}, ${m22}]`,
        `[${m11}, ${m12}; ${m21 + 1}, ${m22}]`,
      ];
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 4),
        section: "Mathematics",
        difficulty,
        prompt: `Given A = [[${a}, ${b}], [${c}, ${d}]] and B = [[${d}, ${e}], [${f}, ${f}]], compute A×B.`,
        choices,
        correctIndex: 0,
        solutionOutline: "Multiply rows by columns.",
        explanationCorrect: "Matrix multiplication is row-by-column. Handbook: Mathematics → Linear Algebra. Ctrl+F: matrix multiplication.",
        explanationCommonWrong: [
          "Adding matrices instead of multiplying",
          "Mixing row/column order",
          "Arithmetic error"
        ],
        tags: ["linear-algebra", "matrix-multiplication"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const x0 = Math.floor(rng() * 4) + 1;
      const x1 = x0 - (x0 * x0 - 2) / (2 * x0); // Newton for sqrt(2)
      const x2 = x1 - (x1 * x1 - 2) / (2 * x1);
      const choices = [x2, x2 + 0.1, x2 - 0.1, x2 + 0.2].map((v) => v.toFixed(3));
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 5),
        section: "Mathematics",
        difficulty,
        prompt: `Use Newton’s method for f(x)=x²−2 with x₀=${x0}. What is x₂ (second iteration) to three decimals?`,
        choices,
        correctIndex: 0,
        solutionOutline: `x_{n+1}=x_n−f(x_n)/f'(x_n). Compute x₁ then x₂.`,
        explanationCorrect: "Apply Newton’s method twice. Handbook: Mathematics → Numerical Methods. Ctrl+F: Newton's method.",
        explanationCommonWrong: [
          "Using x₀ as final",
          "Wrong derivative",
          "Arithmetic error"
        ],
        tags: ["numerical-methods", "newton-raphson"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const c = Math.floor(rng() * 4) + 1;
      const y0 = Math.floor(rng() * 6) + 1;
      const C = y0 - c;
      const choices = [C, C + 1, C - 1, C + 2].map((v) => v.toString());
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 6),
        section: "Mathematics",
        difficulty,
        prompt: `Solve dy/dx = ${c} with y(0) = ${y0}. What is the constant C in y = ${c}x + C?`,
        choices,
        correctIndex: 0,
        solutionOutline: `y = ${c}x + C, y(0) = ${y0} → C = ${C}`,
        explanationCorrect: "Use the initial condition to find C. Handbook: Mathematics → Differential Equations. Ctrl+F: initial condition.",
        explanationCommonWrong: [
          "Using x instead of 0",
          "Sign error",
          "Arithmetic mistake"
        ],
        tags: ["differential-equations", "initial-condition"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const a = Math.floor(rng() * 6) + 3; // semi-major
      const b = Math.floor(rng() * (a - 1)) + 1; // semi-minor
      const e = Math.sqrt(1 - (b * b) / (a * a));
      const choices = [e, e + 0.1, e - 0.1, e + 0.2].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 7),
        section: "Mathematics",
        difficulty,
        prompt: `An ellipse has equation x²/${a * a} + y²/${b * b} = 1. What is its eccentricity e?`,
        choices,
        correctIndex: 0,
        solutionOutline: `e = √(1 - b²/a²) = √(1 - ${b * b}/${a * a}) = ${e.toFixed(2)}`,
        explanationCorrect: "Use the ellipse eccentricity formula. Handbook: Mathematics → Conic Sections. Ctrl+F: eccentricity.",
        explanationCommonWrong: [
          "Swapping a and b",
          "Forgetting the square root",
          "Arithmetic error"
        ],
        tags: ["conic-sections", "ellipse"],
      });
    },
    (seed, difficulty) => {
      const choices = ["1 + x + x²/2", "1 + x + x³/6", "x + x²/2", "1 + x²/2"]; 
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 8),
        section: "Mathematics",
        difficulty,
        prompt: "What are the first three nonzero terms of the Maclaurin series for e^x?",
        choices,
        correctIndex: 0,
        solutionOutline: "e^x = 1 + x + x²/2! + x³/3! + …",
        explanationCorrect: "Use the Maclaurin series for e^x. Handbook: Mathematics → Series. Ctrl+F: Maclaurin series.",
        explanationCommonWrong: [
          "Mixing with sin(x) series",
          "Skipping the constant term",
          "Wrong factorial"
        ],
        tags: ["series", "maclaurin"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const a = Math.floor(rng() * 6) + 1;
      const b = Math.floor(rng() * 6) + 1;
      const c = Math.floor(rng() * 6) + 1;
      const mag = Math.sqrt(a * a + b * b + c * c);
      const choices = [
        `<${(a / mag).toFixed(2)}, ${(b / mag).toFixed(2)}, ${(c / mag).toFixed(2)}>`,
        `<${(a / mag + 0.1).toFixed(2)}, ${(b / mag).toFixed(2)}, ${(c / mag).toFixed(2)}>`,
        `<${(a / mag).toFixed(2)}, ${(b / mag + 0.1).toFixed(2)}, ${(c / mag).toFixed(2)}>`,
        `<${(a / mag).toFixed(2)}, ${(b / mag).toFixed(2)}, ${(c / mag + 0.1).toFixed(2)}>`
      ];
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 9),
        section: "Mathematics",
        difficulty,
        prompt: `Find the unit vector in the direction of v = <${a}, ${b}, ${c}>.`,
        choices,
        correctIndex: 0,
        solutionOutline: "Unit vector = v / |v|",
        explanationCorrect: "Divide each component by the magnitude. Handbook: Mathematics → Vector Algebra. Ctrl+F: unit vector.",
        explanationCommonWrong: [
          "Forgetting to divide all components",
          "Using magnitude instead of components",
          "Arithmetic error"
        ],
        tags: ["vectors", "unit-vector"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const R = Math.floor(rng() * 6) + 5;
      const r = Math.floor(rng() * 4) + 2;
      const h = Math.floor(rng() * 6) + 4;
      const V = (Math.PI * h * (R * R + R * r + r * r)) / 3;
      const choices = [V, V + 10, V - 10, V + 20].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Mathematics", seed + 10),
        section: "Mathematics",
        difficulty,
        prompt: `Find the volume of a frustum of a cone with R=${R}, r=${r}, h=${h}.`,
        choices,
        correctIndex: 0,
        solutionOutline: "V = (πh/3)(R² + Rr + r²)",
        explanationCorrect: "Use frustum volume formula. Handbook: Mathematics → Areas & Volumes. Ctrl+F: frustum.",
        explanationCommonWrong: [
          "Using cylinder formula",
          "Forgetting the /3 factor",
          "Arithmetic error"
        ],
        tags: ["mensuration", "volume"],
      });
    },
  ],
  "Probability and Statistics": [
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const p = (Math.floor(rng() * 5) + 2) / 10; // 0.2-0.6
      const q = (Math.floor(rng() * 4) + 2) / 10; // 0.2-0.5
      const correct = Number((p * q).toFixed(2));
      const choices = [correct, p + q, p, q].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Probability and Statistics", seed),
        section: "Probability and Statistics",
        difficulty,
        prompt: `If P(A) = ${p} and P(B) = ${q}, and A and B are independent, what is P(A and B)?`,
        choices,
        correctIndex: 0,
        solutionOutline: `P(A∩B)=P(A)P(B)=${p}×${q}=${correct}`,
        explanationCorrect: "Independent events multiply.",
        explanationCommonWrong: [
          "Adding probabilities",
          "Using P(A) or P(B) only",
          "Confusing with union"
        ],
        tags: ["probability", "independence"],
      });
    },
    (seed, difficulty) => {
      const choices = ["50%", "68%", "95%", "99.7%"];
      return createMcqQuestion({
        id: makeId("Probability and Statistics", seed + 1),
        section: "Probability and Statistics",
        difficulty,
        prompt: "For a normal distribution, approximately what percentage of data lies within one standard deviation of the mean?",
        choices,
        correctIndex: 1,
        solutionOutline: "Empirical rule: 68-95-99.7",
        explanationCorrect: "Within 1σ is about 68%.",
        explanationCommonWrong: [
          "Using 2σ or 3σ instead",
          "Mixing the percentages",
          "Guessing without the rule"
        ],
        tags: ["statistics", "normal-distribution"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const n = 20;
      const p = 0.1;
      const k = 2;
      const comb = 190; // C(20,2)
      const prob = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
      const choices = [prob, prob + 0.05, prob - 0.05, prob + 0.1].map((v) => v.toFixed(3));
      return createMcqQuestion({
        id: makeId("Probability and Statistics", seed + 2),
        section: "Probability and Statistics",
        difficulty,
        prompt: "If 10% of parts are defective, what is the probability that exactly 2 in a sample of 20 are defective?",
        choices,
        correctIndex: 0,
        solutionOutline: "Use binomial: C(n,k)p^k(1-p)^{n-k}",
        explanationCorrect: "Apply the binomial distribution. Handbook: Probability & Statistics → Binomial. Ctrl+F: binomial distribution.",
        explanationCommonWrong: [
          "Using p instead of p^k",
          "Forgetting combination term",
          "Arithmetic error"
        ],
        tags: ["binomial", "discrete"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const z1 = 1.0;
      const z2 = 2.0;
      const area = 0.1359; // approx P(1<Z<2)
      const choices = [area, area + 0.05, area - 0.05, 0.3413].map((v) => v.toFixed(4));
      return createMcqQuestion({
        id: makeId("Probability and Statistics", seed + 3),
        section: "Probability and Statistics",
        difficulty,
        prompt: `For a standard normal variable Z, approximate P(${z1} < Z < ${z2}).`,
        choices,
        correctIndex: 0,
        solutionOutline: "Use Z-table: P(1<Z<2)=Φ(2)-Φ(1)",
        explanationCorrect: "Subtract cumulative probabilities from the Z-table. Handbook: Probability & Statistics → Normal Distribution. Ctrl+F: Z table.",
        explanationCommonWrong: [
          "Using Φ(2) only",
          "Subtracting in wrong order",
          "Using two-tailed value"
        ],
        tags: ["normal-distribution", "z-table"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const n = 10;
      const r = 4;
      const comb = 210; // C(10,4)
      const choices = [comb, 200, 120, 240].map((v) => v.toString());
      return createMcqQuestion({
        id: makeId("Probability and Statistics", seed + 4),
        section: "Probability and Statistics",
        difficulty,
        prompt: `How many ways can a ${r}-person committee be chosen from ${n} engineers?`,
        choices,
        correctIndex: 0,
        solutionOutline: `C(${n},${r}) = ${comb}`,
        explanationCorrect: "Use combinations for unordered selections. Handbook: Probability & Statistics → Combinations. Ctrl+F: nCr.",
        explanationCommonWrong: [
          "Using permutations",
          "Arithmetic error",
          "Using nPr instead of nCr"
        ],
        tags: ["combinations", "counting"],
      });
    },
    (seed, difficulty) => {
      const choices = ["Fail to reject", "Reject", "Insufficient data", "Always reject"];
      return createMcqQuestion({
        id: makeId("Probability and Statistics", seed + 5),
        section: "Probability and Statistics",
        difficulty,
        prompt: "A z-test yields z = 2.10 at α = 0.05 (two-tailed). What is the correct decision?",
        choices,
        correctIndex: 1,
        solutionOutline: "|z| > 1.96 → reject H₀",
        explanationCorrect: "Compare test statistic to critical value. Handbook: Probability & Statistics → Hypothesis Testing. Ctrl+F: z-test.",
        explanationCommonWrong: [
          "Using one-tailed critical value",
          "Comparing without absolute value",
          "Confusing α with p-value"
        ],
        tags: ["hypothesis-testing", "z-test"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const R1 = 0.9;
      const R2 = 0.8;
      const R3 = 0.95;
      const series = R1 * R2 * R3;
      const parallel = 1 - (1 - R1) * (1 - R2);
      const choices = [series, parallel, R1 + R2 + R3, R1 * R2].map((v) => v.toFixed(3));
      return createMcqQuestion({
        id: makeId("Probability and Statistics", seed + 6),
        section: "Probability and Statistics",
        difficulty,
        prompt: "Three components (R1=0.9, R2=0.8, R3=0.95) are in series. What is system reliability?",
        choices,
        correctIndex: 0,
        solutionOutline: "Series reliability = R1·R2·R3",
        explanationCorrect: "Multiply reliabilities in series. Handbook: Probability & Statistics → Reliability. Ctrl+F: series system.",
        explanationCommonWrong: [
          "Adding reliabilities",
          "Using parallel formula",
          "Arithmetic error"
        ],
        tags: ["reliability", "series"],
      });
    },
    (seed, difficulty) => {
      const data = [1, 2, 3];
      const mean = 2;
      const s2 = ((1 - mean) ** 2 + (2 - mean) ** 2 + (3 - mean) ** 2) / 2; // n-1
      const choices = [s2, s2 + 0.5, s2 - 0.5, 2].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Probability and Statistics", seed + 7),
        section: "Probability and Statistics",
        difficulty,
        prompt: "For data {1,2,3}, what is the sample variance s²?",
        choices,
        correctIndex: 0,
        solutionOutline: "Use n−1 in denominator for sample variance.",
        explanationCorrect: "Sample variance divides by n−1. Handbook: Probability & Statistics → Descriptive Stats. Ctrl+F: variance.",
        explanationCommonWrong: [
          "Using n instead of n−1",
          "Arithmetic error",
          "Using standard deviation instead of variance"
        ],
        tags: ["variance", "sample"],
      });
    },
  ],
  "Chemistry": [
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const mass = Math.floor(rng() * 20) + 10;
      const molar = 18;
      const n = Number((mass / molar).toFixed(2));
      const choices = [n, n + 0.5, n - 0.5, n + 1].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Chemistry", seed),
        section: "Chemistry",
        difficulty,
        prompt: `How many moles are in ${mass} grams of water (H₂O)? (Molar mass = 18 g/mol)`,
        choices,
        correctIndex: 0,
        solutionOutline: `n = mass / molar mass = ${mass}/18 = ${n}`,
        explanationCorrect: "Use molar mass to convert grams to moles.",
        explanationCommonWrong: [
          "Multiplying instead of dividing",
          "Using wrong molar mass",
          "Arithmetic error"
        ],
        tags: ["stoichiometry", "molar-mass"],
      });
    },
    (seed, difficulty) => {
      const powers = [2, 3, 4, 5];
      const exp = powers[seed % powers.length];
      return createMcqQuestion({
        id: makeId("Chemistry", seed + 1),
        section: "Chemistry",
        difficulty,
        prompt: `What is the pH of a solution with hydrogen ion concentration [H⁺] = 1×10⁻${exp} M?`,
        choices: [String(exp - 1), String(exp), String(exp + 1), "10"],
        correctIndex: 1,
        solutionOutline: `pH = −log10(1×10⁻${exp}) = ${exp}`,
        explanationCorrect: "Use pH definition with log10.",
        explanationCommonWrong: [
          "Dropping the negative sign",
          "Using ln instead of log10",
          "Confusing exponent"
        ],
        tags: ["chemistry", "ph"],
      });
    },
    (seed, difficulty) => {
      const choices = ["+6", "+3", "+2", "0"];
      return createMcqQuestion({
        id: makeId("Chemistry", seed + 2),
        section: "Chemistry",
        difficulty,
        prompt: "What is the oxidation state of Cr in K₂Cr₂O₇?",
        choices,
        correctIndex: 0,
        solutionOutline: "K = +1, O = −2. Solve for Cr in neutral compound.",
        explanationCorrect: "Oxidation state of Cr is +6. Handbook: Chemistry → Oxidation Numbers. Ctrl+F: oxidation state.",
        explanationCommonWrong: [
          "Using average of K or O only",
          "Sign error",
          "Arithmetic error"
        ],
        tags: ["redox", "oxidation"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const m1 = 10 + Math.floor(rng() * 10);
      const m2 = 5 + Math.floor(rng() * 10);
      const choices = ["Reactant A", "Reactant B", "Neither", "Both"];
      return createMcqQuestion({
        id: makeId("Chemistry", seed + 3),
        section: "Chemistry",
        difficulty,
        prompt: `A reaction requires 2 mol A per 1 mol B. If you have ${m1} mol A and ${m2} mol B, which is limiting?`,
        choices,
        correctIndex: m1 / 2 < m2 ? 0 : 1,
        solutionOutline: "Compare available moles to stoichiometric ratio.",
        explanationCorrect: "Limiting reactant is the one that runs out first. Handbook: Chemistry → Stoichiometry. Ctrl+F: limiting reactant.",
        explanationCommonWrong: [
          "Comparing moles directly",
          "Ignoring stoichiometric ratio",
          "Arithmetic error"
        ],
        tags: ["stoichiometry", "limiting-reactant"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const P = 1; // atm
      const V = 2 + (seed % 4); // L
      const n = 0.5 + (seed % 3) * 0.5; // mol
      const R = 0.0821;
      const T = (P * V) / (n * R);
      const choices = [T, T + 10, T - 10, T + 20].map((v) => v.toFixed(1));
      return createMcqQuestion({
        id: makeId("Chemistry", seed + 4),
        section: "Chemistry",
        difficulty,
        prompt: `Using PV = nRT, find T (K) for P=${P} atm, V=${V} L, n=${n} mol (R=0.0821).`,
        choices,
        correctIndex: 0,
        solutionOutline: `T = PV/(nR) = ${T.toFixed(1)} K`,
        explanationCorrect: "Apply the ideal gas law. Handbook: Chemistry → Gas Laws. Ctrl+F: PV=nRT.",
        explanationCommonWrong: [
          "Multiplying instead of dividing",
          "Unit inconsistency",
          "Arithmetic error"
        ],
        tags: ["gas-laws", "ideal-gas"],
      });
    },
    (seed, difficulty) => {
      const Ered = 0.34; // Cu2+/Cu
      const Eox = -0.76; // Zn2+/Zn
      const Ecell = Ered - Eox;
      const choices = [Ecell, Ecell - 0.5, Ecell + 0.5, 0.34].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Chemistry", seed + 5),
        section: "Chemistry",
        difficulty,
        prompt: "Given E°(Cu²⁺/Cu)=+0.34 V and E°(Zn²⁺/Zn)=−0.76 V, what is E°cell?",
        choices,
        correctIndex: 0,
        solutionOutline: `E°cell = E°cathode − E°anode = 0.34 − (−0.76) = ${Ecell.toFixed(2)} V`,
        explanationCorrect: "Subtract anode potential. Handbook: Chemistry → Electrochemistry. Ctrl+F: cell potential.",
        explanationCommonWrong: [
          "Adding instead of subtracting",
          "Swapping anode/cathode",
          "Sign error"
        ],
        tags: ["electrochemistry", "cell-potential"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const I = 2; // A
      const t = 600; // s
      const F = 96485;
      const M = 63.55; // Cu
      const n = 2;
      const m = (I * t * M) / (n * F);
      const choices = [m, m + 1, m - 1, m + 2].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Chemistry", seed + 6),
        section: "Chemistry",
        difficulty,
        prompt: "Using Faraday’s Law, how many grams of Cu are plated by 2 A for 10 min? (M=63.55, n=2)",
        choices,
        correctIndex: 0,
        solutionOutline: "m = (ItM)/(nF)",
        explanationCorrect: "Apply Faraday’s law. Handbook: Chemistry → Electrochemistry. Ctrl+F: Faraday’s law.",
        explanationCommonWrong: [
          "Using minutes instead of seconds",
          "Forgetting n",
          "Arithmetic error"
        ],
        tags: ["faraday", "plating"],
      });
    },
    (seed, difficulty) => {
      const C = 200; // mg/L as CaCO3
      const meq = C / 50;
      const choices = [meq, meq + 1, meq - 1, meq + 2].map((v) => v.toFixed(1));
      return createMcqQuestion({
        id: makeId("Chemistry", seed + 7),
        section: "Chemistry",
        difficulty,
        prompt: "Convert 200 mg/L as CaCO₃ to meq/L.",
        choices,
        correctIndex: 0,
        solutionOutline: "meq/L = (mg/L) / 50 = 4.0",
        explanationCorrect: "Use 50 mg/meq for CaCO₃. Handbook: Chemistry → Water Chemistry. Ctrl+F: hardness.",
        explanationCommonWrong: [
          "Multiplying instead of dividing",
          "Using wrong equivalent weight",
          "Arithmetic error"
        ],
        tags: ["water-chemistry", "hardness"],
      });
    },
    (seed, difficulty) => {
      const y = 0.25;
      const P = 2.0;
      const Pi = y * P;
      const choices = [Pi, Pi + 0.5, Pi - 0.5, P].map((v) => v.toFixed(2));
      return createMcqQuestion({
        id: makeId("Chemistry", seed + 8),
        section: "Chemistry",
        difficulty,
        prompt: "A gas mixture has total pressure 2.0 atm with mole fraction of O₂ = 0.25. What is the partial pressure of O₂?",
        choices,
        correctIndex: 0,
        solutionOutline: "P_i = y_i P_total = 0.25 × 2.0 = 0.50 atm",
        explanationCorrect: "Use Dalton’s law. Handbook: Chemistry → Gas Mixtures. Ctrl+F: partial pressure.",
        explanationCommonWrong: [
          "Adding pressures",
          "Using 1−y instead of y",
          "Arithmetic error"
        ],
        tags: ["gas-mixtures", "dalton"],
      });
    },
  ],
  "Instrumentation and Controls": [
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const sensitivity = 5 + Math.floor(rng() * 6); // mV/°C
      const temp = 10 + Math.floor(rng() * 41); // °C
      const volts = (sensitivity * temp) / 1000;
      return createMcqQuestion({
        id: makeId("Instrumentation and Controls", seed),
        section: "Instrumentation and Controls",
        difficulty,
        prompt: `A temperature sensor outputs ${sensitivity} mV/°C. What voltage should it output at ${temp}°C?`,
        choices: [volts.toFixed(2), (volts * 10).toFixed(2), (volts / 10).toFixed(2), temp.toFixed(2)],
        correctIndex: 0,
        solutionOutline: `V = ${sensitivity} mV/°C × ${temp}°C = ${(sensitivity * temp)} mV = ${volts.toFixed(2)} V`,
        explanationCorrect: "Multiply sensitivity by temperature and convert mV to V.",
        explanationCommonWrong: [
          "Skipping mV→V conversion",
          "Multiplying by 10 instead of dividing",
          "Arithmetic error"
        ],
        tags: ["sensors", "calibration"],
      });
    },
    (seed, difficulty) => {
      const tau = 2 + (seed % 8);
      return createMcqQuestion({
        id: makeId("Instrumentation and Controls", seed + 1),
        section: "Instrumentation and Controls",
        difficulty,
        prompt: `A first-order system has time constant τ = ${tau} s. Approximately how long to reach 63.2% of final value?`,
        choices: ["1 s", `${tau} s`, `${2 * tau} s`, `${3 * tau} s`],
        correctIndex: 1,
        solutionOutline: "First-order response reaches 63.2% at t = τ",
        explanationCorrect: "Definition of time constant.",
        explanationCommonWrong: [
          "Using 2τ or 3τ",
          "Confusing with 95% time",
          "Unit confusion"
        ],
        tags: ["controls", "first-order"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const bits = 8 + (seed % 5); // 8-12 bits
      const vref = 5;
      const res = vref / Math.pow(2, bits);
      const choices = [res, res * 2, res / 2, vref].map((v) => v.toFixed(4));
      return createMcqQuestion({
        id: makeId("Instrumentation and Controls", seed + 2),
        section: "Instrumentation and Controls",
        difficulty,
        prompt: `What is the voltage resolution of a ${bits}-bit ADC with a ${vref} V range?`,
        choices,
        correctIndex: 0,
        solutionOutline: `Resolution = Vref / 2^N = ${res.toFixed(4)} V`,
        explanationCorrect: "ADC resolution uses 2^N levels. Handbook: Instrumentation & Controls → Data Acquisition. Ctrl+F: ADC resolution.",
        explanationCommonWrong: [
          "Using 2N instead of 2^N",
          "Forgetting units",
          "Arithmetic error"
        ],
        tags: ["adc", "resolution"],
      });
    },
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const vin = 1 + (seed % 5);
      const r1 = 1 + (seed % 4);
      const r2 = 2 + (seed % 4);
      const vout = -(r2 / r1) * vin;
      const choices = [vout, -vin, vin, vout + 1].map((v) => v.toFixed(1));
      return createMcqQuestion({
        id: makeId("Instrumentation and Controls", seed + 3),
        section: "Instrumentation and Controls",
        difficulty,
        prompt: `An inverting op-amp has R1=${r1} kΩ and R2=${r2} kΩ with Vin=${vin} V. What is Vout?`,
        choices,
        correctIndex: 0,
        solutionOutline: `Vout = -(R2/R1)Vin = ${vout.toFixed(1)} V`,
        explanationCorrect: "Use inverting amplifier gain. Handbook: Instrumentation & Controls → Op-Amps. Ctrl+F: inverting amplifier.",
        explanationCommonWrong: [
          "Missing the negative sign",
          "Swapping R1 and R2",
          "Arithmetic error"
        ],
        tags: ["op-amp", "gain"],
      });
    },
    (seed, difficulty) => {
      const dec = 13 + (seed % 8);
      const bin = dec.toString(2);
      const choices = [bin, (dec + 1).toString(2), (dec - 1).toString(2), (dec + 2).toString(2)];
      return createMcqQuestion({
        id: makeId("Instrumentation and Controls", seed + 4),
        section: "Instrumentation and Controls",
        difficulty,
        prompt: `Convert decimal ${dec} to binary.`,
        choices,
        correctIndex: 0,
        solutionOutline: `Binary representation of ${dec} is ${bin}`,
        explanationCorrect: "Convert by repeated division by 2. Handbook: Instrumentation & Controls → Digital Systems. Ctrl+F: binary.",
        explanationCommonWrong: [
          "Bit order reversed",
          "Off-by-one error",
          "Arithmetic error"
        ],
        tags: ["binary", "digital"],
      });
    },
    (seed, difficulty) => {
      const zeta = [0.2, 0.5, 1.0, 1.5][seed % 4];
      const choices = ["Underdamped", "Critically damped", "Overdamped", "Unstable"];
      const correctIndex = zeta < 1 ? 0 : zeta === 1 ? 1 : 2;
      return createMcqQuestion({
        id: makeId("Instrumentation and Controls", seed + 5),
        section: "Instrumentation and Controls",
        difficulty,
        prompt: `A second-order system has damping ratio ζ = ${zeta}. What is the response type?`,
        choices,
        correctIndex,
        solutionOutline: "ζ<1 underdamped, ζ=1 critical, ζ>1 overdamped",
        explanationCorrect: "Classify based on ζ. Handbook: Instrumentation & Controls → Second-Order Systems. Ctrl+F: damping ratio.",
        explanationCommonWrong: [
          "Swapping categories",
          "Treating ζ=1 as underdamped",
          "Ignoring ζ definition"
        ],
        tags: ["damping", "stability"],
      });
    },
    (seed, difficulty) => {
      const choices = ["25°C", "50°C", "75°C", "100°C"];
      return createMcqQuestion({
        id: makeId("Instrumentation and Controls", seed + 6),
        section: "Instrumentation and Controls",
        difficulty,
        prompt: "Given a Type K thermocouple table snippet: 1.0 mV → 25°C, 2.0 mV → 50°C. Approximate temperature at 1.5 mV.",
        choices,
        correctIndex: 1,
        solutionOutline: "Linear interpolation between table values.",
        explanationCorrect: "Interpolate from provided table. Handbook: Instrumentation & Controls → Thermocouples. Ctrl+F: Type K table.",
        explanationCommonWrong: [
          "Picking nearest value",
          "Using wrong table scale",
          "Arithmetic error"
        ],
        tags: ["thermocouple", "tables"],
      });
    },
  ],
  "Engineering Economics": [
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const fv = 500 + Math.floor(rng() * 1500);
      const r = (5 + Math.floor(rng() * 6)) / 100;
      const n = 2 + (seed % 5);
      const pw = Number((fv / Math.pow(1 + r, n)).toFixed(2));
      return createNumericQuestion({
        id: makeId("Engineering Economics", seed),
        section: "Engineering Economics",
        difficulty,
        prompt: `Calculate the present worth of a $${fv} payment due in ${n} years at ${(r * 100).toFixed(0)}% annual interest.`,
        correctAnswer: pw,
        tolerance: 0.05,
        acceptedUnits: ["$"],
        solutionOutline: `PW = FV/(1+r)^n = ${fv}/(1+${r})^${n} = ${pw}`,
        explanationCorrect: "Use present worth formula.",
        explanationCommonWrong: [
          "Multiplying instead of dividing",
          "Using simple interest",
          "Power error"
        ],
        tags: ["economics", "present-worth"],
      });
    },
  ],
  "Statics": [
    (seed, difficulty) => {
      const rng = mulberry32(seed);
      const f = 50 + Math.floor(rng() * 100);
      const theta = [30, 45, 60][seed % 3];
      const fy = Number((f * Math.sin((theta * Math.PI) / 180)).toFixed(2));
      return createNumericQuestion({
        id: makeId("Statics", seed),
        section: "Statics",
        difficulty,
        prompt: `A ${f} N force acts at ${theta}° above the horizontal. What is the vertical component?`,
        correctAnswer: fy,
        tolerance: 0.05,
        acceptedUnits: ["N"],
        solutionOutline: `F_y = F sin(θ) = ${f} sin(${theta}°) = ${fy} N`,
        explanationCorrect: "Use sin for vertical component.",
        explanationCommonWrong: [
          "Using cos instead of sin",
          "Wrong angle reference",
          "Arithmetic error"
        ],
        tags: ["force-resolution", "components"],
      });
    },
  ],
  "Dynamics": [
    (seed, difficulty) => {
      const m = 2 + (seed % 8);
      const f = 10 + (seed % 10) * 5;
      const a = Number((f / m).toFixed(2));
      return createNumericQuestion({
        id: makeId("Dynamics", seed),
        section: "Dynamics",
        difficulty,
        prompt: `An object with mass ${m} kg experiences a net force of ${f} N. What is its acceleration?`,
        correctAnswer: a,
        tolerance: 0.05,
        acceptedUnits: ["m/s²"],
        solutionOutline: `a = F/m = ${f}/${m} = ${a} m/s²`,
        explanationCorrect: "Newton's second law.",
        explanationCommonWrong: [
          "Multiplying instead of dividing",
          "Unit confusion",
          "Arithmetic error"
        ],
        tags: ["newtons-laws", "kinematics"],
      });
    },
  ],
  "Strength of Materials": [
    (seed, difficulty) => {
      const area = 40 + (seed % 6) * 10;
      const stress = 150 + (seed % 6) * 25;
      const force = Number((stress * area).toFixed(0));
      return createNumericQuestion({
        id: makeId("Strength of Materials", seed),
        section: "Strength of Materials",
        difficulty,
        prompt: `A rod with cross-sectional area ${area} mm² experiences a tensile stress of ${stress} MPa. Calculate the tensile force.`,
        correctAnswer: force,
        tolerance: 0.05,
        acceptedUnits: ["N"],
        solutionOutline: `F = σA = ${stress} MPa × ${area} mm² = ${force} N`,
        explanationCorrect: "Stress is force per area.",
        explanationCommonWrong: [
          "Dividing instead of multiplying",
          "Unit conversion errors",
          "Arithmetic error"
        ],
        tags: ["stress", "tensile-force"],
      });
    },
  ],
  "Materials": [
    (seed, difficulty) => {
      return createMcqQuestion({
        id: makeId("Materials", seed),
        section: "Materials",
        difficulty,
        prompt: "Which material property is most directly related to resistance to deformation under load?",
        choices: ["Elastic modulus", "Thermal conductivity", "Electrical resistivity", "Density"],
        correctIndex: 0,
        solutionOutline: "Elastic modulus measures stiffness.",
        explanationCorrect: "Elastic modulus quantifies stiffness.",
        explanationCommonWrong: [
          "Confusing thermal and mechanical properties",
          "Selecting unrelated property",
          "Guessing"
        ],
        tags: ["materials", "stiffness"],
      });
    },
  ],
  "Fluid Mechanics": [
    (seed, difficulty) => {
      const v = 1 + (seed % 4);
      const d = 0.05 + (seed % 5) * 0.01;
      const area = Math.PI * (d / 2) * (d / 2);
      const q = Number((v * area).toFixed(4));
      return createNumericQuestion({
        id: makeId("Fluid Mechanics", seed),
        section: "Fluid Mechanics",
        difficulty,
        prompt: `Water flows through a pipe at velocity ${v} m/s. If the pipe diameter is ${(d * 1000).toFixed(0)} mm, calculate the volumetric flow rate.`,
        correctAnswer: q,
        tolerance: 0.05,
        acceptedUnits: ["m³/s"],
        solutionOutline: `Q = VA = ${v} × ${area.toFixed(4)} = ${q} m³/s`,
        explanationCorrect: "Volumetric flow rate is velocity times area.",
        explanationCommonWrong: [
          "Using diameter instead of radius",
          "Forgetting π",
          "Unit conversion errors"
        ],
        tags: ["flow-rate", "continuity"],
      });
    },
  ],
  "Basic Electrical Engineering": [
    (seed, difficulty) => {
      const v = 12 + (seed % 5) * 3;
      const r = 2 + (seed % 4) * 2;
      const i = Number((v / r).toFixed(2));
      return createNumericQuestion({
        id: makeId("Basic Electrical Engineering", seed),
        section: "Basic Electrical Engineering",
        difficulty,
        prompt: `A ${v} V source supplies current to a ${r} Ω resistor. What is the current?`,
        correctAnswer: i,
        tolerance: 0.05,
        acceptedUnits: ["A"],
        solutionOutline: `I = V/R = ${v}/${r} = ${i} A`,
        explanationCorrect: "Ohm's law.",
        explanationCommonWrong: [
          "Multiplying instead of dividing",
          "Unit confusion",
          "Arithmetic error"
        ],
        tags: ["ohms-law", "dc-circuits"],
      });
    },
  ],
  "Thermodynamics and Heat Transfer": [
    (seed, difficulty) => {
      const m = 2 + (seed % 6);
      const c = 4.18;
      const t1 = 20;
      const t2 = 40 + (seed % 4) * 10;
      const q = Number((m * c * (t2 - t1)).toFixed(0));
      return createNumericQuestion({
        id: makeId("Thermodynamics and Heat Transfer", seed),
        section: "Thermodynamics and Heat Transfer",
        difficulty,
        prompt: `Calculate heat transfer Q for ${m} kg of water heated from ${t1}°C to ${t2}°C. (c = 4.18 kJ/kg·K)`,
        correctAnswer: q,
        tolerance: 0.05,
        acceptedUnits: ["kJ"],
        solutionOutline: `Q = mcΔT = ${m}×4.18×(${t2}-${t1}) = ${q} kJ`,
        explanationCorrect: "Use Q = mcΔT.",
        explanationCommonWrong: [
          "Using wrong ΔT",
          "Forgetting mass",
          "Arithmetic error"
        ],
        tags: ["heat-transfer", "specific-heat"],
      });
    },
  ],
  "Engineering Ethics and Societal Impacts": [
    (seed, difficulty) => createMcqQuestion({
      id: makeId("Engineering Ethics and Societal Impacts", seed),
      section: "Engineering Ethics and Societal Impacts",
      difficulty,
      prompt: "An engineer discovers a design flaw that could endanger the public. What is the most appropriate action?",
      choices: [
        "Report the issue to supervisors and document findings",
        "Ignore it if it delays the project",
        "Keep it private to avoid conflict",
        "Wait for someone else to notice"
      ],
      correctIndex: 0,
      solutionOutline: "Engineers must hold public safety paramount.",
      explanationCorrect: "Ethics codes prioritize public safety.",
      explanationCommonWrong: [
        "Prioritizing schedule over safety",
        "Avoiding responsibility",
        "Lack of documentation"
      ],
      tags: ["ethics", "public-safety"],
    }),
  ],
  "Safety, Health, and Environment": [
    (seed, difficulty) => createMcqQuestion({
      id: makeId("Safety, Health, and Environment", seed),
      section: "Safety, Health, and Environment",
      difficulty,
      prompt: "Which action best reduces risk in a hazard analysis?",
      choices: [
        "Eliminate the hazard at the source",
        "Add warning labels only",
        "Rely on PPE alone",
        "Ignore low-probability hazards"
      ],
      correctIndex: 0,
      solutionOutline: "Hierarchy of controls prioritizes elimination.",
      explanationCorrect: "Elimination is the most effective control.",
      explanationCommonWrong: [
        "Overreliance on PPE",
        "Warning labels are weaker controls",
        "Ignoring hazards is unsafe"
      ],
      tags: ["safety", "risk"],
    }),
  ],
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeChoiceText(choice: string): string {
  return choice.trim().replace(/^[A-D]\s*[\.)]\s*/, "").trim();
}

function extractHandbookAnchor(question: Question): string {
  if (question.handbookAnchor) return question.handbookAnchor;

  const explanation = question.explanationCorrect || "";
  const handbookMatch = explanation.match(/Handbook:\s*([^\.]+)\.\s*Ctrl\+F:\s*([^\.]+)\./i);

  if (handbookMatch) {
    const section = handbookMatch[1].trim();
    const keyword = handbookMatch[2].trim();
    return `Handbook: ${section}. Ctrl+F: ${keyword}.`;
  }

  const subtopic = question.tags?.[0] || "general";
  const keyword = question.tags?.[0] || question.section;
  return `Handbook: ${question.section} → ${subtopic}. Ctrl+F: ${keyword}.`;
}

function withMetadata(question: Question): Question {
  const topic = question.topic || question.section;
  const subtopic = question.subtopic || question.tags?.[0] || "general";
  const difficultyRating =
    question.difficultyRating || DIFFICULTY_RATING[question.difficulty];
  const estimatedTimeSec =
    question.estimatedTimeSec || ESTIMATED_TIME_SEC[question.difficulty];
  const conceptTags = question.conceptTags || question.tags || [];
  const handbookAnchor = extractHandbookAnchor(question);

  return {
    ...question,
    topic,
    subtopic,
    difficultyRating,
    estimatedTimeSec,
    conceptTags,
    handbookAnchor,
  };
}

function isValidMcq(question: Question): boolean {
  if (question.type !== "mcq" || !question.choices) return true;

  if (question.choices.length !== 4) return false;

  const normalized = question.choices.map(normalizeChoiceText);
  const unique = new Set(normalized.map((c) => c.toLowerCase()));
  if (unique.size !== 4) return false;

  const answer = String(question.correctAnswer).toUpperCase();
  if (!/[A-D]/.test(answer)) return false;

  return true;
}

function makeQuestionKey(question: Question): string {
  const choices = question.choices
    ? question.choices.map(normalizeChoiceText).join("|")
    : "";
  return `${question.section}|${question.type}|${question.prompt.trim()}|${choices}`;
}

function buildSectionPool(
  section: string,
  poolSize = DEFAULT_POOL_SIZE,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed"
): Question[] {
  const templates = sectionTemplates[section] || [];
  const basePool = questionPools[section] || [];
  const pool: Question[] = [];

  const fallbackTemplates: TemplateFn[] = [
    (seed, diff) =>
      createMcqQuestion({
        id: makeId(section, seed),
        section,
        difficulty: diff,
        prompt: `In ${section}, which option best represents a fundamental concept?`,
        choices: [
          "Core principle application",
          "Unrelated topic",
          "Incorrect unit usage",
          "Nonstandard assumption",
        ],
        correctIndex: 0,
        solutionOutline: "Identify the option that aligns with the section’s core principle.",
        explanationCorrect: "The correct option reflects a core principle of the section.",
        explanationCommonWrong: [
          "Selecting an unrelated topic",
          "Using incorrect units",
          "Relying on nonstandard assumptions",
        ],
        tags: [section.toLowerCase().replace(/[^a-z0-9]+/g, "-"), "fundamentals"],
      }),
  ];

  const activeTemplates = templates.length > 0 ? templates : fallbackTemplates;

  let attempts = 0;
  const maxAttempts = poolSize * 3;

  while (pool.length < poolSize && attempts < maxAttempts) {
    const i = attempts;
    attempts += 1;
    const diff: Difficulty =
      difficulty === "mixed"
        ? i % 3 === 0
          ? "easy"
          : i % 3 === 1
            ? "medium"
            : "hard"
        : difficulty;

    let question: Question | null = null;
    if (activeTemplates.length > 0) {
      const template = activeTemplates[i % activeTemplates.length];
      question = template(i + 1000, diff);
    } else if (basePool.length > 0) {
      const base = basePool[i % basePool.length];
      question = {
        ...base,
        id: `${base.id}-${i}-${Date.now()}`,
        generatedAt: new Date().toISOString(),
      } as Question;
    }

    if (!question) continue;

    if (question.type === "mcq" && question.choices) {
      const originalChoices = question.choices.map(normalizeChoiceText);
      const correctIndex = ["A", "B", "C", "D"].indexOf(
        question.correctAnswer as string
      );
      const correctText = originalChoices[correctIndex];

      if (!correctText) continue;

      const shuffledTexts = shuffleArray(originalChoices);
      const newCorrectIndex = shuffledTexts.indexOf(correctText);
      question.choices = shuffledTexts.map(
        (text, idx) => `${["A", "B", "C", "D"][idx]}) ${text}`
      );
      question.correctAnswer = ["A", "B", "C", "D"][newCorrectIndex];
    }

    const enriched = withMetadata(question);

    if (!isValidMcq(enriched)) continue;

    pool.push(enriched);
  }

  return pool;
}

/**
 * Generate deterministic mock questions (no API calls)
 * Useful for free testing and demo purposes
 */
export function generateMockQuestions(
  sections: string[],
  count: number,
  difficulty?: "easy" | "medium" | "hard" | "mixed"
): Question[] {
  const questions: Question[] = [];

  if (count <= 0 || sections.length === 0) {
    return [];
  }

  const perSectionCount = Math.floor(count / sections.length);
  const remainder = count % sections.length;

  const sectionCounts = sections.map((section, idx) =>
    idx < remainder ? perSectionCount + 1 : perSectionCount
  );

  const seen = new Set<string>();

  sections.forEach((section, sIdx) => {
    const targetCount = sectionCounts[sIdx];
    const pool = buildSectionPool(
      section,
      DEFAULT_POOL_SIZE,
      difficulty || "mixed"
    );

    if (pool.length === 0) return;

    const shuffledPool = shuffleArray(pool);
    const selected: Question[] = [];

    for (const q of shuffledPool) {
      if (selected.length >= targetCount) break;
      const key = makeQuestionKey(q);
      if (seen.has(key)) continue;
      seen.add(key);
      selected.push(q);
    }

    questions.push(...selected);
  });

  return questions.slice(0, count);
}

/**
 * Get all available sections for mock generator
 */
export function getMockSections(): string[] {
  return Object.keys(questionPools);
}

/**
 * Get question count by section
 */
export function getMockQuestionCount(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const [section, questions] of Object.entries(questionPools)) {
    counts[section] = questions.length;
  }
  return counts;
}
