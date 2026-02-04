# Study Codebase

Read patterns before coding. Understand philosophy, not just syntax.

## The Pattern

Before writing new code:
1. Find similar existing code
2. Read how it's structured
3. Follow the same patterns
4. Honor the codebase's philosophy

## Examples

### ❌ Bad: Write Without Reading

```typescript
// User asks: "Add a new API endpoint"
// You write this without checking existing endpoints:

router.post('/api/users', async (req, res) => {
  try {
    const user = await db.users.create(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### ✅ Good: Study Existing Patterns

```typescript
// First, read existing endpoints:
// 1. grep -r "router.post" to find patterns
// 2. Notice they use validation middleware
// 3. Notice they use custom error types
// 4. Notice they use standard response format

// Now write following their pattern:
router.post('/api/users',
  validateRequest(userSchema),
  asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);
    res.json({ data: user });
  })
);

// Matches: validation, asyncHandler, response shape, service layer
```

## Real Example: Error Handling

```typescript
// Study existing error handling:
// $ grep -r "class.*Error extends" src/

// Found pattern:
class ValidationError extends AppError {
  constructor(message: string, field: string) {
    super(message, 400);
    this.field = field;
  }
}

// ✅ Follow same pattern for new errors:
class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super('Rate limit exceeded', 429);
    this.retryAfter = retryAfter;
  }
}

// ❌ Don't invent new patterns:
class RateLimitExceeded {  // Wrong base class
  msg = 'Too many requests';  // Wrong property name
  code = 'RATE_LIMIT';  // Adds new concept not in codebase
}
```

## Practical Steps

Before writing:
1. `grep` for similar code
2. Read 2-3 examples
3. Identify common patterns:
   - Naming conventions
   - Error handling
   - Response formats
   - Validation approach
4. Match those patterns exactly

## What to Look For

- File organization (where do controllers go?)
- Import patterns (relative vs absolute?)
- Function signatures (sync vs async? callbacks vs promises?)
- Error handling (throw vs return?)
- Logging (what's logged? what format?)
- Testing (unit vs integration? what's mocked?)
