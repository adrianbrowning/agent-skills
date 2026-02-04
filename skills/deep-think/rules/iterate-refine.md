# Iterate and Refine

First version is never good enough. Screenshot, test, compare, refine until insanely great.

## The Pattern

After implementing:
1. Run the code
2. Check the output
3. Compare to requirements
4. Identify gaps
5. Refine and repeat

Don't stop at "it works" - push to "it's great".

## Examples

### ❌ Bad: Ship First Working Version

```typescript
// Implement login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Tests pass → Ship it ✓
```

### ✅ Good: Iterate to Excellence

```typescript
// Version 1: Works
// ❌ Issues:
// - No input validation
// - Returns 401 for both wrong email and wrong password (timing attack)
// - No rate limiting
// - Token has no expiry
// - No logging
// - Password field not excluded from user object

// Version 2: Iterate
router.post('/login',
  validateRequest(loginSchema),  // Add validation
  rateLimiter({ max: 5, window: '15m' }),  // Add rate limiting
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Timing-safe comparison
    const user = await User.findByEmail(email);
    const hash = user?.passwordHash || DUMMY_HASH;
    const isValid = await bcrypt.compare(password, hash);

    if (!user || !isValid) {
      logger.warn('Failed login attempt', { email, ip: req.ip });
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: '15m' }  // Add expiry
    );

    logger.info('Successful login', { userId: user.id, ip: req.ip });
    res.json({
      token,
      user: user.toSafeObject()  // Exclude sensitive fields
    });
  })
);

// Now it's production-ready
```

## Real Example: UI Components

```typescript
// Version 1: Basic button
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ Issues after testing:
// - No loading state
// - No disabled state
// - No keyboard support
// - No aria labels
// - No variants (primary, secondary)

// Version 2: Production quality
type ButtonProps = {
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
};

function Button({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  ariaLabel
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(loading);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`btn btn-${variant}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

## Iteration Checklist

After "it works", check:

### Security
- [ ] Input validation?
- [ ] XSS prevention?
- [ ] SQL injection prevention?
- [ ] CSRF protection?
- [ ] Rate limiting?
- [ ] Auth/authz checks?

### Performance
- [ ] N+1 queries?
- [ ] Unnecessary re-renders?
- [ ] Large payload sizes?
- [ ] Blocking operations?
- [ ] Memory leaks?

### Error Handling
- [ ] All errors caught?
- [ ] Meaningful error messages?
- [ ] Proper status codes?
- [ ] Logging?
- [ ] User feedback?

### UX
- [ ] Loading states?
- [ ] Error states?
- [ ] Empty states?
- [ ] Keyboard navigation?
- [ ] Screen reader support?
- [ ] Mobile responsive?

### Code Quality
- [ ] DRY?
- [ ] Clear naming?
- [ ] No magic numbers?
- [ ] No commented code?
- [ ] Tests?

## The Refinement Loop

1. Implement minimum viable version
2. Test manually
3. Find the rough edges
4. List what could be better
5. Prioritize improvements
6. Implement top 3
7. Repeat until excellent

Don't iterate forever - but don't stop at "barely works" either.
