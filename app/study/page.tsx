"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BankQuestion, loadQuestionsForSections } from "@/lib/question-bank";
import { markQuestion } from "@/lib/progress-tracker";
import { buildQuestionQueue } from "@/lib/question-queue";

function StudyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [showHandbook, setShowHandbook] = useState(false);

  const sectionsParam = searchParams.get("sections") || "";
  const sections = useMemo(() => sectionsParam ? sectionsParam.split(",") : [], [sectionsParam]);

  useEffect(() => {
    if (sections.length === 0) {
      router.push("/select-section");
      return;
    }

    loadQuestionsForSections(sections).then((loaded) => {
      const queue = buildQuestionQueue(loaded);
      setQuestions(queue);
      setLoading(false);
      setQuestionStartTime(Date.now());
    });
  }, [sections, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">No Questions Available</h2>
        <p className="text-gray-600">
          No questions found for the selected sections. Check back later!
        </p>
        <Link
          href="/select-section"
          className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Section Selection
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    setUserAnswer(answer);
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handleMarkAs = (status: "correct" | "review" | "skipped") => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect =
      status === "correct" || userAnswer === currentQuestion.answer;

    markQuestion(currentQuestion.id, status === "skipped" ? "skipped" : status, timeSpent, isCorrect);

    // Move to next question
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setUserAnswer("");
      setQuestionStartTime(Date.now());
    } else {
      // Session complete
      router.push("/select-section?studyComplete=true");
    }
  };

  const handleSkip = () => {
    handleMarkAs("skipped");
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setUserAnswer("");
      setQuestionStartTime(Date.now());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Study Session: Question {currentIndex + 1} of {questions.length}
          </h2>
          <Link
            href="/select-section"
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Exit Session
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {currentQuestion.section}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            {currentQuestion.subtopic}
          </span>
        </div>

        <div>
          <p className="text-lg text-gray-900 font-semibold whitespace-pre-wrap">
            {currentQuestion.question}
          </p>
        </div>

        {/* Answer Choices */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const letter = option.charAt(0); // "A", "B", "C", "D"
            const text = option.substring(3); // Remove "A. "

            const isSelected = userAnswer === letter;
            const isCorrect = currentQuestion.answer === letter;
            const showCorrectness = showAnswer;

            let bgColor = "bg-white border-gray-300";
            if (isSelected && !showCorrectness) {
              bgColor = "bg-indigo-50 border-indigo-600";
            } else if (showCorrectness && isCorrect) {
              bgColor = "bg-green-50 border-green-600";
            } else if (showCorrectness && isSelected && !isCorrect) {
              bgColor = "bg-red-50 border-red-600";
            }

            return (
              <div
                key={idx}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${bgColor} hover:border-indigo-400`}
                onClick={() => !showAnswer && handleAnswerSelect(letter)}
              >
                <div className="flex items-baseline gap-2">
                  <span className="inline-block font-bold text-indigo-600 text-lg">
                    {letter}.
                  </span>
                  <span className="text-gray-900">{text}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reveal Answer Button */}
        {!showAnswer && userAnswer && (
          <button
            onClick={handleRevealAnswer}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Show Answer & Explanation
          </button>
        )}

        {/* Explanation (after reveal) */}
        {showAnswer && (
          <div className="bg-gray-50 border-l-4 border-indigo-600 p-6 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">
              Correct Answer: {currentQuestion.answer}
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Buttons (after reveal) */}
        {showAnswer && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleMarkAs("correct")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2"
            >
              ✅ Got It
            </button>
            <button
              onClick={() => handleMarkAs("review")}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold flex items-center gap-2"
            >
              🔁 Review Again
            </button>
          </div>
        )}

        {/* Skip button (before reveal) */}
        {!showAnswer && (
          <button
            onClick={handleSkip}
            className="w-full px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            ⏭ Skip for Now
          </button>
        )}
      </div>

      {/* Handbook Viewer */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            FE Reference Handbook
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHandbook((prev) => !prev)}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {showHandbook ? "Hide" : "Show"} Handbook
            </button>
            <a
              href="/reference/fe-handbook-10-5.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800 underline"
            >
              Open in new tab
            </a>
          </div>
        </div>

        {showHandbook && (
          <iframe
            title="FE Reference Handbook"
            src="/reference/fe-handbook-10-5.pdf#view=FitH"
            className="w-full h-[600px] border rounded-lg"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow p-6 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
        >
          ← Previous
        </button>

        <div className="text-center text-sm text-gray-600">
          {questions.length - currentIndex - 1} questions remaining
        </div>

        <button
          onClick={() => handleMarkAs("skipped")}
          disabled={!showAnswer}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Loading study session...</p>
      </div>
    }>
      <StudyPageContent />
    </Suspense>
  );
}
