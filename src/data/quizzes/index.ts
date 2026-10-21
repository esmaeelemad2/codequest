import { Quiz } from '../../types/quiz';
import { pythonQuizzes } from './python';
import { javascriptQuizzes } from './javascript';
import { javaQuizzes } from './java';
import { cppQuizzes } from './cpp';
import { csharpQuizzes } from './csharp';
import { sqlQuizzes } from './sql';
import { htmlCssQuizzes } from './htmlCss';

export const INITIAL_QUIZZES: Quiz[] = [
  ...pythonQuizzes,
  ...javascriptQuizzes,
  ...javaQuizzes,
  ...cppQuizzes,
  ...csharpQuizzes,
  ...sqlQuizzes,
  ...htmlCssQuizzes,
];

export const getQuizById = (id: string, allQuizzes: Quiz[] = INITIAL_QUIZZES): Quiz | undefined => {
  return allQuizzes.find(q => q.id === id || q.slug === id);
};

export const getQuizzesByLanguage = (language: string, allQuizzes: Quiz[] = INITIAL_QUIZZES): Quiz[] => {
  return allQuizzes.filter(q => q.language === language);
};
