"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ALL_SECTIONS, getQuestionCounts } from "@/lib/question-bank";
import { loadProgress, getWeakestTopics, clearProgress } from "@/lib/progress-tracker";

interface SectionProgress {
  section: string;
  total: number;
  seen: number;
  correct: number;
  review: number;
  completion: number;
}

export default function ProgressDashboard() {
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [weakestTopics, setWeakestTopics] = useState<Array<{ topic: string; accuracy: number; attempts: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const progress = loadProgress();
    const questionCounts = await getQuestionCounts();
    const weakest = getWeakestTopics(5);

    const progressData: SectionProgress[] = ALL_SECTIONS.map((section) => {
      const total = questionCounts[section] || 0;
      const sectionProgress = Object.values(progress).filter((p) => {
        // Match section by checking if question ID starts with section abbreviation
        const sectionPrefix = section.toLowerCase().substring(0, 4);
        return p.id.toLowerCase().startsWith(sectionPrefix);
      });

      const seen = sectionProgress.filter((p) => p.status !== "unseen").length;
      const correct = sectionProgress.filter((p) => p.status === "correct").length;
      const review = sectionProgress.filter((p) => p.status === "review" || p.markedForReview).length;
      const completion = total > 0 ? Math.round((seen / total) * 100) : 0;

      return { section, total, seen, correct, review, completion };
    });

    setSectionProgress(progressData);
    setWeakestTopics(weakest);
    setLoading(false);
  };

  const handleReset = () => {
    clearProgress();
    setShowResetConfirm(false);
    loadDashboard();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-600">Loading progress...</p>
      </div>
    );
  }

  const totalQuestions = sectionProgress.reduce((sum, s) => sum + s.total, 0);
  const totalSeen = sectionProgress.reduce((sum, s) => sum + s.seen, 0);
  const totalCorrect = sectionProgress.reduce((sum, s) => sum + s.correct, 0);
  const overallCompletion = totalQuestions > 0 ? Math.round((totalSeen / totalQuestions) * 100) : 0;
  const overallAccuracy = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
        <Link
          href="/select-section"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Start Study Session
        </Link>
      </div>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Questions</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalQuestions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Questions Seen</h3>
          <p className="text-3xl font-bold text-blue-600">{totalSeen}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Overall Completion</h3>
          <p className="text-3xl font-bold text-green-600">{overallCompletion}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Overall Accuracy</h3>
          <p className="text-3xl font-bold text-purple-600">{overallAccuracy}%</p>
        </div>
      </div>

      {/* Section Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Section Progress</h2>
        <div className="space-y-4">
          {sectionProgress.map((section) => (
            <div key={section.section} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">{section.section}</h3>
                <div className="text-sm text-gray-600">
                  {section.seen}/{section.total} questions ({section.completion}%)
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${section.completion}%` }}
                ></div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">✓ {section.correct} correct</span>
                <span className="text-yellow-600">🔁 {section.review} review</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weakest Topics */}
      {weakestTopics.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Areas to Focus On</h2>
          <div className="space-y-3">
            {weakestTopics.map((topic) => (
              <div key={topic.topic} className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">{topic.topic}</h3>
                  <p className="text-sm text-gray-600">{topic.attempts} attempts</p>
                </div>
                <div className="text-2xl font-bold text-red-600">{topic.accuracy}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reset Progress</h2>
        <p className="text-gray-600 mb-4">
          Clear all progress and start fresh. This action cannot be undone.
        </p>
        {showResetConfirm ? (
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reset All Progress
          </button>
        )}
      </div>
    </div>
  );
}
