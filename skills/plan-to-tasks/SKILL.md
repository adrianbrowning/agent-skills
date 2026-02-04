---
name: plan-to-tasks
description: Convert project plans to JSONL format (issues + dependencies). Use when users ask "convert plan to jsonl", "create jsonl from plan", "export plan as json" or "convert plan to taks", "create tasks from plan", "export plan as tasks".
---

# Plan to JSONL Converter

Transform project plans into JSONL format: **Story (Epic) → Task → SubTask** with embedded dependencies.

## Core Conversion Process

### TDD-First Approach (MANDATORY)

**For features and bug fixes, tasks MUST follow Test-Driven Development.**

When creating tasks for:
- New features → Use `/tdd-integration` skill (Red→Green→Refactor)
- Bug fixes → Use `/tdd-integration` skill (test reproduces bug → fix → refactor)
- Infrastructure/config → TDD optional (use judgment)

Structure tasks to support TDD:
1. Test SubTask (RED phase) - write failing test
2. Implementation SubTask (GREEN phase) - minimal code to pass
3. Refactor SubTask (REFACTOR phase) - improve quality

**Default behavior: Plan assumes TDD unless explicitly noted otherwise.**

### Step 1: Analyze the Plan

Identify three levels:
- **Stories (Epics)**: Major features/components → Type: `epic`
- **Tasks**: Implementation work → Type: `task`
- **SubTasks**: Granular actions → Type: `task`

**CRITICAL: Extract ALL details from the plan including:**
- Technical requirements (APIs, endpoints, data models)
- Acceptance criteria (what "done" means)
- Dependencies and prerequisites
- Performance requirements (latency, throughput)
- Security considerations
- Testing requirements
- Documentation needs
- Error handling approaches
- Edge cases to handle

### Step 2: Type Schema

```typescript
type Issue = {
    id: string;
    title: string;
    description: string;
    priority: number; // 0-4
    issue_type: "task" | "bug";
    status: "ready" | "blocked" | "in_progress" | "closed";
    created_at: string; // ISO Date
    updated_at: string; // ISO Date
    closed_at?: string; // present when status = "closed"
    close_reason?: string; // present when status = "closed"
    labels?: string[]; // e.g., ["feature:auth", "backend", "api", "tdd-red"]
    dependencies: Array<{
        issue_id: string; // this issue's id
        depends_on_id: string; // blocking issue
        type: "blocks" | "depends_on" | "related" | "discovered-from";
        created_at: string; // ISO Date
    }>;
}
```

### Step 3: Create Self-Contained Tasks

Each task must include complete context for agent to work independently. Agent selects by priority only - no hierarchy traversal.

**Task Description Template (1500+ chars):**

1. **Feature Context** (200 chars): What feature this supports, why it matters, success criteria
2. **Technical Approach** (400 chars): API signatures, libraries, algorithms, error handling, validation, configuration
3. **Implementation Details** (900 chars): Files, functions, imports, patterns, test cases, dependencies, config

**Example:**
```jsonl
{"id":"bd-a3f8.1","title":"Implement login endpoint with rate limiting","description":"Part of User Authentication System - JWT-based auth with <200ms response time, 99.9% uptime, 1000 concurrent users. POST /api/auth/login endpoint. Request: {email:string, password:string, rememberMe?:boolean}. Response: {accessToken:string, refreshToken:string, user:{id,email,name,emailVerified}}. Validation: joi schema (email format, password present). Flow: (1) Check rate limit (Redis key: ratelimit:login:${ip}), (2) Find user by email, (3) Verify emailVerified=true else 403, (4) bcrypt.compare password else 401, (5) Generate JWT access (15min exp, payload: {userId, email}), (6) Generate refresh token (7day or 30day if rememberMe, store in users.refresh_tokens JSONB array), (7) Log success to Winston. Error codes: 400 validation, 401 invalid, 403 unverified, 429 rate limited, 500 server. Rate limit: express-rate-limit middleware, 5 attempts per IP per 15min, Redis store. Implementation: File: src/controllers/auth.controller.ts. Function: async loginController(req, res, next). Call authService.login(email, password, rememberMe, req.ip). Error handling: wrap in try-catch, use custom errors. Logging: logger.info('Login attempt', {email, ip, success}). Tests: valid login (200), wrong password (401), unverified email (403), rate limit (429), 100% coverage of auth paths. Dependencies: bcrypt, jsonwebtoken, express-rate-limit, ioredis. Config: JWT_SECRET, JWT_ACCESS_EXPIRY=15m, REDIS_URL.","priority":3,"issue_type":"task","status":"ready","created_at":"2026-01-23T10:01:00Z","updated_at":"2026-01-23T10:01:00Z","labels":["feature:auth","api","jwt","rate-limiting","redis","backend"],"dependencies":[]}
```

