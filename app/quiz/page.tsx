"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/lib/types";
import QuestionCard from "@/components/QuestionCard";

export default function QuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string | number>>(
    new Map()
  );
  const [timeByQuestion, setTimeByQuestion] = useState<Map<string, number>>(
    new Map()
  );
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showHandbook, setShowHandbook] = useState(true);

  useEffect(() => {
    // Load quiz from session storage
    const storedQuiz = sessionStorage.getItem("currentQuiz");
    if (!storedQuiz) {
      router.push("/select-section");
      return;
    }

    const parsedQuiz: Quiz = JSON.parse(storedQuiz);
    setQuiz(parsedQuiz);
    setCurrentQuestion(0); // Reset to first question
    setAnswers(new Map()); // Clear previous answers
    setTimeByQuestion(new Map());
    setQuestionStartTime(Date.now());

    // Set timer for exam mode
    if (parsedQuiz.mode === "exam" && parsedQuiz.timeLimit) {
      setTimeLeft(parsedQuiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev! > 0 ? prev! - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const recordTimeForCurrent = () => {
    if (!questionStartTime) return;
    if (!currentQ) return;
    const elapsed = (Date.now() - questionStartTime) / 1000;
    const newTimes = new Map(timeByQuestion);
    newTimes.set(currentQ.id, (newTimes.get(currentQ.id) || 0) + elapsed);
    setTimeByQuestion(newTimes);
    setQuestionStartTime(Date.now());
  };

  const handleAnswerChange = (answer: string | number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQ.id, answer);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    console.log("Next clicked, current:", currentQuestion, "total:", quiz.questions.length);
    if (currentQuestion < quiz.questions.length - 1) {
      recordTimeForCurrent();
      setCurrentQuestion(currentQuestion + 1);
      console.log("Moving to question:", currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    console.log("Previous clicked, current:", currentQuestion);
    if (currentQuestion > 0) {
      recordTimeForCurrent();
      setCurrentQuestion(currentQuestion - 1);
      console.log("Moving to question:", currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    recordTimeForCurrent();
    // Check if all questions answered
    const unanswered = quiz.questions.filter(
      (q) => !answers.has(q.id)
    ).length;
    if (unanswered > 0) {
      setError(
        `Please answer all ${unanswered} remaining question(s) before submitting.`
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Convert answers to array format
      const answerArray = quiz.questions.map((q) => ({
        questionId: q.id,
        userAnswer: answers.get(q.id),
        timeSpent: timeByQuestion.get(q.id) || 0,
      }));

      // Call grade API
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          questions: quiz.questions,
          answers: answerArray,
          sections: quiz.sections,
          mode: quiz.mode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to grade quiz");
      }

      const result = await response.json();

      // Store results and navigate
      sessionStorage.setItem("lastAttempt", JSON.stringify(result.attempt));
      sessionStorage.setItem("lastAnswers", JSON.stringify(result.answers));
      router.push("/results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit quiz"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h2>
          {timeLeft !== null && (
            <div
              className={`text-lg font-semibold ${
                timeLeft < 600 ? "text-red-600" : "text-gray-600"
              }`}
            >
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
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
      <QuestionCard
        key={currentQ.id}
        question={currentQ}
        answer={answers.get(currentQ.id)}
        onAnswerChange={handleAnswerChange}
        mode={quiz.mode}
      />

      {/* Handbook Viewer */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">FE Reference Handbook</h3>
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

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow p-6 flex justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
        >
          ← Previous
        </button>

        <div className="text-center text-sm text-gray-600">
          {answers.size} of {quiz.questions.length} answered
        </div>

        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || answers.size < quiz.questions.length}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}
