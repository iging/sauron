# OWASP Defensive Shield Standards

Defines defensive security requirements addressing the OWASP Top 10 vulnerabilities.

---

## 1. Injection Defense

- **Parameterized Queries:** Every SQL, NoSQL, and ORM query must use parameterized inputs or prepared statements. String interpolation in queries is strictly forbidden.
- **Shell Command Sanitization:** Prohibit passing unescaped user inputs directly to child process executions or shell interpreters.

---

## 2. Authentication and Authorization

- **Deny by Default:** All routes and resources require explicit authentication unless explicitly marked public in routing declarations.
- **Object-Level Permissions:** Check tenant and ownership authorization on every single resource read, update, or delete. Guard against Insecure Direct Object References (IDOR).
- **Session Security:** Use HTTP-only, secure, same-site cookies with short expiration windows and cryptographic token signing.

---

## 3. Data Protection and Headers

- **Strict Transport Security:** Enforce HTTPS with HSTS headers.
- **Content Security Policy:** Define strict Content-Security-Policy (CSP) headers blocking inline scripts and untrusted script origins.
- **Mask Sensitive Data:** Redact credit cards, social security numbers, passwords, and tokens before logging.