**Task characteristics:**
- Type: `task` or `bug`
- Priority: 0-4 (0=architectural, 1=integration, 2=risky, 3=standard, 4=polish)
- Description: **Complete context** - agent needs no other tasks to understand
- ID: Hierarchical (bd-a3f8.1, bd-a3f8.2) for human viewing
- Labels: feature:*, tdd-*, stack tags for human queries
- Status: `blocked` if has blocking dependencies, `ready` otherwise

## Information Extraction Guidelines

### From Requirements Documents

When converting requirements docs, extract:

```markdown
Requirement: "Users must be able to reset passwords via email"

Extract into JSONL:
- Feature scope: Password reset flow
- Technical approach: Email token (1-hour expiry), secure random token generation
- Email template: "Reset your password" with link to /reset-password?token=XXX
- Security: Token stored hashed in DB, single-use only, invalidate after use
- UX: Clear success/error messages, redirect to login after reset
- Email delivery: SendGrid API, queue with Bull/Redis for reliability
- Testing: Token expiry, invalid token, already-used token, concurrent requests
```

### From User Stories

When converting user stories (As a... I want... So that...):

```markdown
As a user, I want to filter products by price range so that I can find items within my budget

Extract:
- UI component: Range slider with min/max inputs
- API endpoint: GET /api/products?minPrice=X&maxPrice=Y
- Query optimization: Index on price column, use BETWEEN clause
- Defaults: Min=0, Max=highest product price
- Validation: Min <= Max, both >= 0
- Edge cases: No products in range, invalid price values
- Analytics: Track popular price ranges for business insights
```

### From Technical Specs

When converting technical specifications:

```markdown
Spec: "Implement caching layer for product catalog"

Extract:
- Cache strategy: Redis with 5-minute TTL
- Cache keys: product:${id}, products:list:${page}:${filters_hash}
- Cache invalidation: On product update/delete, clear related keys
- Fallback: On cache miss, fetch from DB, populate cache
- Cache-aside pattern: Check cache → miss → DB → update cache
- Monitoring: Cache hit rate (target >80%), memory usage alerts
- Config: REDIS_URL, CACHE_TTL env vars
- Libraries: ioredis, cache-manager
```

## Dependency Types

**Parent-Child** (hierarchy):
```jsonl
{"issue_id":"bd-a3f8.1","depends_on_id":"bd-a3f8","type":"parent-child","created_at":"2026-01-23T10:01:00Z"}
```

**Blocks** (hard dependency - prevents starting):
```jsonl
{"issue_id":"bd-a3f8.1.3","depends_on_id":"bd-a3f8.1.1","type":"blocks","created_at":"2026-01-23T10:03:00Z"}
```

Example: Tests block on endpoint implementation

**Related** (soft connection):
```jsonl
{"issue_id":"bd-a3f8.2","depends_on_id":"bd-a3f8.1","type":"related","created_at":"2026-01-23T10:05:00Z"}
```

Example: Login and logout share session logic

**Discovered-From** (found during other work):
```jsonl
{"issue_id":"bd-new123","depends_on_id":"bd-a3f8.1.1","type":"discovered-from","created_at":"2026-01-23T11:00:00Z"}
```

Example: Bug found while implementing feature

## Priority Scale

- **P0 (0)**: Architectural decisions, core abstractions (HITL required)
- **P1 (1)**: Integration points between modules (integrate early)
- **P2 (2)**: Unknown unknowns, spike work (risky work first)
- **P3 (3)**: Standard features, implementation
- **P4 (4)**: Polish, clean-up, quick wins

Rationale: Hard tasks first. Easy work can bury you in tech debt. Fail fast on risky work.

## Writing Self-Contained Task Descriptions

Agent selects tasks by priority and needs complete context. No hierarchy traversal.

**Description structure (1500+ chars):**

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

**Example:**
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

## Task Completion Protocol

**MANDATORY**: When agent completes a task, must return:
```
<promise>COMPLETE</promise>
```

Ralph.sh checks for this marker. If present → task closed. If absent → stays in_progress for next iteration.

Agent should return COMPLETE only when:
- All implementation done
- Tests pass
- Types check
- No blockers remain

