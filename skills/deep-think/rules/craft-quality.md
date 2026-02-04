# Craft Quality

Focus on elegance, maintainability. Every function name should sing.

## The Pattern

When implementing:
- Names should be self-documenting
- Abstractions should feel natural
- Edge cases handled gracefully
- Code reads like prose

## Examples

### ❌ Bad: Quick and Dirty

```typescript
function proc(d: any) {
  let r = [];
  for (let i = 0; i < d.length; i++) {
    if (d[i].s === 'active' && d[i].t > Date.now() - 86400000) {
      r.push(d[i]);
    }
  }
  return r;
}

// What does this do? Need to read implementation
```

### ✅ Good: Self-Documenting

```typescript
function getActiveRecordsFromLast24Hours(records: Record[]): Record[] {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return records.filter(record =>
    record.status === 'active' &&
    record.timestamp > oneDayAgo
  );
}

// Name tells you exactly what it does
// Implementation confirms the name
```

## Real Example: Error Messages

```typescript
// ❌ Bad: Generic errors
throw new Error('Invalid input');
throw new Error('Failed');
throw new Error('Error in user creation');

// ✅ Good: Specific, actionable
throw new ValidationError('Email must be a valid email address');
throw new ConflictError('User with this email already exists');
throw new UnauthorizedError('Session expired, please log in again');
```

## Naming Quality

### Functions

```typescript
// ❌ Bad: Vague
get(), process(), handle(), do()

// ✅ Good: Specific
getUserById(), validateEmailFormat(), handleLoginSuccess(), createInvoice()
```

### Variables

```typescript
// ❌ Bad: Abbreviated
const usr = await db.query();
const res = api.call();
const tmp = arr.map();

// ✅ Good: Full words
const user = await db.query();
const response = api.call();
const transformedItems = arr.map();
```

### Booleans

```typescript
// ❌ Bad: Unclear state
const flag = true;
const check = user.admin;

// ✅ Good: Question format
const isAuthenticated = true;
const hasAdminAccess = user.role === 'admin';
const canEditPost = post.authorId === user.id;
```

## Abstractions

```typescript
// ❌ Bad: Leaky abstraction
class EmailService {
  async send(to: string, subject: string, body: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // Gmail details leak into API
      port: 587,
      auth: { /* ... */ }
    });
    await transporter.sendMail({ to, subject, html: body });
  }
}

// ✅ Good: Clean interface
class EmailService {
  constructor(private transporter: MailTransporter) {}

  async send(email: Email) {
    await this.transporter.send({
      to: email.to,
      subject: email.subject,
      html: email.body
    });
  }
}

// Implementation details hidden
// Easy to swap transporter
```

## Edge Cases

```typescript
// ❌ Bad: Assumes happy path
function divide(a: number, b: number) {
  return a / b;  // What if b is 0?
}

function getFirstName(user: User) {
  return user.name.split(' ')[0];  // What if name is null?
}

// ✅ Good: Gracefully handle edges
function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}

function getFirstName(user: User): string {
  if (!user.name) return '';
  return user.name.split(' ')[0] || '';
}
```

## Checklist

Before committing code:
- [ ] Could function names be more specific?
- [ ] Are all variables using full words (not abbreviations)?
- [ ] Do boolean names read as questions?
- [ ] Are edge cases handled?
- [ ] Would this make sense to someone in 6 months?
- [ ] Is there anything that needs a comment? (If yes, can you make the code clearer instead?)
