import { 
  SecurityAttempt, 
  SecurityProgressSummary, 
  SecurityTopic, 
  SecurityTopicStats 
} from '../types/security';
import { SECURITY_CHALLENGES, SECURITY_TOPICS_META } from '../data/securityChallenges';

const SECURITY_STORAGE_KEY = 'codequest_security_attempts_v1';

export const getSecurityAttempts = (): SecurityAttempt[] => {
  try {
    const raw = localStorage.getItem(SECURITY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse security attempts from localStorage', e);
    return [];
  }
};

export const saveSecurityAttempt = (attempt: SecurityAttempt): void => {
  const existing = getSecurityAttempts();
  const updated = [attempt, ...existing];
  try {
    localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save security attempt', e);
  }
};

export const clearSecurityProgress = (): void => {
  try {
    localStorage.removeItem(SECURITY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear security progress', e);
  }
};

export const calculateSecuritySummary = (): SecurityProgressSummary => {
  const attempts = getSecurityAttempts();
  const totalChallenges = SECURITY_CHALLENGES.length;

  // Initialize topic breakdown with all 8 topics
  const allTopics = Object.keys(SECURITY_TOPICS_META) as SecurityTopic[];
  const topicBreakdown: Record<SecurityTopic, SecurityTopicStats> = {} as Record<SecurityTopic, SecurityTopicStats>;

  allTopics.forEach((topicKey) => {
    topicBreakdown[topicKey] = {
      topic: topicKey,
      topicLabel: SECURITY_TOPICS_META[topicKey].label,
      totalAttempts: 0,
      correctAttempts: 0,
      accuracy: 0,
    };
  });

  const completedSet = new Set<string>();
  const passedSet = new Set<string>();
  const challengeLatestResult: Record<string, boolean> = {};

  // Traverse attempts (from newest to oldest)
  attempts.forEach((att) => {
    completedSet.add(att.challengeId);
    if (att.isCorrect) {
      passedSet.add(att.challengeId);
    }
    if (challengeLatestResult[att.challengeId] === undefined) {
      challengeLatestResult[att.challengeId] = att.isCorrect;
    }

    if (topicBreakdown[att.topic]) {
      topicBreakdown[att.topic].totalAttempts += 1;
      if (att.isCorrect) {
        topicBreakdown[att.topic].correctAttempts += 1;
      }
    }
  });

  // Calculate percentages
  let totalCorrect = 0;
  allTopics.forEach((topicKey) => {
    const st = topicBreakdown[topicKey];
    if (st.totalAttempts > 0) {
      st.accuracy = Math.round((st.correctAttempts / st.totalAttempts) * 100);
      totalCorrect += st.correctAttempts;
    }
  });

  const overallAccuracy = attempts.length > 0
    ? Math.round((totalCorrect / attempts.length) * 100)
    : 0;

  // Strongest topics (at least 1 attempt, sorted by accuracy descending)
  const activeTopics = allTopics.filter((t) => topicBreakdown[t].totalAttempts > 0);

  const strongestTopics = [...activeTopics]
    .map((t) => topicBreakdown[t])
    .filter((st) => st.accuracy >= 70)
    .sort((a, b) => b.accuracy - a.accuracy || b.totalAttempts - a.totalAttempts);

  // Topics needing practice (either accuracy < 70% with attempts, or failed latest challenge)
  const topicsNeedingPractice = [...activeTopics]
    .map((t) => topicBreakdown[t])
    .filter((st) => st.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy);

  // Suggested challenges:
  // 1. Challenges the user failed on their latest attempt
  // 2. Challenges in weak topics
  // 3. Unattempted challenges
  const suggestedChallengeIds: string[] = [];
  const seenIds = new Set<string>();

  // Prioritize failed challenges
  SECURITY_CHALLENGES.forEach((c) => {
    if (challengeLatestResult[c.id] === false && !seenIds.has(c.id)) {
      seenIds.add(c.id);
      suggestedChallengeIds.push(c.id);
    }
  });

  // Next, challenges from weak topics
  topicsNeedingPractice.forEach((weakSt) => {
    SECURITY_CHALLENGES.filter((c) => c.topic === weakSt.topic).forEach((c) => {
      if (!seenIds.has(c.id)) {
        seenIds.add(c.id);
        suggestedChallengeIds.push(c.id);
      }
    });
  });

  // Next, unattempted challenges
  SECURITY_CHALLENGES.forEach((c) => {
    if (!completedSet.has(c.id) && !seenIds.has(c.id)) {
      seenIds.add(c.id);
      suggestedChallengeIds.push(c.id);
    }
  });

  return {
    totalChallenges,
    completedChallengesCount: completedSet.size,
    totalAttemptsCount: attempts.length,
    overallAccuracy,
    completedIds: Array.from(completedSet),
    passedIds: Array.from(passedSet),
    topicBreakdown,
    strongestTopics,
    topicsNeedingPractice,
    recentAttempts: attempts.slice(0, 10),
    suggestedChallengeIds: suggestedChallengeIds.slice(0, 4),
  };
};
