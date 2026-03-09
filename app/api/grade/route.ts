import { NextRequest, NextResponse } from "next/server";
import { Attempt, Question, UserAnswer } from "@/lib/types";
import {
  calculateScore,
  calculateSectionScores,
  checkNumericAnswer,
} from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, questions, answers: userAnswers, sections, mode } = body;

    if (!quizId || !questions || !userAnswers || !sections) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Grade each answer
    const gradedAnswers: (UserAnswer & { section: string; prompt: string; choices?: string[]; correctAnswerFull: string; userAnswerFull: string })[] = userAnswers.map(
      (
        userAnswer: {
          questionId: string;
          userAnswer: string | number;
          timeSpent?: number;
        },
        index: number
      ) => {
        const question = questions[index] as Question;

        if (!question) {
          return {
            questionId: userAnswer.questionId,
            userAnswer: userAnswer.userAnswer,
            isCorrect: false,
            explanation: "Question not found",
            section: "Unknown",
            prompt: "Question not found",
            correctAnswerFull: "",
            userAnswerFull: String(userAnswer.userAnswer),
          };
        }

        const isCorrect = gradeAnswer(userAnswer.userAnswer, question);
        const explanation = generateExplanation(
          userAnswer.userAnswer,
          question,
          isCorrect
        );

        // Resolve full answer text for MCQ
        let correctAnswerFull = String(question.correctAnswer);
        let userAnswerFull = String(userAnswer.userAnswer);
        if (question.type === "mcq" && Array.isArray(question.choices)) {
          const correctIdx = String(question.correctAnswer).toUpperCase().charCodeAt(0) - 65;
          const userIdx = String(userAnswer.userAnswer).toUpperCase().charCodeAt(0) - 65;
          if (correctIdx >= 0 && correctIdx < question.choices.length) {
            correctAnswerFull = question.choices[correctIdx];
          }
          if (userIdx >= 0 && userIdx < question.choices.length) {
            userAnswerFull = question.choices[userIdx];
          }
        }

        const topic = question.topic || question.section;
        const subtopic = question.subtopic || question.tags?.[0] || "general";
        const difficultyRating = question.difficultyRating ||
          (question.difficulty === "easy" ? 2 : question.difficulty === "medium" ? 3 : 4);
        const estimatedTimeSec = question.estimatedTimeSec ||
          (question.difficulty === "easy" ? 120 : question.difficulty === "medium" ? 150 : 180);
        const conceptTags = question.conceptTags || question.tags || [];
        const handbookAnchor = question.handbookAnchor || "";

        return {
          questionId: userAnswer.questionId,
          userAnswer: userAnswer.userAnswer,
          isCorrect,
          explanation,
          section: question.section,
          prompt: question.prompt,
          choices: question.choices,
          correctAnswerFull,
          userAnswerFull,
          timeSpent: userAnswer.timeSpent,
          topic,
          subtopic,
          difficultyRating,
          estimatedTimeSec,
          conceptTags,
          handbookAnchor,
        };
      }
    );

    // Calculate scores
    const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
    const overallScore = calculateScore(correctCount, gradedAnswers.length);

    // Extract section data for section score calculation
    const answersWithSection = gradedAnswers.map((a) => ({
      section: a.section,
      isCorrect: a.isCorrect,
    }));

    const sectionScores = calculateSectionScores(answersWithSection, sections);

    // Create attempt record
    const totalTimeSec = gradedAnswers.reduce(
      (sum, a) => sum + (a.timeSpent || 0),
      0
    );

    const attempt: Attempt = {
      id: `attempt-${Date.now()}`,
      quizId,
      sections,
      mode: mode || "practice",
      answers: gradedAnswers.map(({ section, ...rest }) => rest),
      overallScore,
      sectionScores,
      submittedAt: new Date().toISOString(),
      timeSpent: totalTimeSec > 0 ? Math.round(totalTimeSec / 60) : undefined,
    };

    return NextResponse.json({
      attempt,
      answers: gradedAnswers,
    });
  } catch (error) {
    console.error("Grading error:", error);
    return NextResponse.json(
      {
        error: "Failed to grade quiz",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function gradeAnswer(userAnswer: string | number, question: Question): boolean {
  if (question.type === "mcq") {
    // Normalize both to strings and compare
    return String(userAnswer).toUpperCase() ===
      String(question.correctAnswer).toUpperCase()
      ? true
      : false;
  } else if (question.type === "numeric") {
    const correctNum = Number(question.correctAnswer);
    const userNum = Number(userAnswer);

    if (isNaN(correctNum) || isNaN(userNum)) {
      return false;
    }

    const tolerance = question.tolerance || 0.05; // Default 5%
    return checkNumericAnswer(userNum, correctNum, tolerance);
  }

  return false;
}

function generateExplanation(
  userAnswer: string | number,
  question: Question,
  isCorrect: boolean
): string {
  let explanation = "";
  const handbookAnchor = question.handbookAnchor || "";

  if (isCorrect) {
    explanation = question.explanationCorrect || question.solutionOutline;
    if (handbookAnchor) {
      explanation += `\n\n📖 ${handbookAnchor}`;
    }
  } else {
    // Build a clean explanation without duplicating info
    const parts: string[] = [];

    // Why user's choice was wrong (only if we have specific distractor info)
    if (question.type === "mcq" && Array.isArray(question.choices)) {
      const userAnswerStr = String(userAnswer).toUpperCase();
      const userChoiceIndex = userAnswerStr.length === 1 && /[A-D]/.test(userAnswerStr)
        ? userAnswerStr.charCodeAt(0) - 65 : -1;

      if (
        userChoiceIndex >= 0 &&
        question.explanationCommonWrong &&
        question.explanationCommonWrong[userChoiceIndex]
      ) {
        parts.push(question.explanationCommonWrong[userChoiceIndex]);
      }
    } else if (question.type === "numeric") {
      if (question.explanationCommonWrong && question.explanationCommonWrong[0]) {
        parts.push(question.explanationCommonWrong[0]);
      }
    }

    // The actual explanation
    parts.push(question.explanationCorrect || question.solutionOutline);

    if (handbookAnchor) {
      parts.push(`📖 ${handbookAnchor}`);
    }

    explanation = parts.filter(Boolean).join("\n\n");
  }

  return explanation;
}