Partial work → DO NOT return COMPLETE. Next iteration resumes.

## Labels for Organization and Discovery

Use labels for human filtering and grouping (replaces parent_id):

**Feature grouping:**
```jsonl
{"id":"bd-a3f8.1","labels":["feature:auth","api","jwt"]}
{"id":"bd-a3f8.2","labels":["feature:auth","middleware","redis"]}
```

Query: `jq -r 'select(.labels[]? == "feature:auth")' plan/issues.jsonl`

**TDD phases:**
- `tdd-red` - Write failing test
- `tdd-green` - Make test pass
- `tdd-refactor` - Improve code quality

**Stack/Domain:**
- Stack: backend, frontend, database, infrastructure
- Language: typescript, python, rust, go
- Framework: react, express, nestjs, django
- Area: auth, payments, search, notifications
- Skill: security, performance, accessibility, i18n

**Query examples:**
```bash
# Find all auth feature tasks
jq -r 'select(.labels[]? == "feature:auth") | .id + ": " + .title' plan/issues.jsonl

# Find TDD red phase tasks
jq -r 'select(.labels[]? == "tdd-red") | .id + ": " + .title' plan/issues.jsonl

# Find backend security tasks
jq -r 'select(.labels[]? == "backend" and .labels[]? == "security") | .id + ": " + .title' plan/issues.jsonl
```

## Complete Example with Rich Context

Given this detailed plan:

```
Feature: User Authentication System

Requirements:
- Login with email/password authentication
- JWT-based session management (15min access, 7day refresh tokens)
- Rate limiting to prevent brute force (5 attempts per 15 minutes)
- Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special
- Email verification required before login
- "Remember me" functionality (30-day refresh tokens)
- Password reset via email with 1-hour token expiry
- GDPR compliance: user data export/deletion

Technical constraints:
- PostgreSQL database with users table
- Redis for rate limiting and session storage
- SendGrid for email delivery
- bcrypt for password hashing (12 rounds)
- Express.js backend with TypeScript
- Jest for testing (>80% coverage required)
- Winston for structured logging

Performance targets:
- Login response <200ms (p95)
- Support 1000 concurrent users
- 99.9% uptime SLA
```

Convert to JSONL with **maximum context:**

