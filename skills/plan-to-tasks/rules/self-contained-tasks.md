# Self-Contained Tasks

Each task must include complete context for agent to work independently. Agent selects by priority only - no hierarchy traversal.

## Task Description Template (1500+ chars)

1. **Feature Context** (200 chars): What feature this supports, why it matters, success criteria
2. **Technical Approach** (400 chars): API signatures, libraries, algorithms, error handling, validation, configuration
3. **Implementation Details** (900 chars): Files, functions, imports, patterns, test cases, dependencies, config

## Description Structure

```
[Feature Context - 200 chars]
Part of [Feature Name] - [Why it matters]. [Success criteria].

[Technical Approach - 400 chars]
[What to build]. [API/interface signatures]. [Libraries/patterns].
[Error handling]. [Validation]. [Configuration].

[Implementation Details - 900 chars]
Files: [exact paths]. Functions: [signatures]. Imports: [packages].
Patterns: [examples to follow]. Tests: [test cases].
Dependencies: [packages]. Config: [env vars].
```

## Example

```
Part of User Authentication System - JWT-based auth with <200ms
response, 99.9% uptime, 1000 concurrent users.

POST /api/auth/login. Request: {email, password, rememberMe?}.
Response: {accessToken, refreshToken, user}. Flow: (1) Rate limit,
(2) Find user, (3) Verify email, (4) bcrypt compare, (5) JWT gen,
(6) Store refresh token, (7) Log. Errors: 400/401/403/429/500.

File: src/controllers/auth.controller.ts. Function: async
loginController(req, res, next). Call authService.login().
Error handling: try-catch + custom errors. Logging: Winston
with {email, ip, success}. Tests: valid login (200), wrong
password (401), unverified (403), rate limit (429), 100% coverage.
Dependencies: bcrypt, jsonwebtoken, express-rate-limit, ioredis.
Config: JWT_SECRET, JWT_ACCESS_EXPIRY, REDIS_URL.
```

## Full JSONL Example

```jsonl
{"id":"bd-a3f8.1","title":"Implement login endpoint with rate limiting","description":"Part of User Authentication System - JWT-based auth with <200ms response time, 99.9% uptime, 1000 concurrent users. POST /api/auth/login endpoint. Request: {email:string, password:string, rememberMe?:boolean}. Response: {accessToken:string, refreshToken:string, user:{id,email,name,emailVerified}}. Validation: joi schema (email format, password present). Flow: (1) Check rate limit (Redis key: ratelimit:login:${ip}), (2) Find user by email, (3) Verify emailVerified=true else 403, (4) bcrypt.compare password else 401, (5) Generate JWT access (15min exp, payload: {userId, email}), (6) Generate refresh token (7day or 30day if rememberMe, store in users.refresh_tokens JSONB array), (7) Log success to Winston. Error codes: 400 validation, 401 invalid, 403 unverified, 429 rate limited, 500 server. Rate limit: express-rate-limit middleware, 5 attempts per IP per 15min, Redis store. Implementation: File: src/controllers/auth.controller.ts. Function: async loginController(req, res, next). Call authService.login(email, password, rememberMe, req.ip). Error handling: wrap in try-catch, use custom errors. Logging: logger.info('Login attempt', {email, ip, success}). Tests: valid login (200), wrong password (401), unverified email (403), rate limit (429), 100% coverage of auth paths. Dependencies: bcrypt, jsonwebtoken, express-rate-limit, ioredis. Config: JWT_SECRET, JWT_ACCESS_EXPIRY=15m, REDIS_URL.","priority":3,"issue_type":"task","status":"ready","created_at":"2026-01-23T10:01:00Z","updated_at":"2026-01-23T10:01:00Z","labels":["feature:auth","api","jwt","rate-limiting","redis","backend"],"dependencies":[]}
```
