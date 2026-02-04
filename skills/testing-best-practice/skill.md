---
name: testing-best-practice
description: A Skill for writing, reviewing, and refactoring tests using Artem-style principles: test intent over implementation, mock boundaries not internals, avoid flakiness, prefer integration tests, and use `using` for cleanup.
---

# Testing Best Practice

## Instructions

When the user asks for help with tests (writing new tests, improving existing ones, or defining testing standards), follow these rules:

1. **Test intent, not implementation**
   - Make tests read like requirements.
   - Assert observable behaviour: return values, DOM, side-effects, and public contracts.
   - Avoid asserting private state, internal variables, or exact call sequences unless the behaviour *requires* it.

2. **Favour high-signal, low-maintenance tests**
   - A test should fail only when the *behavioural contract* changes.
   - Use the smallest, clearest input that still demonstrates the behaviour.
   - Name tests in real-world language, e.g.:
     ```ts
     it("allows a customer to update their email", async () => {})
     ```

3. **Avoid flakiness with strict control of nondeterminism**
   - Control time (fake timers), randomness, and external systems.
   - Do not hit real network, databases, or filesystem in unit/integration tests.
   - Explicitly await all async behaviour (no untracked promises).

4. **Mock boundaries, not internals**
   - Mock HTTP via tools like Mock Service Worker (MSW) or equivalent.
   - Do not mock your own internal functions when you can mock the external boundary instead.
   - When mocking, model both success and failure modes (errors, invalid data, timeouts).

5. **Prefer integration tests where possible**
   - Use unit tests for pure functions and complex branching.
   - Use integration tests for behaviour spanning multiple layers.
   - Keep end-to-end tests few and focused on critical user flows.

6. **Refactor for testability**
   - If a test is hard to write, consider changing the production code:
     - Extract pure functions.
     - Inject dependencies instead of using globals.
     - Isolate side-effects behind small, well-defined boundaries.

7. **Use the `using` keyword for resource cleanup**
   - Use `using` for disposable resources such as:
     - Temporary files/directories
     - DB connections or transactions
     - Event listeners
     - Fake timers or custom resources exposing `Symbol.dispose`
   - Prefer `using` over manual `afterEach` cleanup when possible.

   Example:
   ```ts
   it("handles a temporary directory", async () => {
     using tmp = createTempDir();

     await writeFile(tmp.path + "/a.txt", "hello");
     expect(await readFile(tmp.path + "/a.txt")).toBe("hello");
   });
   ```

8. **Recommended test layout**
   - When generating or refactoring tests, aim for this structure:
     ```ts
     describe("FeatureName", () => {
       it("states the requirement", async () => {
         // Arrange
         const user = buildUser();

         // Act
         const result = await updateEmail(user.id, "new@x.com");

         // Assert
         expect(result.email).toBe("new@x.com");
       });
     });
     ```

9. **Golden rules summary**
   - Test the **intention**, not the implementation.
   - Mock **boundaries**, not internal helpers.
   - Keep tests **deterministic** and repeatable.
   - Prefer **integration tests** for real behaviour.
   - Refactor code that is hard to test.
   - Use **MSW or equivalent** for HTTP boundaries.
   - Use **`using`** for automatic cleanup of disposable resources.
   - Keep inputs minimal and test names descriptive.

When responding, ensure that any example tests you write or refactor obey these rules by default. If the user’s existing tests violate these rules, explain what to change and why.

## Examples

### Example 1: Generating tests

**User prompt**

> I have a function `updateEmail(userId, email)` that calls an HTTP API. Can you write tests for it?

**What to do**

- Propose integration-style tests that:
  - Call `updateEmail` as the user would.
  - Mock HTTP via MSW or a boundary-level mock.
  - Assert on the returned result and/or observable side-effects.
- Avoid spying on internal helpers like `apiClient.get`.

**Example response snippet**

```ts
describe("updateEmail", () => {
  it("updates the user email when the API succeeds", async () => {
    // MSW handler: mock boundary, not internal client
    server.use(
      http.put("/users/:id/email", () => HttpResponse.json({ email: "new@example.com" }))
    );

    const result = await updateEmail("user-123", "new@example.com");

    expect(result.email).toBe("new@example.com");
  });

  it("throws a helpful error when the API fails", async () => {
    server.use(
      http.put("/users/:id/email", () => HttpResponse.text("Server error", { status: 500 }))
    );

    await expect(updateEmail("user-123", "new@example.com"))
      .rejects
      .toThrow(/unable to update email/i);
  });
});
```

### Example 2: Refactoring brittle tests

**User prompt**

> My test keeps breaking whenever I refactor. It spies on `apiClient.put` and checks the exact arguments. How can I make it better?

**What to do**

- Explain that the test is implementation-coupled.
- Suggest asserting on behaviour instead of specific internal calls.
- Optionally replace internal spies with boundary mocks (e.g. MSW).

**Example response snippet**

```ts
// Instead of:
expect(apiClient.put).toHaveBeenCalledWith("/users/123/email", { email: "new@example.com" });

// Prefer:
const result = await updateEmail("123", "new@example.com");
expect(result.email).toBe("new@example.com");
```

Explain that this test will only fail when the *behavioural contract* changes, not just when `apiClient` usage is refactored.