```jsonl
{"id":"bd-a3f8.1","title":"Implement login endpoint with rate limiting","description":"POST /api/auth/login endpoint. Request: {email:string, password:string, rememberMe?:boolean}. Response: {accessToken:string, refreshToken:string, user:{id,email,name,emailVerified}}. Validation: joi schema (email format, password present). Flow: (1) Check rate limit (Redis key: ratelimit:login:${ip}), (2) Find user by email, (3) Verify emailVerified=true else 403, (4) bcrypt.compare password else 401, (5) Generate JWT access (15min exp, payload: {userId, email}), (6) Generate refresh token (7day or 30day if rememberMe, store in users.refresh_tokens JSONB array with {token, createdAt, expiresAt, device}), (7) Log success to Winston. Error codes: 400 validation, 401 invalid credentials, 403 email not verified, 429 rate limited, 500 server error. Rate limit: express-rate-limit middleware, 5 attempts per IP per 15min, Redis store. Middleware chain: validateLoginRequest → checkRateLimit → loginController. Tests required: valid login, wrong password, email not verified, rate limit trigger, remember-me token expiry. Dependencies: bcrypt, jsonwebtoken, express-rate-limit, ioredis. Config: JWT_SECRET, JWT_ACCESS_EXPIRY=15m, JWT_REFRESH_EXPIRY=7d, JWT_REFRESH_LONG_EXPIRY=30d, REDIS_URL.","priority":3,"issue_type":"task","status":"ready","created_at":"2026-01-23T10:01:00Z","updated_at":"2026-01-23T10:01:00Z","labels":["feature:auth","api","jwt","rate-limiting","redis","backend"],"dependencies":[{"issue_id":"bd-a3f8.1","depends_on_id":"bd-a3f8","type":"parent-child","created_at":"2026-01-23T10:01:00Z"}]}
{"id":"bd-a3f8.2","title":"Create login API endpoint handler","description":"File: src/controllers/auth.controller.ts. Function: async loginController(req, res, next). Extract {email, password, rememberMe} from req.body (already validated by middleware). Call authService.login(email, password, rememberMe, req.ip). On success: res.status(200).json({accessToken, refreshToken, user}). On error: pass to error middleware with proper status code. Error handling: wrap in try-catch, use custom errors (AuthenticationError, RateLimitError, EmailNotVerifiedError). Logging: logger.info('Login attempt', {email, ip: req.ip, success: true/false, reason}). Import from: bcrypt, jsonwebtoken, ../services/auth.service, ../utils/logger, ../utils/errors. Add to routes: POST /api/auth/login with [validateLoginRequest, checkRateLimit] middleware chain in src/routes/auth.routes.ts. Example pattern: Follow existing src/controllers/user.controller.ts structure.","priority":3,"issue_type":"task","status":"blocked","created_at":"2026-01-23T10:02:00Z","updated_at":"2026-01-23T10:02:00Z","labels":["feature:auth","implementation","nodejs","backend"],"dependencies":[{"issue_id":"bd-a3f8.1.1","depends_on_id":"bd-a3f8.1","type":"parent-child","created_at":"2026-01-23T10:02:00Z"},{"issue_id":"bd-a3f8.1.1","depends_on_id":"bd-a3f8.1.5","type":"blocks","created_at":"2026-01-23T10:02:00Z"}]}
{"id":"bd-a3f8.3","title":"Implement rate limiting middleware","description":"File: src/middleware/rateLimit.middleware.ts. Use express-rate-limit package. Create loginRateLimiter middleware: RedisStore with REDIS_URL, windowMs: 15*60*1000 (15min), max: 5, keyGenerator: (req) => req.ip, handler: (req, res) => throw new RateLimitError('Too many login attempts, try again in 15 minutes'), standardHeaders: true, legacyHeaders: false. Create Redis client with ioredis, connection pooling (min: 2, max: 10), retry strategy (max 3 retries), error handling (log and fallback to in-memory store). Export as checkRateLimit constant. Add to auth routes before controller. Test: Redis connection failure fallback, rate limit counter increments, reset after window, different IPs isolated. Dependencies: express-rate-limit ^7.0.0, rate-limit-redis ^4.0.0, ioredis ^5.0.0. Config: REDIS_URL (default: redis://localhost:6379), RATE_LIMIT_WINDOW_MS=900000, RATE_LIMIT_MAX_ATTEMPTS=5.","priority":3,"issue_type":"task","status":"ready","created_at":"2026-01-23T10:03:00Z","updated_at":"2026-01-23T10:03:00Z","labels":["feature:auth","middleware","redis","security","backend"],"dependencies":[{"issue_id":"bd-a3f8.1.2","depends_on_id":"bd-a3f8.1","type":"parent-child","created_at":"2026-01-23T10:03:00Z"}]}
{"id":"bd-a3f8.4","title":"Create authentication service layer","description":"File: src/services/auth.service.ts. Class AuthService with methods: login(email, password, rememberMe, ip), generateAccessToken(user), generateRefreshToken(user, expiresIn), verifyPassword(plaintext, hash). login() logic: (1) const user = await User.findByEmail(email), throw NotFoundError if null, (2) if (!user.emailVerified) throw EmailNotVerifiedError, (3) const isValid = await bcrypt.compare(password, user.passwordHash), throw AuthenticationError if false, (4) const accessToken = generateAccessToken(user), (5) const refreshToken = generateRefreshToken(user, rememberMe ? '30d' : '7d'), (6) await user.addRefreshToken(refreshToken, expiresIn, ip), (7) logger.info('Login success', {userId: user.id, ip}), (8) return {accessToken, refreshToken, user: user.toSafeObject()}. JWT payload: {userId: user.id, email: user.email, type: 'access'|'refresh'}. Sign with JWT_SECRET from env. Use bcrypt.compare() not custom comparison. Handle bcrypt errors (invalid hash). Return user without passwordHash field. Unit tests: successful login, email not verified, wrong password, bcrypt error, JWT generation. Dependencies: bcrypt, jsonwebtoken, ../models/User. Singleton pattern: export new AuthService().","priority":3,"issue_type":"task","status":"blocked","created_at":"2026-01-23T10:04:00Z","updated_at":"2026-01-23T10:04:00Z","labels":["feature:auth","business-logic","service-layer","backend"],"dependencies":[{"issue_id":"bd-a3f8.1.3","depends_on_id":"bd-a3f8.1","type":"parent-child","created_at":"2026-01-23T10:04:00Z"},{"issue_id":"bd-a3f8.1.3","depends_on_id":"bd-a3f8.1.5","type":"blocks","created_at":"2026-01-23T10:04:00Z"}]}
{"id":"bd-a3f8.5","title":"Write login endpoint integration tests","description":"File: tests/integration/auth.test.ts. Test suite for POST /api/auth/login using Jest + Supertest. Setup: beforeAll() seed test DB with test users (fixtures/users.json: validUser with emailVerified=true, unverifiedUser with emailVerified=false, multiple IPs for rate limit tests), afterAll() cleanup DB, beforeEach() clear Redis rate limit counters. Test cases: (1) Valid credentials returns 200 + {accessToken, refreshToken, user} + verify JWT structure, (2) Valid with rememberMe=true returns refresh token with 30d expiry, (3) Invalid password returns 401 + {error: 'Invalid credentials'}, (4) Email not verified returns 403 + {error: 'Email not verified'}, (5) Missing email field returns 400 + validation error, (6) Missing password returns 400, (7) Malformed email returns 400, (8) 6th login attempt from same IP returns 429 + rate limit message, (9) Different IPs not rate limited together, (10) bcrypt error returns 500. Mock bcrypt only for error case, use real JWT verification. Assert response structure, status codes, error messages, JWT expiry claims, user object shape, Redis counters. Coverage target: 100% of auth.controller.ts and auth.service.ts login paths. Use supertest agent for requests, chai/expect for assertions. Run with: npm test -- tests/integration/auth.test.ts. Performance: each test <500ms.","priority":3,"issue_type":"task","status":"blocked","created_at":"2026-01-23T10:05:00Z","updated_at":"2026-01-23T10:05:00Z","labels":["feature:auth","testing","integration-tests","jest"],"dependencies":[{"issue_id":"bd-a3f8.1.4","depends_on_id":"bd-a3f8.1","type":"parent-child","created_at":"2026-01-23T10:05:00Z"},{"issue_id":"bd-a3f8.1.4","depends_on_id":"bd-a3f8.2","type":"blocks","created_at":"2026-01-23T10:05:00Z"},{"issue_id":"bd-a3f8.1.4","depends_on_id":"bd-a3f8.4","type":"blocks","created_at":"2026-01-23T10:05:00Z"}]}
{"id":"bd-a3f8.6","title":"Add refresh_tokens column to users table","description":"Migration file: migrations/YYYYMMDDHHMMSS-add-refresh-tokens.ts. Add column to users table: refresh_tokens JSONB DEFAULT '[]'. Update User model in src/models/User.ts: add refreshTokens: RefreshToken[] field where RefreshToken = {token: string, createdAt: Date, expiresAt: Date, device: string, ip: string}. Add methods: addRefreshToken(token, expiresIn, ip), removeRefreshToken(token), clearExpiredTokens(). Migration up(): ALTER TABLE users ADD COLUMN refresh_tokens JSONB DEFAULT '[]'; Migration down(): ALTER TABLE users DROP COLUMN refresh_tokens. Run migration: npm run migrate. Verify: psql check column exists and type. Update User tests to cover new methods. Index: CREATE INDEX idx_users_refresh_tokens ON users USING GIN (refresh_tokens) for fast token lookups. Validation: max 5 concurrent refresh tokens per user (remove oldest when exceeded). Dependencies: knex for migrations. Config: DATABASE_URL. Rollback plan: migration down() + restore from backup.","priority":1,"issue_type":"task","status":"ready","created_at":"2026-01-23T10:06:00Z","updated_at":"2026-01-23T10:06:00Z","labels":["feature:auth","database","migration","postgresql"],"dependencies":[{"issue_id":"bd-a3f8.1.5","depends_on_id":"bd-a3f8.1","type":"parent-child","created_at":"2026-01-23T10:06:00Z"}]}
```

