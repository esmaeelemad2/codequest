import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Lightbulb, 
  Check, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { SecurityChallenge } from '../../types/security';
import { CodeBlock } from '../CodeBlock';
import { saveSecurityAttempt } from '../../services/securityStorage';

interface SecurityChallengeRunnerProps {
  challenge: SecurityChallenge;
  onBack: () => void;
  onNextChallenge?: () => void;
  onChallengeUpdated: () => void;
  hasNext: boolean;
}

export const SecurityChallengeRunner: React.FC<SecurityChallengeRunnerProps> = ({
  challenge,
  onBack,
  onNextChallenge,
  onChallengeUpdated,
  hasNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [showMitigationTab, setShowMitigationTab] = useState<'vulnerable' | 'secure'>('vulnerable');

  // Reset state when challenge changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowMitigationTab('vulnerable');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [challenge.id]);

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;

    const isCorrect = selectedOption === challenge.correctIndex;
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    saveSecurityAttempt({
      id: 'sec_att_' + Date.now(),
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      topic: challenge.topic,
      topicLabel: challenge.topicLabel,
      difficulty: challenge.difficulty,
      selectedOption,
      isCorrect,
      timeTakenSeconds: timeSpent,
      completedAt: new Date().toISOString(),
    });

    setIsSubmitted(true);
    onChallengeUpdated();

    // If correct, automatically switch code tab to secure to show the fix!
    if (isCorrect) {
      setShowMitigationTab('secure');
    }
  };

  const handleRetake = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowMitigationTab('vulnerable');
  };

  const isCorrect = isSubmitted && selectedOption === challenge.correctIndex;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Challenges</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono font-bold text-slate-700">
            {challenge.cwe}
          </span>
          <span className="rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
            {challenge.owaspCategory}
          </span>
        </div>
      </div>

      {/* Challenge Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-brand-600">
          <ShieldAlert className="h-4 w-4" />
          <span>{challenge.topicLabel}</span>
          <span className="text-slate-300">•</span>
          <span className="capitalize text-slate-500">{challenge.difficulty} Difficulty</span>
        </div>

        <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight sm:text-3xl">
          {challenge.title}
        </h1>

        {/* Scenario description box */}
        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm text-slate-700 shadow-xs leading-relaxed">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            <BookOpen className="h-4 w-4 text-brand-600" />
            <span>Scenario Context</span>
          </div>
          <p>{challenge.scenario}</p>
        </div>
      </div>

      {/* Interactive Code Viewer with Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMitigationTab('vulnerable')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                showMitigationTab === 'vulnerable'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              <span>Vulnerable Code</span>
            </button>

            {isSubmitted && (
              <button
                type="button"
                onClick={() => setShowMitigationTab('secure')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  showMitigationTab === 'secure'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Secure Alternative Fix</span>
              </button>
            )}
          </div>

          <span className="text-xs font-mono text-slate-500 uppercase">
            {challenge.language}
          </span>
        </div>

        {/* Code Block rendering */}
        {showMitigationTab === 'vulnerable' ? (
          <div>
            <div className="mb-1 text-xs text-rose-600 font-medium flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 inline-block animate-pulse" />
              <span>Review the unsafe implementation below and locate the flaw:</span>
            </div>
            <CodeBlock
              code={challenge.codeSnippet}
              language={challenge.language}
              filename={challenge.codeFilename}
            />
          </div>
        ) : (
          <div>
            <div className="mb-1 text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Recommended safe implementation pattern:</span>
            </div>
            <CodeBlock
              code={challenge.secureCode}
              language={challenge.language}
              filename={challenge.secureCodeFilename}
            />
            <p className="mt-2 text-xs text-slate-600 italic bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              {challenge.secureCodeExplanation}
            </p>
          </div>
        )}
      </div>

      {/* Question and Answer Selection Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div>
          <span className="inline-block rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 uppercase tracking-wider mb-2">
            Security Assessment
          </span>
          <h2 className="text-base sm:text-lg font-bold text-navy-900 leading-snug">
            {challenge.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {challenge.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isOptionCorrect = idx === challenge.correctIndex;

            let optionStyle = 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/70 text-slate-800';

            if (isSubmitted) {
              if (isOptionCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium ring-1 ring-emerald-500';
              } else if (isSelected && !isOptionCorrect) {
                optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
              } else {
                optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'border-brand-600 bg-brand-50/70 text-brand-950 font-medium ring-1 ring-brand-500 shadow-xs';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full flex items-start gap-3.5 rounded-xl border p-4 text-left text-sm transition-all duration-150 ${optionStyle}`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isSubmitted
                      ? isOptionCorrect
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                        ? 'bg-rose-600 text-white'
                        : 'border border-slate-300 text-slate-400'
                      : isSelected
                      ? 'bg-brand-600 text-white'
                      : 'border border-slate-300 bg-slate-50 text-slate-600'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>

                <div className="flex-1 leading-relaxed">
                  <span>{option}</span>
                </div>

                {isSubmitted && isOptionCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isSelected && !isOptionCorrect && (
                  <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {!isSubmitted ? (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all shadow-xs ${
                selectedOption === null
                  ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20 active:scale-[0.98]'
              }`}
            >
              <span>Submit Answer</span>
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </button>

              {hasNext && onNextChallenge && (
                <button
                  type="button"
                  onClick={onNextChallenge}
                  className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition-all shadow-xs shadow-brand-500/20"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post-Submission Feedback Banner & Explanation */}
      {isSubmitted && (
        <div className="space-y-6 animate-fade-in">
          {/* Result Alert Header */}
          <div
            className={`flex items-start gap-4 rounded-2xl border p-5 shadow-xs ${
              isCorrect
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-rose-200 bg-rose-50 text-rose-900'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h3 className="text-base font-extrabold">
                {isCorrect ? 'Correct! Vulnerability Identified.' : 'Incorrect Assessment'}
              </h3>
              <p className="text-sm leading-relaxed">
                {isCorrect
                  ? 'Excellent spot! You correctly identified the security flaw and understood the attack vector.'
                  : `Option ${String.fromCharCode(65 + challenge.correctIndex)} is the correct answer. Review the explanation below to reinforce your knowledge.`}
              </p>
            </div>
          </div>

          {/* Detailed Vulnerability Explanation Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
              <Lightbulb className="h-4 w-4" />
              <span>Vulnerability Analysis</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {challenge.explanation}
            </p>

            <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-800 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                <span>Preventative Mitigation (OWASP Best Practice)</span>
              </div>
              <p className="text-sm text-brand-950 leading-relaxed">
                {challenge.mitigation}
              </p>
            </div>

            {/* Quick Toggle for safe code */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowMitigationTab('secure');
                  window.scrollTo({ top: 250, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors"
              >
                <span>View Secure Implementation Code Above</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
