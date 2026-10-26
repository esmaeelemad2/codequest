import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BrainCircuit,
  Send,
  Trash2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Settings,
  ChevronDown,
  Lightbulb,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { ChatMessage, streamMessageFromAI } from '../services/aiTutor';
import { CodeBlock } from '../components/CodeBlock';
import { ConfirmModal } from '../components/ConfirmModal';
import { getAttempts, calculateStats } from '../services/storage';

interface AiTutorPageProps {
  initialMessage?: string;
  onNavigate: (tab: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { value: 'general', label: 'General Programming' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'sql', label: 'SQL' },
  { value: 'html-css', label: 'HTML & CSS' },
];

const SUGGESTED_PROMPTS = [
  'Explain Python functions with a simple example.',
  'Help me understand JavaScript promises and async/await.',
  'What is the difference between a list and a tuple in Python?',
  'Explain how SQL JOIN works with an example.',
  'Give me a beginner exercise to practice loops in JavaScript.',
  'What are common mistakes beginners make in Java?',
];

// Parse AI response text into segments (text | code block)
interface TextSegment { type: 'text'; content: string }
interface CodeSegment { type: 'code'; content: string; language: string }
type MessageSegment = TextSegment | CodeSegment;

function parseMessageContent(text: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', content: match[2].trim(), language: match[1] || 'text' });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

function MessageContent({ text }: { text: string }) {
  const segments = parseMessageContent(text);
  return (
    <div className="space-y-2">
      {segments.map((seg, i) =>
        seg.type === 'code' ? (
          <CodeBlock key={i} code={seg.content} language={seg.language} showLineNumbers={seg.content.split('\n').length > 3} />
        ) : (
          <div key={i} className="text-sm leading-relaxed whitespace-pre-wrap">
            {seg.content.trim()}
          </div>
        )
      )}
    </div>
  );
}

export const AiTutorPage: React.FC<AiTutorPageProps> = ({ initialMessage, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const attempts = getAttempts();
  const stats = attempts.length > 0 ? calculateStats() : null;

  // Auto-scroll to bottom as messages or streaming chunks update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, streamingText]);

  // Handle initialMessage prop (from "Ask AI" in quiz results)
  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      setInputValue(initialMessage.trim());
      textareaRef.current?.focus();
    }
  }, [initialMessage]);

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = (messageText ?? inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    setStreamingText('');
    setError(null);
    setLastUserMessage(text);

    try {
      const response = await streamMessageFromAI(
        updatedMessages,
        selectedLanguage,
        (_delta, accumulated) => {
          setStreamingText(accumulated);
        }
      );

      setIsLoading(false);
      setStreamingText('');

      if (response.setup_required) {
        setSetupRequired(true);
        setSetupMessage(response.message || 'AI Tutor is not configured.');
        return;
      }

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.content) {
        const aiMsg: ChatMessage = { role: 'assistant', content: response.content };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch {
      setIsLoading(false);
      setStreamingText('');
      setError('The AI tutor is temporarily busy. Your message is preserved; please click Retry to try again.');
    }
  }, [inputValue, isLoading, messages, selectedLanguage]);

