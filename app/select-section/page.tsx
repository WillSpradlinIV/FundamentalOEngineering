"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FE_SECTIONS } from "@/lib/types";
import { ALL_SECTIONS } from "@/lib/question-bank";
import { getRemainingCount, getCompletionPercentage } from "@/lib/question-queue";

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy (30%)", description: "Fundamental concepts" },
  {
    value: "medium",
    label: "Medium (50%)",
    description: "Core competency level",
  },
  { value: "hard", label: "Hard (20%)", description: "Advanced application" },
];

const QUIZ_MODE_OPTIONS = [
  {
    value: "practice",
    label: "Practice Mode",
    description: "Immediate feedback per question",
  },
  {
    value: "exam",
    label: "Exam Mode",
    description: "Timed, full review after submission",
  },
];

const APP_MODE_OPTIONS = [
  {
    value: "study",
    label: "Study Mode",
    description: "Question bank with progress tracking",
  },
  {
    value: "quiz",
    label: "Quiz Mode",
    description: "AI-generated practice quizzes",
  },
];

function SectionSelectorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [quizMode, setQuizMode] = useState("practice");
  const [appMode, setAppMode] = useState("study");
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [studyComplete, setStudyComplete] = useState(false);

  useEffect(() => {
    if (searchParams.get("studyComplete") === "true") {
      setStudyComplete(true);
    }
  }, [searchParams]);

  const handleSectionToggle = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleStart = async () => {
    if (selectedSections.length === 0) {
      setError("Please select at least one section");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (appMode === "study") {
        // Study mode: Navigate to study page with selected sections
        const sectionsParam = selectedSections.join(",");
        router.push(`/study?sections=${encodeURIComponent(sectionsParam)}`);
      } else {
        // Quiz mode: Call API to generate quiz
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sections: selectedSections,
            difficulty,
            count: questionCount,
            mode: quizMode,
            typeDistribution: { mcq: 0.8, numeric: 0.2 }, // 80% MCQ, 20% numeric
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate quiz");
        }

        const quiz = await response.json();

        // Store quiz in session/local storage
        sessionStorage.setItem("currentQuiz", JSON.stringify(quiz));

        // Navigate to quiz page
        router.push("/quiz");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start session"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Study Complete Banner */}
        {studyComplete && (
          <div className="mb-6 bg-green-50 border border-green-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-2">
              🎉 Study Session Complete!
            </h3>
            <p className="text-green-800">
              Great work! Start a new session to continue studying.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Select Study Sections
        </h2>

        {/* App Mode Selection */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Study Mode
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {APP_MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setAppMode(option.value)}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  appMode === option.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 bg-white hover:border-indigo-400"
                }`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sections Grid */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            FE Topics ({selectedSections.length} selected)
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {ALL_SECTIONS.map((section) => (
              <button
                key={section}
                onClick={() => handleSectionToggle(section)}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  selectedSections.includes(section)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 bg-white hover:border-indigo-400"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section)}
                    onChange={() => handleSectionToggle(section)}
                    className="mr-3"
                  />
                  <span className="font-medium text-gray-900">{section}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Mode Options (only in quiz mode) */}
        {appMode === "quiz" && (
          <>
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Quiz Mode
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {QUIZ_MODE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQuizMode(option.value)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      quizMode === option.value
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 bg-white hover:border-indigo-400"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {option.label}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Difficulty Mix
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDifficulty(option.value)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      difficulty === option.value
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 bg-white hover:border-indigo-400"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {option.label}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Number of Questions: {questionCount}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                5 - 50 questions per session
              </p>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading
            ? appMode === "study"
              ? "Loading Study Session..."
              : "Generating Quiz..."
            : appMode === "study"
            ? "Start Study Session"
            : "Start Quiz"}
        </button>
      </div>
      </div>
    </div>
  );
}

export default function SectionSelector() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <SectionSelectorContent />
    </Suspense>
  );
}
