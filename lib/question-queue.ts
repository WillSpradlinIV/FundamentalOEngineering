/**
 * Question Queue Algorithm
 * Prioritizes unseen questions, then review, then all others
 */

import { BankQuestion } from "./question-bank";
import { loadProgress } from "./progress-tracker";

export interface QueuedQuestion {
  question: BankQuestion;
  priority: number; // Lower = higher priority
}

/**
 * Build a smart queue prioritizing:
 * 1. Unseen questions (priority 1)
 * 2. Questions marked for review (priority 2)
 * 3. Questions with low accuracy (priority 3)
 * 4. Recently incorrect (priority 4)
 * 5. All others (priority 5)
 */
export function buildQuestionQueue(
  questions: BankQuestion[]
): BankQuestion[] {
  const progress = loadProgress();

  const prioritized = questions.map((q): QueuedQuestion => {
    const p = progress[q.id];

    // Priority 1: Never seen
    if (!p || p.status === "unseen") {
      return { question: q, priority: 1 };
    }

    // Priority 2: Marked for review
    if (p.markedForReview || p.status === "review") {
      return { question: q, priority: 2 };
    }

    // Priority 3: Incorrect recently (within last 3 attempts)
    if (p.status === "skipped" || (!p.correctOnFirstTry && p.attempts <= 3)) {
      return { question: q, priority: 3 };
    }

    // Priority 4: Has some mistakes
    if (!p.correctOnFirstTry) {
      return { question: q, priority: 4 };
    }

    // Priority 5: Correct on first try
    return { question: q, priority: 5 };
  });

  // Sort by priority, then shuffle within priority groups
  prioritized.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Shuffle within same priority
    return Math.random() - 0.5;
  });

  return prioritized.map((pq) => pq.question);
}

/**
 * Filter questions to only unseen
 */
export function getUnseenQuestions(
  questions: BankQuestion[]
): BankQuestion[] {
  const progress = loadProgress();
  return questions.filter(
    (q) => !progress[q.id] || progress[q.id].status === "unseen"
  );
}

/**
 * Filter questions marked for review
 */
export function getReviewQuestions(
  questions: BankQuestion[]
): BankQuestion[] {
  const progress = loadProgress();
  return questions.filter(
    (q) =>
      progress[q.id] &&
      (progress[q.id].status === "review" || progress[q.id].markedForReview)
  );
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage(questions: BankQuestion[]): number {
  if (questions.length === 0) return 0;

  const progress = loadProgress();
  const seen = questions.filter(
    (q) => progress[q.id] && progress[q.id].status !== "unseen"
  ).length;

  return Math.round((seen / questions.length) * 100);
}

/**
 * Get questions remaining count
 */
export function getRemainingCount(questions: BankQuestion[]): {
  unseen: number;
  review: number;
  total: number;
} {
  const progress = loadProgress();

  const unseen = questions.filter(
    (q) => !progress[q.id] || progress[q.id].status === "unseen"
  ).length;

  const review = questions.filter(
    (q) =>
      progress[q.id] &&
      (progress[q.id].status === "review" || progress[q.id].markedForReview)
  ).length;

  return {
    unseen,
    review,
    total: questions.length,
  };
}
