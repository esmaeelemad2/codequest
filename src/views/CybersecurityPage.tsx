import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  BarChart3, 
  BookOpen, 
  Lock 
} from 'lucide-react';
import { 
  SecurityTopic 
} from '../types/security';
import { 
  SECURITY_CHALLENGES, 
  SECURITY_TOPICS_META 
} from '../data/securityChallenges';
import { SecurityChallengeCard } from '../components/security/SecurityChallengeCard';
import { SecurityChallengeRunner } from '../components/security/SecurityChallengeRunner';
import { SecurityDashboardView } from '../components/security/SecurityDashboardView';
import { calculateSecuritySummary } from '../services/securityStorage';

interface CybersecurityPageProps {
  onNavigateHome: () => void;
}

export const CybersecurityPage: React.FC<CybersecurityPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'dashboard'>('catalog');
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Summary state for reactivity
  const [summary, setSummary] = useState(calculateSecuritySummary());

  const refreshSummary = () => {
    setSummary(calculateSecuritySummary());
  };

  const allTopics = Object.keys(SECURITY_TOPICS_META) as SecurityTopic[];

  // Filter challenges
  const filteredChallenges = SECURITY_CHALLENGES.filter((c) => {
    // Topic filter
    if (selectedTopic !== 'all' && c.topic !== selectedTopic) {
      return false;
    }
    // Difficulty filter
    if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) {
      return false;
    }
    // Status filter
    if (selectedStatus === 'solved') {
      if (!summary.passedIds.includes(c.id)) return false;
    } else if (selectedStatus === 'review') {
      if (!summary.completedIds.includes(c.id) || summary.passedIds.includes(c.id)) {
        return false;
      }
    } else if (selectedStatus === 'unattempted') {
      if (summary.completedIds.includes(c.id)) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.topicLabel.toLowerCase().includes(q) ||
        c.cwe.toLowerCase().includes(q) ||
        c.owaspCategory.toLowerCase().includes(q) ||
        c.language.toLowerCase().includes(q) ||
        c.scenario.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const activeChallenge = activeChallengeId
    ? SECURITY_CHALLENGES.find((c) => c.id === activeChallengeId)
    : null;

  const currentChallengeIndex = activeChallenge
    ? SECURITY_CHALLENGES.findIndex((c) => c.id === activeChallenge.id)
    : -1;

  const hasNext =
    currentChallengeIndex >= 0 &&
    currentChallengeIndex < SECURITY_CHALLENGES.length - 1;

  const handleNextChallenge = () => {
    if (hasNext) {
      const nextChallenge = SECURITY_CHALLENGES[currentChallengeIndex + 1];
      setActiveChallengeId(nextChallenge.id);
    }
  };

  // If a challenge is currently active in the runner, display runner
  if (activeChallenge) {
    return (
      <SecurityChallengeRunner
        challenge={activeChallenge}
        onBack={() => setActiveChallengeId(null)}
        onNextChallenge={hasNext ? handleNextChallenge : undefined}
        onChallengeUpdated={refreshSummary}
        hasNext={hasNext}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-brand-50/70 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            <span>OWASP Top 10 Aligned Practical Defense</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            Secure Coding <span className="text-brand-600">Challenges</span>
          </h1>

          <p className="text-base text-slate-600 sm:text-lg leading-relaxed">
            Learn to spot vulnerabilities, understand security risks, and write safer code.
          </p>

          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Hands-on training for developers to identify common web application security weaknesses—from SQL injection and XSS to broken access control and sensitive data exposure—paired with production-ready mitigation patterns.
          </p>

          {/* Educational Safety Banner */}
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
            <Lock className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Educational Demonstration:</strong> All challenges run safely in a sandbox using predefined code samples. No external attacks, network scans, or live arbitrary code executions are performed.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-brand-600 text-white shadow-xs shadow-brand-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>All Challenges</span>
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
              {SECURITY_CHALLENGES.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-brand-600 text-white shadow-xs shadow-brand-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Security Dashboard & Analytics</span>
            {summary.completedChallengesCount > 0 && (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                {summary.completedChallengesCount}/{summary.totalChallenges}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'dashboard' ? (
        <SecurityDashboardView
          summary={summary}
          onRefresh={refreshSummary}
          onSelectChallenge={(id) => setActiveChallengeId(id)}
          onGoToChallenges={() => setActiveTab('catalog')}
        />
      ) : (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              {/* Search Bar */}
              <div className="relative md:col-span-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vulnerabilities, CWE-89, language..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Topic Select */}
              <div className="md:col-span-3">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-brand-500 focus:bg-white focus:outline-none"
                >
                  <option value="all">All Security Topics ({SECURITY_CHALLENGES.length})</option>
                  {allTopics.map((topicKey) => (
                    <option key={topicKey} value={topicKey}>
                      {SECURITY_TOPICS_META[topicKey].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Select */}
              <div className="md:col-span-2">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-brand-500 focus:bg-white focus:outline-none"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Status Select */}
              <div className="md:col-span-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-brand-500 focus:bg-white focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="unattempted">Unattempted</option>
                  <option value="solved">Solved</option>
                  <option value="review">Needs Practice</option>
                </select>
              </div>
            </div>

            {/* Topic Filter Quick Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Topics:
              </span>
              <button
                type="button"
                onClick={() => setSelectedTopic('all')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  selectedTopic === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {allTopics.map((topicKey) => {
                const isSelected = selectedTopic === topicKey;
                return (
                  <button
                    key={topicKey}
                    type="button"
                    onClick={() => setSelectedTopic(topicKey)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {SECURITY_TOPICS_META[topicKey].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong>{filteredChallenges.length}</strong> of{' '}
              {SECURITY_CHALLENGES.length} challenges
            </span>
            {(selectedTopic !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic('all');
                  setSelectedDifficulty('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="font-semibold text-brand-600 hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Challenges Grid */}
          {filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => {
                const isCompleted = summary.completedIds.includes(challenge.id);
                const isPassed = summary.passedIds.includes(challenge.id);

                return (
                  <SecurityChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    isCompleted={isCompleted}
                    isPassed={isPassed}
                    onSelect={(id) => setActiveChallengeId(id)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <ShieldAlert className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-base font-bold text-navy-900">
                No challenges match your filter criteria
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Try clearing your search query or selecting a different topic.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic('all');
                  setSelectedDifficulty('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
