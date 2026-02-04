# Simplify Ruthlessly

Remove complexity without losing power. Elegance = nothing left to take away.

## The Pattern

After iterating, look for:
- Unnecessary abstractions
- Over-engineering
- Dead code
- Complex solutions to simple problems

Then simplify.

## Examples

### ❌ Bad: Over-Engineered

```typescript
// User needs: "Store user preferences"

// Over-engineered solution:
interface PreferenceStore {
  get(key: string): Promise<Preference | null>;
  set(key: string, value: Preference): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

class LocalStoragePreferenceStore implements PreferenceStore {
  async get(key: string) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }
  async set(key: string, value: Preference) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  // ...
}

class RedisPreferenceStore implements PreferenceStore {
  constructor(private redis: Redis) {}
  async get(key: string) {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  // ...
}

class PreferenceFactory {
  static create(type: 'local' | 'redis'): PreferenceStore {
    return type === 'redis'
      ? new RedisPreferenceStore(createRedisClient())
      : new LocalStoragePreferenceStore();
  }
}

// Need to change storage? Add new implementation!
// YAGNI violation - You Aren't Gonna Need It
```

### ✅ Good: Simple Solution

```typescript
// Simple solution:
class UserPreferences {
  constructor(private userId: string) {}

  get(key: string) {
    return db.preferences.findOne({ userId: this.userId, key });
  }

  async set(key: string, value: unknown) {
    await db.preferences.upsert({
      userId: this.userId,
      key
    }, {
      value
    });
  }
}

// Simpler, clearer, easier to test
// If we need Redis later, we'll add it then
```

## Real Example: Logging

```typescript
// ❌ Bad: Over-abstracted
interface Logger {
  log(level: LogLevel, message: string, context: Context): void;
}

interface Context {
  userId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class WinstonLogger implements Logger {
  private winston: WinstonInstance;

  log(level: LogLevel, message: string, context: Context) {
    this.winston.log(this.mapLevel(level), message, context);
  }

  private mapLevel(level: LogLevel): string {
    return LogLevel[level].toLowerCase();
  }
}

const logger = new WinstonLogger(createWinston());

// To log: logger.log(LogLevel.INFO, 'User logged in', { userId: '123' });

// ✅ Good: Use winston directly
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// To log: logger.info('User logged in', { userId: '123' });

// Simpler. Same power. No abstraction overhead.
```

## Finding Over-Engineering

Ask yourself:
1. **Do we actually need this abstraction?**
   - If not swapping implementations → No interface needed
   - If not shared → No base class needed

2. **Are we solving future problems?**
   - YAGNI: You Aren't Gonna Need It
   - Build for today's requirements

3. **Can we use a library?**
   - Don't build what exists
   - But don't add libraries for trivial things

4. **Is this the simplest solution?**
   - Could a junior dev understand it?
   - Could you explain it in one sentence?

## Simplification Examples

### Complex → Simple

```typescript
// ❌ Complex: Builder pattern for simple object
const user = new UserBuilder()
  .setId('123')
  .setEmail('test@test.com')
  .setName('Test User')
  .setRole('admin')
  .build();

// ✅ Simple: Object literal
const user = {
  id: '123',
  email: 'test@test.com',
  name: 'Test User',
  role: 'admin'
};
```

### Over-abstracted → Direct

```typescript
// ❌ Over-abstracted
interface IUserRepository {
  findById(id: string): Promise<User | null>;
}

class PostgresUserRepository implements IUserRepository {
  async findById(id: string) {
    return db.users.findOne({ id });
  }
}

const userRepo: IUserRepository = new PostgresUserRepository();

// ✅ Direct (unless actually swapping implementations)
const userRepo = {
  findById: (id: string) => db.users.findOne({ id })
};
```

### Generic → Specific

```typescript
// ❌ Generic utility
function processData<T>(
  data: T[],
  predicate: (item: T) => boolean,
  transform: (item: T) => T
): T[] {
  return data.filter(predicate).map(transform);
}

const activeUsers = processData(
  users,
  u => u.status === 'active',
  u => ({ ...u, lastSeen: new Date() })
);

// ✅ Specific function with clear intent
function getActiveUsersWithUpdatedLastSeen(users: User[]): User[] {
  return users
    .filter(u => u.status === 'active')
    .map(u => ({ ...u, lastSeen: new Date() }));
}

const activeUsers = getActiveUsersWithUpdatedLastSeen(users);
```

## When to Add Complexity

Add complexity only when:
- Requirements actually demand it (not might demand it)
- Simpler solution is proven insufficient
- Complexity reduces total system complexity

Otherwise, keep it simple.

## Simplicity Checklist

- [ ] Removed unused code?
- [ ] Removed unnecessary abstractions?
- [ ] Using built-in features instead of custom?
- [ ] Could a junior dev understand this?
- [ ] Is this the minimum code to solve the problem?
- [ ] Can you explain the approach in one sentence?
