export type ProgrammingLanguage = 
  | 'python' 
  | 'javascript' 
  | 'java' 
  | 'cpp' 
  | 'csharp' 
  | 'sql' 
  | 'html-css';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type QuestionType = 
  | 'predict-output' 
  | 'concept' 
  | 'debugging' 
  | 'complete-code' 
  | 'sql-practice' 
  | 'best-solution';

export interface Question {
  id: string;
  type: QuestionType;
  topic: string;
  text: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  distractorExplanations?: string[];
  correctedCode?: string;
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: ProgrammingLanguage;
  topic: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  timeLimitSeconds?: number | null; // null means untimed practice mode
  iconName: string;
  questions: Question[];
  featured?: boolean;
  isCustom?: boolean;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  language: ProgrammingLanguage;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  userAnswers: Record<string, number | null>; // questionId -> selectedIndex
  weakTopicsMissed: string[];
}

export interface LanguageInfo {
  id: ProgrammingLanguage;
  name: string;
  category: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  popularTopics: string[];
  docUrl: string;
}
