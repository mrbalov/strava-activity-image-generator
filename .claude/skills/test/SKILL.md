---
name: test
description: Test-driven development guide. Use this skill when writing tests, learning test patterns, understanding coverage requirements, or questions about the testing workflow.
---

# Test-Driven Development

This skill covers how to write tests and the TDD workflow.

## Test-Driven Development (TDD) Workflow

1. **Write tests FIRST** — Write unit tests before implementation
2. **Red phase** — Tests fail (you haven't implemented yet)
3. **Get approval** — Show tests to user, wait for explicit approval
4. **Green phase** — Implement code to pass the tests
5. **Verify** — Both tests and linter must pass

**Critical**: Never write implementation code until tests are approved.

## Quick Start

**Run tests**:
```bash
bun run test
```

**Run tests in watch mode**:
```bash
bun run test --watch
```

**Check coverage**:
```bash
bun run test --coverage
```

## Test Structure

Tests use Bun test with `test.each()` for multiple test cases. Each test file wraps cases in a `describe` block:

```typescript
import { describe, test, expect } from 'bun:test';
import validateActivity from './validate-activity';

/**
 * Test case type for validateActivity tests.
 */
type ValidateActivityCase = [
  /** Test case name */
  string,
  /** Activity input */
  Activity,
  /** Expected result */
  ValidationResult,
];

describe('validate-activity', () => {
  const cases: ValidateActivityCase[] = [
    [
      'Valid activity with all required fields',
      {
        id: '123',
        name: 'Morning Run',
        duration: 30,
        distance: 5.2,
      },
      { valid: true, errors: [] },
    ],
    [
      'Invalid: missing activity ID',
      {
        id: '',
        name: 'Run',
        duration: 30,
        distance: 5.2,
      },
      { valid: false, errors: ['Activity ID is required'] },
    ],
    [
      'Invalid: duration below minimum',
      {
        id: '456',
        name: 'Short Run',
        duration: 2,
        distance: 1.0,
      },
      { valid: false, errors: ['Duration must be at least 5 minutes'] },
    ],
  ];

  test.each<ValidateActivityCase>(cases)(
    '%#. %s',
    (_name, activity, expected) => {
      const result = validateActivity(activity);
      expect(result).toStrictEqual(expected);
    }
  );
});
```

**Key patterns**:
- Define a `Case` type at the top of the test file
- Use `describe('entity-name', ...)` to wrap all tests for one function
- Use `test.each<CaseType>(cases)(...)` for parameterized tests
- Test case name template: `%#. %s` (test number + case name)
- Use `.toStrictEqual(...)` for object comparisons (not `.toBe()`)
- Split arrays and objects across multiple lines for readability

## Test Case Naming

Use **business-friendly names** based on behavior, not implementation details:

```typescript
// ❌ BAD: Implementation details
cases: [
  ['Test 1', ...],
  ['if statement', ...],
  ['returns object', ...],
];

// ✅ GOOD: Business behavior
cases: [
  ['Valid activity passes validation', ...],
  ['Missing ID raises error', ...],
  ['Duration below minimum fails', ...],
];
```

## Coverage Requirements

| Type | Minimum Coverage |
|------|------------------|
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |
| Statements | 80% |
| Critical paths | 100% |

**Critical paths** are code that handles security, safety, or core business logic. Example: guardrails validation is critical and needs 100% coverage.

## Dependency Injection for Testing

Pass dependencies as parameters so you can mock them in tests:

```typescript
/**
 * Validates activity with external dependency.
 * @param {Activity} activity - Activity to validate
 * @param {GuardrailsValidator} validator - Validator instance (injectable)
 * @returns {Promise<ValidationResult>} Validation result
 */
const validateActivity = async (
  activity: Activity,
  validator: GuardrailsValidator
): Promise<ValidationResult> => {
  const guardResult = await validator.check(activity);
  // ...
};

// In tests: pass a mock validator
const mockValidator = {
  check: async (activity: Activity) => ({ safe: true, issues: [] }),
};

const result = await validateActivity(testActivity, mockValidator);
```

## Testing Patterns

### Unit Test (Function in Isolation)
```typescript
// Arrange: set up the test data
const activity = { id: '123', duration: 30 };

// Act: call the function
const result = validateActivity(activity);

// Assert: check the result
expect(result.valid).toBe(true);
```

### Integration Test (Multiple Functions)
```typescript
// Test how validateActivity and formatResult work together
const activity = { id: '123', duration: 30 };
const validation = validateActivity(activity);
const formatted = formatResult(validation);

expect(formatted.message).toBe('Activity is valid');
```

### Test with Dependency Injection
```typescript
// Create a mock dependency
const mockApi = {
  fetchConfig: async () => ({ timeout: 5000 }),
};

// Pass the mock to the function
const result = await processActivity(activity, mockApi);

expect(result).toStrictEqual(expected);
```

### Error Testing
```typescript
// Test that errors are thrown with correct messages
const testCase = () => {
  validateActivity({ id: '', duration: 30 });
};

expect(testCase).toThrow(
  new Error('Activity ID is required')
);
```

## Running Tests After Code Changes

**CRITICAL**: Always run tests and linting together:

```bash
# 1. Run tests
bun run test

# 2. Run linter
bun run lint

# 3. If linting fails, auto-fix what you can
bun run lint:fix

# 4. Re-run both
bun run test
bun run lint
```

Both must pass. If either fails:
1. Review the errors carefully
2. Fix the code
3. Re-run both again

## Code Quality Requirements

- **MUST run tests after code changes** — No exceptions
- **MUST run linter after code changes** — No exceptions
- **Tests and linting MUST work in parallel** — Both passing is the requirement, not either/or
- Before committing any code, ensure:
  - ✓ All tests pass
  - ✓ Linting passes
  - ✓ Critical paths have 100% coverage

## Tips

- **Test names matter**: Use clear business names, not technical jargon
- **One assertion per test**: Each test case should verify one behavior
- **Avoid heavy mocking**: Test real interactions when possible
- **Keep test data simple**: Use minimal data needed for each test
- **Use describe() blocks**: Organize tests by function or feature
- **Watch mode is helpful**: Use `bun run test --watch` during development to auto-run tests as you code

## Common Test Errors

### Error: "Expected X to be Y"
```
Check your assertion. Use `.toStrictEqual()` for objects, `.toBe()` for primitives.
```

### Error: "Timeout of 5000ms exceeded"
```
Function is taking too long. Check if there's an infinite loop or hanging promise.
```

### Error: "Expected function to throw"
```
Function didn't throw, but the test expected it to. Check your error handling logic.
```

### Coverage Below 80%
```
Add more test cases to cover untested code paths. Run `bun run test --coverage` to see which lines need coverage.
```
