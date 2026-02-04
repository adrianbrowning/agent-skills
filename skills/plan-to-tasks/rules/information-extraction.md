# Information Extraction Guidelines

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

## From Requirements Documents

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

## From User Stories

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

## From Technical Specs

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

## Information Checklist

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

## Best Practices for Maximum Information Capture

### 1. Extract Technical Specifics
```
❌ Bad: "Add authentication"
✅ Good: "POST /api/auth/login with JWT tokens, bcrypt password hashing, Redis rate limiting (5/15min)"
```

### 2. Include Error Handling
```
❌ Bad: "Handle errors"
✅ Good: "Return 400 for validation errors, 401 for invalid credentials, 429 for rate limit, 500 for server errors with structured error responses {error, message, code}"
```

### 3. Specify Testing Requirements
```
❌ Bad: "Add tests"
✅ Good: "Jest integration tests: valid login (200), wrong password (401), unverified email (403), rate limit (429), 100% coverage of auth paths"
```

### 4. Document Configuration
```
❌ Bad: "Use environment variables"
✅ Good: "Config: JWT_SECRET, JWT_ACCESS_EXPIRY=15m, REDIS_URL, RATE_LIMIT_MAX=5"
```

### 5. Reference Existing Patterns
```
❌ Bad: "Follow project conventions"
✅ Good: "Follow pattern in src/controllers/user.controller.ts: async handler + try-catch + error middleware + Winston logging"
```

### 6. Include Performance Targets
```
❌ Bad: "Make it fast"
✅ Good: "Target: <200ms p95 response time, support 1000 concurrent users, cache hit rate >80%"
```

### 7. Add Security Requirements
```
❌ Bad: "Secure the endpoint"
✅ Good: "Security: bcrypt(12 rounds), JWT with 15min expiry, HTTPS only, rate limiting, SQL injection prevention with parameterized queries, XSS prevention with helmet.js"
```

### 8. Specify Data Models
```
❌ Bad: "Store user data"
✅ Good: "Users table: {id UUID PK, email VARCHAR(255) UNIQUE, passwordHash VARCHAR(255), emailVerified BOOLEAN, refreshTokens JSONB, createdAt TIMESTAMP}"
```