## JSONL Query Examples with jq

### Basic Queries

```bash
# Count by type
jq -s 'group_by(.issue_type) | map({type: .[0].issue_type, count: length})' plan/issues.jsonl

# Get all ready tasks (no blockers, status=ready)
jq -r 'select(.status == "ready" and .issue_type == "task") | .id + ": " + .title' plan/issues.jsonl

# Find issues by priority
jq -r 'select(.priority == 1) | .id + " [" + .status + "]: " + .title' plan/issues.jsonl

# Count issues by status
jq -s 'group_by(.status) | map({status: .[0].status, count: length})' plan/issues.jsonl
```

### Dependency Queries

```bash
# Find what blocks a specific task
jq -r --arg id "bd-a3f8.1.1" 'select(.id == $id) | .dependencies[] | select(.type == "blocks") | "Blocked by: " + .depends_on_id' plan/issues.jsonl

# List dependencies for specific issue
jq -r --arg id "bd-a3f8.1.4" 'select(.id == $id) | .dependencies[] | "- " + .type + ": " + .depends_on_id' plan/issues.jsonl

# Find all tasks blocking others
jq -r 'select(.dependencies | length > 0) | .dependencies[] | select(.type == "blocks") | "⛔ " + .depends_on_id + " blocks " + .issue_id' plan/issues.jsonl

# Find blocked tasks
jq -r 'select(.dependencies[]?.type == "blocks" and .status == "blocked") | .id + ": " + .title' plan/issues.jsonl

# Find issues with no dependencies (leaf nodes)
jq -r 'select(.dependencies | length == 0) | .id + ": " + .title' plan/issues.jsonl
```

