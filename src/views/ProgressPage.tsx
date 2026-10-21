import React, { useState } from 'react';
import { 
  BarChart3, 
  Trash2, 
  Clock, 
  Trophy, 
  Target, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  RotateCcw,
  Sparkles,
  Compass,
  CheckCircle2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Quiz, QuizAttempt, ProgrammingLanguage } from '../types/quiz';
import { calculateStats, clearAllProgress } from '../services/storage';
import { LANGUAGES } from '../data/languages';
import { ConfirmModal } from '../components/ConfirmModal';

interface ProgressPageProps {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  onRefreshData: () => void;
  onStartQuiz: (quizId: string) => void;
  onNavigateToExplore: () => void;
  onNavigateToCybersecurity?: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  quizzes,
  attempts,
  onRefreshData,
  onStartQuiz,
  onNavigateToExplore,
  onNavigateToCybersecurity,
}) => {
  const [showClearModal, setShowClearModal] = useState(false);
  const stats = calculateStats(quizzes);

  const handleClear = () => {
    clearAllProgress();
    onRefreshData();
    setShowClearModal(false);
  };

  const hasData = attempts.length > 0;

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} mins`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider">
            <BarChart3 className="h-4 w-4" />
            <span>Developer Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight sm:text-4xl mt-1">
            My Progress & Performance
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-xl">
            Track your quiz history, test accuracy, strengths across programming languages, and identified weak spots.
          </p>
        </div>

        {hasData && (
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-2 self-start rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Progress</span>
          </button>
        )}
      </div>

      {/* Local Storage Notice Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-xs">
        <Info className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Client-Side Storage:</strong> Your quiz attempts and progress metrics are safely stored in your current browser's local storage. Your data remains strictly on your device and will not transfer across different browsers or computers.
        </p>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Target className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-navy-900">
            No quiz attempts recorded yet
          </h3>
          <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Take your first programming quiz to unlock detailed performance analytics, language breakdown charts, and smart topic recommendations.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onNavigateToExplore}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Quizzes & Start Practicing</span>
            </button>
          </div>
        </div>
      ) : (
        /* Stats Dashboard */
        <div className="space-y-10">
          {/* Top 4 Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Target className="h-4 w-4 text-brand-600" />
                <span>Completed Quizzes</span>
              </div>
              <span className="mt-3 block text-3xl font-extrabold text-navy-900">
                {stats.totalAttempts}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {stats.completedQuizIds.size} unique quizzes aced
              </span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>Average Score</span>
              </div>
              <span className="mt-3 block text-3xl font-extrabold text-emerald-600">
                {stats.averageScore}%
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Across all attempts
              </span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>Highest Score</span>
              </div>
              <span className="mt-3 block text-3xl font-extrabold text-amber-600">
                {stats.highestScore}%
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Personal best record
              </span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock className="h-4 w-4 text-violet-600" />
                <span>Total Practice Time</span>
              </div>
              <span className="mt-3 block text-3xl font-extrabold text-violet-600">
                {formatTotalTime(stats.totalTimeSeconds)}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Time spent coding
              </span>
            </div>
          </div>

          {/* Performance by Language & Score History Visualizer */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Performance by Programming Language */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Performance by Programming Language
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accuracy and completion stats for each language category
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(stats.languageBreakdown).map(([langKey, data]) => {
                  const lang = LANGUAGES[langKey as ProgrammingLanguage] || {
                    name: langKey,
                    bgColor: 'bg-slate-50',
                    textColor: 'text-slate-800',
                  };

                  return (
                    <div key={langKey} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">
                          {lang.name}
                        </span>
                        <div className="flex items-center gap-3 text-slate-500 font-medium">
                          <span>{data.attempts} {data.attempts === 1 ? 'attempt' : 'attempts'}</span>
                          <span>•</span>
                          <span className="font-bold text-navy-900">{data.avgScore}% avg</span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            data.avgScore >= 75
                              ? 'bg-emerald-500'
                              : data.avgScore >= 50
                              ? 'bg-brand-500'
                              : 'bg-rose-500'
                          } transition-all duration-500`}
                          style={{ width: `${data.avgScore}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Score History Trend Chart */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Recent Score Trend
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Last {Math.min(attempts.length, 8)} completed attempts
                </p>

                {/* Score Bars Visualizer */}
                <div className="mt-8 flex h-40 items-end justify-between gap-2 border-b border-slate-200 pb-2">
                  {attempts.slice(0, 8).reverse().map((att) => (
                    <div key={att.id} className="flex flex-1 flex-col items-center gap-2 group relative">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 rounded-lg bg-navy-900 px-2 py-1 text-[10px] text-white whitespace-nowrap z-10 transition-opacity shadow-md">
                        {att.quizTitle}: {att.scorePercentage}%
                      </div>

                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          att.scorePercentage >= 75
                            ? 'bg-brand-600 group-hover:bg-brand-500'
                            : att.scorePercentage >= 50
                            ? 'bg-amber-500 group-hover:bg-amber-400'
                            : 'bg-rose-500 group-hover:bg-rose-400'
                        }`}
                        style={{ height: `${Math.max(att.scorePercentage, 8)}%` }}
                      />
                      <span className="font-mono text-[10px] font-semibold text-slate-500">
                        {att.scorePercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Older</span>
                <span>Recent</span>
              </div>
            </div>
          </div>

          {/* Weak Topics Analysis & Targeted Recommendations */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Weak Topics */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-4">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-bold text-navy-900">
                  Identified Weak Topics
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Inferred automatically from questions answered incorrectly during your practice quizzes:
              </p>

              {stats.weakTopics.length > 0 ? (
                <div className="space-y-2 pt-2">
                  {stats.weakTopics.slice(0, 5).map(({ topic, missCount }) => (
                    <div
                      key={topic}
                      className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-xs"
                    >
                      <span className="font-semibold text-rose-900">{topic}</span>
                      <span className="rounded-lg bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                        {missCount} {missCount === 1 ? 'error' : 'errors'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No weak spots detected! You have maintained a clean record.</span>
                </div>
              )}
            </div>

            {/* Smart Suggested Quizzes */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-4">
              <div className="flex items-center gap-2 text-brand-600">
                <Sparkles className="h-5 w-5" />
                <h3 className="text-base font-bold text-navy-900">
                  Recommended For You
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Suggested practice based on your focus areas and topics needing reinforcement:
              </p>

              <div className="space-y-3 pt-2">
                {stats.recommendedQuizzes.map((recQuiz) => (
                  <div
                    key={recQuiz.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-xs"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-navy-900">
                        {recQuiz.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {recQuiz.questions.length} Questions • ~{recQuiz.estimatedMinutes} mins
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onStartQuiz(recQuiz.id)}
                      className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      <span>Practice</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Quiz Attempts Table */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="text-base font-bold text-navy-900">
              Recent Quiz Attempts History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-1">Quiz Title</th>
                    <th className="pb-3">Language</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Date Completed</th>
                    <th className="pb-3 pr-1 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att) => {
                    const lang = LANGUAGES[att.language] || { name: att.language, badgeBg: 'bg-slate-100 text-slate-800' };

                    return (
                      <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 pl-1 font-semibold text-navy-900">
                          {att.quizTitle}
                        </td>
                        <td className="py-3.5">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${lang.badgeBg}`}>
                            {lang.name}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                              att.scorePercentage >= 75
                                ? 'bg-emerald-100 text-emerald-800'
                                : att.scorePercentage >= 50
                                ? 'bg-brand-100 text-brand-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {att.scorePercentage}%
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-500 font-medium">
                          {att.timeTakenSeconds ? `${att.timeTakenSeconds}s` : '—'}
                        </td>
                        <td className="py-3.5 text-slate-500">
                          {new Date(att.completedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 pr-1 text-right">
                          <button
                            type="button"
                            onClick={() => onStartQuiz(att.quizId)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Retake</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cybersecurity Learning Track Callout */}
      {onNavigateToCybersecurity && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-brand-200 bg-gradient-to-r from-brand-50/80 via-white to-purple-50/60 p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Secure Coding & Vulnerability Challenges
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Ready to level up your defensive engineering skills? Practice spotting real-world flaws and mitigating OWASP Top 10 vulnerabilities.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToCybersecurity}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 transition-colors"
          >
            <span>View Security Challenges</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Clear Progress Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear All Quiz Progress?"
        message="This action will permanently delete all completed attempts, scores, time logs, and analytics from your browser's local storage. This action cannot be undone."
        confirmLabel="Yes, Clear All Progress"
        cancelLabel="Keep My Progress"
        isDestructive={true}
        onConfirm={handleClear}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
};
