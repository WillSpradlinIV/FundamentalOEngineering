"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to FE Exam Practice
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Prepare for the NCEES Fundamentals of Engineering exam with curated question banks and AI-generated practice quizzes.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/select-section"
            className="inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition"
          >
            Start Studying
          </Link>
          <Link
            href="/progress"
            className="inline-block bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 transition"
          >
            View Progress
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-indigo-900 mb-3">
            📖 Study Mode (NEW)
          </h3>
          <p className="text-gray-700 mb-4">
            Work through curated question banks one at a time. Mark questions as Got it, Review, or Skip. Track your progress across sessions.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Smart question prioritization</li>
            <li>✓ Progress tracking by section</li>
            <li>✓ Immediate feedback</li>
            <li>✓ FE Reference Handbook integrated</li>
          </ul>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-purple-900 mb-3">
            🎯 Quiz Mode
          </h3>
          <p className="text-gray-700 mb-4">
            Generate custom AI-powered practice quizzes. Choose your sections, difficulty, and mode. Perfect for timed practice.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ AI-generated questions</li>
            <li>✓ Practice & Exam modes</li>
            <li>✓ Analytics dashboard</li>
            <li>✓ Customizable difficulty</li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            📚 14 FE Sections
          </h3>
          <p className="text-gray-600">
            Mathematics, Statics, Dynamics, Strength of Materials, Fluid Mechanics, Thermodynamics, and more.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            📊 Progress Dashboard
          </h3>
          <p className="text-gray-600">
            Track completion by section, identify weak areas, and see your improvement over time.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ✅ Detailed Explanations
          </h3>
          <p className="text-gray-600">
            Every question includes step-by-step solutions and references to the FE Handbook.
          </p>
        </div>
      </div>
    </div>
  );
}
