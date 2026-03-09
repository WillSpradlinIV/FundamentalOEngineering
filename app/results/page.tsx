"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Attempt, UserAnswer } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<
    Array<UserAnswer & { section: string }>
  >([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const storedAttempt = sessionStorage.getItem("lastAttempt");
    const storedAnswers = sessionStorage.getItem("lastAnswers");

    if (!storedAttempt || !storedAnswers) {
      router.push("/select-section");
      return;
    }

    setAttempt(JSON.parse(storedAttempt));
    setAnswers(JSON.parse(storedAnswers));
  }, [router]);

  if (!attempt || !answers) {
    return <div>Loading...</div>;
  }

  const correctCount = answers.filter((a) => a.isCorrect).length;

  const groupAccuracy = (keyFn: (a: (UserAnswer & { section: string }) ) => string) => {
    const stats: Record<string, { correct: number; total: number }> = {};
    answers.forEach((a) => {
      const key = keyFn(a);
      if (!stats[key]) stats[key] = { correct: 0, total: 0 };
      stats[key].total += 1;
      if (a.isCorrect) stats[key].correct += 1;
    });
    return Object.entries(stats).map(([key, { correct, total }]) => ({
      key,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      total,
    }));
  };

  const topicAccuracy = groupAccuracy((a) => a.topic || a.section);
  const subtopicAccuracy = groupAccuracy((a) => a.subtopic || "general");
  const difficultyAccuracy = groupAccuracy((a) =>
    a.difficultyRating ? `Difficulty ${a.difficultyRating}` : "Difficulty"
  );

  const weakestTopics = [...topicAccuracy]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const missedConcepts: Record<string, number> = {};
  answers.forEach((a) => {
    if (a.isCorrect) return;
    (a.conceptTags || []).forEach((tag) => {
      missedConcepts[tag] = (missedConcepts[tag] || 0) + 1;
    });
  });
  const mostMissedConcepts = Object.entries(missedConcepts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const timeStats = answers
    .filter((a) => typeof a.timeSpent === "number" && a.timeSpent > 0)
    .map((a) => a.timeSpent as number);
  const avgTime =
    timeStats.length > 0
      ? Math.round(timeStats.reduce((sum, t) => sum + t, 0) / timeStats.length)
      : null;

  const timeByTopic: Record<string, { total: number; count: number }> = {};
  answers.forEach((a) => {
    if (!a.timeSpent) return;
    const key = a.topic || a.section;
    if (!timeByTopic[key]) timeByTopic[key] = { total: 0, count: 0 };
    timeByTopic[key].total += a.timeSpent;
    timeByTopic[key].count += 1;
  });
  const timeByTopicRows = Object.entries(timeByTopic).map(([key, stats]) => ({
    key,
    avg: Math.round(stats.total / stats.count),
  }));

  const getSectionColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Quiz Results</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Overall Score */}
          <div className="bg-indigo-50 rounded-lg p-6 text-center">
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {attempt.overallScore}%
            </div>
            <p className="text-gray-600">
              {correctCount} of {answers.length} correct
            </p>
          </div>

          {/* Section Scores */}
          <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Section Breakdown
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(attempt.sectionScores).map(([section, score]) => (
                <div key={section} className="flex justify-between items-center">
                  <span className="text-gray-700">{section}</span>
                  <span className={`font-semibold ${getSectionColor(Number(score))}`}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mode Info */}
        <div className="text-sm text-gray-500 text-center">
          Mode: <strong>{attempt.mode.toUpperCase()}</strong> • Submitted:{" "}
          <strong>
            {new Date(attempt.submittedAt).toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Performance Analytics</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Accuracy by Topic</h4>
            <div className="space-y-2">
              {topicAccuracy.map((row) => (
                <div key={row.key} className="flex justify-between text-sm">
                  <span className="text-gray-700">{row.key}</span>
                  <span className="font-semibold">{row.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Accuracy by Difficulty</h4>
            <div className="space-y-2">
              {difficultyAccuracy.map((row) => (
                <div key={row.key} className="flex justify-between text-sm">
                  <span className="text-gray-700">{row.key}</span>
                  <span className="font-semibold">{row.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Accuracy by Subtopic</h4>
            <div className="space-y-2">
              {subtopicAccuracy.map((row) => (
                <div key={row.key} className="flex justify-between text-sm">
                  <span className="text-gray-700">{row.key}</span>
                  <span className="font-semibold">{row.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Weakest 3 Topics</h4>
            {weakestTopics.length === 0 ? (
              <p className="text-sm text-gray-600">No topic data yet.</p>
            ) : (
              <div className="space-y-2">
                {weakestTopics.map((row) => (
                  <div key={row.key} className="flex justify-between text-sm">
                    <span className="text-gray-700">{row.key}</span>
                    <span className="font-semibold text-red-600">
                      {row.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Most Missed Concepts</h4>
            {mostMissedConcepts.length === 0 ? (
              <p className="text-sm text-gray-600">No missed concept data yet.</p>
            ) : (
              <div className="space-y-2">
                {mostMissedConcepts.map(([tag, count]) => (
                  <div key={tag} className="flex justify-between text-sm">
                    <span className="text-gray-700">{tag}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Average Time per Question</h4>
            <p className="text-sm text-gray-700">
              {avgTime !== null ? `${avgTime} sec` : "No timing data yet."}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Time by Topic (avg)</h4>
            {timeByTopicRows.length === 0 ? (
              <p className="text-sm text-gray-600">No timing data yet.</p>
            ) : (
              <div className="space-y-2">
                {timeByTopicRows.map((row) => (
                  <div key={row.key} className="flex justify-between text-sm">
                    <span className="text-gray-700">{row.key}</span>
                    <span className="font-semibold">{row.avg} sec</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Question Review
        </h3>

        <div className="space-y-4">
          {answers.map((answer, idx) => (
            <div
              key={answer.questionId}
              className={`border-l-4 p-4 rounded cursor-pointer transition ${
                answer.isCorrect
                  ? "border-green-500 bg-green-50 hover:bg-green-100"
                  : "border-red-500 bg-red-50 hover:bg-red-100"
              }`}
              onClick={() =>
                setExpandedQuestion(
                  expandedQuestion === answer.questionId ? null : answer.questionId
                )
              }
            >
              {/* Summary Row */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">
                    Question {idx + 1} ({answer.section})
                  </p>
                  <p className="text-sm text-gray-600">
                    Your answer: <strong>{answer.userAnswer}</strong>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    answer.isCorrect
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
              </div>

              {/* Expanded Explanation */}
              {expandedQuestion === answer.questionId && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="bg-white p-4 rounded text-sm text-gray-800 space-y-3">
                    {answer.explanation.split("\n").map((line, idx) => (
                      line.trim() && (
                        <p key={idx} className="leading-relaxed">
                          {line}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6 flex justify-center gap-4">
        <Link
          href="/select-section"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Start Another Quiz
        </Link>
        <button
          onClick={() => {
            // Save to history (localStorage)
            const history = JSON.parse(
              localStorage.getItem("quizHistory") || "[]"
            );
            history.push(attempt);
            localStorage.setItem("quizHistory", JSON.stringify(history));
            alert("Saved to history!");
          }}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Save to History
        </button>
      </div>
    </div>
  );
}
