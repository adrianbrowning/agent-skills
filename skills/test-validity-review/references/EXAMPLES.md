# Better Test Shapes

Use examples as patterns, not copy-paste requirements.

## Focused runtime behaviour

```ts
it('returns a validation error when email is missing', () => {
  const result = validateSignup({
    email: '',
    password: 'correct horse battery staple',
  })

  expect(result).toEqual({
    ok: false,
    field: 'email',
    message: 'Email is required',
  })
})
```

Weak alternative:

```ts
expect(validateSignup(input)).toBeTruthy()
```

Why weak: may pass for wrong result.

## Async UI behaviour

```ts
it('shows an error when saving fails', async () => {
  server.use(
    http.post('/api/profile', () =>
      HttpResponse.json({ message: 'Nope' }, { status: 500 }),
    ),
  )

  render(<ProfileForm />)
  await userEvent.click(screen.getByRole('button', { name: /save/i }))

  expect(await screen.findByText(/could not save/i)).toBeVisible()
})
```

Weak alternatives:

```ts
userEvent.click(saveButton)
expect(api.save).toHaveBeenCalled()
```

Problems: action may not be awaited; mock call does not prove user-visible handling.

## Validator or type guard

```ts
it('rejects non-user values', () => {
  expect(isUser(null)).toBe(false)
  expect(isUser({ id: 123 })).toBe(false)
  expect(isUser({ id: 'u_123', name: 'Ada' })).toBe(true)
})
```

Check false cases. TypeScript trusts declared predicates even when implementation is wrong.

## Domain fixture factory

```ts
const buildUser = (overrides: Partial<User> = {}): User => ({
  id: 'u_123',
  email: 'ada@example.com',
  role: 'member',
  ...overrides,
})

it('blocks suspended users', () => {
  const user = buildUser({ status: 'suspended' })

  expect(canSignIn(user)).toBe(false)
})
```

Good: important override visible. Boring defaults hidden.

## HTTP contract-sensitive test

Prefer request-level interception when request details matter:

```ts
it('sends bearer token when loading profile', async () => {
  server.use(
    http.get('/api/profile', ({ request }) => {
      expect(request.headers.get('authorization')).toBe('Bearer token-123')
      return HttpResponse.json({ id: 'u_123', name: 'Ada' })
    }),
  )

  await expect(loadProfile('token-123')).resolves.toEqual({
    id: 'u_123',
    name: 'Ada',
  })
})
```

Directly mocking HTTP client may hide URL, headers, serialization, or parsing bugs.

## Type-level positive and negative checks

Framework differs. Preserve both directions:

```ts
expectTypeOf(getUserId({ id: 'u_123' })).toEqualTypeOf<string>()

// @ts-expect-error number ID must be rejected
getUserId({ id: 123 })
```

## Suggested report shape

```md
## Verdict
Risky. Core happy path valid. Error handling and request contract weak.

## Top risks

### High: save error test asserts mock call only
Location: `profile-form.test.tsx > shows save error`
Problem: Test verifies `api.save()` invocation, not visible error state.
Escaping bug: UI can swallow 500 response while suite stays green.
Fix: Use request-level 500 response. Assert visible error message.

## Missing coverage
- Retry exhausted
- Disabled state while save pending
- Unauthorized response

## Suggested commands
- Use repo-defined targeted test command from `package.json`
- Run repeated suite when shared mock leakage suspected
```
