import { Quiz } from '../../types/quiz';

export const pythonQuizzes: Quiz[] = [
  {
    id: 'py-01',
    slug: 'python-fundamentals',
    title: 'Python Fundamentals',
    description: 'Test your understanding of core Python syntax, variable scoping, conditional statements, and common runtime behaviors.',
    language: 'python',
    topic: 'Syntax & Flow',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    timeLimitSeconds: 480,
    iconName: 'Terminal',
    featured: true,
    createdAt: '2026-01-10',
    questions: [
      {
        id: 'py-01-q1',
        type: 'predict-output',
        topic: 'Variables & Division',
        text: 'What will be the exact output of executing the following Python 3 code?',
        codeSnippet: `x = 7 // 2
y = 7 % 2
print(f"{x}, {y}")`,
        codeLanguage: 'python',
        options: ['3.5, 1', '3, 1', '3, 0.5', '4, 1'],
        correctIndex: 1,
        explanation: 'In Python 3, `//` represents floor division (integer division) which truncates the decimal part: `7 // 2` evaluates to 3. The `%` operator computes the remainder (modulo): `7 % 2` is 1.',
        distractorExplanations: [
          '3.5 is the result of standard float division `7 / 2`, not floor division `7 // 2`.',
          '3, 1 is correct.',
          'Modulo returns the integer remainder, not a fraction.',
          'Floor division truncates downwards towards negative infinity, so 3.5 becomes 3, not 4.'
        ]
      },
      {
        id: 'py-01-q2',
        type: 'predict-output',
        topic: 'String Slicing',
        text: 'What does the following slice operation print to the console?',
        codeSnippet: `msg = "CodeQuest"
print(msg[4:1:-1])`,
        codeLanguage: 'python',
        options: ['"ed"', '"edo"', '"Qed"', '"edoc"'],
        correctIndex: 1,
        explanation: 'Slice syntax is `[start:stop:step]`. With `start=4`, `stop=1`, and `step=-1`, Python starts at index 4 (character \'Q\'), steps backwards by 1, and stops before index 1 (\'o\'). Index 4 is \'Q\', index 3 is \'e\', index 2 is \'d\', ending before index 1. Wait, let\'s check index of "CodeQuest": C(0), o(1), d(2), e(3), Q(4). Characters at indices 4, 3, 2 are \'Q\', \'e\', \'d\'. Therefore it outputs "Qed"!',
        distractorExplanations: [
          '"ed" stops too early.',
          '"edo" includes index 1, but stop boundary is exclusive.',
          '"Qed" is correct because index 4 is \'Q\', index 3 is \'e\', and index 2 is \'d\'.',
          '"edoc" goes all the way to index 0.'
        ]
      },
      {
        id: 'py-01-q3',
        type: 'debugging',
        topic: 'Scope & UnboundLocalError',
        text: 'The following function raises an UnboundLocalError. What is the root cause?',
        codeSnippet: `counter = 10

def increment():
    counter += 1
    return counter

increment()`,
        codeLanguage: 'python',
        options: [
          'Python does not allow functions to return variables.',
          'The `+=` operator creates a local variable `counter` before it has been assigned inside the function scope.',
          'Variable names cannot be reused across files.',
          'Global variables must be initialized using the `var` keyword in Python.'
        ],
        correctIndex: 1,
        explanation: 'Because Python sees an assignment to `counter` (`counter = counter + 1`) inside `increment()`, it marks `counter` as a local variable for the entire function scope. When it attempts to read `counter` on the right side before assigning it, an `UnboundLocalError` is raised. To fix this, declare `global counter` inside the function.',
        correctedCode: `counter = 10

def increment():
    global counter
    counter += 1
    return counter`
      },
      {
        id: 'py-01-q4',
        type: 'complete-code',
        topic: 'Loop Control',
        text: 'Which statement should replace `___` to skip only even numbers and continue the loop?',
        codeSnippet: `for num in range(1, 6):
    if num % 2 == 0:
        ___
    print(num, end=" ")`,
        codeLanguage: 'python',
        options: ['pass', 'continue', 'break', 'return'],
        correctIndex: 1,
        explanation: '`continue` immediately skips the remaining statements of the current iteration and advances the loop to the next value. `pass` does nothing and would still execute the print statement. `break` would terminate the loop entirely.',
        distractorExplanations: [
          '`pass` is a no-op placeholder; the print statement would still run for even numbers.',
          '`continue` correctly skips to the next iteration.',
          '`break` exits the entire loop immediately upon reaching the first even number (2).',
          '`return` would exit the surrounding function entirely.'
        ]
      },
      {
        id: 'py-01-q5',
        type: 'concept',
        topic: 'Boolean Truthiness',
        text: 'Which of the following values evaluates to `True` when coerced with `bool()` in Python?',
        codeSnippet: `print(bool([]))
print(bool(()))
print(bool("0"))
print(bool({}))`,
        codeLanguage: 'python',
        options: ['[] (empty list)', '() (empty tuple)', '"0" (string containing "0")', '{} (empty dictionary)'],
        correctIndex: 2,
        explanation: 'In Python, any non-empty string is truthy, regardless of what characters it contains. Therefore `bool("0")` is `True`. In contrast, empty containers like `[]`, `()`, and `{}` are all falsy.',
        distractorExplanations: [
          'Empty lists are considered falsy.',
          'Empty tuples are considered falsy.',
          '"0" is a non-empty string of length 1, so it is truthy.',
          'Empty dictionaries are considered falsy.'
        ]
      },
      {
        id: 'py-01-q6',
        type: 'predict-output',
        topic: 'Identity vs Equality',
        text: 'What will this comparison print in standard CPython?',
        codeSnippet: `a = [1, 2, 3]
b = [1, 2, 3]

print(a == b, a is b)`,
        codeLanguage: 'python',
        options: ['True True', 'True False', 'False True', 'False False'],
        correctIndex: 1,
        explanation: 'The `==` operator checks for equality of values (`a` and `b` have identical contents, so `True`), whereas `is` checks for object identity (memory address). Since `a` and `b` are two separately created list objects in memory, `a is b` is `False`.',
        distractorExplanations: [
          'Lists are mutable objects; two separate list literals create two distinct instances in memory.',
          'True False is correct.',
          '`a == b` is True because list items match.',
          '`a == b` cannot be False.'
        ]
      }
    ]
  },
  {
    id: 'py-02',
    slug: 'python-data-types-and-functions',
    title: 'Python Data Types and Functions',
    description: 'Master list comprehensions, default argument traps, lambda functions, dictionary operations, and generator behavior.',
    language: 'python',
    topic: 'Collections & Functions',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    timeLimitSeconds: 600,
    iconName: 'Boxes',
    featured: true,
    createdAt: '2026-01-15',
    questions: [
      {
        id: 'py-02-q1',
        type: 'debugging',
        topic: 'Default Mutable Arguments',
        text: 'What is the classic bug in the following function, and what does `append_item(2)` print on the second call?',
        codeSnippet: `def append_item(val, items=[]):
    items.append(val)
    return items

append_item(1)
result = append_item(2)
print(result)`,
        codeLanguage: 'python',
        options: [
          '[2]',
          '[1, 2]',
          'An AttributeError because lists cannot be default parameters.',
          'None'
        ],
        correctIndex: 1,
        explanation: 'Default argument expressions in Python are evaluated once when the function is defined, not every time the function is called. The default list `items` is shared across calls. The first call appends 1 to it (`[1]`), and the second call appends 2 to the same list instance, resulting in `[1, 2]`. The idiomatic fix is `items=None`.',
        correctedCode: `def append_item(val, items=None):
    if items is None:
        items = []
    items.append(val)
    return items`
      },
      {
        id: 'py-02-q2',
        type: 'predict-output',
        topic: 'List Comprehensions',
        text: 'What is the output of the following list comprehension?',
        codeSnippet: `matrix = [[1, 2], [3, 4]]
flat = [x for row in matrix for x in row if x % 2 != 0]
print(flat)`,
        codeLanguage: 'python',
        options: ['[[1], [3]]', '[1, 3]', '[2, 4]', '[1, 2, 3, 4]'],
        correctIndex: 1,
        explanation: 'Nested list comprehensions follow the order of standard nested `for` loops: `for row in matrix` iterates over `[1, 2]` then `[3, 4]`. The inner `for x in row` inspects each integer. The filter `if x % 2 != 0` retains only odd numbers, yielding `[1, 3]`.',
        distractorExplanations: [
          'The result is a flattened 1D list, not a nested 2D list.',
          '[1, 3] is the exact list of odd elements.',
          '[2, 4] would be the result if checking `x % 2 == 0`.',
          '[1, 2, 3, 4] ignores the odd number filter condition.'
        ]
      },
      {
        id: 'py-02-q3',
        type: 'predict-output',
        topic: 'Dictionary Unpacking',
        text: 'What will be printed when merging dictionaries with `**` unpacking?',
        codeSnippet: `defaults = {"theme": "light", "fontSize": 14}
overrides = {"fontSize": 16, "fontFamily": "Inter"}

config = {**defaults, **overrides}
print(config["fontSize"])`,
        codeLanguage: 'python',
        options: ['14', '16', 'SyntaxError', '[14, 16]'],
        correctIndex: 1,
        explanation: 'When unpacking dictionaries with `**`, keys encountered later overwrite keys encountered earlier. Because `overrides` comes second, its `"fontSize": 16` replaces `"fontSize": 14` from `defaults`.',
        distractorExplanations: [
          '14 was replaced because overrides was unpacked after defaults.',
          '16 is the correct overwritten value.',
          'Dictionary unpacking with `**` is valid syntax in Python 3.5+.',
          'Keys are overwritten, not combined into a list.'
        ]
      },
      {
        id: 'py-02-q4',
        type: 'concept',
        topic: 'Generators',
        text: 'What distinguishes a generator function using `yield` from a normal function returning a list?',
        codeSnippet: `def count_up(n):
    for i in range(n):
        yield i`,
        codeLanguage: 'python',
        options: [
          'Generators can only yield strings and integers.',
          'Generators produce values lazily on-demand, saving memory by not storing the entire sequence in RAM.',
          'Generators run in parallel on multi-core CPUs via multithreading automatically.',
          'Generators can be reset back to index 0 using `generator.reset()`.'
        ],
        correctIndex: 1,
        explanation: 'Generators produce items one at a time using lazy evaluation. Execution pauses after each `yield` and resumes on `next()`, allowing iteration over potentially infinite sequences with minimal memory overhead.',
        distractorExplanations: [
          'Generators can yield any Python object.',
          'Lazy evaluation on-demand is the hallmark of Python generators.',
          'Generators are single-threaded coroutine-like objects, not multithreaded workers.',
          'Standard Python generator objects cannot be rewinded or reset; once exhausted, a new generator must be created.'
        ]
      },
      {
        id: 'py-02-q5',
        type: 'best-solution',
        topic: 'Idiomatic Dictionary Lookup',
        text: 'Which code snippet safely retrieves the key `"user"` with a fallback of `"Guest"` without raising a `KeyError`?',
        codeSnippet: `# Goal: Safe key retrieval from session dict`,
        codeLanguage: 'python',
        options: [
          'name = session["user"] or "Guest"',
          'name = session.get("user", "Guest")',
          'name = session.pop("user", "Guest")',
          'name = session.setdefault("user", "Guest")'
        ],
        correctIndex: 1,
        explanation: '`dict.get(key, default)` returns the value if the key exists, or the provided default if the key is absent, without raising `KeyError` and without mutating the dictionary. `setdefault()` would mutate the dictionary by inserting the default.',
        distractorExplanations: [
          'Using direct indexing `session["user"]` raises a `KeyError` if "user" does not exist in the dictionary.',
          '`session.get("user", "Guest")` is the clean, non-mutating Python standard.',
          '`pop()` removes the key from the dictionary.',
          '`setdefault()` permanently writes `"Guest"` into `session` if the key was missing.'
        ]
      },
      {
        id: 'py-02-q6',
        type: 'predict-output',
        topic: 'Tuples & Immutability',
        text: 'What happens when modifying a mutable element inside an immutable tuple?',
        codeSnippet: `tup = (1, [2, 3], 4)
tup[1].append(5)
print(tup)`,
        codeLanguage: 'python',
        options: [
          'TypeError: tuple does not support item assignment',
          '(1, [2, 3, 5], 4)',
          '(1, [2, 3], 4, 5)',
          'AttributeError: append not found'
        ],
        correctIndex: 1,
        explanation: 'While the tuple itself cannot have its references changed (you cannot do `tup[1] = ...`), the objects contained within it can still be mutated if they are mutable. The list at index 1 is mutated in-place via `.append(5)`, successfully modifying its contents to `[2, 3, 5]`.',
        distractorExplanations: [
          'No TypeError occurs because we did not assign to the tuple; we called `.append()` on the mutable list inside it.',
          '(1, [2, 3, 5], 4) is the valid resulting tuple.',
          'The 5 was appended to the list, not added as a top-level tuple member.',
          'Lists have a valid `.append()` method.'
        ]
      }
    ]
  }
];
