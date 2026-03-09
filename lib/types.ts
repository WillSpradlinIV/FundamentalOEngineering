import { z } from "zod";

// FE Other Disciplines exam sections (per NCEES CBT specifications)
// Effective July 2020 - 14 knowledge areas, 110 questions, 6 hours
export const FE_SECTIONS = [
  "Mathematics",
  "Probability and Statistics",
  "Chemistry",
  "Instrumentation and Controls",
  "Engineering Ethics and Societal Impacts",
  "Safety, Health, and Environment",
  "Engineering Economics",
  "Statics",
  "Dynamics",
  "Strength of Materials",
  "Materials",
  "Fluid Mechanics",
  "Basic Electrical Engineering",
  "Thermodynamics and Heat Transfer",
] as const;

export type FESection = (typeof FE_SECTIONS)[number];

export type QuestionType = "mcq" | "numeric";
export type Difficulty = "easy" | "medium" | "hard";
export type Mode = "practice" | "exam";

// Zod schema for validation
export const QuestionSchema = z.object({
  id: z.string(),
  section: z.enum(FE_SECTIONS),
  difficulty: z.enum(["easy", "medium", "hard"]),
  type: z.enum(["mcq", "numeric"]),
  prompt: z.string(),
  choices: z.array(z.string()).optional(), // For MCQ (A, B, C, D)
  correctAnswer: z.union([z.string(), z.number()]), // Letter or numeric
  tolerance: z.number().optional(), // For numeric questions
  acceptedUnits: z.array(z.string()).optional(),
  solutionOutline: z.string(),
  explanationCorrect: z.string(),
  explanationCommonWrong: z.array(z.string()),
  tags: z.array(z.string()),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  difficultyRating: z.number().min(1).max(5).optional(),
  estimatedTimeSec: z.number().optional(),
  conceptTags: z.array(z.string()).optional(),
  handbookAnchor: z.string().optional(),
  generatedAt: z.string().datetime(),
});

export type Question = z.infer<typeof QuestionSchema>;

export const UserAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.union([z.string(), z.number()]),
  isCorrect: z.boolean(),
  explanation: z.string(),
  timeSpent: z.number().optional(), // Seconds
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  difficultyRating: z.number().min(1).max(5).optional(),
  estimatedTimeSec: z.number().optional(),
  conceptTags: z.array(z.string()).optional(),
  handbookAnchor: z.string().optional(),
});

export type UserAnswer = z.infer<typeof UserAnswerSchema>;

export const QuizSchema = z.object({
  id: z.string(),
  sections: z.array(z.enum(FE_SECTIONS)),
  mode: z.enum(["practice", "exam"]),
  questions: z.array(QuestionSchema),
  timeLimit: z.number().optional(), // Minutes, for exam mode
  createdAt: z.string().datetime(),
});

export type Quiz = z.infer<typeof QuizSchema>;

export const AttemptSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  sections: z.array(z.enum(FE_SECTIONS)),
  mode: z.enum(["practice", "exam"]),
  answers: z.array(UserAnswerSchema),
  overallScore: z.number(), // 0-100
  sectionScores: z.record(z.string(), z.number()), // Section -> %
  submittedAt: z.string().datetime(),
  timeSpent: z.number().optional(), // Minutes
});

export type Attempt = z.infer<typeof AttemptSchema>;

export const SectionResultSchema = z.object({
  section: z.enum(FE_SECTIONS),
  attempts: z.number(),
  avgScore: z.number(),
  lastAttempt: z.string().datetime(),
  missedTopics: z.array(z.string()),
});

export type SectionResult = z.infer<typeof SectionResultSchema>;
