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
    const gradedAnswers: (UserAnswer & { section: string })[] = userAnswers.map(
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
          };
        }

        const isCorrect = gradeAnswer(userAnswer.userAnswer, question);
        const explanation = generateExplanation(
          userAnswer.userAnswer,
          question,
          isCorrect
        );

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
    explanation = `✓ CORRECT\n\n`;
    explanation += question.explanationCorrect;
    if (handbookAnchor) {
      explanation += `\n\n${handbookAnchor}`;
    }
    explanation += `\n\nSolution:\n${question.solutionOutline}`;
  } else {
    explanation = `✗ INCORRECT\n\n`;
    explanation += `Your answer: ${userAnswer}\n`;
    explanation += `Correct answer: ${question.correctAnswer}\n\n`;

    // Provide targeted feedback
    if (question.type === "mcq" && Array.isArray(question.choices)) {
      const userAnswerStr = String(userAnswer).toUpperCase();

      // Find which choice the user picked
      let userChoiceIndex = -1;
      if (userAnswerStr.length === 1 && /[A-D]/.test(userAnswerStr)) {
        userChoiceIndex = userAnswerStr.charCodeAt(0) - 65;
      }

      explanation += `Why your choice was wrong:\n`;
      if (
        userChoiceIndex >= 0 &&
        question.explanationCommonWrong &&
        question.explanationCommonWrong[userChoiceIndex]
      ) {
        explanation += `${question.explanationCommonWrong[userChoiceIndex]}\n\n`;
      }

      explanation += `Why the correct answer (${question.correctAnswer}) is right:\n`;
      explanation += `${question.explanationCorrect}\n\n`;

      if (handbookAnchor) {
        explanation += `${handbookAnchor}\n\n`;
      }

      if (question.explanationCommonWrong && question.explanationCommonWrong.length >= 4) {
        explanation += "Distractor notes:\n";
        const labels = ["A", "B", "C", "D"];
        question.explanationCommonWrong.forEach((note, idx) => {
          if (note) {
            explanation += `${labels[idx]}: ${note}\n`;
          }
        });
        explanation += "\n";
      }
    } else if (question.type === "numeric") {
      explanation += `Why this is incorrect:\n`;
      if (question.explanationCommonWrong && question.explanationCommonWrong[0]) {
        explanation += `${question.explanationCommonWrong[0]}\n\n`;
      }

      explanation += `Correct approach:\n`;
      explanation += `${question.explanationCorrect}\n\n`;

      if (handbookAnchor) {
        explanation += `${handbookAnchor}\n\n`;
      }
    }

    explanation += `Solution Steps:\n${question.solutionOutline}`;
  }

  return explanation;
}
