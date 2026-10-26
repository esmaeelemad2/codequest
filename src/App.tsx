import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InfoModals } from './components/InfoModals';
import { HomePage } from './views/HomePage';
import { ExplorePage } from './views/ExplorePage';
import { LanguagesPage } from './views/LanguagesPage';
import { QuizPlayPage } from './views/QuizPlayPage';
import { QuizResultPage } from './views/QuizResultPage';
import { ProgressPage } from './views/ProgressPage';
import { BookmarksPage } from './views/BookmarksPage';
import { CreatorPage } from './views/CreatorPage';
import { AiTutorPage } from './views/AiTutorPage';
import { 
  getAllQuizzes, 
  getBookmarks, 
  toggleBookmark, 
  getAttempts, 
  saveAttempt 
} from './services/storage';
import { Quiz, QuizAttempt } from './types/quiz';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>(getAllQuizzes());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(getBookmarks()));
  const [attempts, setAttempts] = useState<QuizAttempt[]>(getAttempts());
  
  // Active playing quiz and attempt
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(null);

  // AI Tutor initial prefilled message (e.g. from quiz result review)
  const [aiTutorInitialMessage, setAiTutorInitialMessage] = useState<string | undefined>(undefined);

  // Filter passed when navigating from other views (e.g. from Languages page)
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  // Info modal state
  const [infoModalType, setInfoModalType] = useState<'about' | 'contact' | 'privacy' | 'terms' | null>(null);

  // Refresh data on mount or after actions
  const reloadData = () => {
    setAllQuizzes(getAllQuizzes());
    setBookmarkedIds(new Set(getBookmarks()));
    setAttempts(getAttempts());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, activeQuizId, activeAttempt]);

  // Handle bookmarking
  const handleToggleBookmark = (quizId: string) => {
    toggleBookmark(quizId);
    setBookmarkedIds(new Set(getBookmarks()));
  };

  // Navigation router handler
  const handleNavigate = (tab: string, extraParam?: string) => {
    if (extraParam) {
      setLanguageFilter(extraParam);
    } else {
      setLanguageFilter('all');
    }
    setActiveQuizId(null);
    setActiveAttempt(null);
    if (tab !== 'ai-tutor') {
      setAiTutorInitialMessage(undefined);
    }
    setCurrentTab(tab);
  };

  // Open AI Tutor with optional initial context prompt
  const handleOpenAiTutor = (initialMessage?: string) => {
    setAiTutorInitialMessage(initialMessage);
    handleNavigate('ai-tutor');
  };

  // Start a Quiz
  const handleStartQuiz = (quizId: string) => {
    const found = allQuizzes.find((q) => q.id === quizId || q.slug === quizId);
    if (!found) {
      console.warn('Quiz not found:', quizId);
      return;
    }
    setActiveQuizId(found.id);
    setActiveAttempt(null);
    setCurrentTab('play');
  };

  // Quiz completed
  const handleCompleteQuiz = (attempt: QuizAttempt) => {
    saveAttempt(attempt);
    setAttempts(getAttempts());
    setActiveAttempt(attempt);
    setCurrentTab('result');
  };

  // Exit quiz
  const handleExitQuiz = () => {
    setActiveQuizId(null);
    setActiveAttempt(null);
    setCurrentTab('explore');
  };

  // Retake quiz
  const handleRetakeQuiz = () => {
    if (activeQuizId) {
      setActiveAttempt(null);
      setCurrentTab('play');
    }
  };

  const activeQuiz = activeQuizId
    ? allQuizzes.find((q) => q.id === activeQuizId || q.slug === activeQuizId)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        bookmarkCount={bookmarkedIds.size}
      />

      {/* Main Content View Container */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            quizzes={allQuizzes}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onStartQuiz={handleStartQuiz}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            quizzes={allQuizzes}
            bookmarkedIds={bookmarkedIds}
            initialLanguageFilter={languageFilter}
            onToggleBookmark={handleToggleBookmark}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {currentTab === 'languages' && (
          <LanguagesPage
            quizzes={allQuizzes}
            onNavigateToExploreWithLanguage={(lang) => {
              handleNavigate('explore', lang);
            }}
          />
        )}

        {currentTab === 'ai-tutor' && (
          <AiTutorPage
            key={aiTutorInitialMessage}
            initialMessage={aiTutorInitialMessage}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressPage
            quizzes={allQuizzes}
            attempts={attempts}
            onRefreshData={reloadData}
            onStartQuiz={handleStartQuiz}
            onNavigateToExplore={() => handleNavigate('explore')}
          />
        )}

        {currentTab === 'bookmarks' && (
          <BookmarksPage
            quizzes={allQuizzes}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onStartQuiz={handleStartQuiz}
            onNavigateToExplore={() => handleNavigate('explore')}
          />
        )}

        {currentTab === 'creator' && (
          <CreatorPage
            onQuizPublished={reloadData}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {currentTab === 'play' && activeQuiz && (
          <QuizPlayPage
            key={activeQuiz.id + '_' + Date.now()} // fresh state on mount
            quiz={activeQuiz}
            onCompleteQuiz={handleCompleteQuiz}
            onExitQuiz={handleExitQuiz}
          />
        )}

        {currentTab === 'result' && activeQuiz && activeAttempt && (
          <QuizResultPage
            quiz={activeQuiz}
            attempt={activeAttempt}
            onRetakeQuiz={handleRetakeQuiz}
            onExploreMore={() => handleNavigate('explore')}
            onGoHome={() => handleNavigate('home')}
            onOpenAiTutor={handleOpenAiTutor}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenModal={(type) => setInfoModalType(type)}
      />

      {/* Modals for About, Contact, Privacy, Terms */}
      <InfoModals
        isOpen={infoModalType !== null}
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </div>
  );
};

export default App;
