import React from 'react';
import { 
  Play, 
  Layers, 
  CheckCircle, 
  Zap, 
  BrainCircuit, 
  Code2, 
  ArrowRight, 
  Sparkles,
  BarChart2,
  ShieldCheck
} from 'lucide-react';
import { Quiz, ProgrammingLanguage } from '../types/quiz';
import { LANGUAGES } from '../data/languages';
import { QuizCard } from '../components/QuizCard';

interface HomePageProps {
  quizzes: Quiz[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (quizId: string) => void;
  onStartQuiz: (quizId: string) => void;
  onNavigate: (tab: string, extraParam?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  quizzes,
  bookmarkedIds,
  onToggleBookmark,
  onStartQuiz,
  onNavigate,
}) => {
  const totalQuestions = quizzes.reduce((acc, q) => acc + q.questions.length, 0);
  const totalLanguages = Object.keys(LANGUAGES).length;
  const featuredQuizzes = quizzes.filter((q) => q.featured).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-50/60 to-transparent pointer-events-none -z-10 blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                <span>Interactive Developer Quiz Platform</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
                How Well Do You <span className="text-brand-600">Really Know</span> Your Code?
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Challenge your programming knowledge, solve real code-based questions, discover your weak spots, and become a better developer one quiz at a time.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('explore')}
                  className="flex items-center gap-2.5 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
                >
                  <Play className="h-5 w-5 fill-current" />
                  <span>Start Practicing</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('languages')}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                >
                  <Layers className="h-5 w-5 text-slate-500" />
                  <span>Explore Languages</span>
                </button>
              </div>

              {/* Highlights pills */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Real Code Snippets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Instant Detailed Feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Zero Sign-up Required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Code Editor & Quiz Demo Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-800 bg-[#0d1117] p-4 text-slate-200 shadow-2xl">
                {/* Editor Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/90" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/90" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
                    </div>
                    <span className="font-mono text-slate-400 ml-2">codequest_challenge.py</span>
                  </div>
                  <span className="rounded bg-brand-500/20 px-2 py-0.5 text-[10px] font-mono text-brand-300 border border-brand-500/30">
                    PYTHON 3.12
                  </span>
                </div>

                {/* Simulated Code Question */}
                <div className="mt-3 font-mono text-xs leading-relaxed space-y-1">
                  <p className="text-slate-400"># Predict the output:</p>
                  <p className="text-pink-400">def <span className="text-blue-400">get_multiplier</span>():</p>
                  <p className="pl-4 text-slate-300">funcs = [<span className="text-pink-400">lambda</span> x, i=i: x * i <span className="text-pink-400">for</span> i <span className="text-pink-400">in</span> <span className="text-yellow-400">range</span>(3)]</p>
                  <p className="pl-4 text-pink-400">return <span className="text-slate-200">funcs</span></p>
                  <p className="text-slate-300">results = [f(2) <span className="text-pink-400">for</span> f <span className="text-pink-400">in</span> get_multiplier()]</p>
                  <p className="text-emerald-400">print(results)</p>
                </div>

                {/* Interactive Question Card Mock */}
                <div className="mt-4 rounded-xl border border-slate-700/80 bg-slate-900/90 p-3.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-brand-400">Sample Question</span>
                    <span>1 of 6</span>
                  </div>
                  <p className="mt-1 font-sans text-xs font-medium text-slate-200">
                    What will be printed to stdout?
                  </p>

                  <div className="mt-2.5 grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-300">
                      A. [4, 4, 4]
                    </div>
                    <div className="rounded-lg border border-emerald-500/60 bg-emerald-950/40 p-2 text-emerald-300 font-semibold flex items-center justify-between">
                      <span>B. [0, 2, 4]</span>
                      <span className="text-[10px] text-emerald-400">✓ Correct</span>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-300">
                      C. [2, 4, 6]
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-300">
                      D. TypeError
                    </div>
                  </div>
                </div>

                {/* Progress bar preview */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Knowledge Accuracy</span>
                  <span className="font-semibold text-brand-400">92%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A. Platform Overview (Live application data) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-xl font-bold text-navy-900">Platform Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated directly from CodeQuest's active quiz database
              </p>
            </div>
            <span className="self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              ● Live Catalog Data
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 sm:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-navy-900 sm:text-4xl">{quizzes.length}</span>
              <span className="mt-1 text-xs font-medium text-slate-500">Available Quizzes</span>
              <span className="text-[11px] text-brand-600 mt-0.5 font-medium">100% Free & Open</span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-brand-600 sm:text-4xl">{totalLanguages}</span>
              <span className="mt-1 text-xs font-medium text-slate-500">Supported Languages</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Python to SQL</span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-violet-600 sm:text-4xl">{totalQuestions}</span>
              <span className="mt-1 text-xs font-medium text-slate-500">Curated Questions</span>
              <span className="text-[11px] text-slate-400 mt-0.5">With full explanations</span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-emerald-600 sm:text-4xl">0</span>
              <span className="mt-1 text-xs font-medium text-slate-500">Accounts Required</span>
              <span className="text-[11px] text-emerald-600 mt-0.5 font-medium">Pure Local Storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* B. Popular Languages */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider">
              <Code2 className="h-4 w-4" />
              <span>Language Coverage</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl mt-1">
              Popular Programming Languages
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Targeted skill tracks tailored to language idioms, runtime mechanics, syntax gotchas, and real-world patterns.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('languages')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <span>View all languages</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(Object.keys(LANGUAGES) as ProgrammingLanguage[]).map((langKey) => {
            const lang = LANGUAGES[langKey];
            const langQuizzes = quizzes.filter((q) => q.language === langKey);
            const questionCount = langQuizzes.reduce((acc, q) => acc + q.questions.length, 0);

            return (
              <div
                key={langKey}
                onClick={() => onNavigate('explore', langKey)}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-bold ${lang.badgeBg}`}
                    >
                      {lang.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {langQuizzes.length} {langQuizzes.length === 1 ? 'Quiz' : 'Quizzes'}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                    {lang.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {lang.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {questionCount} Questions
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* C. Featured Quizzes */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Recommended Starts</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl mt-1">
              Featured Quizzes
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Curated assessments covering essential programming concepts, debugging scenarios, and code output prediction.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <span>Browse all {quizzes.length} quizzes</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {featuredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isBookmarked={bookmarkedIds.has(quiz.id)}
              onToggleBookmark={onToggleBookmark}
              onStartQuiz={onStartQuiz}
            />
          ))}
        </div>
      </section>

      {/* Cybersecurity Feature Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-brand-200/90 bg-gradient-to-r from-navy-900 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-brand-500/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 border border-brand-400/30 px-3.5 py-1 text-xs font-semibold text-brand-300">
              <ShieldCheck className="h-4 w-4 text-brand-400" />
              <span>NEW: OWASP Top 10 Aligned</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Master Secure Coding & Vulnerability Defense
            </h2>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Learn to spot SQL Injection, Cross-Site Scripting (XSS), Broken Access Control, and more before attackers do. Test your defensive programming knowledge with interactive challenges.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('cybersecurity')}
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-500 transition-all active:scale-[0.98]"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Explore Secure Coding Challenges</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* D. How It Works (3 Steps) */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
              Simple 3-Step Methodology
            </span>
            <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl mt-1">
              How CodeQuest Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed to help developers test their intuition, isolate knowledge gaps, and remember programming rules effectively.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white font-extrabold text-lg shadow-sm">
                1
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-900">
                Choose a Programming Topic
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Filter by your language of choice — Python, JavaScript, Java, C++, C#, SQL, or HTML/CSS — and select a targeted difficulty track.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white font-extrabold text-lg shadow-sm">
                2
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-900">
                Answer Interactive Coding Questions
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Read authentic code snippets, spot bugs, solve syntax challenges, predict outputs, and select answers with responsive navigation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-extrabold text-lg shadow-sm">
                3
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-900">
                Review Results & Learn
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Receive instant grading, explore comprehensive question explanations, discover your weak spots, and track your ongoing improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E. Why CodeQuest? */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            Engineered For Growth
          </span>
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl mt-1">
            Why Practice on CodeQuest?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Most developers spend more time reading other people's code than writing new code. CodeQuest builds that exact superpower.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand-600">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-navy-900">Practical Coding Knowledge</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Every question tests realistic scenarios: memory scope, async execution order, type coercion, and edge-case behaviors.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-navy-900">Instant Grading & Timing</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Automatic scoring with accurate percentage formulas, performance tier evaluations, and optional countdown timers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-navy-900">Detailed Explanations</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Never get stuck wondering why. We explain both why the correct answer succeeds and why each distractor fails.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BarChart2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-navy-900">Personal Progress Tracking</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Automatic local storage analytics that identify your weakest topics and recommend targeted quizzes to fix them.
            </p>
          </div>
        </div>
      </section>

      {/* F. Final CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-brand-950 p-8 sm:p-12 text-white shadow-xl text-center">
          {/* Subtle violet overlay */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Take a 5-minute quiz now, discover what you really know, and level up your software engineering confidence.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-white transition-all active:scale-[0.98]"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>Take Your First Quiz</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
