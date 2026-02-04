---
name: jherr-dev-workflow
description: Iterative development workflow based on "Make it work, Make it right, Make it fast" philosophy. Use when building software features, components, or systems from scratch. Guides Claude through three distinct phases - getting a working solution first, then refactoring for quality, and finally optimizing performance only when needed. Prevents premature optimization and over-engineering. Integrates seamlessly with TDD (Test-Driven Development) by mapping test phases to development phases.
---

# jherr Development Workflow

A systematic approach to building software iteratively, inspired by Jack Harrington (jherr) and the classic software development principle.

## Core Philosophy

Development should happen in three distinct phases:

1. **Make it work** - Get a working solution first
2. **Make it right** - Refactor and improve code quality  
3. **Make it fast** - Optimize for performance when needed

Each phase has different priorities and success criteria. Moving to the next phase too early causes problems.

## Phase 1: Make It Work

**Goal**: Create a minimal working solution that demonstrates the feature works end-to-end.

**Priorities**:
- Get something functional as quickly as possible
- Focus on the happy path
- Use straightforward approaches
- Hardcode values if it helps move faster
- Skip error handling that isn't critical
- Accept code duplication temporarily

**With TDD (Test-Driven Development)**:
- Write tests for the core happy path first
- Get those fundamental tests passing
- Defer edge case tests to Phase 2
- Use Red-Green cycle: failing test → minimal code → passing test
- Tests serve as proof the feature works, not comprehensive coverage yet

**Without TDD**:
- Build the feature directly
- Manual testing or simple validation is acceptable
- Add automated tests in Phase 2

**Success criteria**:
- The feature demonstrates the intended behavior
- Core functionality works for the primary use case
- You can show it to someone and they understand what it does
- (TDD) Happy path tests are green

**Common mistakes**:
- Trying to handle every edge case immediately
- Building abstractions before understanding the problem
- Optimizing before knowing if the approach works
- Adding features beyond the core requirement
- (TDD) Writing exhaustive test suites before understanding the problem

## Phase 2: Make It Right

**Goal**: Refactor the working code into maintainable, well-structured software.

**Priorities**:
- Remove code duplication (DRY principle)
- Add proper error handling and edge cases
- Extract reusable functions and components
- Improve naming and code clarity
- Add type safety (TypeScript types, Python type hints)
- Write tests for critical paths
- Add documentation where behavior is non-obvious

**With TDD**:
- Add edge case tests now
- Test error conditions and boundary cases
- Refactor with confidence (tests prevent regressions)
- Use TDD's refactor step to improve design
- Achieve good test coverage of important behaviors

**Without TDD**:
- Add automated tests for critical functionality
- Focus on integration and key unit tests
- Tests enable safe refactoring

**Success criteria**:
- Code is readable and maintainable
- Common errors are handled gracefully
- Components have clear, single responsibilities
- Tests cover the main functionality
- Other developers can understand and modify the code
- (TDD) Comprehensive test suite with edge cases covered

**Common mistakes**:
- Over-abstracting before patterns emerge
- Premature optimization
- Perfect test coverage on first pass
- Adding speculative features "just in case"
- (TDD) Testing implementation details instead of behavior

## Phase 3: Make It Fast

**Goal**: Optimize performance based on actual measured bottlenecks.

**When to enter this phase**:
- Performance testing reveals actual issues
- Users report slowness in production
- Profiling identifies clear bottlenecks
- You have specific performance requirements to meet

**Priorities**:
- Profile first to find actual bottlenecks
- Optimize the slowest parts first (80/20 rule)
- Measure impact of each optimization
- Consider caching strategies
- Evaluate algorithmic improvements
- Look for unnecessary re-renders/re-computations

**With TDD**:
- Add performance tests to capture benchmarks
- Ensure existing tests still pass after optimization
- Use tests to verify optimizations don't break behavior
- Consider adding specific performance regression tests

**Success criteria**:
- Measured performance meets requirements
- Optimizations target actual bottlenecks
- Performance improvements are documented
- Code remains maintainable
- (TDD) All tests still pass, performance tests validate improvements

**Common mistakes**:
- Optimizing without measuring first
- Making code complex for negligible gains
- Optimizing parts that aren't bottlenecks
- Sacrificing maintainability unnecessarily
- (TDD) Breaking tests during optimization without realizing behavioral changes

## Workflow Guidelines

### Starting a new feature
1. Clarify the core requirement
2. Sketch the simplest working approach
3. Build Phase 1: Make it work
4. Demo/validate it works
5. Proceed to Phase 2

### When something breaks
- Fix in the current phase
- Don't jump back to "make it work" mode unnecessarily
- Maintain the quality level achieved

### Knowing when to move forward
- **Phase 1 → 2**: When core functionality works
- **Phase 2 → 3**: When you have performance requirements AND measurements showing issues
- **Staying in Phase 2**: Most code should stay here indefinitely - clean, working code doesn't need optimization

### Red flags
- Writing complex abstractions in Phase 1
- Discussing performance in Phase 1
- Skipping Phase 2 entirely
- Entering Phase 3 without measurements

## TDD Integration

