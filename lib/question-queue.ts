/**
 * Question Queue Algorithm
 * Prioritizes unseen questions with guaranteed subtopic coverage rotation.
 *
 * Algorithm:
 * 1. Assign priority based on progress (unseen > review > incorrect > seen)
 * 2. Within each priority group, round-robin through subtopics
 * 3. This ensures ALL subtopics are covered before any subtopic repeats
 */

import { BankQuestion } from "./question-bank";
import { loadProgress } from "./progress-tracker";

export interface QueuedQuestion {
  question: BankQuestion;
  priority: number; // Lower = higher priority
}

/**
 * Build a smart queue with subtopic-coverage rotation:
 * 1. Unseen questions (priority 1) — round-robin across subtopics
 * 2. Questions marked for review (priority 2)
 * 3. Questions with low accuracy (priority 3)
 * 4. Recently incorrect (priority 4)
 * 5. All others (priority 5)
 *
 * Within each priority, questions are interleaved by subtopic so
 * the user cycles through ALL subtopics before seeing the same one twice.
 */
export function buildQuestionQueue(
  questions: BankQuestion[]
): BankQuestion[] {
  const progress = loadProgress();

  // Assign priorities
  const prioritized = questions.map((q): QueuedQuestion => {
    const p = progress[q.id];

    if (!p || p.status === "unseen") {
      return { question: q, priority: 1 };
    }
    if (p.markedForReview || p.status === "review") {
      return { question: q, priority: 2 };
    }
    if (p.status === "skipped" || (!p.correctOnFirstTry && p.attempts <= 3)) {
      return { question: q, priority: 3 };
    }
    if (!p.correctOnFirstTry) {
      return { question: q, priority: 4 };
    }
    return { question: q, priority: 5 };
  });

  // Group by priority
  const byPriority = new Map<number, QueuedQuestion[]>();
  for (const pq of prioritized) {
    if (!byPriority.has(pq.priority)) byPriority.set(pq.priority, []);
    byPriority.get(pq.priority)!.push(pq);
  }

  // For each priority group, interleave by subtopic (round-robin)
  const result: BankQuestion[] = [];
  const sortedPriorities = [...byPriority.keys()].sort((a, b) => a - b);

  for (const priority of sortedPriorities) {
    const group = byPriority.get(priority)!;
    const interleaved = interleaveBySubtopic(group.map((pq) => pq.question));
    result.push(...interleaved);
  }

  return result;
}

/**
 * Interleave questions by subtopic: round-robin through all subtopics
 * so no subtopic appears twice until all subtopics have appeared once.
 */
function interleaveBySubtopic(questions: BankQuestion[]): BankQuestion[] {
  // Group by subtopic
  const bySubtopic = new Map<string, BankQuestion[]>();
  for (const q of questions) {
    const key = q.subtopic || "general";
    if (!bySubtopic.has(key)) bySubtopic.set(key, []);
    bySubtopic.get(key)!.push(q);
  }

  // Shuffle within each subtopic
  for (const [key, qs] of bySubtopic) {
    bySubtopic.set(key, shuffleArray(qs));
  }

  // Shuffle the order of subtopics
  const subtopicKeys = shuffleArray([...bySubtopic.keys()]);

  // Round-robin
  const result: BankQuestion[] = [];
  const indices = new Map<string, number>();
  for (const key of subtopicKeys) {
    indices.set(key, 0);
  }

  let hasMore = true;
  while (hasMore) {
    hasMore = false;
    for (const subtopic of subtopicKeys) {
      const pool = bySubtopic.get(subtopic)!;
      const idx = indices.get(subtopic) || 0;
      if (idx < pool.length) {
        result.push(pool[idx]);
        indices.set(subtopic, idx + 1);
        if (idx + 1 < pool.length) hasMore = true;
      }
    }
    // If nothing was added this round but hasMore is still false, break
    if (!hasMore) {
      // Check if any subtopic still has items
      for (const subtopic of subtopicKeys) {
        const pool = bySubtopic.get(subtopic)!;
        const idx = indices.get(subtopic) || 0;
        if (idx < pool.length) {
          hasMore = true;
          break;
        }
      }
    }
  }

  return result;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
