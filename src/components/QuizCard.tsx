import React from 'react';
import { Bookmark, Clock, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Quiz } from '../types/quiz';
import { LANGUAGES } from '../data/languages';

interface QuizCardProps {
  quiz: Quiz;
  isBookmarked: boolean;
  onToggleBookmark: (quizId: string) => void;
  onStartQuiz: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  isBookmarked,
  onToggleBookmark,
  onStartQuiz,
}) => {
  const lang = LANGUAGES[quiz.language] || {
    name: quiz.language,
    badgeBg: 'bg-slate-100 text-slate-800',
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1">
      {quiz.featured && (
        <div className="absolute -top-3 left-6 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-violet-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
          <Sparkles className="h-3 w-3" />
          Featured
        </div>
      )}

      <div>
        {/* Badges and Bookmark Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${lang.badgeBg}`}
            >
              {lang.name}
            </span>
            <span
              className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium ${getDifficultyBadge(
                quiz.difficulty
              )}`}
            >
              {quiz.difficulty}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(quiz.id);
            }}
            className={`rounded-lg p-2 transition-colors ${
              isBookmarked
                ? 'bg-brand-50 text-brand-600'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this quiz'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this quiz'}
          >
            <Bookmark
              className="h-4 w-4"
              fill={isBookmarked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Title and Description */}
        <h3 className="mt-4 text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
          {quiz.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {quiz.description}
        </p>

        {/* Meta Info */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>{quiz.questions.length} Questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>~{quiz.estimatedMinutes} Mins</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>•</span>
            <span className="truncate max-w-[130px]">{quiz.topic}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {quiz.timeLimitSeconds ? 'Timed Mode' : 'Untimed Practice'}
        </span>
        <button
          type="button"
          onClick={() => onStartQuiz(quiz.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 transition-all active:scale-[0.98]"
        >
          <span>Start Quiz</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
