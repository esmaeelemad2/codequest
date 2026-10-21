import React from 'react';
import { 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { SecurityChallenge } from '../../types/security';

interface SecurityChallengeCardProps {
  challenge: SecurityChallenge;
  isCompleted: boolean;
  isPassed: boolean;
  onSelect: (challengeId: string) => void;
}

export const SecurityChallengeCard: React.FC<SecurityChallengeCardProps> = ({
  challenge,
  isCompleted,
  isPassed,
  onSelect,
}) => {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-lg border px-2 py-0.5 font-semibold text-[11px] ${getDifficultyBadge(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
              {challenge.cwe}
            </span>
            <span className="rounded-lg border border-brand-100 bg-brand-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand-700 uppercase">
              {challenge.language}
            </span>
          </div>

          {/* Status Indicator */}
          {isCompleted ? (
            isPassed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Solved</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Needs Practice</span>
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              New
            </span>
          )}
        </div>

        {/* Challenge Title */}
        <h3 className="mt-3 text-base font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-2">
          {challenge.title}
        </h3>

        {/* OWASP & Topic tags */}
        <div className="mt-2 flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldAlert className="h-3.5 w-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{challenge.topicLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Tag className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{challenge.owaspCategory}</span>
          </div>
        </div>

        {/* Short Scenario preview */}
        <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
          {challenge.scenario}
        </p>
      </div>

      {/* Footer Meta & Button */}
      <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span>~{challenge.estimatedMinutes} mins</span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(challenge.id)}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shadow-xs ${
            isCompleted
              ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20'
          }`}
        >
          <span>{isCompleted ? 'Review' : 'Start'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
