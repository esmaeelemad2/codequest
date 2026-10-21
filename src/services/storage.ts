import { Quiz, QuizAttempt } from '../types/quiz';
import { INITIAL_QUIZZES } from '../data/quizzes';

const STORAGE_KEYS = {
  BOOKMARKS: 'codequest_bookmarks_v1',
  ATTEMPTS: 'codequest_attempts_v1',
  CUSTOM_QUIZZES: 'codequest_custom_quizzes_v1',
};

// Bookmarks
export const getBookmarks = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse bookmarks from localStorage', e);
    return [];
  }
};

export const isBookmarked = (quizId: string): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.includes(quizId);
};

export const toggleBookmark = (quizId: string): boolean => {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(quizId);
  let updated: string[];
  let newState: boolean;

  if (index >= 0) {
    updated = bookmarks.filter(id => id !== quizId);
    newState = false;
  } else {
    updated = [quizId, ...bookmarks];
    newState = true;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save bookmark', e);
  }

  return newState;
};

// Attempts
export const getAttempts = (): QuizAttempt[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse attempts from localStorage', e);
    return [];
  }
};

export const saveAttempt = (attempt: QuizAttempt): void => {
  const attempts = getAttempts();
  const updated = [attempt, ...attempts];
  try {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save quiz attempt', e);
  }
};

export const clearAllProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  } catch (e) {
    console.error('Failed to clear progress', e);
  }
};

// Custom Quizzes (for Creator / Admin)
export const getCustomQuizzes = (): Quiz[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUIZZES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse custom quizzes', e);
    return [];
  }
};

export const saveCustomQuiz = (quiz: Quiz): void => {
  const custom = getCustomQuizzes();
  const existingIndex = custom.findIndex(q => q.id === quiz.id);
  let updated: Quiz[];
  if (existingIndex >= 0) {
    updated = [...custom];
    updated[existingIndex] = quiz;
  } else {
    updated = [quiz, ...custom];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom quiz', e);
  }
};

export const deleteCustomQuiz = (quizId: string): void => {
  const custom = getCustomQuizzes();
  const updated = custom.filter(q => q.id !== quizId);
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete custom quiz', e);
  }
};

export const getAllQuizzes = (): Quiz[] => {
  const custom = getCustomQuizzes();
  return [...custom, ...INITIAL_QUIZZES];
};

// Analytics & Stats
export interface StatsSummary {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  totalTimeSeconds: number;
  completedQuizIds: Set<string>;
  languageBreakdown: Record<string, { attempts: number; avgScore: number; bestScore: number }>;
  weakTopics: Array<{ topic: string; missCount: number }>;
  recommendedQuizzes: Quiz[];
}

export const calculateStats = (allQuizzes: Quiz[] = INITIAL_QUIZZES): StatsSummary => {
  const attempts = getAttempts();
  
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      totalTimeSeconds: 0,
      completedQuizIds: new Set(),
      languageBreakdown: {},
      weakTopics: [],
      recommendedQuizzes: allQuizzes.filter(q => q.featured).slice(0, 3),
    };
  }

  let totalScore = 0;
  let highestScore = 0;
  let totalTime = 0;
  const completedQuizIds = new Set<string>();
  const langMap: Record<string, { attempts: number; sumScore: number; bestScore: number }> = {};
  const topicMissMap: Record<string, number> = {};

  attempts.forEach(att => {
    totalScore += att.scorePercentage;
    if (att.scorePercentage > highestScore) highestScore = att.scorePercentage;
    totalTime += att.timeTakenSeconds || 0;
    completedQuizIds.add(att.quizId);

    // Language stats
    if (!langMap[att.language]) {
      langMap[att.language] = { attempts: 0, sumScore: 0, bestScore: 0 };
    }
    langMap[att.language].attempts += 1;
    langMap[att.language].sumScore += att.scorePercentage;
    if (att.scorePercentage > langMap[att.language].bestScore) {
      langMap[att.language].bestScore = att.scorePercentage;
    }

    // Weak topics
    if (att.weakTopicsMissed && Array.isArray(att.weakTopicsMissed)) {
      att.weakTopicsMissed.forEach(topic => {
        topicMissMap[topic] = (topicMissMap[topic] || 0) + 1;
      });
    }
  });

  const languageBreakdown: Record<string, { attempts: number; avgScore: number; bestScore: number }> = {};
  Object.keys(langMap).forEach(lang => {
    languageBreakdown[lang] = {
      attempts: langMap[lang].attempts,
      avgScore: Math.round(langMap[lang].sumScore / langMap[lang].attempts),
      bestScore: langMap[lang].bestScore,
    };
  });

  const weakTopics = Object.entries(topicMissMap)
    .map(([topic, missCount]) => ({ topic, missCount }))
    .sort((a, b) => b.missCount - a.missCount);

  // Recommendations:
  // If user missed questions in a language or topic, recommend quizzes in that language or topic that they haven't aced (score < 80)
  const lowestScoringLanguages = Object.entries(languageBreakdown)
    .sort((a, b) => a[1].avgScore - b[1].avgScore)
    .map(([lang]) => lang);

  let recommendedQuizzes: Quiz[] = [];

  if (lowestScoringLanguages.length > 0) {
    const focusLang = lowestScoringLanguages[0];
    recommendedQuizzes = allQuizzes.filter(q => q.language === focusLang);
  }

  // Fallback or append uncompleted quizzes
  const uncompleted = allQuizzes.filter(q => !completedQuizIds.has(q.id));
  if (recommendedQuizzes.length < 3) {
    recommendedQuizzes = [...recommendedQuizzes, ...uncompleted];
  }

  // Remove duplicates and trim to 3
  const seenIds = new Set<string>();
  const filteredRecommendations: Quiz[] = [];
  for (const q of recommendedQuizzes) {
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      filteredRecommendations.push(q);
      if (filteredRecommendations.length === 3) break;
    }
  }

  return {
    totalAttempts: attempts.length,
    averageScore: Math.round(totalScore / attempts.length),
    highestScore,
    totalTimeSeconds: totalTime,
    completedQuizIds,
    languageBreakdown,
    weakTopics,
    recommendedQuizzes: filteredRecommendations,
  };
};
