import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Target, 
  Trophy, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { SecurityProgressSummary } from '../../types/security';
import { SECURITY_CHALLENGES } from '../../data/securityChallenges';
import { ConfirmModal } from '../ConfirmModal';
import { clearSecurityProgress } from '../../services/securityStorage';

interface SecurityDashboardViewProps {
  summary: SecurityProgressSummary;
  onRefresh: () => void;
  onSelectChallenge: (challengeId: string) => void;
  onGoToChallenges: () => void;
}

export const SecurityDashboardView: React.FC<SecurityDashboardViewProps> = ({
  summary,
  onRefresh,
  onSelectChallenge,
  onGoToChallenges,
}) => {
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClear = () => {
    clearSecurityProgress();
    onRefresh();
    setShowClearModal(false);
  };

  const hasAttempts = summary.totalAttemptsCount > 0;
  const completionPercentage = Math.round(
    (summary.completedChallengesCount / summary.totalChallenges) * 100
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Completed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">
              {summary.completedChallengesCount}
            </span>
            <span className="text-sm font-medium text-slate-500">
              / {summary.totalChallenges} challenges
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-brand-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Accuracy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Accuracy Rate
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">
              {hasAttempts ? `${summary.overallAccuracy}%` : '—'}
            </span>
            <span className="text-xs font-medium text-slate-500">
              first attempt score
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {hasAttempts
              ? `${summary.passedIds.length} solved correctly`
              : 'Complete a challenge to evaluate'}
          </p>
        </div>

        {/* Total Attempts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Attempts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">
              {summary.totalAttemptsCount}
            </span>
            <span className="text-xs font-medium text-slate-500">
              submissions recorded
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Saved securely in local storage
          </p>
        </div>

        {/* Mastered Topics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Mastered Topics
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">
              {summary.strongestTopics.length}
            </span>
            <span className="text-xs font-medium text-slate-500">
              topics with ≥ 70% accuracy
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {summary.topicsNeedingPractice.length} need further review
          </p>
        </div>
      </div>

      {/* Suggested Challenges Banner based on weak topics or unattempted */}
      {summary.suggestedChallengeIds.length > 0 && (
        <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-50/70 via-white to-indigo-50/40 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Recommended Secure Coding Challenges
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Targeted practice based on your incorrect answers and unattempted security topics.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.suggestedChallengeIds.map((id) => {
              const challenge = SECURITY_CHALLENGES.find((c) => c.id === id);
              if (!challenge) return null;
              const isDone = summary.completedIds.includes(challenge.id);
              const isPassed = summary.passedIds.includes(challenge.id);

              return (
                <div
                  key={challenge.id}
                  onClick={() => onSelectChallenge(challenge.id)}
                  className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-brand-400 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="rounded bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
                        {challenge.topicLabel}
                      </span>
                      {isDone && !isPassed && (
                        <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                          Retake
                        </span>
                      )}
                    </div>
                    <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {challenge.title}
                    </h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="font-mono">{challenge.cwe}</span>
                    <span className="flex items-center gap-1 font-semibold text-brand-600">
                      Practice <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Columns: Strongest Topics vs Topics Requiring Practice */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Strongest Topics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-4">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Strongest Security Topics</span>
          </div>

          {summary.strongestTopics.length > 0 ? (
            <div className="space-y-3">
              {summary.strongestTopics.map((st) => (
                <div key={st.topic} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span>{st.topicLabel}</span>
                    <span className="text-emerald-700">{st.accuracy}% accuracy</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${st.accuracy}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    {st.correctAttempts} of {st.totalAttempts} submissions answered correctly
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              No strong topics recorded yet. Answer challenges correctly to highlight your proficiencies.
            </div>
          )}
        </div>

        {/* Topics Requiring Practice */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Topics Requiring Practice</span>
          </div>

          {summary.topicsNeedingPractice.length > 0 ? (
            <div className="space-y-3">
              {summary.topicsNeedingPractice.map((st) => (
                <div key={st.topic} className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span>{st.topicLabel}</span>
                    <span className="text-amber-700">{st.accuracy}% accuracy</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${st.accuracy}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-600">
                    Missed in {st.totalAttempts - st.correctAttempts} attempts. Review OWASP guidelines.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              {hasAttempts
                ? 'Great work! No weak topics identified so far.'
                : 'Complete challenges to identify areas where more practice is beneficial.'}
            </div>
          )}
        </div>
      </div>

      {/* Recent Challenge History Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-navy-900">
            Recent Challenge History
          </h3>

          {hasAttempts && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {hasAttempts ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                <tr>
                  <th className="py-3 px-4 font-semibold">Challenge</th>
                  <th className="py-3 px-4 font-semibold">Topic</th>
                  <th className="py-3 px-4 font-semibold">Result</th>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.recentAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {att.challengeTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {att.topicLabel}
                    </td>
                    <td className="py-3 px-4">
                      {att.isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-700 border border-rose-200">
                          <XCircle className="h-3 w-3" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectChallenge(att.challengeId)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
            No history recorded. Start your first challenge to view your submission logs.
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing Progress */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear Cybersecurity Progress?"
        message="This will reset all your cybersecurity challenge attempts, topic scores, and history from your browser local storage. This action cannot be undone."
        confirmLabel="Yes, Clear Progress"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleClear}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
};