### Hierarchy Queries

```bash
# Get epic with all children
EPIC="bd-a3f8"
jq -r --arg epic "$EPIC" 'select(.parent_id == $epic or .id == $epic)' plan/issues.jsonl

# Get issue by id with dependency details
ID="bd-a3f8.1.1"
jq -s --arg id "$ID" 'map(select(.id == $id)) + map(select(.id == any((map(select(.id == $id))[0].dependencies[]?.depends_on_id); .)))' plan/issues.jsonl

# Get all children of a task
PARENT="bd-a3f8.1"
jq -r --arg parent "$PARENT" 'select(.parent_id == $parent)' plan/issues.jsonl
```

### Label Queries

```bash
# Find issues by label
jq -r 'select(.labels[]? == "testing") | .id + ": " + .title' plan/issues.jsonl

# List all unique labels
jq -s '[.[].labels[]?] | unique | .[]' plan/issues.jsonl

# Find issues with multiple labels
jq -r 'select(.labels[]? == "backend" and .labels[]? == "security") | .id + ": " + .title' plan/issues.jsonl
```

### Status & Progress Queries

```bash
# Get all in-progress tasks
jq -r 'select(.status == "in_progress") | .id + ": " + .title' plan/issues.jsonl

# Get closed issues with reason
jq -r 'select(.status == "closed") | .id + ": " + .title + " [" + .close_reason + "]"' plan/issues.jsonl

# Issues by status and priority
jq -s 'group_by(.status) | map({status: .[0].status, tasks: [.[] | {id, title, priority}]})' plan/issues.jsonl
```

## Output Structure

After conversion, output to single file:

```
└── plan/issues.jsonl  # One issue per line, dependencies embedded
```

Each line in `plan/issues.jsonl` is a complete JSON object following the Issue type schema.

## Expected Output Format

### 1. Summary Table

```
Created Issues:
┌─────────────┬──────┬──────────────────────────────────────┬──────────┬────────────────────────┐
│ ID          │ Type │ Title                                │ Priority │ Labels                 │
├─────────────┼──────┼──────────────────────────────────────┼──────────┼────────────────────────┤
│ bd-a3f8     │ epic │ User Authentication System           │ P1       │ auth,backend,security  │
│ bd-a3f8.1   │ task │ Implement login endpoint w/ rate lim │ P1       │ api,jwt,rate-limiting  │
│ bd-a3f8.1.1 │ task │ Create login API endpoint handler    │ P2       │ implementation,nodejs  │
│ bd-a3f8.1.2 │ task │ Implement rate limiting middleware   │ P2       │ middleware,redis       │
│ bd-a3f8.1.3 │ task │ Create authentication service layer  │ P2       │ business-logic,service │
│ bd-a3f8.1.4 │ task │ Write login endpoint integration ts  │ P2       │ testing,integration    │
│ bd-a3f8.1.5 │ task │ Add refresh_tokens column to users   │ P1       │ database,migration     │
└─────────────┴──────┴──────────────────────────────────────┴──────────┴────────────────────────┘
```

### 2. Dependency Tree

```
bd-a3f8 [epic] User Authentication System
└── bd-a3f8.1 [task] Implement login endpoint with rate limiting
    ├── bd-a3f8.1.5 [task] Add refresh_tokens column to users (BLOCKER)
    │   └── Must complete before: bd-a3f8.1.1, bd-a3f8.1.3
    ├── bd-a3f8.1.1 [task] Create login API endpoint handler
    │   └── Blocked by: bd-a3f8.1.5
    ├── bd-a3f8.1.2 [task] Implement rate limiting middleware
    ├── bd-a3f8.1.3 [task] Create authentication service layer
    │   └── Blocked by: bd-a3f8.1.5
    └── bd-a3f8.1.4 [task] Write login endpoint integration tests
        └── Blocked by: bd-a3f8.1.1, bd-a3f8.1.3
```

