import { Quiz } from '../../types/quiz';

export const sqlQuizzes: Quiz[] = [
  {
    id: 'sql-01',
    slug: 'sql-queries-filtering-and-joins',
    title: 'SQL Queries, Filtering, and Joins',
    description: 'Master relational queries, INNER and LEFT JOINs, GROUP BY aggregations, HAVING vs WHERE filters, and NULL comparisons.',
    language: 'sql',
    topic: 'Relational Queries & Joins',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    timeLimitSeconds: 540,
    iconName: 'Database',
    featured: true,
    createdAt: '2026-02-05',
    questions: [
      {
        id: 'sql-01-q1',
        type: 'sql-practice',
        topic: 'NULL Comparison',
        text: 'Why does the following query fail to return records where `discount` is null or zero?',
        codeSnippet: `SELECT product_name, price 
FROM products 
WHERE discount = NULL;`,
        codeLanguage: 'sql',
        options: [
          'NULL values cannot be stored in SQL tables.',
          'In SQL, comparisons with NULL using `=` evaluate to UNKNOWN/false; you must use `IS NULL`.',
          'The `WHERE` clause must come before the `FROM` clause.',
          '`product_name` must be wrapped in `LOWER()`.'
        ],
        correctIndex: 1,
        explanation: 'In Three-Valued Logic (3VL) SQL, `NULL` represents an unknown value. Any equality test like `col = NULL` evaluates to `UNKNOWN` (falsy in WHERE). You must always write `WHERE discount IS NULL` to check for missing values.',
        correctedCode: `SELECT product_name, price 
FROM products 
WHERE discount IS NULL;`
      },
      {
        id: 'sql-01-q2',
        type: 'sql-practice',
        topic: 'INNER vs LEFT JOIN',
        text: 'Given `customers` (5 rows) and `orders` (3 rows with matching customer_id, and 2 customers with 0 orders), how many rows does a `LEFT JOIN` on customers return?',
        codeSnippet: `SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;`,
        codeLanguage: 'sql',
        options: ['3 rows', '5 rows', '2 rows', '8 rows'],
        correctIndex: 1,
        explanation: 'A `LEFT JOIN` returns ALL records from the left table (`customers`), plus matching records from the right table (`orders`). Customers who have not placed any orders will still appear in the result with `o.order_id` as `NULL`. Because there are 5 customers and none placed duplicate orders in this scenario, exactly 5 rows are returned.',
        distractorExplanations: [
          '3 rows would be returned by an `INNER JOIN`, which excludes customers without orders.',
          '5 rows is correct because LEFT JOIN guarantees all left table rows are retained.',
          '2 is just the count of customers without orders.',
          '8 would require Cartesian product or many-to-many duplicates.'
        ]
      },
      {
        id: 'sql-01-q3',
        type: 'concept',
        topic: 'WHERE vs HAVING',
        text: 'What is the key difference between the `WHERE` clause and the `HAVING` clause in SQL?',
        codeSnippet: `SELECT department, COUNT(*) AS emp_count
FROM employees
WHERE salary > 50000
GROUP BY department
HAVING COUNT(*) > 5;`,
        codeLanguage: 'sql',
        options: [
          'They are completely interchangeable aliases in SQL standard.',
          '`WHERE` filters individual rows before grouping/aggregating; `HAVING` filters aggregated groups after `GROUP BY`.',
          '`HAVING` only works on primary keys.',
          '`WHERE` can only be used with numbers, while `HAVING` works with strings.'
        ],
        correctIndex: 1,
        explanation: '`WHERE` filters individual input rows before grouping operations occur. `HAVING` operates on the aggregate groups resulting from the `GROUP BY` clause (such as filtering by `COUNT(*) > 5` or `AVG(salary) > 80000`).',
        distractorExplanations: [
          'They cannot be interchanged; aggregate functions like `COUNT(*)` cannot appear in standard `WHERE` clauses.',
          '`WHERE` filters rows before grouping; `HAVING` filters groups after aggregation.',
          'HAVING works on any grouped or aggregated column, not just primary keys.',
          'Both clauses support numbers, strings, and dates.'
        ]
      },
      {
        id: 'sql-01-q4',
        type: 'predict-output',
        topic: 'COUNT(*) vs COUNT(column)',
        text: 'If a table `feedback` has 5 rows, but 2 rows have `NULL` in the `rating` column, what do these two statements output?',
        codeSnippet: `SELECT COUNT(*), COUNT(rating) FROM feedback;`,
        codeLanguage: 'sql',
        options: ['5, 5', '5, 3', '3, 3', '5, 0'],
        correctIndex: 1,
        explanation: '`COUNT(*)` counts all rows in the table regardless of column content (yielding 5). `COUNT(column_name)` counts only non-null values for that specific column. Since 2 rows contain `NULL` ratings, `5 - 2 = 3`. The output is `5, 3`.',
        distractorExplanations: [
          '`COUNT(col)` ignores NULL values.',
          '5, 3 is the exact output.',
          '`COUNT(*)` includes all 5 rows.',
          'There are 3 valid non-null ratings, not 0.'
        ]
      },
      {
        id: 'sql-01-q5',
        type: 'best-solution',
        topic: 'Pagination Query',
        text: 'Which standard SQL pattern retrieves the second page of 10 products ordered by price descending?',
        codeSnippet: `-- Requirement: Page 2 (Items 11-20), ordered by price DESC`,
        codeLanguage: 'sql',
        options: [
          'SELECT * FROM products ORDER BY price DESC LIMIT 10 OFFSET 10;',
          'SELECT * FROM products WHERE page = 2 ORDER BY price DESC;',
          'SELECT * FROM products ORDER BY price DESC LIMIT 20, 10;',
          'SELECT TOP 10 * FROM products ORDER BY price DESC;'
        ],
        correctIndex: 0,
        explanation: 'To skip the first 10 items (Page 1) and retrieve the next 10 items (Page 2), the standard ANSI SQL pattern is `LIMIT 10 OFFSET 10` (or `OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY`).',
        distractorExplanations: [
          '`LIMIT 10 OFFSET 10` correctly skips 10 and takes 10.',
          '`WHERE page = 2` is invalid because tables do not possess inherent page columns.',
          '`LIMIT 20, 10` is MySQL legacy syntax where 20 is offset and 10 is count, but ANSI standard uses `LIMIT count OFFSET offset`.',
          '`SELECT TOP 10` returns page 1, not page 2.'
        ]
      },
      {
        id: 'sql-01-q6',
        type: 'debugging',
        topic: 'GROUP BY Column Rule',
        text: 'Why does this query cause a syntax/execution error in standard SQL (PostgreSQL, SQLite, SQL Server)?',
        codeSnippet: `SELECT department, role, AVG(salary) 
FROM employees 
GROUP BY department;`,
        codeLanguage: 'sql',
        options: [
          'Aggregate functions like `AVG` cannot be used in SELECT.',
          '`role` is not an aggregate function and is not included in the `GROUP BY` clause.',
          'The `FROM` table must be aliased.',
          'SQL does not allow multiple columns in a SELECT statement.'
        ],
        correctIndex: 1,
        explanation: 'Under standard SQL rules, any column present in the `SELECT` list that is not wrapped in an aggregate function (such as `AVG()`, `SUM()`, `MIN()`) MUST appear in the `GROUP BY` clause. Since `department` has multiple different `role` values, the database does not know which `role` to output unless grouped or aggregated.',
        correctedCode: `SELECT department, role, AVG(salary) 
FROM employees 
GROUP BY department, role;`
      }
    ]
  }
];
