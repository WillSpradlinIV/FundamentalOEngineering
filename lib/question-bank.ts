/**
 * Question Bank Manager
 * Loads and manages questions from JSON files
 */

export interface BankQuestion {
  id: string;
  section: string;
  subtopic: string;
  question: string;
  options: string[];
  answer: string; // "A", "B", "C", "D"
  explanation: string;
}

export interface QuestionBank {
  [section: string]: BankQuestion[];
}

// Section mapping (matches data file names)
export const SECTION_FILES: Record<string, string> = {
  "Mathematics": "mathematics",
  "Probability and Statistics": "statistics",
  "Chemistry": "chemistry",
  "Instrumentation and Controls": "instrumentation",
  "Engineering Ethics and Societal Impacts": "ethics",
  "Safety, Health, and Environment": "safety",
  "Engineering Economics": "economics",
  "Statics": "statics",
  "Dynamics": "dynamics",
  "Strength of Materials": "strength-of-materials",
  "Materials": "materials",
  "Fluid Mechanics": "fluid-mechanics",
  "Basic Electrical Engineering": "electrical",
  "Thermodynamics and Heat Transfer": "thermodynamics",
};

export const ALL_SECTIONS = Object.keys(SECTION_FILES);

/**
 * Load questions for specific sections from JSON files
 */
export async function loadQuestionsForSections(
  sections: string[]
): Promise<BankQuestion[]> {
  const allQuestions: BankQuestion[] = [];

  for (const section of sections) {
    const fileName = SECTION_FILES[section];
    if (!fileName) {
      console.warn(`No question file found for section: ${section}`);
      continue;
    }

    try {
      const response = await fetch(`/data/questions/${fileName}.json`);
      if (!response.ok) {
        console.warn(`Failed to load ${fileName}.json: ${response.status}`);
        continue;
      }

      const questions: BankQuestion[] = await response.json();
      allQuestions.push(...questions);
    } catch (error) {
      console.error(`Error loading questions for ${section}:`, error);
    }
  }

  return allQuestions;
}

/**
 * Get question count by section (without loading all questions)
 */
export async function getQuestionCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};

  for (const [section, fileName] of Object.entries(SECTION_FILES)) {
    try {
      const response = await fetch(`/data/questions/${fileName}.json`);
      if (response.ok) {
        const questions: BankQuestion[] = await response.json();
        counts[section] = questions.length;
      } else {
        counts[section] = 0;
      }
    } catch {
      counts[section] = 0;
    }
  }

  return counts;
}

/**
 * Load a single question by ID
 */
export async function loadQuestionById(
  questionId: string
): Promise<BankQuestion | null> {
  // Extract section from question ID (e.g., "math-A-001" -> "mathematics")
  for (const [, fileName] of Object.entries(SECTION_FILES)) {
    try {
      const response = await fetch(`/data/questions/${fileName}.json`);
      if (!response.ok) continue;

      const questions: BankQuestion[] = await response.json();
      const question = questions.find((q) => q.id === questionId);
      if (question) return question;
    } catch {
      continue;
    }
  }

  return null;
}