### 3. Ready Work (Prioritized)

```
Ready to start immediately (no blockers):
1. bd-a3f8.1.5 [P1]: Add refresh_tokens column to users
   Labels: database, migration, postgresql
   Blocks: 2 other tasks

2. bd-a3f8.1.2 [P2]: Implement rate limiting middleware
   Labels: middleware, redis, security
   Blocks: 0 tasks
```

### 4. Context Summary

```
Project Overview:
- Story: bd-a3f8 "User Authentication System"
- Tasks: 1 (login endpoint)
- SubTasks: 5 (endpoint, rate limit, service, tests, DB migration)
- Total work items: 6
- Ready to start: 2 (bd-a3f8.1.5, bd-a3f8.1.2)
- Blocked: 3 (waiting on DB migration)

Critical Path:
bd-a3f8.1.5 (DB) → bd-a3f8.1.3 (Service) → bd-a3f8.1.1 (Controller) → bd-a3f8.1.4 (Tests)

Parallel Work:
bd-a3f8.1.2 (Rate limiting) can proceed independently

Tech Stack Required:
- Backend: Express.js, TypeScript, Node.js
- Database: PostgreSQL with Knex migrations
- Cache: Redis with ioredis
- Security: bcrypt, jsonwebtoken
- Testing: Jest, Supertest
- Logging: Winston
```

### 5. Query Commands

```
To query the JSONL:

1. View ready work:
   jq -r 'select(.status == "ready") | .id + ": " + .title' plan/issues.jsonl

2. Find blocked tasks:
   jq -r 'select(.status == "blocked") | .id + ": " + .title' plan/issues.jsonl

3. Check dependencies for task:
   jq -r --arg id "bd-a3f8.1.1" 'select(.id == $id) | .dependencies[]' plan/issues.jsonl

4. Count by status:
   jq -s 'group_by(.status) | map({status: .[0].status, count: length})' plan/issues.jsonl

5. Find high priority tasks:
   jq -r 'select(.priority <= 1) | .id + ": " + .title' plan/issues.jsonl
```

## Best Practices for Maximum Information Capture

### 1. **Extract Technical Specifics**
```
❌ Bad: "Add authentication"
✅ Good: "POST /api/auth/login with JWT tokens, bcrypt password hashing, Redis rate limiting (5/15min)"
```

### 2. **Include Error Handling**
```
❌ Bad: "Handle errors"
✅ Good: "Return 400 for validation errors, 401 for invalid credentials, 429 for rate limit, 500 for server errors with structured error responses {error, message, code}"
```

### 3. **Specify Testing Requirements**
```
❌ Bad: "Add tests"
✅ Good: "Jest integration tests: valid login (200), wrong password (401), unverified email (403), rate limit (429), 100% coverage of auth paths"
```

### 4. **Document Configuration**
```
❌ Bad: "Use environment variables"
✅ Good: "Config: JWT_SECRET, JWT_ACCESS_EXPIRY=15m, REDIS_URL, RATE_LIMIT_MAX=5"
```

### 5. **Reference Existing Patterns**
```
❌ Bad: "Follow project conventions"
✅ Good: "Follow pattern in src/controllers/user.controller.ts: async handler + try-catch + error middleware + Winston logging"
```

### 6. **Include Performance Targets**
```
❌ Bad: "Make it fast"
✅ Good: "Target: <200ms p95 response time, support 1000 concurrent users, cache hit rate >80%"
```

### 7. **Add Security Requirements**
```
❌ Bad: "Secure the endpoint"
✅ Good: "Security: bcrypt(12 rounds), JWT with 15min expiry, HTTPS only, rate limiting, SQL injection prevention with parameterized queries, XSS prevention with helmet.js"
```

### 8. **Specify Data Models**
```
❌ Bad: "Store user data"
✅ Good: "Users table: {id UUID PK, email VARCHAR(255) UNIQUE, passwordHash VARCHAR(255), emailVerified BOOLEAN, refreshTokens JSONB, createdAt TIMESTAMP}"
```

## Common Patterns

### Sequential Work
```jsonl
{"id":"bd-a3f8.1.3","dependencies":[{"issue_id":"bd-a3f8.1.3","depends_on_id":"bd-a3f8.1.5","type":"blocks","created_at":"2026-01-23T10:04:00Z"}]}
```

