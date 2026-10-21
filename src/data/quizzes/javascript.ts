import { Quiz } from '../../types/quiz';

export const javascriptQuizzes: Quiz[] = [
  {
    id: 'js-01',
    slug: 'javascript-essentials',
    title: 'JavaScript Essentials',
    description: 'Test your grasp of JavaScript type coercion, truthiness, hoisting, strict equality, and asynchronous event loop fundamentals.',
    language: 'javascript',
    topic: 'Core Syntax & Coercion',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    timeLimitSeconds: 480,
    iconName: 'Code',
    featured: true,
    createdAt: '2026-01-12',
    questions: [
      {
        id: 'js-01-q1',
        type: 'predict-output',
        topic: 'Type Coercion',
        text: 'What is the output of the following addition and subtraction expressions?',
        codeSnippet: `console.log("5" + 2);
console.log("5" - 2);`,
        codeLanguage: 'javascript',
        options: ['"52" and "52"', '"52" and 3', '7 and 3', 'NaN and 3'],
        correctIndex: 1,
        explanation: 'The `+` operator performs string concatenation when either operand is a string (`"5" + 2` becomes `"52"`). The `-` operator, however, is purely mathematical, so JavaScript coerces `"5"` to the number `5` and calculates `5 - 2 = 3`.',
        distractorExplanations: [
          'The minus operator does not concatenate strings.',
          '"52" and 3 is correct.',
          'The plus operator does not coerce to number when a string is present.',
          '"5" converts cleanly to number 5, so it is not NaN.'
        ]
      },
      {
        id: 'js-01-q2',
        type: 'predict-output',
        topic: 'Hoisting & Temporal Dead Zone',
        text: 'What occurs when executing this block in modern ECMAScript?',
        codeSnippet: `console.log(score);
let score = 95;`,
        codeLanguage: 'javascript',
        options: [
          'undefined',
          'ReferenceError: Cannot access \'score\' before initialization',
          'null',
          '95'
        ],
        correctIndex: 1,
        explanation: 'Variables declared with `let` and `const` are hoisted to the top of the block, but are not initialized. The period from the start of the block until the declaration is called the Temporal Dead Zone (TDZ). Accessing the variable in the TDZ throws a `ReferenceError`. (In contrast, `var` would have logged `undefined`).',
        distractorExplanations: [
          '`undefined` occurs with `var`, but `let` enforces TDZ checking.',
          'ReferenceError is the exact runtime exception.',
          'JavaScript never defaults uninitialized identifiers to `null`.',
          '95 has not been reached yet when `console.log` executes.'
        ]
      },
      {
        id: 'js-01-q3',
        type: 'concept',
        topic: 'Equality Comparison',
        text: 'Which comparison expression returns `false`?',
        codeSnippet: `// Comparing standard JS equality edge cases`,
        codeLanguage: 'javascript',
        options: [
          '0 == false',
          'null == undefined',
          '"" == 0',
          'NaN === NaN'
        ],
        correctIndex: 3,
        explanation: 'According to the IEEE 754 floating point standard and JavaScript specification, `NaN` is not equal to anything, including itself. Therefore `NaN === NaN` is `false`. (Use `Number.isNaN()` or `Object.is(NaN, NaN)` to check).',
        distractorExplanations: [
          '`0 == false` evaluates to `true` via loose equality.',
          '`null == undefined` is explicitly defined to evaluate to `true` in JavaScript.',
          '`"" == 0` evaluates to `true` because empty string coerces to 0 in numeric comparison.',
          '`NaN === NaN` evaluates to `false`.'
        ]
      },
      {
        id: 'js-01-q4',
        type: 'debugging',
        topic: 'Event Loop & setTimeout',
        text: 'In what order will the following console logs appear?',
        codeSnippet: `console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");`,
        codeLanguage: 'javascript',
        options: ['A, B, C, D', 'A, D, B, C', 'A, D, C, B', 'A, C, D, B'],
        correctIndex: 2,
        explanation: '1. Synchronous code executes first: "A", then "D".\n2. Microtasks (Promise reactions) have higher priority than macrotasks (timers) and run before the next event loop tick: "C".\n3. Macrotask (setTimeout callback) runs next: "B".\nFinal sequence: A, D, C, B.',
        distractorExplanations: [
          'Async callbacks never execute before synchronous code on the call stack.',
          'Microtask "C" runs before macrotask "B".',
          'A, D, C, B is the standard event loop execution sequence.',
          'Synchronous "D" must execute before microtasks queue is drained.'
        ]
      },
      {
        id: 'js-01-q5',
        type: 'complete-code',
        topic: 'Nullish Coalescing',
        text: 'Which operator should replace `___` to preserve `0` as a valid count, falling back to `10` only if `count` is `null` or `undefined`?',
        codeSnippet: `const count = 0;
const finalCount = count ___ 10;
console.log(finalCount); // Desired output: 0`,
        codeLanguage: 'javascript',
        options: ['||', '??', '&&', '?:'],
        correctIndex: 1,
        explanation: 'The nullish coalescing operator `??` returns the right-hand operand only if the left-hand operand is `null` or `undefined`. The logical OR operator `||` treats `0` as falsy and would incorrectly fall back to `10`.',
        distractorExplanations: [
          '`||` treats `0` as falsy and would evaluate to `10`.',
          '`??` only checks for `null` and `undefined`, preserving `0`.',
          '`&&` returns the second operand if the first is truthy, which would fail here.',
          '`?:` is ternary syntax requiring a condition and colon.'
        ]
      },
      {
        id: 'js-01-q6',
        type: 'predict-output',
        topic: 'Array.map and parseInt Trap',
        text: 'What will `["1", "2", "3"].map(parseInt)` produce in JavaScript?',
        codeSnippet: `const numbers = ["1", "2", "3"].map(parseInt);
console.log(numbers);`,
        codeLanguage: 'javascript',
        options: ['[1, 2, 3]', '[1, NaN, NaN]', '[1, 2, NaN]', 'TypeError'],
        correctIndex: 1,
        explanation: 'Array `.map()` passes three arguments to its callback: `(element, index, array)`. `parseInt` accepts `(string, radix)`. For the first item: `parseInt("1", 0)` uses base 10 -> 1. For the second item: `parseInt("2", 1)` -> radix 1 is invalid -> `NaN`. For the third item: `parseInt("3", 2)` -> "3" is not a valid binary digit -> `NaN`. The result is `[1, NaN, NaN]`. To fix this, use `.map(Number)` or `.map(str => parseInt(str, 10))`.',
        distractorExplanations: [
          'It would only be `[1, 2, 3]` if written as `.map(x => parseInt(x))` or `.map(Number)`.',
          '[1, NaN, NaN] is the famous JavaScript quirk result.',
          'Radix 1 produces NaN, not 2.',
          'No TypeError is thrown; invalid conversions in parseInt return NaN.'
        ]
      }
    ]
  },
  {
    id: 'js-02',
    slug: 'javascript-arrays-objects-and-scope',
    title: 'JavaScript Arrays, Objects, and Scope',
    description: 'Deep dive into closures, array mutation vs pure methods, deep vs shallow copying, `this` binding, and destructuring.',
    language: 'javascript',
    topic: 'Data Structures & Closures',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    timeLimitSeconds: 600,
    iconName: 'Braces',
    featured: true,
    createdAt: '2026-01-18',
    questions: [
      {
        id: 'js-02-q1',
        type: 'predict-output',
        topic: 'Closures & Loop Scoping',
        text: 'What will be printed when the timeout callbacks fire?',
        codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10);
}`,
        codeLanguage: 'javascript',
        options: ['0 1 2', '3 3 3', 'undefined undefined undefined', '3 2 1'],
        correctIndex: 1,
        explanation: 'Because `var` is function-scoped (or globally scoped here) rather than block-scoped, there is only one shared variable `i` for all iterations. By the time the `setTimeout` callbacks run after 10ms, the loop has completed and `i` equals 3. All three callbacks log 3. Replacing `var` with `let` creates a new binding for each iteration and outputs `0 1 2`.',
        distractorExplanations: [
          '0 1 2 would occur if `let` was used instead of `var`.',
          '3 3 3 is the correct result of shared var closure.',
          '`i` is 3, not undefined.',
          'Loop does not count backwards.'
        ]
      },
      {
        id: 'js-02-q2',
        type: 'concept',
        topic: 'Arrow Functions and `this`',
        text: 'How does the `this` keyword behave inside an ES6 arrow function compared to a standard `function` declaration?',
        codeSnippet: `const obj = {
  name: "CodeQuest",
  regular: function() { return this.name; },
  arrow: () => { return this.name; }
};`,
        codeLanguage: 'javascript',
        options: [
          'Arrow functions bind `this` to the object they are declared inside.',
          'Arrow functions do not have their own `this`; they inherit `this` lexically from their enclosing scope.',
          'Arrow functions throw a SyntaxError when referencing `this`.',
          'Arrow functions re-bind `this` on every invocation to the caller.'
        ],
        correctIndex: 1,
        explanation: 'Arrow functions do not define their own `this` binding; instead, `this` is resolved lexically like any other variable from the surrounding lexical scope at the time the function is created. In object literals, the surrounding scope is usually the module/global scope (or `window`), so `obj.arrow()` will not point to `obj`.',
        distractorExplanations: [
          'Object curly braces `{}` do not establish a new lexical variable scope.',
          'Arrow functions resolve `this` lexically.',
          'Arrow functions can freely use `this`, it is not a SyntaxError.',
          'Regular functions bind `this` based on how they are called; arrow functions never rebind `this`.'
        ]
      },
      {
        id: 'js-02-q3',
        type: 'debugging',
        topic: 'Object References & Shallow Copy',
        text: 'What will `user.settings.theme` be after the following spread assignment?',
        codeSnippet: `const user = {
  name: "Alex",
  settings: { theme: "light" }
};

const userCopy = { ...user };
userCopy.settings.theme = "dark";

console.log(user.settings.theme);`,
        codeLanguage: 'javascript',
        options: ['"light"', '"dark"', 'undefined', 'TypeError'],
        correctIndex: 1,
        explanation: 'Object spread `{ ...user }` performs a shallow copy. The nested object `settings` is not cloned; both `user` and `userCopy` point to the same memory reference for `settings`. Modifying `userCopy.settings.theme` mutates `user.settings.theme` as well. To avoid this, use deep cloning (`structuredClone(user)`) or nested spread `{ ...user, settings: { ...user.settings } }`.',
        correctedCode: `const userCopy = structuredClone(user);
userCopy.settings.theme = "dark";
console.log(user.settings.theme); // "light"`
      },
      {
        id: 'js-02-q4',
        type: 'predict-output',
        topic: 'Array Reduce',
        text: 'What is the evaluated output of the following `reduce` accumulator?',
        codeSnippet: `const words = ["a", "b", "a", "c", "b", "a"];
const counts = words.reduce((acc, word) => {
  acc[word] = (acc[word] || 0) + 1;
  return acc;
}, {});

console.log(counts["a"]);`,
        codeLanguage: 'javascript',
        options: ['1', '2', '3', 'undefined'],
        correctIndex: 2,
        explanation: 'The letter "a" appears 3 times in the array. The accumulator begins as an empty object `{}`. Each time `"a"` is encountered, its count is incremented: 0+1=1, 1+1=2, 2+1=3.',
        distractorExplanations: [
          '1 is only the first increment.',
          '2 accounts for "b", not "a".',
          '3 is the exact tally for "a".',
          '"a" exists in the resulting counts dictionary.'
        ]
      },
      {
        id: 'js-02-q5',
        type: 'best-solution',
        topic: 'Immutability & Array Methods',
        text: 'Which array method returns a new array sorted without mutating the original array?',
        codeSnippet: `const nums = [3, 1, 4, 1, 5];
// Requirement: Non-mutating sort`,
        codeLanguage: 'javascript',
        options: [
          'nums.sort()',
          'nums.toSorted()',
          'nums.reverse()',
          'nums.filter().sort()'
        ],
        correctIndex: 1,
        explanation: '`toSorted()` (introduced in ECMAScript 2023) creates a shallow copy of the array and returns the sorted array without modifying the original array in place. In contrast, `nums.sort()` mutates the source array directly.',
        distractorExplanations: [
          '`nums.sort()` mutates `nums` in place.',
          '`toSorted()` is the official ECMAScript non-mutating sort method.',
          '`nums.reverse()` also mutates the original array.',
          '`filter()` requires a callback predicate and is unnecessarily verbose compared to `toSorted()`.'
        ]
      },
      {
        id: 'js-02-q6',
        type: 'predict-output',
        topic: 'Destructuring Default Values',
        text: 'What will be logged by the destructuring assignment below?',
        codeSnippet: `const { role = "member", status = "active" } = {
  role: undefined,
  status: null
};

console.log(role, status);`,
        codeLanguage: 'javascript',
        options: [
          '"member" "active"',
          '"member" null',
          'undefined null',
          '"member" undefined'
        ],
        correctIndex: 1,
        explanation: 'In JavaScript destructuring, default values are applied only when the property is `undefined`. Because `role` is `undefined`, it uses the fallback `"member"`. However, `null` is a defined primitive value, so `status` remains `null`. The result is `"member" null`.',
        distractorExplanations: [
          '`null` does not trigger the default value in destructuring.',
          '"member" null is correct.',
          'role was replaced by its default value.',
          'status retained its explicit value of null.'
        ]
      }
    ]
  }
];
