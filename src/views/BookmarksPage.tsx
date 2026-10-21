import React, { useState, useMemo } from 'react';
import { Bookmark, Compass, Search } from 'lucide-react';
import { Quiz } from '../types/quiz';
import { QuizCard } from '../components/QuizCard';

interface BookmarksPageProps {
  quizzes: Quiz[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (quizId: string) => void;
  onStartQuiz: (quizId: string) => void;
  onNavigateToExplore: () => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
  quizzes,
  bookmarkedIds,
  onToggleBookmark,
  onStartQuiz,
  onNavigateToExplore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const savedQuizzes = useMemo(() => {
    return quizzes.filter((q) => bookmarkedIds.has(q.id));
  }, [quizzes, bookmarkedIds]);

  const filteredQuizzes = useMemo(() => {
    if (!searchQuery.trim()) return savedQuizzes;
    const q = searchQuery.toLowerCase().trim();
    return savedQuizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q) ||
        quiz.topic.toLowerCase().includes(q)
    );
  }, [savedQuizzes, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider">
            <Bookmark className="h-4 w-4" />
            <span>Saved Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight sm:text-4xl mt-1">
            My Bookmarked Quizzes
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-xl">
            Quickly access and practice your hand-picked quizzes. Bookmarks persist locally across browser sessions.
          </p>
        </div>

        {savedQuizzes.length > 0 && (
          <span className="self-start rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-bold text-brand-700">
            {savedQuizzes.length} {savedQuizzes.length === 1 ? 'Quiz' : 'Quizzes'} Saved
          </span>
        )}
      </div>

      {savedQuizzes.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Bookmark className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-navy-900">
            No quizzes bookmarked yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Click the bookmark icon on any quiz card in the catalog to save it here for convenient quick practice later.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onNavigateToExplore}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 active:scale-[0.98]"
            >
              <Compass className="h-4 w-4" />
              <span>Browse Quiz Catalog</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search within bookmarks */}
          {savedQuizzes.length > 3 && (
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved quizzes..."
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
                onStartQuiz={onStartQuiz}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