### Parallel Work
Both tasks have no blocking dependencies, can run independently:
```jsonl
{"id":"bd-a3f8.1","status":"ready","dependencies":[]}
{"id":"bd-a3f8.2","status":"ready","dependencies":[]}
```

### Cross-Story Dependencies
```jsonl
{"id":"bd-f14c.1","dependencies":[{"issue_id":"bd-f14c.1","depends_on_id":"bd-a3f8.1","type":"blocks","created_at":"2026-01-23T11:00:00Z"}]}
```

### Discovered Work
```jsonl
{"id":"bd-new123","title":"Fix email validation regex bug","issue_type":"bug","priority":0,"dependencies":[{"issue_id":"bd-new123","depends_on_id":"bd-a3f8.1.1","type":"discovered-from","created_at":"2026-01-23T11:00:00Z"}]}
```

## When This Skill Applies

Use this skill when:
- User provides a project plan/spec to break down
- Converting markdown plans to JSONL format
- Exporting task hierarchies as structured data
- Creating work queues for external systems
- User asks to "convert to jsonl", "create jsonl from plan", "export plan as json"

## Information Extraction Checklist

Before creating JSONL issues, ensure you've captured:

### From Plans/Specs:
- [ ] Feature scope and user value
- [ ] Technical approach and architecture
- [ ] API signatures (method, path, request/response)
- [ ] Data models and schema changes
- [ ] Security requirements and constraints
- [ ] Performance targets and SLAs
- [ ] Error handling and edge cases
- [ ] Testing requirements and coverage
- [ ] Dependencies on other systems
- [ ] Configuration and environment variables
- [ ] Logging and monitoring needs
- [ ] Documentation requirements

### From User Stories:
- [ ] User persona and goal
- [ ] Acceptance criteria (definition of done)
- [ ] UI/UX requirements
- [ ] Business rules and validation
- [ ] Analytics and metrics to track

### From Technical Discussions:
- [ ] Libraries and frameworks to use
- [ ] Existing code patterns to follow
- [ ] File paths and module structure
- [ ] Mock/test data requirements
- [ ] Review and approval process

## TDD Task Structure

**For features/bugs, structure SubTasks to support Red→Green→Refactor cycle.**

Example TDD SubTask sequence:
```jsonl
{"id":"bd-a3f8.1.1","title":"Write failing test for login endpoint","description":"Test: POST /api/auth/login with valid/invalid credentials, rate limiting, email verification. Expected: test fails (no implementation yet)","status":"ready","labels":["tdd-red","testing"]}
{"id":"bd-a3f8.1.2","title":"Implement login endpoint (minimal)","description":"Minimal code to pass tests. Just enough to make green.","status":"blocked","dependencies":[{"issue_id":"bd-a3f8.1.2","depends_on_id":"bd-a3f8.1.1","type":"blocks"}],"labels":["tdd-green","implementation"]}
{"id":"bd-a3f8.1.3","title":"Refactor login implementation","description":"Improve code quality, remove duplication, enhance readability. Tests must still pass.","status":"blocked","dependencies":[{"issue_id":"bd-a3f8.1.3","depends_on_id":"bd-a3f8.1.2","type":"blocks"}],"labels":["tdd-refactor","quality"]}
```

**Implementation uses `/tdd-integration` skill which handles Red→Green→Refactor automatically.**

Labels for TDD phases:
- `tdd-red` - Write failing test
- `tdd-green` - Make test pass
- `tdd-refactor` - Improve code quality

## Important Notes

- **IDs are hierarchical** (`bd-a3f8`, `bd-a3f8.1`, `bd-a3f8.1.1`)
- **One issue per line** in JSONL format
- **Dependencies embedded** in each issue's dependencies array
- **Parent-child relationships** via `parent_id` field + parent-child dependency
- **Priority scale**: 0=critical, 1=important, 2=normal, 3=nice-to-have, 4=low
- **Status values**: ready, blocked, in_progress, closed
- **ISO timestamps** for all date fields
- **Labels are optional** but recommended for filtering
- **Use jq** for all queries and analysis
- **🔴🟢🔵 TDD is mandatory for features/bugs** - Use `/tdd-integration` skill during implementation
- **Structure SubTasks for TDD** - RED (test) → GREEN (implement) → REFACTOR (improve)

**STOP ONCE JSONL IS CREATED!**
**DO NOT IMPLEMENT OR TEST ANYTHING YET!**
**The goal is complete task definition with TDD-ready structure, not implementation.**
