# CodeSkill — Test Your Skills. Master Your Code.

CodeSkill is an interactive, developer-focused programming quiz platform designed to help developers, students, and engineers master code comprehension, identify knowledge gaps, and practice real-world programming concepts.

## 🚀 Key Features

- **Multi-Language Support**: Interactive quizzes across Python, JavaScript, Java, C++, C#, SQL, and HTML & CSS.
- **Realistic Code Tracing**: Practice reading real code snippets, scope behaviors, execution order, and tricky edge cases.
- **AI Programming Tutor**: Real-time AI programming assistant powered by Google Gemini (`gemini-3.5-flash`), featuring guided hints, line-by-line code breakdowns, and deep concept explanations.
- **Performance Analytics**: Instant scoring, streak tracking, accuracy breakdowns by category and difficulty, and detailed answer reviews.
- **Interactive Quiz Authoring**: Custom quiz creator with schema validation and JSON export/import.
- **Client-Side Privacy**: Bookmarks, progress, and custom quizzes stored locally on your device without invasive trackers.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, PrismJS
- **Backend / AI Proxy**: Secure PHP endpoint interfacing with Google Gemini API (`gemini-3.5-flash`)
- **Web Server**: Nginx with TLS via Let's Encrypt, CloudPanel on Ubuntu VPS

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Typecheck and build for production
npm run build
```
