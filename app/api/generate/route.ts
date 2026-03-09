import { NextRequest, NextResponse } from "next/server";
import { Quiz, Question } from "@/lib/types";
import fs from "fs";
import path from "path";

interface BankQuestion {
  id: string;
  section: string;
  subtopic: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

// Section name → JSON file name
const SECTION_FILES: Record<string, string> = {
  Mathematics: "mathematics",
  "Probability and Statistics": "statistics",
  Chemistry: "chemistry",
  "Instrumentation and Controls": "instrumentation",
  "Engineering Ethics and Societal Impacts": "ethics",
  "Safety, Health, and Environment": "safety",
  "Engineering Economics": "economics",
  Statics: "statics",
  Dynamics: "dynamics",
  "Strength of Materials": "strength-of-materials",
  Materials: "materials",
  "Fluid Mechanics": "fluid-mechanics",
  "Basic Electrical Engineering": "electrical",
  "Thermodynamics and Heat Transfer": "thermodynamics",
};

// Clean section name: "6. Safety, Health, ..." → "Safety, Health, ..."
function cleanSectionName(raw: string): string {
  return raw.replace(/^\d+\.\s*/, "");
}

// Map cleaned section name to FE_SECTIONS enum value
function toFESection(raw: string): string {
  const cleaned = cleanSectionName(raw);
  // Find the matching key in SECTION_FILES
  for (const key of Object.keys(SECTION_FILES)) {
    if (cleaned.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleaned.toLowerCase())) {
      return key;
    }
  }
  return cleaned;
}

// Determine difficulty from question ID or default to medium
function inferDifficulty(q: BankQuestion): "easy" | "medium" | "hard" {
  const id = q.id.toLowerCase();
  if (id.includes("-e-") || id.includes("easy")) return "easy";
  if (id.includes("-h-") || id.includes("hard")) return "hard";
  return "medium";
}

// Determine if question is numeric based on content
function inferType(q: BankQuestion): "mcq" | "numeric" {
  const hasNumericAnswer = !isNaN(Number(q.answer));
  if (hasNumericAnswer && (!q.options || q.options.length === 0)) return "numeric";
  return "mcq";
}

// Convert BankQuestion → Question (quiz format)
function convertToQuizQuestion(bq: BankQuestion): Question {
  const section = toFESection(bq.section);
  const qType = inferType(bq);
  const difficulty = inferDifficulty(bq);

  // Extract subtopic tag (e.g., "A. Time Value of Money" → "time-value-of-money")
  const subtopicTag = bq.subtopic
    .replace(/^[A-Z]\.\s*/, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return {
    id: bq.id,
    section: section as Question["section"],
    difficulty,
    type: qType,
    prompt: bq.question,
    choices: qType === "mcq" ? bq.options : undefined,
    correctAnswer: bq.answer,
    tolerance: qType === "numeric" ? 0.02 : undefined,
    solutionOutline: bq.explanation,
    explanationCorrect: bq.explanation,
    explanationCommonWrong: [],
    tags: [cleanSectionName(bq.section).toLowerCase().split(",")[0].trim(), subtopicTag],
    topic: cleanSectionName(bq.section),
    subtopic: bq.subtopic,
    generatedAt: new Date().toISOString(),
  };
}

// Load questions from a JSON file on disk
function loadSectionQuestions(sectionName: string): BankQuestion[] {
  const fileName = SECTION_FILES[sectionName];
  if (!fileName) return [];

  // Try multiple paths (dev vs production)
  const possiblePaths = [
    path.join(process.cwd(), "data", "questions", `${fileName}.json`),
    path.join(process.cwd(), "public", "data", "questions", `${fileName}.json`),
  ];

  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw) as BankQuestion[];
      }
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e);
    }
  }

  return [];
}

/**
 * Select questions with guaranteed subtopic coverage rotation.
 *
 * Algorithm:
 * 1. Group all questions by subtopic
 * 2. Round-robin through subtopics, picking one question from each
 * 3. Within each subtopic, shuffle questions so different ones appear each time
 * 4. Continue rounds until we hit the requested count
 * 5. Never repeat a question until all questions in that subtopic are used
 */
function selectWithSubtopicCoverage(
  questions: BankQuestion[],
  count: number
): BankQuestion[] {
  if (questions.length === 0) return [];
  if (questions.length <= count) {
    // Shuffle and return all
    return shuffleArray([...questions]);
  }

  // Group by subtopic
  const bySubtopic = new Map<string, BankQuestion[]>();
  for (const q of questions) {
    const key = q.subtopic || "general";
    if (!bySubtopic.has(key)) bySubtopic.set(key, []);
    bySubtopic.get(key)!.push(q);
  }

  // Shuffle questions within each subtopic
  for (const [key, qs] of bySubtopic) {
    bySubtopic.set(key, shuffleArray(qs));
  }

  // Shuffle subtopic order
  const subtopicKeys = shuffleArray([...bySubtopic.keys()]);

  // Round-robin through subtopics
  const selected: BankQuestion[] = [];
  const usedIndices = new Map<string, number>(); // Track position per subtopic

  for (const key of subtopicKeys) {
    usedIndices.set(key, 0);
  }

  let round = 0;
  while (selected.length < count) {
    let addedThisRound = false;

    for (const subtopic of subtopicKeys) {
      if (selected.length >= count) break;

      const pool = bySubtopic.get(subtopic)!;
      const idx = (usedIndices.get(subtopic) || 0) + round * 0; // Use sequential index
      const actualIdx = usedIndices.get(subtopic) || 0;

      if (actualIdx < pool.length) {
        selected.push(pool[actualIdx]);
        usedIndices.set(subtopic, actualIdx + 1);
        addedThisRound = true;
      }
    }

    round++;
    if (!addedThisRound) break; // All subtopics exhausted
  }

  return selected;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections, difficulty, count, mode } = body;

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid sections" },
        { status: 400 }
      );
    }

    // Load all questions from JSON bank for selected sections
    let allBankQuestions: BankQuestion[] = [];
    for (const section of sections) {
      const sectionQuestions = loadSectionQuestions(section);
      allBankQuestions.push(...sectionQuestions);
    }

    if (allBankQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions available for the selected sections. The question bank may be empty." },
        { status: 404 }
      );
    }

    // Filter by difficulty if specified (not "mixed")
    if (difficulty && difficulty !== "mixed") {
      const filtered = allBankQuestions.filter(
        (q) => inferDifficulty(q) === difficulty
      );
      // Only use filtered if we have enough questions
      if (filtered.length >= Math.min(count || 10, 5)) {
        allBankQuestions = filtered;
      }
    }

    // Select questions with subtopic coverage rotation
    const requestedCount = Math.min(count || 10, allBankQuestions.length);
    const selectedQuestions = selectWithSubtopicCoverage(allBankQuestions, requestedCount);

    // Convert to Quiz Question format
    const quizQuestions: Question[] = selectedQuestions.map(convertToQuizQuestion);

    // Build quiz object
    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      sections: sections as Quiz["sections"],
      mode: mode || "practice",
      questions: quizQuestions,
      timeLimit: mode === "exam" ? 360 : undefined,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate quiz",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
