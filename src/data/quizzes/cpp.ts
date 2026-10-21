import { Quiz } from '../../types/quiz';

export const cppQuizzes: Quiz[] = [
  {
    id: 'cpp-01',
    slug: 'cpp-basics-and-control-flow',
    title: 'C++ Basics and Control Flow',
    description: 'Test your understanding of C++ variable scopes, references vs values, switch fallthrough, pass-by-reference, and standard stream I/O.',
    language: 'cpp',
    topic: 'Syntax & References',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    timeLimitSeconds: 480,
    iconName: 'TerminalSquare',
    featured: false,
    createdAt: '2026-01-25',
    questions: [
      {
        id: 'cpp-01-q1',
        type: 'predict-output',
        topic: 'Pass by Reference vs Value',
        text: 'What will be printed to stdout after `modify(val)` completes?',
        codeSnippet: `#include <iostream>

void modify(int& a, int b) {
    a += 10;
    b += 10;
}

int main() {
    int x = 5, y = 5;
    modify(x, y);
    std::cout << x << " " << y << std::endl;
    return 0;
}`,
        codeLanguage: 'cpp',
        options: ['5 5', '15 15', '15 5', '5 15'],
        correctIndex: 2,
        explanation: 'Parameter `a` is passed by reference (`int& a`), so modifications to `a` directly alter caller variable `x` (5 + 10 = 15). Parameter `b` is passed by value (`int b`), so `modify` receives a copy; caller variable `y` remains unchanged at 5.',
        distractorExplanations: [
          '`x` was passed by reference and was mutated.',
          '`y` was passed by value and was not mutated.',
          '15 5 is correct.',
          '`x` changed to 15, `y` remained 5.'
        ]
      },
      {
        id: 'cpp-01-q2',
        type: 'predict-output',
        topic: 'Switch Fallthrough',
        text: 'What is printed by this switch statement?',
        codeSnippet: `#include <iostream>

int main() {
    int num = 2;
    switch(num) {
        case 1: std::cout << "1";
        case 2: std::cout << "2";
        case 3: std::cout << "3";
        default: std::cout << "D";
    }
    return 0;
}`,
        codeLanguage: 'cpp',
        options: ['2', '23D', '23', 'D'],
        correctIndex: 1,
        explanation: 'Without `break` statements, execution enters at `case 2`, prints "2", and falls through subsequent cases and `default`, printing "3" and "D". The final output is "23D". Modern C++ uses `[[fallthrough]];` to document intentional fallthrough.',
        distractorExplanations: [
          'Switch statements require `break` to stop fallthrough.',
          '23D is the result of continuous fallthrough.',
          'The default branch is also executed during fallthrough.',
          'Execution enters at matching case 2, not default.'
        ]
      },
      {
        id: 'cpp-01-q3',
        type: 'concept',
        topic: 'Const References',
        text: 'Why is `const std::string&` preferred over `std::string` as a function parameter type?',
        codeSnippet: `void printMessage(const std::string& message) {
    std::cout << message << std::endl;
}`,
        codeLanguage: 'cpp',
        options: [
          'It forces string characters to uppercase.',
          'It avoids an expensive heap copy of the string while preventing the function from modifying the original object.',
          'It converts the string into a C-style char pointer automatically.',
          'It is required by the C++ compiler for all string functions.'
        ],
        correctIndex: 1,
        explanation: 'Passing by `const&` gives the efficiency of pass-by-reference (no copying of dynamic memory buffer) while guaranteeing read-only safety via `const`.',
        distractorExplanations: [
          '`const` enforces immutability, not text transformation.',
          'Zero-copy performance and immutability safety are the key benefits.',
          'It does not convert to `const char*`.',
          'Pass-by-value is syntactically legal, just less performant.'
        ]
      },
      {
        id: 'cpp-01-q4',
        type: 'debugging',
        topic: 'Operator Precedence and Prefix/Postfix',
        text: 'What is the value of `b` and `a` after this statement in C++?',
        codeSnippet: `int a = 5;
int b = ++a * 2;`,
        codeLanguage: 'cpp',
        options: ['b = 10, a = 6', 'b = 12, a = 6', 'b = 10, a = 5', 'b = 12, a = 5'],
        correctIndex: 1,
        explanation: 'The prefix increment `++a` increments `a` from 5 to 6 first and returns the updated lvalue 6. Then `6 * 2` is calculated, assigning 12 to `b`. Both `b = 12` and `a = 6`.',
        distractorExplanations: [
          'Prefix `++a` increments before the multiplication, unlike postfix `a++`.',
          'b = 12, a = 6 is the exact result.',
          '`a` is incremented, not preserved at 5.',
          '`a` becomes 6.'
        ]
      },
      {
        id: 'cpp-01-q5',
        type: 'complete-code',
        topic: 'Range-based For Loop',
        text: 'Which declaration allows modifying elements of `vec` in-place inside a range-based loop?',
        codeSnippet: `std::vector<int> vec = {1, 2, 3};
for (___ : vec) {
    x *= 2;
}`,
        codeLanguage: 'cpp',
        options: ['int x', 'auto x', 'auto& x', 'const auto& x'],
        correctIndex: 2,
        explanation: '`auto& x` binds a reference to each element in `vec`, allowing mutations like `x *= 2` to modify the vector elements directly. Using `int x` or `auto x` copies each element by value.',
        distractorExplanations: [
          '`int x` creates a local copy; modifying it leaves `vec` unchanged.',
          '`auto x` also creates a copy by value.',
          '`auto& x` creates an editable reference.',
          '`const auto& x` creates a read-only reference that prevents modification.'
        ]
      },
      {
        id: 'cpp-01-q6',
        type: 'concept',
        topic: 'Header Guards',
        text: 'What is the purpose of `#ifndef`, `#define`, and `#endif` header guards (or `#pragma once`) in C++?',
        codeSnippet: `#ifndef MY_HEADER_H
#define MY_HEADER_H

// Declarations

#endif`,
        codeLanguage: 'cpp',
        options: [
          'To encrypt the header file against reverse engineering.',
          'To prevent multiple definitions and compilation errors when the header is included multiple times across translation units.',
          'To automatically link external library DLLs.',
          'To restrict access to public functions.'
        ],
        correctIndex: 1,
        explanation: 'Header guards prevent the contents of a header file from being tokenized and compiled more than once within the same translation unit, preventing duplicate symbol and type redefinition errors.',
        distractorExplanations: [
          'Header guards are preprocessor directives, not encryption tools.',
          'Preventing multiple re-definitions is the fundamental purpose.',
          'Linking is handled by the linker, not preprocessor guards.',
          'Access specifiers (`public`, `private`) control visibility.'
        ]
      }
    ]
  },
  {
    id: 'cpp-02',
    slug: 'cpp-pointers-and-memory-fundamentals',
    title: 'C++ Pointers and Memory Fundamentals',
    description: 'Master raw pointers, address-of and dereference operators, dynamic allocation with new/delete, smart pointers, and memory leaks.',
    language: 'cpp',
    topic: 'Memory & RAII',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    timeLimitSeconds: 600,
    iconName: 'Cpu',
    featured: false,
    createdAt: '2026-01-28',
    questions: [
      {
        id: 'cpp-02-q1',
        type: 'predict-output',
        topic: 'Pointer Dereferencing',
        text: 'What will be printed by the pointer operations below?',
        codeSnippet: `#include <iostream>

int main() {
    int val = 42;
    int* ptr = &val;
    *ptr = 99;
    std::cout << val << " " << *ptr << std::endl;
    return 0;
}`,
        codeLanguage: 'cpp',
        options: ['42 42', '42 99', '99 99', 'Hexadecimal address'],
        correctIndex: 2,
        explanation: '`ptr` stores the memory address of `val` (`&val`). Dereferencing `ptr` with `*ptr = 99` writes directly into the memory location of `val`. Thus both `val` and `*ptr` evaluate to 99.',
        distractorExplanations: [
          'The value of `val` was mutated through the pointer.',
          'Both `val` and `*ptr` reference the same memory slot, so they are identical.',
          '99 99 is correct.',
          'Dereferencing `*ptr` yields the value, not the address.'
        ]
      },
      {
        id: 'cpp-02-q2',
        type: 'debugging',
        topic: 'Memory Leak & Delete Array',
        text: 'What memory management bug is present in the code below?',
        codeSnippet: `int* arr = new int[50];
// ... operations
delete arr;`,
        codeLanguage: 'cpp',
        options: [
          '`arr` cannot be allocated dynamically with `new`.',
          'Array deallocation must use `delete[] arr` instead of scalar `delete arr`, otherwise undefined behavior and leaks occur.',
          'The size 50 must be passed to `delete(50, arr)`.',
          'No bug exists.'
        ],
        correctIndex: 1,
        explanation: 'Memory allocated with array `new[]` must always be released with array `delete[]`. Using scalar `delete` on an array leads to undefined behavior; for objects with destructors, only the first element\'s destructor would be called.',
        correctedCode: `int* arr = new int[50];
// ... operations
delete[] arr;`
      },
      {
        id: 'cpp-02-q3',
        type: 'concept',
        topic: 'RAII and Smart Pointers',
        text: 'What makes `std::unique_ptr` safer than raw pointers in modern C++?',
        codeSnippet: `std::unique_ptr<Widget> w = std::make_unique<Widget>();`,
        codeLanguage: 'cpp',
        options: [
          'It encrypts heap memory.',
          'It automatically deallocates the managed object when it goes out of scope (RAII), preventing leaks even if exceptions are thrown.',
          'It allows multiple owners to modify the object simultaneously across threads without locks.',
          'It runs on the GPU.'
        ],
        correctIndex: 1,
        explanation: '`std::unique_ptr` implements Resource Acquisition Is Initialization (RAII). It has exclusive ownership of a dynamic resource and automatically invokes `delete` upon destruction, providing exception safety and preventing leaks.',
        distractorExplanations: [
          'Smart pointers manage lifetime, not memory encryption.',
          'Automatic cleanup via RAII is the core feature of `unique_ptr`.',
          '`std::unique_ptr` is strictly non-copyable; multiple ownership is handled by `std::shared_ptr`.',
          'Smart pointers are standard CPU constructs.'
        ]
      },
      {
        id: 'cpp-02-q4',
        type: 'predict-output',
        topic: 'Pointer Arithmetic',
        text: 'What is printed by accessing array elements via pointer arithmetic?',
        codeSnippet: `#include <iostream>

int main() {
    int nums[] = {10, 20, 30, 40};
    int* p = nums;
    std::cout << *(p + 2) << std::endl;
    return 0;
}`,
        codeLanguage: 'cpp',
        options: ['10', '20', '30', '40'],
        correctIndex: 2,
        explanation: 'Array names decay into a pointer to their first element (`nums[0]`). Adding 2 advances the pointer by `2 * sizeof(int)` bytes to point at `nums[2]`. Dereferencing `*(p + 2)` yields `30`.',
        distractorExplanations: [
          '`p + 0` is 10.',
          '`p + 1` is 20.',
          '30 is the element at index 2.',
          '`p + 3` is 40.'
        ]
      },
      {
        id: 'cpp-02-q5',
        type: 'debugging',
        topic: 'Dangling Pointer',
        text: 'What is the danger of returning a pointer or reference to a local stack variable?',
        codeSnippet: `int* getNumber() {
    int num = 100;
    return &num;
}`,
        codeLanguage: 'cpp',
        options: [
          'Stack variables are permanent, wasting RAM.',
          '`num` is destroyed when `getNumber()` exits, leaving a dangling pointer whose dereference is undefined behavior.',
          'Compilation always fails with Error 404.',
          'The function converts the number into float.'
        ],
        correctIndex: 1,
        explanation: 'Local variables are allocated on the call stack and deallocated as soon as their enclosing scope ends. Returning `&num` returns an address to invalid, freed stack memory (a dangling pointer). Accessing it invokes undefined behavior.',
        correctedCode: `int getNumber() {
    int num = 100;
    return num; // Return by value
}`
      },
      {
        id: 'cpp-02-q6',
        type: 'best-solution',
        topic: 'Modern Ownership Transfer',
        text: 'How should ownership of a `std::unique_ptr` be transferred to another function or container in C++11 and later?',
        codeSnippet: `std::unique_ptr<Task> task = std::make_unique<Task>();
// Requirement: Transfer ownership to processTask(std::unique_ptr<Task> t)`,
        codeLanguage: 'cpp',
        options: [
          'processTask(task); // Direct copy',
          'processTask(std::move(task));',
          'processTask(&task);',
          'processTask(task.clone());'
        ],
        correctIndex: 1,
        explanation: 'Because `std::unique_ptr` explicitly deletes its copy constructor, it cannot be passed by value directly. To transfer ownership, you must explicitly use `std::move(task)`, which invokes its move constructor and leaves the original pointer as `nullptr`.',
        distractorExplanations: [
          'Direct copy causes a compile-time error because `unique_ptr` cannot be copied.',
          '`std::move` casts to an rvalue reference to trigger the move constructor.',
          'Passing `&task` passes a pointer to the unique_ptr itself without transferring ownership.',
          '`unique_ptr` does not have a `.clone()` method.'
        ]
      }
    ]
  }
];