  const handleRetry = () => {
    if (lastUserMessage) {
      // Remove last user message if it's still there without an AI response
      const lastMsg = messages[messages.length - 1];
      const newMessages = lastMsg?.role === 'user' ? messages.slice(0, -1) : messages;
      setMessages(newMessages);
      setError(null);
      sendMessage(lastUserMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    textareaRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([]);
    setStreamingText('');
    setError(null);
    setSetupRequired(false);
    setLastUserMessage(null);
    setShowClearConfirm(false);
  };

  const charCount = inputValue.length;
  const charLimit = 2000;
  const isNearLimit = charCount > 1800;

  // Build recommendations from real quiz data
  const weakTopics = stats?.weakTopics?.slice(0, 3) ?? [];
  const weakLanguages = stats
    ? Object.entries(stats.languageBreakdown)
        .sort((a, b) => a[1].avgScore - b[1].avgScore)
        .slice(0, 2)
        .map(([lang]) => lang)
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700">
          <BrainCircuit className="h-3.5 w-3.5 text-brand-600" />
          <span>AI-Powered Learning • High-Speed Inference</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
          Your Personal AI Programming Tutor
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          Ask programming questions, get code explained line-by-line, receive debugging guidance, or request practice exercises. The tutor adapts to your selected programming language.
        </p>
      </div>

      {/* Setup Required Banner */}
      {setupRequired && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Settings className="h-5 w-5 text-amber-700" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-amber-900">AI Tutor Setup Required</h3>
            <p className="text-sm text-amber-800 leading-relaxed">{setupMessage}</p>
            <div className="mt-3 rounded-xl border border-amber-200 bg-white p-4 text-xs font-mono text-slate-700 space-y-1">
              <p className="font-sans font-semibold text-slate-900 mb-2">Administrator Setup Instructions:</p>
              <p>1. SSH into the server: <span className="text-brand-600">/home/codeskill/api-config.php</span></p>
              <p>2. Set <span className="text-brand-600">$AI_API_KEY</span> to your primary provider key</p>
              <p>3. Set <span className="text-brand-600">$AI_MODEL</span> (default: openai/gpt-oss-20b)</p>
              <p>4. Optionally configure fallback provider keys</p>
              <p>5. Save the file — no server restart needed</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
        {/* Chat Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-slate-900">CodeSkill AI Tutor</span>
            <span className="hidden sm:inline rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              FAST STREAMING READY
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors shadow-2xs"
                title="Clear conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[440px] overflow-y-auto p-4 space-y-4 scroll-smooth" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.length === 0 && !setupRequired && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-xs border border-brand-100">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">Start a Conversation</h3>
                <p className="mt-1 text-sm text-slate-500">Ask anything about programming, or try one of these suggestions:</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="rounded-xl border border-brand-200 bg-brand-50/80 px-3.5 py-2 text-xs font-medium text-brand-700 hover:bg-brand-100 hover:border-brand-300 transition-all text-left shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {msg.role === 'assistant' && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-2xs">
                  <BrainCircuit className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <MessageContent text={msg.content} />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Progressive Streaming & Thinking Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-2xs">
                <BrainCircuit className="h-3.5 w-3.5" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3 text-sm shadow-xs">
                {streamingText ? (
                  <MessageContent text={streamingText} />
                ) : (
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-2 text-xs text-slate-500 font-medium">Thinking...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error display with Retry */}
          {error && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start gap-3 max-w-[85%] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 shadow-2xs">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-xs text-rose-800 font-medium">{error}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-2xs active:scale-95"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Retry Question</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-slate-50/70 p-4">
          <div className="space-y-2">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value.slice(0, charLimit))}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={isLoading ? "AI is generating a response..." : "Ask a programming question... (Ctrl+Enter to send)"}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed shadow-2xs"
                aria-label="Message to AI Tutor"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white font-mono text-[10px]">Ctrl+Enter</kbd> to send</span>
              {isNearLimit && (
                <span className={charCount >= charLimit ? 'text-rose-600 font-semibold' : 'text-amber-600'}>
                  {charCount}/{charLimit}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Next Steps */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-600" />
          <h2 className="text-base font-bold text-navy-900">Recommended Next Steps</h2>
        </div>

        {stats && (weakTopics.length > 0 || weakLanguages.length > 0) ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Based on your quiz history:</p>

            {weakTopics.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Topics to Practice:</span>
                <div className="flex flex-wrap gap-2">
                  {weakTopics.map(({ topic, missCount }) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleSuggestedPrompt(`Explain ${topic} with a clear example in ${selectedLanguage === 'general' ? 'Python' : selectedLanguage}.`)}
                      className="group flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs"
                    >
                      <Lightbulb className="h-3 w-3 text-amber-600" />
                      <span>{topic}</span>
                      <span className="rounded-full bg-amber-200 px-1.5 text-[10px] font-bold text-amber-900">
                        {missCount}x missed
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {weakLanguages.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Languages Needing Work:</span>
                <div className="flex flex-wrap gap-2">
                  {weakLanguages.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(lang);
                        handleSuggestedPrompt(`Give me a beginner exercise to practice ${lang} fundamentals.`);
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 transition-colors shadow-2xs"
                    >
                      <BookOpen className="h-3 w-3 text-brand-600" />
                      <span className="capitalize">{lang}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
            >
              View full progress dashboard →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              {attempts.length === 0
                ? 'Complete some quizzes to get personalized recommendations. Here are general suggestions to get started:'
                : 'Great progress so far! Here are some topics worth exploring:'}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { topic: 'Python list comprehensions and generators', lang: 'python' },
                { topic: 'JavaScript async/await and Promises', lang: 'javascript' },
                { topic: 'SQL JOIN types with examples', lang: 'sql' },
                { topic: 'Object-oriented programming concepts', lang: 'general' },
              ].map(({ topic, lang }) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(lang);
                    handleSuggestedPrompt(`Explain ${topic} with a simple code snippet.`);
                  }}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-left text-xs text-slate-700 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors shadow-2xs"
                >
                  <span className="font-medium">{topic}</span>
                  <span className="rounded bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-mono uppercase text-slate-600">
                    {lang}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Conversation?"
        message="Are you sure you want to clear the entire chat history? This action cannot be undone."
        confirmLabel="Clear Chat"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleClearChat}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