This workflow pairs naturally with Test-Driven Development:

**How they complement each other**:
- **TDD answers "how"** - Write test first, then implementation
- **jherr answers "when"** - When to refactor, when to optimize

**Phase mapping**:
- **Phase 1**: Red-Green cycle for happy path (minimal tests, minimal code)
- **Phase 2**: Add edge case tests, refactor with test safety net
- **Phase 3**: Performance tests validate optimizations don't break behavior

**Best practices**:
- In Phase 1, write just enough tests to prove it works
- In Phase 2, expand test coverage to include edge cases
- In Phase 3, ensure tests pass after each optimization
- Tests are documentation of expected behavior across all phases

**If using TDD throughout**:
- Maintain Red-Green-Refactor cycle in all phases
- Let test failures guide implementation
- Use refactor step as your Phase 2 signal
- Add performance assertions in Phase 3 only

## Examples

### Example: Building a user search feature

**Phase 1 - Make it work**:
```typescript
// Just get it working
function searchUsers(query: string) {
  return users.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase())
  );
}
```

**Phase 2 - Make it right**:
```typescript
// Add proper handling and structure
function searchUsers(query: string): User[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return users.filter(user => 
    user.name.toLowerCase().includes(normalizedQuery) ||
    user.email.toLowerCase().includes(normalizedQuery)
  );
}
```

**Phase 3 - Make it fast** (only if measurements show it's slow):
```typescript
// Optimize with debouncing and indexing
const searchIndex = buildSearchIndex(users);

const debouncedSearch = debounce((query: string) => {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  return searchIndex.query(normalizedQuery);
}, 300);
```

### Example with TDD: Building a shopping cart

**Phase 1 - Make it work (with TDD)**:
```typescript
// Test: Happy path only
test('adds item to cart', () => {
  const cart = new ShoppingCart();
  cart.addItem({ id: 1, name: 'Widget', price: 10 });
  expect(cart.total()).toBe(10);
});

// Implementation: Simplest thing that works
class ShoppingCart {
  items = [];
  
  addItem(item) {
    this.items.push(item);
  }
  
  total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}
```

**Phase 2 - Make it right (with TDD)**:
```typescript
// Tests: Add edge cases and error handling
test('handles empty cart', () => {
  const cart = new ShoppingCart();
  expect(cart.total()).toBe(0);
});

test('prevents adding invalid items', () => {
  const cart = new ShoppingCart();
  expect(() => cart.addItem(null)).toThrow();
});

test('removes items correctly', () => {
  const cart = new ShoppingCart();
  cart.addItem({ id: 1, name: 'Widget', price: 10 });
  cart.removeItem(1);
  expect(cart.total()).toBe(0);
});

// Implementation: Refactored with types and validation
interface CartItem {
  id: number;
  name: string;
  price: number;
}

class ShoppingCart {
  private items: CartItem[] = [];
  
  addItem(item: CartItem): void {
    if (!item || typeof item.price !== 'number') {
      throw new Error('Invalid item');
    }
    this.items.push(item);
  }
  
  removeItem(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
  }
  
  total(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}
```

**Phase 3 - Make it fast** (only if needed):
```typescript
// Performance test
test('handles large cart efficiently', () => {
  const cart = new ShoppingCart();
  const start = performance.now();
  
  for (let i = 0; i < 10000; i++) {
    cart.addItem({ id: i, name: `Item ${i}`, price: i });
  }
  
  const total = cart.total();
  const duration = performance.now() - start;
  
  expect(duration).toBeLessThan(100); // Should complete in <100ms
  expect(total).toBe(49995000);
});

// Optimized implementation with memoization
class ShoppingCart {
  private items: CartItem[] = [];
  private cachedTotal: number | null = null;
  
  addItem(item: CartItem): void {
    if (!item || typeof item.price !== 'number') {
      throw new Error('Invalid item');
    }
    this.items.push(item);
    this.cachedTotal = null; // Invalidate cache
  }
  
  total(): number {
    if (this.cachedTotal !== null) {
      return this.cachedTotal;
    }
    this.cachedTotal = this.items.reduce((sum, item) => sum + item.price, 0);
    return this.cachedTotal;
  }
}
```

## Key Principles

- **Resist premature optimization** - Most code never needs Phase 3
- **Iterate quickly** - Feedback loops are more valuable than perfect first attempts  
- **Measure, don't guess** - Performance problems must be measured
- **Maintainability matters** - Code is read more than written
- **Ship working software** - A working MVP beats a perfect plan
- **TDD enhances the workflow** - Tests provide safety nets for refactoring and prove behavior doesn't change during optimization
- **Test behavior, not implementation** - Focus on what the code does, not how it does it

## When NOT to use this workflow

This workflow may not fit when:
- Building safety-critical systems (correctness first)
- Working with strict performance requirements upfront
- Making small fixes to existing code
- Prototyping/exploring (stay in Phase 1)
- The "right" solution is obvious from the start

## Related Skills

- `/tdd-integration` - TDD Red-Green-Refactor cycle that complements this workflow
- `/testing-best-practice` - Testing philosophy and patterns for quality tests
