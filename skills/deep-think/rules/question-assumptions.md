# Question Assumptions

Challenge defaults, explore alternatives, think different.

## The Pattern

Before writing code, ask:
- Why does it have to work this way?
- What if we started from zero?
- What's the most elegant solution?

## Examples

### ❌ Bad: Accept Default Pattern

```typescript
// User asks: "Add caching to API responses"
// You immediately reach for Redis
class APICache {
  private redis: Redis;
  async get(key: string) { return this.redis.get(key); }
  async set(key: string, value: string) { this.redis.set(key, value); }
}
```

### ✅ Good: Question the Approach

```typescript
// First ask: Do we need Redis?
// - Cache hit rate? (if <50%, don't cache)
// - Data size? (if <10MB total, in-memory is simpler)
// - Multiple servers? (if single server, Redis is overkill)

// For small datasets, this is better:
class APICache {
  private cache = new Map<string, CacheEntry>();

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) return null;
    return entry.value;
  }

  set(key: string, value: unknown, ttlMs: number) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }
}
```

### Real Example: Authentication

```typescript
// ❌ Assumption: Need full auth library
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';

// Adds 2MB to bundle, complex config, passport middleware

// ✅ Question: What do we actually need?
import jwt from 'jsonwebtoken';

// Just verify tokens in middleware
async function authenticate(req: Request) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedError();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch {
    throw new UnauthorizedError();
  }
}

// Simpler, smaller, same security
```

## Apply This

When planning features:
1. State the default approach
2. Question why it's default
3. List 2-3 alternatives
4. Choose based on constraints, not convention
