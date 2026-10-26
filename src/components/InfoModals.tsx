import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, FileText, Mail, Info, Send, CheckCircle2 } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  type: 'about' | 'contact' | 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ isOpen, type, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [contactSubmitted, setContactSubmitted] = React.useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && type) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
      setContactSubmitted(false);
    }
  }, [isOpen, type]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdrop = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inBox =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!inBox) onClose();
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('click', handleBackdrop);
    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('click', handleBackdrop);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  if (!isOpen || !type) return null;

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Info className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-navy-900">About CodeSkill</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>CodeSkill</strong> is an interactive programming quiz platform built for developers, students, and interview candidates who want to master real-world code comprehension.
              </p>
              <p>
                Traditional flashcards test trivia, but writing software requires reading code, predicting execution output, tracing scope boundaries, and catching bugs. CodeSkill presents realistic code snippets across popular languages — <strong>Python, JavaScript, Java, C++, C#, SQL, and HTML & CSS</strong> — with deep pedagogical explanations for every question.
              </p>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-900">Our Core Principles:</h4>
                <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700 text-xs">
                  <li><strong>Authentic Snippets:</strong> Real code patterns and idioms, not ambiguous puzzle tricks.</li>
                  <li><strong>Educational Feedback:</strong> Detailed breakdowns explaining why right answers work and why wrong options fail.</li>
                  <li><strong>Private & Lightweight:</strong> Your progress and scores are safely preserved in your browser’s local storage.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-navy-900">Contact CodeSkill Team</h2>
            </div>
            {contactSubmitted ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="mt-3 text-base font-bold text-emerald-900">Thank you for reaching out!</h3>
                <p className="mt-1 text-sm text-emerald-700">
                  Your message has been received. Our developer team will review your feedback and question suggestions.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="mt-4 space-y-3.5"
              >
                <p className="text-xs text-slate-600">
                  Have feedback, noticed a tricky edge-case question, or want to suggest a new programming language? Let us know!
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@developer.io"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Message / Topic</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your suggestion, quiz question proposal, or bug report..."
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-700"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      case 'privacy':
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-navy-900">Privacy Policy</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <p>
                <strong>Last Updated: February 2026</strong>
              </p>
              <p>
                At CodeSkill, we prioritize developer privacy. We believe that practicing code and testing your knowledge should not come at the expense of your personal data.
              </p>
              <h4 className="font-semibold text-slate-900">1. Client-Side Data Storage</h4>
              <p>
                All your quiz attempts, scores, custom question bookmarks, and progress statistics are stored strictly in your browser’s local storage (<code>localStorage</code>). We do not send your quiz answers or results to external ad networks or tracking servers.
              </p>
              <h4 className="font-semibold text-slate-900">2. Cookies & Telemetry</h4>
              <p>
                CodeSkill does not use invasive third-party tracking cookies or advertising pixels. Your practice history remains private on your personal device.
              </p>
              <h4 className="font-semibold text-slate-900">3. Data Control</h4>
              <p>
                You maintain complete control over your data. You can inspect or permanently erase all stored attempts at any time using the "Clear All Progress" button on the <em>My Progress</em> dashboard.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-navy-900">Terms of Use</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <p>
                <strong>Last Updated: February 2026</strong>
              </p>
              <p>
                By accessing and using CodeSkill, you agree to comply with and be bound by the following terms and conditions:
              </p>
              <h4 className="font-semibold text-slate-900">1. Educational Purpose</h4>
              <p>
                CodeSkill quizzes and materials are provided solely for educational, practice, and skill evaluation purposes. Snippets represent standard language specifications and common industry runtime environments.
              </p>
              <h4 className="font-semibold text-slate-900">2. Content & Fair Use</h4>
              <p>
                All code questions, explanations, and visual designs are provided for personal learning. You may use CodeSkill to prepare for technical interviews, university courses, and independent study.
              </p>
              <h4 className="font-semibold text-slate-900">3. Disclaimer</h4>
              <p>
                While we strive for accuracy across language specifications, software platforms evolve continuously. CodeSkill is provided "as is" without warranty of any kind.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as any)}
      className="fixed inset-0 m-auto z-50 max-w-xl w-[92%] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-1 -right-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
        {renderContent()}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};
