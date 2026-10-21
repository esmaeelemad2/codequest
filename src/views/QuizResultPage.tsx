import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Compass, 
  Home, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Check, 
  X
} from 'lucide-react';
import { Quiz, QuizAttempt } from '../types/quiz';
import { CodeBlock } from '../components/CodeBlock';
import { LANGUAGES } from '../data/languages';

interface QuizResultPageProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetakeQuiz: () => void;
  onExploreMore: () => void;
  onGoHome: () => void;
}

export const QuizResultPage: React.FC<QuizResultPageProps> = ({
  quiz,
  attempt,
  onRetakeQuiz,
  onExploreMore,
  onGoHome,
}) => {
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire confetti for scores 75% or higher
    if (attempt.scorePercentage >= 75) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#7c3aed', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  }, [attempt.scorePercentage]);

  const scrollToReview = () => {
    reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getFeedbackMessage = (pct: number) => {
    if (pct >= 90) return { title: 'Outstanding!', message: 'Outstanding! You really know your code.', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (pct >= 75) return { title: 'Great Job!', message: 'Great job! Keep building your skills.', color: 'text-brand-700 bg-brand-50 border-brand-200' };
    if (pct >= 50) return { title: 'Good Effort!', message: 'Good effort. Review your mistakes and try again.', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { title: 'Keep Practicing!', message: 'Keep practicing. Every mistake helps you learn.', color: 'text-slate-700 bg-slate-100 border-slate-200' };
  };

  const feedback = getFeedbackMessage(attempt.scorePercentage);
  const lang = LANGUAGES[quiz.language] || { name: quiz.language, badgeBg: 'bg-slate-100 text-slate-800' };

  // Calculate circular SVG progress values
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attempt.scorePercentage / 100) * circumference;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    if (mins === 0) return `${sec}s`;
    return `${mins}m ${remaining}s`;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header & Score Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
        {/* Banner */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-brand-50/40 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`rounded-lg px-2.5 py-0.5 text-xs font-bold ${lang.badgeBg}`}>
                {lang.name}
              </span>
              <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {quiz.difficulty}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-navy-900 sm:text-3xl">
              {quiz.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Completed on {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Circular Score Indicator */}
          <div className="relative flex shrink-0 items-center justify-center">
            <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={attempt.scorePercentage >= 75 ? '#2563eb' : attempt.scorePercentage >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-navy-900">
                {attempt.scorePercentage}%
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Final Score
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className={`rounded-2xl border p-4 text-center sm:text-left ${feedback.color}`}>
            <h3 className="text-base font-bold">{feedback.title}</h3>
            <p className="mt-0.5 text-xs sm:text-sm font-medium">{feedback.message}</p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Correct</span>
              </div>
              <span className="mt-1 block text-2xl font-bold text-emerald-900">
                {attempt.correctAnswers}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">
                {attempt.totalQuestions > 0 ? Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100) : 0}% of total
              </span>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-700 text-xs font-semibold">
                <XCircle className="h-4 w-4" />
                <span>Incorrect</span>
              </div>
              <span className="mt-1 block text-2xl font-bold text-rose-900">
                {attempt.incorrectAnswers}
              </span>
              <span className="text-[11px] text-rose-600 font-medium">Missed answers</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-700 text-xs font-semibold">
                <HelpCircle className="h-4 w-4" />
                <span>Unanswered</span>
              </div>
              <span className="mt-1 block text-2xl font-bold text-slate-900">
                {attempt.unanswered}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">No credit given</span>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-blue-700 text-xs font-semibold">
                <Clock className="h-4 w-4" />
                <span>Time Taken</span>
              </div>
              <span className="mt-1 block text-2xl font-bold text-blue-900">
                {formatSeconds(attempt.timeTakenSeconds)}
              </span>
              <span className="text-[11px] text-blue-600 font-medium">Total duration</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={onRetakeQuiz}
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 active:scale-[0.98]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Quiz</span>
              </button>

              <button
                type="button"
                onClick={scrollToReview}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span>Review All Answers</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={onExploreMore}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Compass className="h-4 w-4" />
                <span>Explore More</span>
              </button>

              <button
                type="button"
                onClick={onGoHome}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Question-by-Question Review Section */}
      <div ref={reviewRef} className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">
              Question-by-Question Answer Review
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Inspect your answers against the correct solutions and read educational explanations for all concepts.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((q, idx) => {
            const userChoiceIdx = attempt.userAnswers[q.id];
            const isCorrect = userChoiceIdx === q.correctIndex;
            const isUnanswered = userChoiceIdx === null || userChoiceIdx === undefined;

            return (
              <div
                key={q.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-card transition-all ${
                  isCorrect
                    ? 'border-emerald-200/90'
                    : isUnanswered
                    ? 'border-slate-300'
                    : 'border-rose-200/90'
                }`}
              >
                {/* Header */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 px-6 py-3.5 text-xs font-semibold ${
                    isCorrect
                      ? 'bg-emerald-50/70 text-emerald-800'
                      : isUnanswered
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-rose-50/70 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold shadow-xs">
                      {idx + 1}
                    </span>
                    <span>Question {idx + 1} of {quiz.questions.length}</span>
                    <span className="text-slate-400 font-normal">• {q.topic}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Correct (+1)</span>
                      </>
                    ) : isUnanswered ? (
                      <>
                        <HelpCircle className="h-4 w-4 text-slate-500" />
                        <span>Unanswered (0)</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-rose-600" />
                        <span>Incorrect (0)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Question Text */}
                  <div className="text-sm font-semibold text-navy-900 leading-relaxed">
                    {q.text}
                  </div>

                  {/* Code Snippet if applicable */}
                  {q.codeSnippet && (
                    <CodeBlock
                      code={q.codeSnippet}
                      language={q.codeLanguage || quiz.language}
                    />
                  )}

                  {/* Option Comparison */}
                  <div className="space-y-2 pt-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Options Breakdown:
                    </span>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctIndex;
                        const isThisUserChoice = optIdx === userChoiceIdx;
                        const optLetter = String.fromCharCode(65 + optIdx);

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs font-mono leading-relaxed transition-colors ${
                              isThisCorrect
                                ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 font-semibold ring-1 ring-emerald-500/30'
                                : isThisUserChoice
                                ? 'border-rose-300 bg-rose-50/50 text-rose-950 ring-1 ring-rose-500/30'
                                : 'border-slate-200 bg-slate-50/50 text-slate-600'
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                                isThisCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : isThisUserChoice
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {optLetter}
                            </span>

                            <div className="flex-1 whitespace-pre-wrap">{opt}</div>

                            <div className="shrink-0 font-sans text-[11px] font-semibold flex items-center gap-1">
                              {isThisCorrect && (
                                <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {isThisUserChoice && !isThisCorrect && (
                                <span className="rounded bg-rose-100 px-2 py-0.5 text-rose-800">
                                  ✗ Your Choice
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Explanation Box */}
                  <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-slate-700 leading-relaxed space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900">
                      <Sparkles className="h-4 w-4 text-brand-600" />
                      <span>Why This is Correct:</span>
                    </div>
                    <p className="whitespace-pre-line text-slate-800">{q.explanation}</p>

                    {/* Corrected Code if debugging */}
                    {q.correctedCode && (
                      <div className="mt-3 pt-3 border-t border-blue-200/80">
                        <span className="font-semibold text-blue-900 block mb-1">
                          Corrected Code Solution:
                        </span>
                        <CodeBlock
                          code={q.correctedCode}
                          language={q.codeLanguage || quiz.language}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center gap-4 py-8">
          <button
            type="button"
            onClick={onRetakeQuiz}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake This Quiz</span>
          </button>
          <button
            type="button"
            onClick={onExploreMore}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <Compass className="h-4 w-4 text-slate-500" />
            <span>Explore Other Quizzes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
