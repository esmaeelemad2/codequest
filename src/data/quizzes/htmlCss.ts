import { Quiz } from '../../types/quiz';

export const htmlCssQuizzes: Quiz[] = [
  {
    id: 'web-01',
    slug: 'html-essentials',
    title: 'HTML Essentials',
    description: 'Master semantic HTML elements, accessibility ARIA patterns, form validations, document structure, and modern input types.',
    language: 'html-css',
    topic: 'Semantics & Forms',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    timeLimitSeconds: 480,
    iconName: 'Layout',
    featured: false,
    createdAt: '2026-02-10',
    questions: [
      {
        id: 'web-01-q1',
        type: 'concept',
        topic: 'Semantic Structure',
        text: 'Which HTML5 element should be used to wrap major navigation links on a website?',
        codeSnippet: `<___>
  <ul>
    <li><a href="/quizzes">Quizzes</a></li>
    <li><a href="/languages">Languages</a></li>
  </ul>
</___>`,
        codeLanguage: 'html',
        options: ['<menu>', '<nav>', '<sidebar>', '<header>'],
        correctIndex: 1,
        explanation: 'The `<nav>` element represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents. Assistive technologies use `<nav>` landmarks to allow screen reader users to skip directly to navigation.',
        distractorExplanations: [
          '`<menu>` is typically used for toolbar actions or context menus.',
          '`<nav>` is the standard semantic element.',
          '`<sidebar>` is not a valid standard HTML5 element.',
          '`<header>` represents introductory content or branding, often containing the `<nav>`.'
        ]
      },
      {
        id: 'web-01-q2',
        type: 'debugging',
        topic: 'Form Accessibility & Labels',
        text: 'What accessibility issue is present in this form control markup?',
        codeSnippet: `<label>Email Address</label>
<input type="email" placeholder="you@domain.com" />`,
        codeLanguage: 'html',
        options: [
          'The `type="email"` attribute is invalid in HTML5.',
          'The `<label>` is not programmatically associated with the `<input>` via a matching `for` attribute and `id` (or nesting).',
          'Placeholder text cannot contain an @ symbol.',
          'Form inputs must have a name starting with "txt_".'
        ],
        correctIndex: 1,
        explanation: 'For screen readers and click targeting to work properly, a `<label>` must be associated with its input either by setting `for="user-email"` matching the input\'s `id="user-email"`, or by wrapping the `<input>` inside the `<label>`.',
        correctedCode: `<label for="user-email">Email Address</label>
<input id="user-email" type="email" name="email" placeholder="you@domain.com" />`
      },
      {
        id: 'web-01-q3',
        type: 'concept',
        topic: 'Image Accessibility & `alt`',
        text: 'What is the purpose of providing an empty `alt=""` attribute on an `<img>` tag?',
        codeSnippet: `<img src="decorative-wave.svg" alt="" />`,
        codeLanguage: 'html',
        options: [
          'It signals a broken image to the browser.',
          'It informs screen readers that the image is purely decorative and should be safely ignored.',
          'It disables image caching in the browser.',
          'It forces the image to load asynchronously.'
        ],
        correctIndex: 1,
        explanation: 'When an image is purely decorative and conveys no essential informational content, providing `alt=""` explicitly tells assistive technologies to skip the image. Omitting the `alt` attribute entirely causes screen readers to read the raw filename or URL, harming user experience.',
        distractorExplanations: [
          'Empty alt does not indicate an error.',
          'Empty alt is the WCAG standard for decorative assets.',
          'Caching is controlled via HTTP headers or service workers.',
          'Loading is controlled via `loading="lazy"`.'
        ]
      },
      {
        id: 'web-01-q4',
        type: 'complete-code',
        topic: 'Native Modal Dialog',
        text: 'Which HTML5 element natively supports focus trapping and top-layer rendering via `.showModal()`?',
        codeSnippet: `<___ id="confirm-modal">
  <h2>Confirm Submission</h2>
  <button id="close-btn">Cancel</button>
</___>`,
        codeLanguage: 'html',
        options: ['<popup>', '<modal>', '<dialog>', '<window>'],
        correctIndex: 2,
        explanation: 'The native `<dialog>` element provides standard modal and non-modal dialog capabilities. Calling `element.showModal()` renders it in the browser\'s top layer with built-in backdrop support, focus trapping, and `Escape` key dismissal.',
        distractorExplanations: [
          '`<popup>` is not an HTML element (popover is an attribute).',
          '`<modal>` is not a valid HTML element.',
          '`<dialog>` is the standard W3C element.',
          '`<window>` is not a valid HTML element.'
        ]
      },
      {
        id: 'web-01-q5',
        type: 'concept',
        topic: 'Script Loading: async vs defer',
        text: 'How does `<script defer src="app.js">` differ from `<script async src="app.js">`?',
        codeSnippet: `<!-- async vs defer loading -->`,
        codeLanguage: 'html',
        options: [
          '`async` scripts never execute until the user clicks the page.',
          '`defer` scripts download without blocking HTML parsing and execute in document order only after parsing finishes; `async` executes as soon as downloaded, potentially interrupting HTML parsing.',
          '`defer` is only supported in legacy Internet Explorer.',
          'Both attributes are identical in modern browsers.'
        ],
        correctIndex: 1,
        explanation: 'Both attributes prevent the download from blocking the HTML parser. However, `async` executes immediately when the file finishes downloading (order not guaranteed), whereas `defer` waits until the DOM tree is completely parsed and maintains the relative execution order of scripts.',
        distractorExplanations: [
          'Async scripts execute immediately upon network arrival.',
          'Execution timing and order guarantee is the exact difference.',
          '`defer` is universally supported in all modern browsers.',
          'They behave differently regarding execution timing and order.'
        ]
      },
      {
        id: 'web-01-q6',
        type: 'predict-output',
        topic: 'Button Default Type in Forms',
        text: 'What happens when a user clicks the button inside this form?',
        codeSnippet: `<form id="quiz-form">
  <input type="text" name="username" required />
  <button>Save Progress</button>
</form>`,
        codeLanguage: 'html',
        options: [
          'Nothing, because the button has no JavaScript `onclick` handler.',
          'The form submits, because the default `type` of a `<button>` inside a `<form>` is `"submit"`.',
          'It clears the input fields like a reset button.',
          'A browser warning appears.'
        ],
        correctIndex: 1,
        explanation: 'According to the HTML specification, a `<button>` without an explicit `type` attribute defaults to `type="submit"`. Clicking it automatically attempts to submit the surrounding `<form>`. If a button is meant for custom client-side logic, you must specify `type="button"`.',
        distractorExplanations: [
          'Default buttons inside forms submit without requiring an explicit click handler.',
          'type="submit" is the specification default.',
          'Reset behavior requires `type="reset"`.',
          'No browser warning is shown.'
        ]
      }
    ]
  },
  {
    id: 'web-02',
    slug: 'css-selectors-and-layout',
    title: 'CSS Selectors and Layout',
    description: 'Master CSS Grid, Flexbox alignment, CSS specificity calculation, the box model, positioning contexts, and media queries.',
    language: 'html-css',
    topic: 'Layout & Specificity',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    timeLimitSeconds: 540,
    iconName: 'Palette',
    featured: true,
    createdAt: '2026-02-12',
    questions: [
      {
        id: 'web-02-q1',
        type: 'concept',
        topic: 'CSS Specificity Calculation',
        text: 'Which selector has the highest specificity score and will determine the color of the text?',
        codeSnippet: `/* Rule 1 */ #header .nav-link { color: blue; }
/* Rule 2 */ ul.menu li a.active { color: red; }
/* Rule 3 */ div #header a { color: green; }
/* Rule 4 */ header nav a { color: purple; }`,
        codeLanguage: 'css',
        options: [
          'Rule 1: `#header .nav-link` (1 ID, 1 Class)',
          'Rule 2: `ul.menu li a.active` (2 Classes, 3 Elements)',
          'Rule 3: `div #header a` (1 ID, 2 Elements)',
          'Rule 4: `header nav a` (3 Elements)'
        ],
        correctIndex: 0,
        explanation: 'Specificity is counted as (IDs, Classes/Attributes/Pseudo-classes, Elements/Pseudo-elements):\n- Rule 1: 1 ID, 1 Class, 0 Elements -> (1, 1, 0)\n- Rule 2: 0 IDs, 2 Classes, 3 Elements -> (0, 2, 3)\n- Rule 3: 1 ID, 0 Classes, 2 Elements -> (1, 0, 2)\nRule 1 wins with (1, 1, 0), beating Rule 3\'s (1, 0, 2) on the class level.',
        distractorExplanations: [
          'Rule 1 has (1, 1, 0), which is the highest score.',
          'Zero IDs cannot beat a selector with 1 ID.',
          'Rule 3 has 0 classes, which loses to Rule 1\'s 1 class.',
          'Pure element selectors have lowest specificity.'
        ]
      },
      {
        id: 'web-02-q2',
        type: 'predict-output',
        topic: 'Box Sizing & Element Width',
        text: 'What will be the total rendered width of the element on screen in pixels?',
        codeSnippet: `.box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  margin: 15px;
}`,
        codeLanguage: 'css',
        options: ['200px', '250px', '280px', '240px'],
        correctIndex: 1,
        explanation: 'With `box-sizing: content-box`, padding and border are added OUTSIDE the specified width:\nTotal Width = width (200px) + left/right padding (20px + 20px = 40px) + left/right border (5px + 5px = 10px) = 250px.\n(Margins create outer spacing and are not part of the element\'s box boundary).',
        distractorExplanations: [
          '200px would be the total width only if `box-sizing: border-box` were used.',
          '250px is the exact total rendered width.',
          '280px erroneously includes outer margins.',
          '240px forgets the border thickness.'
        ]
      },
      {
        id: 'web-02-q3',
        type: 'best-solution',
        topic: 'Flexbox Centering',
        text: 'Which CSS declaration on the parent flex container centers a child item both horizontally and vertically?',
        codeSnippet: `.container {
  display: flex;
  /* Missing centering rules */
}`,
        codeLanguage: 'css',
        options: [
          'align-items: center; justify-content: center;',
          'align-content: middle; justify-items: middle;',
          'text-align: center; vertical-align: middle;',
          'float: center; margin: auto auto;'
        ],
        correctIndex: 0,
        explanation: 'In Flexbox with default `flex-direction: row`, `justify-content: center` aligns items along the primary horizontal axis, and `align-items: center` aligns items along the cross vertical axis.',
        distractorExplanations: [
          '`justify-content: center; align-items: center;` is the classic modern centering pair.',
          '`middle` is not a valid keyword for `align-content` or `justify-items`.',
          '`vertical-align` does not center block-level children in flex containers.',
          '`float: center` is not a valid CSS property value.'
        ]
      },
      {
        id: 'web-02-q4',
        type: 'concept',
        topic: 'CSS Grid repeat and minmax',
        text: 'What does `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));` achieve?',
        codeSnippet: `.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
        codeLanguage: 'css',
        options: [
          'It creates an immutable 4-column layout on all viewports.',
          'It creates a responsive column layout that automatically fits as many 280px+ columns as possible without requiring media queries.',
          'It limits the grid to 280 total items.',
          'It stretches the row height to 280px.'
        ],
        correctIndex: 1,
        explanation: 'This famous CSS Grid pattern automatically creates as many columns as will fit across the container width (minimum 280px each). If remaining space exists, the `1fr` fraction expands the columns to share it equally, creating seamless responsive layouts without media queries.',
        distractorExplanations: [
          'It dynamically computes column count rather than hardcoding 4 columns.',
          'Automatic responsive column distribution is the hallmark of `auto-fit` with `minmax`.',
          'It controls column track sizing, not item counts.',
          'It controls column width, not row height.'
        ]
      },
      {
        id: 'web-02-q5',
        type: 'debugging',
        topic: 'Absolute Positioning Context',
        text: 'A badge styled with `position: absolute; top: 10px; right: 10px;` is positioning itself relative to the entire page rather than the parent card. What is the missing CSS property on `.card`?',
        codeSnippet: `.card {
  /* Missing property */
}
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
}`,
        codeLanguage: 'css',
        options: [
          'display: inline-block;',
          'position: relative;',
          'overflow: hidden;',
          'z-index: 1;'
        ],
        correctIndex: 1,
        explanation: 'An absolutely positioned element (`position: absolute`) positions itself relative to its closest positioned ancestor (any ancestor with a `position` other than `static`). Setting `position: relative` on `.card` establishes that positioning context without altering the card\'s flow.',
        correctedCode: `.card {
  position: relative;
}`
      },
      {
        id: 'web-02-q6',
        type: 'concept',
        topic: ':has() Relational Pseudo-class',
        text: 'What does the modern `:has()` selector `article:has(img)` target?',
        codeSnippet: `article:has(img) {
  border-left: 4px solid #2563eb;
}`,
        codeLanguage: 'css',
        options: [
          'All `img` tags located inside an article.',
          'Any `<article>` element that contains at least one `<img>` element.',
          'Only articles that do not have any images.',
          'The first sibling following an image.'
        ],
        correctIndex: 1,
        explanation: 'The CSS `:has()` pseudo-class acts as a parent/relational selector. `article:has(img)` targets the `<article>` element itself, applying styling if that article contains an `<img>` descendant.',
        distractorExplanations: [
          '`article img` would target the image; `:has()` styles the parent article.',
          '`article:has(img)` styles the containing article.',
          'Excluding images would be `article:not(:has(img))`.',
          'Adjacent sibling is targeted using `+`.'
        ]
      }
    ]
  }
];
