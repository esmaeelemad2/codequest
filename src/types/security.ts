export type SecurityTopic =
  | 'sql-injection'
  | 'xss'
  | 'broken-access-control'
  | 'insecure-auth'
  | 'hardcoded-secrets'
  | 'input-validation'
  | 'insecure-error-handling'
  | 'sensitive-data-exposure';

export type SecurityDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SecurityChallenge {
  id: string;
  slug: string;
  title: string;
  topic: SecurityTopic;
  topicLabel: string;
  owaspCategory: string; // e.g. "OWASP A03:2025 - Injection"
  cwe: string;          // e.g. "CWE-89"
  difficulty: SecurityDifficulty;
  language: string;     // 'python' | 'javascript' | 'sql' | 'csharp'
  estimatedMinutes: number;
  scenario: string;
  codeSnippet: string;
  codeFilename?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mitigation: string;
  secureCode: string;
  secureCodeFilename?: string;
  secureCodeExplanation: string;
}

export interface SecurityAttempt {
  id: string;
  challengeId: string;
  challengeTitle: string;
  topic: SecurityTopic;
  topicLabel: string;
  difficulty: SecurityDifficulty;
  selectedOption: number;
  isCorrect: boolean;
  timeTakenSeconds: number;
  completedAt: string; // ISO string
}

export interface SecurityTopicStats {
  topic: SecurityTopic;
  topicLabel: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
}

export interface SecurityProgressSummary {
  totalChallenges: number;
  completedChallengesCount: number;
  totalAttemptsCount: number;
  overallAccuracy: number;
  completedIds: string[];
  passedIds: string[];
  topicBreakdown: Record<SecurityTopic, SecurityTopicStats>;
  strongestTopics: SecurityTopicStats[];
  topicsNeedingPractice: SecurityTopicStats[];
  recentAttempts: SecurityAttempt[];
  suggestedChallengeIds: string[];
}
