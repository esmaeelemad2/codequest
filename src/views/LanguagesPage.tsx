import React from 'react';
import { 
  Layers, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';
import { Quiz, ProgrammingLanguage } from '../types/quiz';
import { LANGUAGES } from '../data/languages';

interface LanguagesPageProps {
  quizzes: Quiz[];
  onNavigateToExploreWithLanguage: (language: string) => void;
}

export const LanguagesPage: React.FC<LanguagesPageProps> = ({
  quizzes,
  onNavigateToExploreWithLanguage,
}) => {
  const languageKeys = Object.keys(LANGUAGES) as ProgrammingLanguage[];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider">
          <Layers className="h-4 w-4" />
          <span>Curriculum Tracks</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight sm:text-4xl mt-1">
          Programming Languages
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed">
          CodeQuest covers a focused set of high-impact programming languages. Choose your track below to inspect quiz collections, syllabus topics, and practice questions.
        </p>
      </div>

      {/* Language Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {languageKeys.map((langKey) => {
          const lang = LANGUAGES[langKey];
          const langQuizzes = quizzes.filter((q) => q.language === langKey);
          const totalQuestions = langQuizzes.reduce((acc, q) => acc + q.questions.length, 0);

          return (
            <div
              key={langKey}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${lang.badgeBg}`}
                  >
                    {lang.name}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {lang.category}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="mt-4 text-xl font-bold text-navy-900">
                  {lang.name}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed min-h-[48px]">
                  {lang.description}
                </p>

                {/* Popular Topics Pills */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Key Topics Covered:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {lang.popularTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-50 border border-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50/70 p-3 text-center border border-slate-100">
                  <div>
                    <span className="text-base font-bold text-navy-900">
                      {langQuizzes.length}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Available Quizzes
                    </p>
                  </div>
                  <div>
                    <span className="text-base font-bold text-brand-600">
                      {totalQuestions}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Total Questions
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={lang.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  title="Official Documentation"
                >
                  <span>Docs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={() => onNavigateToExploreWithLanguage(langKey)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 active:scale-[0.98] transition-all"
                >
                  <span>Explore Quizzes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
