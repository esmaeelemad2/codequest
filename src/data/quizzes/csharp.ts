import { Quiz } from '../../types/quiz';

export const csharpQuizzes: Quiz[] = [
  {
    id: 'cs-01',
    slug: 'csharp-fundamentals',
    title: 'C# Fundamentals',
    description: 'Master .NET types, properties, nullable reference types, pattern matching, LINQ queries, and async/await mechanics.',
    language: 'csharp',
    topic: 'Language Features & LINQ',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    timeLimitSeconds: 480,
    iconName: 'Hash',
    featured: false,
    createdAt: '2026-02-01',
    questions: [
      {
        id: 'cs-01-q1',
        type: 'predict-output',
        topic: 'LINQ Query Evaluation',
        text: 'What is printed after executing the deferred LINQ query below?',
        codeSnippet: `var numbers = new List<int> { 1, 2, 3 };
var query = numbers.Where(n => n > 1);

numbers.Add(4);

Console.WriteLine(query.Count());`,
        codeLanguage: 'csharp',
        options: ['2', '3', '4', 'InvalidOperationException'],
        correctIndex: 1,
        explanation: 'LINQ queries utilize deferred (lazy) execution. The query `numbers.Where(n => n > 1)` does not execute when defined; it executes only when iterated or aggregated with `.Count()`. By then, `4` has been added to `numbers`, so `[2, 3, 4]` match the condition, yielding a count of 3.',
        distractorExplanations: [
          '2 assumes the query was evaluated immediately before `numbers.Add(4)`.',
          '3 is correct due to deferred execution.',
          '4 would include `1`, which does not satisfy `n > 1`.',
          'Deferred LINQ queries do not throw InvalidOperationException on collection mutation unless iterating concurrently.'
        ]
      },
      {
        id: 'cs-01-q2',
        type: 'concept',
        topic: 'Value vs Reference Types',
        text: 'Which of the following types is a value type stored on the stack in C#?',
        codeSnippet: `// C# Type System Categories`,
        codeLanguage: 'csharp',
        options: ['string', 'class', 'struct', 'interface'],
        correctIndex: 2,
        explanation: 'In C#, `struct` (along with enums and built-in numeric primitives like `int`, `double`, `bool`) is a value type. Value types typically reside on the stack or inline inside enclosing objects. Classes, strings, and interfaces are reference types whose objects live on the managed heap.',
        distractorExplanations: [
          '`string` is an immutable reference type stored on the heap.',
          '`class` defines reference types.',
          '`struct` defines value types.',
          '`interface` instances are reference types.'
        ]
      },
      {
        id: 'cs-01-q3',
        type: 'debugging',
        topic: 'Nullable Reference Types',
        text: 'How can you safely access `user.Address.City` without throwing a `NullReferenceException` if either `user` or `Address` is null?',
        codeSnippet: `string city = user.Address.City; // Risky`,
        codeLanguage: 'csharp',
        options: [
          'string city = user?.Address?.City ?? "Unknown";',
          'string city = user!.Address!.City;',
          'string city = (string)user.Address.City;',
          'string city = user::Address::City;'
        ],
        correctIndex: 0,
        explanation: 'The null-conditional operator `?.` short-circuits and returns `null` if any operand in the chain is null. The null-coalescing operator `??` provides a fallback value of `"Unknown"`. The null-forgiving operator `!` tells the compiler to silence warnings, which would still throw a runtime exception if null.',
        correctedCode: `string city = user?.Address?.City ?? "Unknown";`
      },
      {
        id: 'cs-01-q4',
        type: 'predict-output',
        topic: 'Pattern Matching switch Expression',
        text: 'What will be returned by the switch expression for an input of `35`?',
        codeSnippet: `string GetCategory(int speed) => speed switch
{
    <= 0 => "Stopped",
    > 0 and <= 30 => "Slow",
    > 30 and <= 60 => "Moderate",
    _ => "Fast"
};

Console.WriteLine(GetCategory(35));`,
        codeLanguage: 'csharp',
        options: ['Stopped', 'Slow', 'Moderate', 'Fast'],
        correctIndex: 2,
        explanation: 'The input `35` matches the relational and logical pattern `> 30 and <= 60`, which maps to `"Moderate"`. The discard pattern `_` acts as the default fallback for unmatched values.',
        distractorExplanations: [
          '35 is greater than 0, so it does not match `<= 0`.',
          '35 is greater than 30.',
          '"Moderate" is the exact matched arm.',
          '35 is not greater than 60, so it does not reach the fallback.'
        ]
      },
      {
        id: 'cs-01-q5',
        type: 'best-solution',
        topic: 'Resource Cleanup with `using`',
        text: 'What is the most idiomatic modern C# syntax to ensure an `IDisposable` resource is properly disposed when exiting scope?',
        codeSnippet: `// Requirement: Automatic disposal of FileStream`,
        codeLanguage: 'csharp',
        options: [
          'using var stream = File.OpenRead("data.txt");',
          'var stream = File.OpenRead("data.txt"); stream.Close();',
          'try { var stream = File.OpenRead("data.txt"); } catch {}',
          'finalize(File.OpenRead("data.txt"));'
        ],
        correctIndex: 0,
        explanation: 'C# 8.0 introduced using declarations: `using var stream = ...;`. This ensures `.Dispose()` is called automatically when the enclosing variable scope exits, without requiring braces nesting.',
        distractorExplanations: [
          '`using var` is the concise, safe standard in modern C#.',
          'Calling `Close()` manually is not exception-safe.',
          '`try-catch` without `finally` does not guarantee disposal.',
          '`finalize` is not a C# language keyword for resource disposal.'
        ]
      },
      {
        id: 'cs-01-q6',
        type: 'concept',
        topic: 'String Interpolation with Formatting',
        text: 'Which string interpolation expression formats a decimal `price` as standard currency with 2 decimal places?',
        codeSnippet: `decimal price = 129.5m;`,
        codeLanguage: 'csharp',
        options: [
          '$\"{price:C}\"',
          '$\"{price.currency()}\"',
          '\"{\" + price + \":$\" + \"}\"',
          '$\"{price->money}\"'
        ],
        correctIndex: 0,
        explanation: 'In C# string interpolation `$"..."`, standard format specifiers follow a colon `:`. `:C` formats numeric values as currency matching the current thread culture (e.g. `$129.50`).',
        distractorExplanations: [
          '`$"{price:C}"` is the standard .NET format string.',
          '`.currency()` is not a standard method on decimal.',
          'String concatenation with `:$` is not parsed.',
          '`->` is pointer member access, not formatting.'
        ]
      }
    ]
  }
];
