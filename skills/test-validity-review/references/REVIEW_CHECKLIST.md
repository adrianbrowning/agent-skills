# Test Review Checklist

Use only relevant sections. Do not dump entire checklist into report.

## 1. Confidence map

Map confidence before line review:

- Focused unit tests
- Narrow integration tests
- Contract tests
- Component tests
- End-to-end journeys
- Type-level tests
- Risks covered only by mocks
- Risks missing at every level
- Same behaviour repeated at several levels without extra confidence

Choose cheapest test that catches realistic bug. Narrow integration may beat brittle mocked unit test. Do not enforce pyramid quotas.

Trade-offs:

- Speed
- Maintainability
- CI resource use
- Reliability
- Fidelity to production behaviour

## 2. Behaviour validity

Valid test usually:

- Arranges realistic input
- Acts through public entry point or user action
- Asserts observable outcome
- Fails when claimed behaviour breaks
- Keeps passing after harmless refactor

Flag:

- Mock call asserted with no meaningful outcome
- Assertion reimplements production logic
- Private helper tested because public API is hard to reach
- Existence checked instead of correctness
- Huge snapshots with no focused semantic checks
- Incidental ordering, formatting, generated IDs, object identity, DOM structure

Use direct wording:

> This test passes, but does not prove behaviour claimed by its name.

## 3. Mutation challenge

For important tests, imagine production change:

- Return `null`, `undefined`, `false`, empty array, constant success
- Remove validation
- Invert branch
- Change `>` to `>=`
- Remove `await`
- Swallow error
- Ignore one input
- Select, update, or delete wrong item
- Send wrong HTTP method, URL, body, headers, auth
- Render wrong label, disabled state, or error state

If test still passes: assertion weak, setup wrong, or test invalid.

Suggest actual mutation testing only when repo supports it. Prefer focused package or changed surface first.

## 4. Mock discipline

Good mock:

- Replaces slow, external, non-deterministic, or hard-to-trigger dependency
- Models realistic success and failure
- Is local or reliably reset
- Leaves behaviour under test intact

Risky mock:

- Mocks unit under test
- Mocks most internal call graph
- Mirrors expected output exactly
- Asserts only mock invocation
- Does not match real dependency shape
- Hides serialization, validation, schema, URL, headers, auth, timezone, errors
- Leaks between tests because clear/reset/restore missing

Default rule:

> Mock boundary, not behaviour needing confidence.

For HTTP-heavy tests, prefer request-level mocks where request/response contract matters.

## 5. Async correctness

Flag:

- Missing `await` on promise, async expectation, user event, or wait helper
- Async work starts but test exits early
- Arbitrary sleeps
- Fake timers mixed with promises without flush plan
- Swallowed rejection
- Race-prone assertion

Prefer waiting for observable result. Use fake timers only when time is behaviour.

## 6. UI/component tests

Prefer:

- Queries by role, label, text, placeholder, display value, alt text, title
- Realistic user events
- Visible output, accessibility state, navigation, submitted data, emitted events
- Minimal `data-testid`

Flag:

- Internal state assertions
- CSS selectors or generated structure
- Snapshot-only component test
- Direct method invocation when user path exists
- Child mocks that remove interaction needing confidence
- Missing disabled, loading, error, empty, accessibility states

## 7. TypeScript honesty

Flag:

- `any` in fixtures, mocks, builders, assertions without clear reason
- `as unknown as X`, broad `as X`, non-null assertions used to silence setup problems
- Runtime validator tested only with already-valid typed values
- Type predicate only happy-path tested
- Assertion function never tested for throw
- Overload runtime behaviour not checked per overload
- Generic helper tested with one shape only
- Type-level suite with positive compile cases only

Prefer:

- `unknown` plus narrowing for untrusted input
- `satisfies` for fixtures when suitable
- Domain-shaped factories
- Invalid runtime inputs
- Positive and negative type-level assertions

## 8. Fixtures and setup

Good fixture:

- Exposes scenario-defining values near test
- Hides boring defaults
- Uses domain names
- Avoids shared mutable state
- Makes edge case explicit

Flag:

- Huge inline object hiding tested field
- Fictional shape unlike real API
- Global mutable fixture
- Mystery guest: key state hidden in distant helper, external file, seed, DB
- General fixture: broad setup creating irrelevant state
- Factory defaults hiding required fields or validation rules
- Excessive `beforeEach`

## 9. Actionable failures

Failure should explain scenario without logging-and-rerun cycle.

Flag:

- Vague names: `works`, `renders`, `handles data`
- `toBeTruthy()` when exact value matters
- Array-length-only checks when content matters
- Broad snapshots hiding useful diff
- Parameterized case not visible in failure output
- Helper rethrows generic error and loses context
- Many unrelated assertions masking scenario

Prefer precise expected vs actual values and behaviour names.

## 10. Determinism

Flag:

- Real network
- Real time, timezone, locale, randomness, generated IDs, environment
- Test-order dependence
- Shared mutable state
- Parallel collisions
- Filesystem residue
- DB leakage
- Browser, Node, OS assumptions
- Global mock leakage

Control time, randomness, env, temp dirs, DB cleanup, spies, stubs, module mocks. Recommend repeats and random order where supported.

## 11. Maintainability

Flag:

- Deep nested `describe`
- Hidden setup
- Unrelated assertions in one test
- Repeated boilerplate obscuring scenario
- Complex helper needing own tests
- Expected result understandable only after reading implementation

Prefer clear arrange/action/assert shape. Comments optional when shape obvious.

## 12. Missing coverage prompts

Check where relevant:

- Error paths
- Empty, null, undefined
- Boundaries
- Duplicate or partial data
- Auth and permission failure
- Retry, cancellation, timeout
- External dependency failure
- Type guard false cases
- Accessibility states
- Serialization and contract shape

## 13. Generated-test audit

Be extra suspicious of:

- Over-mocking
- Line-by-line implementation mirror
- High coverage with low behavioural confidence
- Generic names
- Easy assertions chosen instead of meaningful ones
- Invented fixtures
- Snapshot confidence theater
- Agent-generated mocks bypassing real interaction

Delete low-signal tests when rewrite cost exceeds value.

## Severity

### Blocker

Invalid or actively misleading test. Examples: unit under test mocked; missing await means failure cannot surface; assertion cannot fail for claim; implementation replaced by constant and suite stays green.

### High

Confidence materially reduced. Examples: core error path absent; important boundary fully mocked without contract/integration coverage; cast hides invalid fixture; UI verifies internals; nondeterminism creates flake.

### Medium

Mostly valid but brittle or incomplete. Examples: broad snapshot; hidden setup; partial assertion; missing boundary case.

### Low

Naming, readability, minor fixture cleanup, unnecessary nesting.
