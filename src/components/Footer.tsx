import React from 'react';
import { Terminal, Heart } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { ProgrammingLanguage } from '../types/quiz';

interface FooterProps {
  onNavigate: (tab: string, extraParam?: string) => void;
  onOpenModal: (type: 'about' | 'contact' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenModal }) => {
  const languageKeys = Object.keys(LANGUAGES) as ProgrammingLanguage[];

  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div 
              onClick={() => onNavigate('home')}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs">
                <Terminal className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-navy-900">
                Code<span className="text-brand-600">Quest</span>
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              "Test Your Skills. Master Your Code." A developer-first interactive quiz platform to practice reading code, debug tricky edge cases, and level up programming knowledge.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <span>Crafted for developers with</span>
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('explore')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Explore Quizzes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('languages')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Languages Hub
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cybersecurity')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Secure Coding Challenges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('progress')}
                  className="hover:text-brand-600 transition-colors"
                >
                  My Progress
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('bookmarks')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Saved Bookmarks
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Languages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Languages
            </h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {languageKeys.map((langKey) => {
                const lang = LANGUAGES[langKey];
                return (
                  <button
                    key={langKey}
                    type="button"
                    onClick={() => onNavigate('explore', langKey)}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    {lang.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal and Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Information & Legal
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('about')}
                  className="hover:text-brand-600 transition-colors"
                >
                  About CodeQuest
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Contact & Feedback
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} CodeQuest. All rights reserved. English edition.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>All systems operational • Pure client-side privacy</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
