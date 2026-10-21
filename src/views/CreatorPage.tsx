import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  AlertCircle, 
  Download, 
  CheckCircle,
  Terminal
} from 'lucide-react';
import { Quiz, Question, ProgrammingLanguage, Difficulty, QuestionType } from '../types/quiz';
import { getCustomQuizzes, saveCustomQuiz, deleteCustomQuiz } from '../services/storage';
import { LANGUAGES } from '../data/languages';
import { ConfirmModal } from '../components/ConfirmModal';

interface CreatorPageProps {
  onQuizPublished: () => void;
  onStartQuiz: (quizId: string) => void;
}

export const CreatorPage: React.FC<CreatorPageProps> = ({
  onQuizPublished,
  onStartQuiz,
}) => {
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>(getCustomQuizzes());
  const [isEditing, setIsEditing] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [estimatedMinutes, setEstimatedMinutes] = useState(8);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number | null>(480);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q_' + Date.now(),
      type: 'predict-output',
      topic: 'Basic Syntax',
      text: '',
      codeSnippet: '',
      codeLanguage: 'python',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
    },
  ]);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setLanguage('python');
    setTopic('');
    setDifficulty('Beginner');
    setEstimatedMinutes(8);
    setTimeLimitSeconds(480);
    setQuestions([
      {
        id: 'q_' + Date.now(),
        type: 'predict-output',
        topic: 'Basic Syntax',
        text: '',
        codeSnippet: '',
        codeLanguage: 'python',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: '',
      },
    ]);
    setIsEditing(false);
    setValidationError(null);
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        type: 'concept',
        topic: topic || 'Core Fundamentals',
        text: '',
        codeSnippet: '',
        codeLanguage: language,
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      setValidationError('A quiz must have at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: keyof Question, value: any) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleOptionChange = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const newOpts = [...copy[qIdx].options];
      newOpts[optIdx] = val;
      copy[qIdx] = { ...copy[qIdx], options: newOpts };
      return copy;
    });
  };

  const validateAndPublish = () => {
    setValidationError(null);
    if (!title.trim()) {
      setValidationError('Please provide a quiz title.');
      return;
    }
    if (!description.trim()) {
      setValidationError('Please provide a quiz description.');
      return;
    }
    if (!topic.trim()) {
      setValidationError('Please specify a core topic.');
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setValidationError(`Question ${i + 1} is missing its question prompt text.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setValidationError(`Question ${i + 1}, Option ${String.fromCharCode(65 + j)} cannot be empty.`);
          return;
        }
      }
      if (!q.explanation.trim()) {
        setValidationError(`Question ${i + 1} requires an educational explanation for the solution.`);
        return;
      }
    }

    const newQuizId = 'custom_' + Date.now();
    const newQuiz: Quiz = {
      id: newQuizId,
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title.trim(),
      description: description.trim(),
      language,
      topic: topic.trim(),
      difficulty,
      estimatedMinutes: Number(estimatedMinutes) || 8,
      timeLimitSeconds: timeLimitSeconds ? Number(timeLimitSeconds) : null,
      iconName: 'Code',
      questions,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    saveCustomQuiz(newQuiz);
    setCustomQuizzes(getCustomQuizzes());
    onQuizPublished();
    setSuccessMessage(`Quiz "${newQuiz.title}" published successfully to your local catalog!`);
    resetForm();

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleDeleteConfirm = () => {
    if (!quizToDelete) return;
    deleteCustomQuiz(quizToDelete);
    setCustomQuizzes(getCustomQuizzes());
    onQuizPublished();
    setQuizToDelete(null);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customQuizzes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'codequest_custom_quizzes.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-wider">
            <PlusCircle className="h-4 w-4" />
            <span>Quiz Management & Authoring</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight sm:text-4xl mt-1">
            Quiz Creator & Manager
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Create custom coding quizzes, add authentic code snippets, configure question types, and immediately test them in CodeQuest.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 self-start rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Quiz</span>
          </button>
        )}
      </div>

      {/* Security & Local Notice Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-600 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-navy-900 text-sm">
          <Terminal className="h-4 w-4 text-brand-600" />
          <span>Client-Side Authoring Environment</span>
        </div>
        <p className="leading-relaxed">
          CodeQuest does not use mock logins or insecure hardcoded administrative keys. All custom quizzes you author are validated in-browser and stored securely in your local environment. They automatically appear alongside built-in quizzes and can be exported as JSON anytime.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Editor Form Mode */}
      {isEditing ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-navy-900">
              Author Custom Quiz
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          {validationError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quiz Metadata */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quiz Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Python Generators & Memory"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Programming Language *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {Object.keys(LANGUAGES).map((langKey) => (
                  <option key={langKey} value={langKey}>
                    {LANGUAGES[langKey as ProgrammingLanguage].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Difficulty Level *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Core Topic Tag *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Memory & Scope"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estimated Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quiz Description *
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what coding concepts and skills this quiz tests..."
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy-900">
                  Questions ({questions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in questions, selectable answers, and explanatory solutions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 rounded-xl border border-brand-300 bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-8">
              {questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="flex items-center gap-2 font-bold text-navy-900 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white text-xs">
                        {qIdx + 1}
                      </span>
                      <span>Question {qIdx + 1}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600">
                        Question Format
                      </label>
                      <select
                        value={q.type}
                        onChange={(e) => handleQuestionChange(qIdx, 'type', e.target.value as QuestionType)}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs"
                      >
                        <option value="predict-output">Predict the Output</option>
                        <option value="concept">Language Concept</option>
                        <option value="debugging">Debugging Challenge</option>
                        <option value="complete-code">Complete the Code</option>
                        <option value="sql-practice">SQL Practice</option>
                        <option value="best-solution">Best Practice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600">
                        Subtopic
                      </label>
                      <input
                        type="text"
                        value={q.topic}
                        onChange={(e) => handleQuestionChange(qIdx, 'topic', e.target.value)}
                        placeholder="e.g. Scoping, Pointers"
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      Question Prompt *
                    </label>
                    <textarea
                      rows={2}
                      value={q.text}
                      onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                      placeholder="e.g. What will be printed by the following code snippet?"
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      Optional Code Snippet (Monospaced display)
                    </label>
                    <textarea
                      rows={4}
                      value={q.codeSnippet || ''}
                      onChange={(e) => handleQuestionChange(qIdx, 'codeSnippet', e.target.value)}
                      placeholder={`def calculate(x):\n    return x * 2`}
                      className="mt-1 w-full font-mono rounded-xl border border-slate-800 bg-[#0d1117] px-3 py-2 text-xs text-slate-200 shadow-xs"
                    />
                  </div>

                  {/* 4 Options */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Answer Choices (Select radio button for the correct answer) *
                    </label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {q.options.map((opt, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx);
                        const isCorrect = q.correctIndex === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-2 rounded-xl border p-2.5 transition-colors ${
                              isCorrect
                                ? 'border-emerald-300 bg-emerald-50/60'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${q.id}`}
                              checked={isCorrect}
                              onChange={() => handleQuestionChange(qIdx, 'correctIndex', optIdx)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-mono text-xs font-bold text-slate-500">
                              {optLetter}.
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              placeholder={`Option ${optLetter} text`}
                              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      Educational Explanation (Explains why correct option is right) *
                    </label>
                    <textarea
                      rows={3}
                      value={q.explanation}
                      onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                      placeholder="Explain the underlying programming principle, runtime behavior, or rule..."
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={validateAndPublish}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700"
            >
              <Save className="h-4 w-4" />
              <span>Validate & Publish Quiz</span>
            </button>
          </div>
        </div>
      ) : (
        /* Custom Quizzes List & Export */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900">
              Published Custom Quizzes ({customQuizzes.length})
            </h2>

            {customQuizzes.length > 0 && (
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export JSON</span>
              </button>
            )}
          </div>

          {customQuizzes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand-600">
                <Terminal className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-900">
                No custom quizzes created yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Use the Creator Mode to build custom coding questions, test novel programming interview scenarios, or share quizzes.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Your First Quiz</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {customQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="rounded-2xl border border-brand-200 bg-white p-6 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                        {LANGUAGES[quiz.language]?.name || quiz.language}
                      </span>
                      <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                        Custom
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-navy-900">
                      {quiz.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>

                    <div className="mt-4 text-[11px] text-slate-500 font-medium">
                      {quiz.questions.length} Questions • ~{quiz.estimatedMinutes} mins
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setQuizToDelete(quiz.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete custom quiz"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartQuiz(quiz.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      <span>Test Quiz</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={quizToDelete !== null}
        title="Delete Custom Quiz?"
        message="Are you sure you want to permanently delete this custom quiz from your browser's local library? This action cannot be undone."
        confirmLabel="Yes, Delete Quiz"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setQuizToDelete(null)}
      />
    </div>
  );
};
