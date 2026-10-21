import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle, 
  Send 
} from 'lucide-react';
import { Quiz, QuestionType, QuizAttempt } from '../types/quiz';
import { LANGUAGES } from '../data/languages';
import { CodeBlock } from '../components/CodeBlock';
import { ConfirmModal } from '../components/ConfirmModal';

interface QuizPlayPageProps {
  quiz: Quiz;
  onCompleteQuiz: (attempt: QuizAttempt) => void;
  onExitQuiz: () => void;
}

export const QuizPlayPage: React.FC<QuizPlayPageProps> = ({
  quiz,
  onCompleteQuiz,
  onExitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.timeLimitSeconds && quiz.timeLimitSeconds > 0 ? quiz.timeLimitSeconds : null
  );
  const [startTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.values(selectedAnswers).filter((v) => v !== null && v !== undefined).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Countdown Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAttempt = () => {
    if (unansweredCount > 0) {
      setShowIncompleteModal(true);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    let correctCount = 0;
    let incorrectCount = 0;
    let unansCount = 0;
    const weakTopicsMissed: string[] = [];

    quiz.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected === null || selected === undefined) {
        unansCount += 1;
        weakTopicsMissed.push(q.topic);
      } else if (selected === q.correctIndex) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
        weakTopicsMissed.push(q.topic);
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const attempt: QuizAttempt = {
      id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      quizId: quiz.id,
      quizTitle: quiz.title,
      language: quiz.language,
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unanswered: unansCount,
      scorePercentage,
      timeTakenSeconds: timeSpentSeconds,
      completedAt: new Date().toISOString(),
      userAnswers: selectedAnswers,
      weakTopicsMissed,
    };

    onCompleteQuiz(attempt);
  };

  const getTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'predict-output':
        return 'Predict the Output';
      case 'debugging':
        return 'Debugging Challenge';
      case 'concept':
        return 'Language Concept';
      case 'complete-code':
        return 'Complete the Code';
      case 'sql-practice':
        return 'SQL Query Practice';
      case 'best-solution':
        return 'Best Practice / Idiom';
      default:
        return 'Question';
    }
  };

  const langInfo = LANGUAGES[quiz.language] || {
    name: quiz.language,
    badgeBg: 'bg-slate-100 text-slate-800',
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar: Back button, Quiz title, Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Exit Quiz</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${langInfo.badgeBg}`}>
                {langInfo.name}
              </span>
              <h1 className="text-base font-bold text-navy-900 truncate max-w-[280px] sm:max-w-md">
                {quiz.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Timer or Mode indicator */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {timeLeft !== null ? (
            <div
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-bold shadow-xs ${
                timeLeft < 60
                  ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                  : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              <Clock className="h-4 w-4 text-slate-500" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Untimed Practice</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmitAttempt}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit Quiz</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>
            Question <strong className="text-navy-900">{currentIndex + 1}</strong> of{' '}
            <strong className="text-navy-900">{totalQuestions}</strong>
          </span>
          <span>
            {answeredCount} of {totalQuestions} answered ({unansweredCount} remaining)
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          {/* Question Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <span className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-200">
              {getTypeLabel(currentQuestion.type)}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Topic: <strong className="text-slate-800">{currentQuestion.topic}</strong>
            </span>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-semibold text-navy-900 leading-relaxed">
            {currentQuestion.text}
          </div>

          {/* Code Snippet if applicable */}
          {currentQuestion.codeSnippet && (
            <CodeBlock
              code={currentQuestion.codeSnippet}
              language={currentQuestion.codeLanguage || quiz.language}
            />
          )}

          {/* Selectable Options */}
          <div className="space-y-3 pt-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select one option:
            </span>
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                const optionLetter = String.fromCharCode(65 + optIdx); // 'A', 'B', 'C', 'D'

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`group w-full flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-150 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 text-brand-950 shadow-xs ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-800'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {optionLetter}
                    </div>

                    <div className="flex-1 font-mono text-xs sm:text-sm pt-0.5 leading-relaxed">
                      {option}
                    </div>

                    <div className="pt-0.5">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle className="h-3.5 w-3.5 fill-current" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 active:scale-[0.98]"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitAttempt}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98]"
              >
                <span>Submit Quiz</span>
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Overview Jump Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
          <span className="font-semibold text-navy-900">Question Navigator</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-600" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-slate-100" /> Unanswered
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== null && selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-brand-600 ring-offset-2 bg-brand-600 text-white shadow-xs'
                    : isAnswered
                    ? 'bg-brand-100 text-brand-800 hover:bg-brand-200'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
                title={`Go to Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Incomplete Submission Confirmation Modal */}
      <ConfirmModal
        isOpen={showIncompleteModal}
        title="Incomplete Quiz"
        message={`You still have ${unansweredCount} unanswered ${
          unansweredCount === 1 ? 'question' : 'questions'
        }. Unanswered questions receive zero credit. Are you sure you want to submit now?`}
        confirmLabel="Yes, Submit Anyway"
        cancelLabel="Continue Answering"
        onConfirm={() => {
          setShowIncompleteModal(false);
          handleFinalSubmit();
        }}
        onCancel={() => setShowIncompleteModal(false)}
      />

      {/* Exit Quiz Confirmation Modal */}
      <ConfirmModal
        isOpen={showExitModal}
        title="Exit Quiz?"
        message="Your current answers for this attempt will not be saved if you exit now. Are you sure you want to leave?"
        confirmLabel="Exit to Quizzes"
        cancelLabel="Stay in Quiz"
        isDestructive={true}
        onConfirm={() => {
          setShowExitModal(false);
          onExitQuiz();
        }}
        onCancel={() => setShowExitModal(false)}
      />
    </div>
  );
};
