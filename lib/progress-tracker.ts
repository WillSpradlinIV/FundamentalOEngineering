/**
 * Progress Tracker
 * Manages question progress in localStorage
 */

export type QuestionStatus = "unseen" | "correct" | "review" | "skipped";

export interface QuestionProgress {
  id: string;
  status: QuestionStatus;
  attempts: number;
  lastAttempted: string; // ISO date
  timeSpent: number; // total seconds spent
  correctOnFirstTry: boolean;
  markedForReview: boolean;
}

const PROGRESS_KEY = "fe-question-progress";
const SESSION_KEY = "fe-current-session";

/**
 * Load all question progress from localStorage
 */
export function loadProgress(): Record<string, QuestionProgress> {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load progress:", error);
    return {};
  }
}

/**
 * Save progress for a single question
 */
export function saveQuestionProgress(progress: QuestionProgress): void {
  if (typeof window === "undefined") return;

  const allProgress = loadProgress();
  allProgress[progress.id] = progress;

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

/**
 * Mark a question with a specific status
 */
export function markQuestion(
  questionId: string,
  status: QuestionStatus,
  timeSpent: number,
  correct?: boolean
): void {
  const allProgress = loadProgress();
  const existing = allProgress[questionId];

  const progress: QuestionProgress = {
    id: questionId,
    status,
    attempts: (existing?.attempts || 0) + 1,
    lastAttempted: new Date().toISOString(),
    timeSpent: (existing?.timeSpent || 0) + timeSpent,
    correctOnFirstTry:
      existing?.correctOnFirstTry ?? (correct === true && (!existing || existing.attempts === 0)),
    markedForReview: status === "review" || existing?.markedForReview || false,
  };

  saveQuestionProgress(progress);
}

/**
 * Get progress statistics for sections
 */
export function getSectionStats(
  sections: string[],
  allQuestionIds: string[]
): Record<
  string,
  { total: number; seen: number; correct: number; review: number }
> {
  const progress = loadProgress();
  const stats: Record<string, { total: number; seen: number; correct: number; review: number }> =
    {};

  sections.forEach((section) => {
    stats[section] = { total: 0, seen: 0, correct: 0, review: 0 };
  });

  allQuestionIds.forEach((id) => {
    const p = progress[id];
    // Extract section from ID (simplified - assumes format like "math-A-001")
    const sectionPrefix = id.split("-")[0];
    const section = sections.find((s) =>
      s.toLowerCase().includes(sectionPrefix)
    );

    if (section && stats[section]) {
      stats[section].total += 1;
      if (p && p.status !== "unseen") {
        stats[section].seen += 1;
        if (p.status === "correct") stats[section].correct += 1;
        if (p.status === "review") stats[section].review += 1;
      }
    }
  });

  return stats;
}

/**
 * Get weakest topics (most incorrect)
 */
export function getWeakestTopics(limit: number = 3): Array<{
  topic: string;
  accuracy: number;
  attempts: number;
}> {
  const progress = loadProgress();
  const topicStats: Record<string, { correct: number; total: number }> = {};

  Object.values(progress).forEach((p) => {
    const topic = p.id.split("-")[0]; // Simplified topic extraction
    if (!topicStats[topic]) {
      topicStats[topic] = { correct: 0, total: 0 };
    }

    if (p.status !== "unseen" && p.status !== "skipped") {
      topicStats[topic].total += 1;
      if (p.status === "correct") {
        topicStats[topic].correct += 1;
      }
    }
  });

  return Object.entries(topicStats)
    .filter(([_, stats]) => stats.total > 0)
    .map(([topic, stats]) => ({
      topic,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      attempts: stats.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

/**
 * Clear all progress (reset)
 */
export function clearProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(SESSION_KEY);
}
