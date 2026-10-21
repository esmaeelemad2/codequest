import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  BookOpen, 
  Frown 
} from 'lucide-react';
import { Quiz, ProgrammingLanguage, Difficulty } from '../types/quiz';
import { LANGUAGES } from '../data/languages';
import { QuizCard } from '../components/QuizCard';

interface ExplorePageProps {
  quizzes: Quiz[];
  bookmarkedIds: Set<string>;
  initialLanguageFilter?: string;
  onToggleBookmark: (quizId: string) => void;
  onStartQuiz: (quizId: string) => void;
}

type SortOption = 'newest' | 'shortest' | 'questions' | 'difficulty';

export const ExplorePage: React.FC<ExplorePageProps> = ({
  quizzes,
  bookmarkedIds,
  initialLanguageFilter,
  onToggleBookmark,
  onStartQuiz,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    initialLanguageFilter || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Handle external filter update if initialLanguageFilter changes
  React.useEffect(() => {
    if (initialLanguageFilter) {
      setSelectedLanguage(initialLanguageFilter);
    }
  }, [initialLanguageFilter]);

  // Filter and Sort logic
  const filteredQuizzes = useMemo(() => {
    return quizzes
      .filter((quiz) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const titleMatch = quiz.title.toLowerCase().includes(q);
          const descMatch = quiz.description.toLowerCase().includes(q);
          const topicMatch = quiz.topic.toLowerCase().includes(q);
          const langMatch = LANGUAGES[quiz.language]?.name.toLowerCase().includes(q);
          if (!titleMatch && !descMatch && !topicMatch && !langMatch) {
            return false;
          }
        }

        // Language filter
        if (selectedLanguage !== 'all' && quiz.language !== selectedLanguage) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all' && quiz.difficulty !== selectedDifficulty) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'shortest':
            return a.estimatedMinutes - b.estimatedMinutes;
          case 'questions':
            return b.questions.length - a.questions.length;
          case 'difficulty': {
            const weights: Record<Difficulty, number> = {
              Beginner: 1,
              Intermediate: 2,
              Advanced: 3,
            };
            return weights[a.difficulty] - weights[b.difficulty];
          }
          default:
            return 0;
        }
      });
  }, [quizzes, searchQuery, selectedLanguage, selectedDifficulty, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedLanguage !== 'all' ||
    selectedDifficulty !== 'all' ||
    sortBy !== 'newest';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('all');
    setSelectedDifficulty('all');
    setSortBy('newest');
  };

  const languageOptions = Object.keys(LANGUAGES) as ProgrammingLanguage[];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider">
          <BookOpen className="h-4 w-4" />
          <span>Curated Question Library</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight sm:text-4xl mt-1">
          Explore Quizzes
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Search and filter through our full catalog of coding assessments. Test syntax, debug errors, and inspect program output across 7 top programming languages.
        </p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-5">
        {/* Search input and Quick Sort */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          {/* Search box */}
          <div className="relative sm:col-span-8">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by quiz title, keyword (e.g. 'scope', 'pointers', 'joins'), or topic..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="shortest">Shortest Duration</option>
              <option value="questions">Most Questions</option>
              <option value="difficulty">Difficulty (Beginner → Advanced)</option>
            </select>
          </div>
        </div>

        {/* Filter Badges: Language */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Programming Language
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedLanguage('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedLanguage === 'all'
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Languages ({quizzes.length})
            </button>

            {languageOptions.map((langKey) => {
              const lang = LANGUAGES[langKey];
              const count = quizzes.filter((q) => q.language === langKey).length;
              const isSelected = selectedLanguage === langKey;

              return (
                <button
                  key={langKey}
                  type="button"
                  onClick={() => setSelectedLanguage(langKey)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs font-semibold'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{lang.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Badges: Difficulty */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Difficulty:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => {
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-brand-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {diff === 'all' ? 'All Difficulties' : diff}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <p>
          Showing <span className="font-bold text-navy-900">{filteredQuizzes.length}</span> of{' '}
          {quizzes.length} available quizzes
        </p>
        {selectedLanguage !== 'all' && (
          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-brand-700 font-semibold border border-brand-200">
            Filtered: {LANGUAGES[selectedLanguage as ProgrammingLanguage]?.name}
          </span>
        )}
      </div>

      {/* Quiz Grid or Empty State */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isBookmarked={bookmarkedIds.has(quiz.id)}
              onToggleBookmark={onToggleBookmark}
              onStartQuiz={onStartQuiz}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Frown className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-navy-900">
            No matching quizzes found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any quizzes matching your search or active filters. Try adjusting your search query or reset all filters.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
