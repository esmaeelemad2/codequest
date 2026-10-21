import { Quiz } from '../../types/quiz';

export const javaQuizzes: Quiz[] = [
  {
    id: 'java-01',
    slug: 'java-fundamentals',
    title: 'Java Fundamentals',
    description: 'Test your understanding of Java static typing, primitives vs wrapper objects, string pool mechanics, and exception handling.',
    language: 'java',
    topic: 'Types & Exceptions',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    timeLimitSeconds: 480,
    iconName: 'Coffee',
    featured: false,
    createdAt: '2026-01-20',
    questions: [
      {
        id: 'java-01-q1',
        type: 'predict-output',
        topic: 'String Pool & Equality',
        text: 'What will be printed when comparing these strings with `==` in Java?',
        codeSnippet: `String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");

System.out.println((s1 == s2) + " " + (s1 == s3));`,
        codeLanguage: 'java',
        options: ['true true', 'true false', 'false false', 'false true'],
        correctIndex: 1,
        explanation: 'In Java, string literals with identical values share the same cached object in the String Intern Pool, so `s1 == s2` is `true`. However, using `new String(...)` explicitly allocates a new distinct object on the heap, so `s1 == s3` evaluates to `false`. To compare string contents, use `.equals()`.',
        distractorExplanations: [
          '`new String()` allocates a new memory reference on the heap, making `==` false.',
          'true false is the exact output.',
          'Literal strings share intern pool reference, so `s1 == s2` is true.',
          '`s1 == s2` is true, not false.'
        ]
      },
      {
        id: 'java-01-q2',
        type: 'debugging',
        topic: 'NullPointerException',
        text: 'Which line in the following code throws a NullPointerException?',
        codeSnippet: `1: Integer count = null;
2: int primitiveCount = 0;
3: if (primitiveCount == 0) {
4:     primitiveCount = count;
5: }`,
        codeLanguage: 'java',
        options: ['Line 1', 'Line 3', 'Line 4', 'None, it compiles and runs'],
        correctIndex: 2,
        explanation: 'Line 4 triggers auto-unboxing. When Java attempts to unbox the wrapper `Integer count` to a primitive `int` by calling `count.intValue()`, a `NullPointerException` is thrown because `count` is `null`.',
        correctedCode: `if (count != null && primitiveCount == 0) {
    primitiveCount = count;
}`
      },
      {
        id: 'java-01-q3',
        type: 'concept',
        topic: 'Checked vs Unchecked Exceptions',
        text: 'Which exception class is an unchecked runtime exception in Java and does not require explicit `try-catch` or `throws` declaration?',
        codeSnippet: `// Exception hierarchy in java.lang`,
        codeLanguage: 'java',
        options: ['IOException', 'SQLException', 'NullPointerException', 'ClassNotFoundException'],
        correctIndex: 2,
        explanation: 'In Java, exceptions inheriting from `RuntimeException` (such as `NullPointerException`, `IllegalArgumentException`, and `IndexOutOfBoundsException`) are unchecked exceptions. All other subclasses of `Exception` are checked exceptions and must be caught or declared in the method signature.',
        distractorExplanations: [
          'IOException is a checked exception.',
          'SQLException is a checked exception.',
          'NullPointerException extends RuntimeException and is unchecked.',
          'ClassNotFoundException is a checked exception.'
        ]
      },
      {
        id: 'java-01-q4',
        type: 'complete-code',
        topic: 'Generics & Collections',
        text: 'Which type parameter syntax allows a method to accept a `List` of any type that extends `Number`?',
        codeSnippet: `public static double sumList(List<___> list) {
    double total = 0;
    for (Number n : list) {
        total += n.doubleValue();
    }
    return total;
}`,
        codeLanguage: 'java',
        options: ['? extends Number', '? super Number', 'T : Number', 'Number+'],
        correctIndex: 0,
        explanation: 'In Java generics, the upper-bounded wildcard `? extends Number` specifies that the list can hold instances of `Number` or any of its subclasses (such as `Integer` or `Double`). `? super Number` specifies a lower bound.',
        distractorExplanations: [
          '`? extends Number` is the standard upper-bounded wildcard.',
          '`? super Number` is a lower bound, requiring elements to be supertypes of Number.',
          '`T : Number` is invalid Java syntax.',
          '`Number+` is not valid Java syntax.'
        ]
      },
      {
        id: 'java-01-q5',
        type: 'predict-output',
        topic: 'Finally Block Execution',
        text: 'What value does this method return?',
        codeSnippet: `public static int testReturn() {
    try {
        return 1;
    } finally {
        return 2;
    }
}`,
        codeLanguage: 'java',
        options: ['1', '2', 'Compilation error', '1 followed by 2'],
        correctIndex: 1,
        explanation: 'A `finally` block always executes when control leaves a `try` block. If the `finally` block contains a `return` statement, it supersedes and discards any return value or pending unhandled exception from the `try` block, returning 2.',
        distractorExplanations: [
          'The return from the `finally` block overrides the `try` block return.',
          '2 is the value returned by the finally block.',
          'It is valid Java, though compiler linters often warn about return in finally.',
          'A method can only return a single value to its caller.'
        ]
      },
      {
        id: 'java-01-q6',
        type: 'predict-output',
        topic: 'Integer Cache',
        text: 'What is printed by this comparison in standard Java?',
        codeSnippet: `Integer a = 127;
Integer b = 127;
Integer c = 128;
Integer d = 128;

System.out.println((a == b) + " " + (c == d));`,
        codeLanguage: 'java',
        options: ['true true', 'true false', 'false false', 'false true'],
        correctIndex: 1,
        explanation: 'Java caches `Integer` objects between -128 and 127 via `Integer.valueOf()`. Since 127 falls within this range, `a` and `b` reference the identical cached object (`a == b` is `true`). For 128 (outside the cache), new distinct objects are instantiated, making `c == d` `false`.',
        distractorExplanations: [
          '128 is outside the cached range [-128, 127], so `c == d` is false.',
          'true false is correct.',
          '127 is inside the cache, so `a == b` is true.',
          'Cache applies to small integers, not large ones.'
        ]
      }
    ]
  },
  {
    id: 'java-02',
    slug: 'oop-in-java',
    title: 'Object-Oriented Programming in Java',
    description: 'Master inheritance, polymorphism, abstract classes, interfaces, method overriding rules, and encapsulation.',
    language: 'java',
    topic: 'Polymorphism & Design',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    timeLimitSeconds: 540,
    iconName: 'Layers',
    featured: false,
    createdAt: '2026-01-22',
    questions: [
      {
        id: 'java-02-q1',
        type: 'predict-output',
        topic: 'Polymorphism & Dynamic Dispatch',
        text: 'What will be printed when invoking `makeSound()` on the base reference?',
        codeSnippet: `class Animal {
    void makeSound() { System.out.print("Generic "); }
}
class Dog extends Animal {
    @Override
    void makeSound() { System.out.print("Bark "); }
}

Animal pet = new Dog();
pet.makeSound();`,
        codeLanguage: 'java',
        options: ['Generic ', 'Bark ', 'Generic Bark ', 'Compilation Error'],
        correctIndex: 1,
        explanation: 'In Java, all non-static method calls are virtual by default and resolved via dynamic method dispatch at runtime based on the actual object type (`Dog`), not the reference type (`Animal`). Thus `pet.makeSound()` prints "Bark ".',
        distractorExplanations: [
          'Dynamic dispatch resolves to the subclass override, not the base method.',
          'Bark is correct.',
          'Overridden methods do not invoke the superclass method unless `super.makeSound()` is called.',
          'Polymorphic assignment `Animal pet = new Dog()` is valid in Java.'
        ]
      },
      {
        id: 'java-02-q2',
        type: 'concept',
        topic: 'Static Method Overriding',
        text: 'Can a `static` method be overridden polymorphically in a subclass in Java?',
        codeSnippet: `class Parent {
    public static void greet() { System.out.println("Hello"); }
}
class Child extends Parent {
    public static void greet() { System.out.println("Hi"); }
}`,
        codeLanguage: 'java',
        options: [
          'Yes, static methods behave identically to instance methods.',
          'No, static methods are hidden (shadowed), not overridden, and resolved at compile-time by reference type.',
          'No, static methods in subclasses cannot share names with parent static methods.',
          'Yes, but only if annotated with `@Override`.'
        ],
        correctIndex: 1,
        explanation: 'Static methods belong to the class, not instance objects. Defining a static method with the same signature in a child class hides (shadows) the parent method rather than overriding it. Calls are resolved statically at compile-time according to the declared type of the reference.',
        distractorExplanations: [
          'Static methods do not support dynamic dispatch.',
          'Method hiding at compile-time is the exact behavior.',
          'Subclasses can declare identically named static methods.',
          '`@Override` on a static method produces a compilation error.'
        ]
      },
      {
        id: 'java-02-q3',
        type: 'debugging',
        topic: 'Abstract Classes vs Interfaces',
        text: 'Why does this code fail to compile?',
        codeSnippet: `interface Printable {
    void print();
}

abstract class Document implements Printable {
    abstract void sign();
}

class Invoice extends Document {
    void sign() { System.out.println("Signed"); }
}`,
        codeLanguage: 'java',
        options: [
          'Abstract classes cannot implement interfaces.',
          '`Invoice` does not implement the `print()` method inherited from `Printable`.',
          'Interfaces cannot have abstract methods.',
          'Invoice must be declared abstract.'
        ],
        correctIndex: 1,
        explanation: 'Because `Document` is abstract, it is not required to implement the `print()` method from `Printable`. However, `Invoice` is a concrete class; it must provide implementations for ALL inherited abstract methods (`sign()` and `print()`). Missing `print()` causes a compilation error.',
        correctedCode: `class Invoice extends Document {
    public void print() { System.out.println("Printing Invoice"); }
    void sign() { System.out.println("Signed"); }
}`
      },
      {
        id: 'java-02-q4',
        type: 'predict-output',
        topic: 'Constructor Chaining',
        text: 'In what order are the messages printed when `new Derived()` is instantiated?',
        codeSnippet: `class Base {
    Base() { System.out.print("1 "); }
}
class Derived extends Base {
    Derived() { System.out.print("2 "); }
}

public class Main {
    public static void main(String[] args) {
        new Derived();
    }
}`,
        codeLanguage: 'java',
        options: ['2 1', '1 2', '1', '2'],
        correctIndex: 1,
        explanation: 'When a subclass constructor runs, its first statement implicitly calls the parent class constructor `super()` before executing the subclass body. Thus `Base()` runs first ("1 "), followed by `Derived()` ("2 ").',
        distractorExplanations: [
          'The superclass constructor executes before the subclass constructor body.',
          '1 2 is the exact order.',
          'Derived constructor body is not skipped.',
          'Base constructor is always invoked.'
        ]
      },
      {
        id: 'java-02-q5',
        type: 'best-solution',
        topic: 'Encapsulation & Immutability',
        text: 'Which practice is essential when implementing an immutable class that contains a `java.util.Date` field?',
        codeSnippet: `public final class Event {
    private final Date eventDate;

    public Event(Date eventDate) {
        this.eventDate = eventDate; // Potential vulnerability
    }
}`,
        codeLanguage: 'java',
        options: [
          'Make `eventDate` public and static.',
          'Store and return defensive copies of `eventDate` using `new Date(...)` or `clone()`.',
          'Remove the constructor entirely.',
          'Change `Date` to a raw `Object`.'
        ],
        correctIndex: 1,
        explanation: 'Because `java.util.Date` is mutable, an external caller could modify the original Date instance passed to the constructor or received from a getter. Defensive copying in both the constructor (`this.eventDate = new Date(eventDate.getTime())`) and getter protects internal state. Alternatively, modern Java recommends using immutable `java.time.Instant` or `LocalDate`.',
        distractorExplanations: [
          'Public fields violate encapsulation.',
          'Defensive copying prevents external mutation of mutable internal objects.',
          'Removing the constructor prevents instantiation.',
          'Changing to Object does not solve mutability.'
        ]
      },
      {
        id: 'java-02-q6',
        type: 'concept',
        topic: 'Interface Default Methods',
        text: 'What was the primary reason default methods were introduced to Java interfaces in Java 8?',
        codeSnippet: `public interface Repository<T> {
    void save(T item);
    default boolean isEmpty() { return false; }
}`,
        codeLanguage: 'java',
        options: [
          'To deprecate abstract classes completely.',
          'To allow adding new methods to existing interfaces without breaking backward compatibility for implementing classes.',
          'To introduce multiple inheritance of state in Java.',
          'To force interfaces to run in separate threads.'
        ],
        correctIndex: 1,
        explanation: 'Default methods were introduced so library designers (such as the Java Collections framework) could add new methods (like `forEach`, `stream()`, or `removeIf`) to widely used interfaces without breaking existing third-party code that implemented those interfaces.',
        distractorExplanations: [
          'Abstract classes still hold state and constructors, which interfaces cannot.',
          'Backward compatibility with existing implementations was the primary motivation.',
          'Interfaces cannot declare mutable instance state/fields.',
          'Default methods have nothing to do with threading.'
        ]
      }
    ]
  }
];
