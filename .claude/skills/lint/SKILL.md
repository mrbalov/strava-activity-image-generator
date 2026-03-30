---
name: lint
description: ESLint configuration and linting guide for TORQ. Use this skill when encountering linting errors, ESLint violations, or questions about code quality rules and linting configuration.
---

# Linting Guide

This skill covers ESLint configuration and how to fix linting errors in TORQ.

## Quick Start

**Run linter**:
```bash
bun run lint
```

**Auto-fix issues**:
```bash
bun run lint:fix
```

**Fix remaining issues manually** according to the rule reference below.

## ESLint Configuration

- **Linter**: ESLint 9+ with TypeScript and JSDoc plugins
- **Config file**: `eslint.config.mjs` (modern flat config, at project root)
- **Rules enforced**: See "Enforced Rules" section below

## Enforced Rules Reference

### ✅ Fully Automated (auto-fixable)

These rules are automatically fixed with `bun run lint:fix`:

| Rule | What It Does | Example |
|------|----------|---------|
| **No `let`** | Forbids `let` keyword entirely | ✗ `let x = 5;` → ✓ `const x = 5;` |
| **Prefer `const`** | Requires `const` for all variables | ✗ `var x = 5;` → ✓ `const x = 5;` |
| **Arrow functions** | Requires arrow function syntax | ✗ `function fn() {}` → ✓ `const fn = () => {}` |
| **Node: prefix** | Node.js imports must use `node:` prefix | ✗ `import fs from 'fs'` → ✓ `import fs from 'node:fs'` |
| **Explicit return types** | All functions must have explicit return types | ✗ `const fn = () => 5;` → ✓ `const fn = (): number => 5;` |
| **Type annotations** | All variables/params need types | ✗ `const x = 5;` → ✓ `const x: number = 5;` |

### ⚠️ Requires Manual Review

These violations cannot be auto-fixed and require manual changes:

| Rule | What It Does | How to Fix |
|------|----------|-----------|
| **No nested functions** | Functions must be top-level, not inside other functions | Extract to top level, pass dependencies as parameters. Use `@internal` JSDoc tag to mark helper functions. |
| **JSDoc required** | All functions need complete JSDoc with `@param`, `@returns`, description | Add complete JSDoc comment above every function |
| **Module-scoped types** | Types must be prefixed with module name | Rename `ValidationResult` → `ActivityValidationResult` in activity module |
| **No inline types** | Type objects must be defined separately | Define `type Params = { id: string }`, don't use `(p: { id: string })` syntax |

## Common Lint Errors & Fixes

### Error: "Unexpected var"
```
❌ ESLint Error: var foo = 5;
✓ Fix: const foo = 5;
```

### Error: "Unexpected 'let'"
```
❌ ESLint Error: let counter = 0;
✓ Fix: const counter = 0;
(If you need reassignment, rethink the logic — usually means the function is doing too much)
```

### Error: "Missing JSDoc comment"
```typescript
❌ ESLint Error: const validate = () => {};

✓ Fix:
/**
 * Validates the input.
 * @returns {boolean} True if valid
 */
const validate = (): boolean => {
  return true;
};
```

### Error: "Missing @returns JSDoc"
```typescript
❌ ESLint Error:
/**
 * Validates input.
 */
const validate = (): boolean => {};

✓ Fix:
/**
 * Validates input.
 * @returns {boolean} True if valid
 */
const validate = (): boolean => {};
```

### Error: "Missing return type"
```typescript
❌ ESLint Error: const validate = () => true;
✓ Fix: const validate = (): boolean => true;
```

### Error: "Function declaration"
```typescript
❌ ESLint Error: function validate() {}
✓ Fix: const validate = (): boolean => {};
```

### Error: "No node: prefix"
```typescript
❌ ESLint Error: import { readFile } from 'fs/promises';
✓ Fix: import { readFile } from 'node:fs/promises';
```

### Error: "Nested function"
```typescript
❌ ESLint Error:
const outer = () => {
  const inner = () => {};  // Nested — FORBIDDEN
  inner();
};

✓ Fix: Extract to top level
/**
 * Helper function.
 * @internal
 * @returns {void}
 */
const innerHelper = (): void => {};

/**
 * Main function.
 * @returns {void}
 */
const outer = (): void => {
  innerHelper();
};
```

### Error: "Missing type annotation"
```typescript
❌ ESLint Error: const x = 5;
✓ Fix: const x: number = 5;
```

### Error: "Inline type definition"
```typescript
❌ ESLint Error: const fn = (p: { id: string }) => {};

✓ Fix:
type Params = {
  /** The item ID */
  id: string;
};

const fn = (p: Params) => {};
```

## Workflow: Running Lint & Fixing

1. **Check for errors**:
   ```bash
   bun run lint
   ```

2. **Auto-fix what you can**:
   ```bash
   bun run lint:fix
   ```

3. **Review remaining errors** in the output and fix manually using the guide above

4. **Re-check**:
   ```bash
   bun run lint
   ```
   Should show no errors (or only warnings you intentionally left)

5. **Run tests** to ensure your fixes didn't break anything:
   ```bash
   bun run test
   ```

## Linting + Testing Together

You must always run both after code changes:

```bash
bun run lint
bun run test
```

Both must pass before your changes are considered complete. Linting without testing (or vice versa) is insufficient.

## Rule Enforcement Status

| Category | Rule | Auto-fixable? | Notes |
|----------|------|--------------|-------|
| Variables | No `let` | Yes | Auto-fixed to `const` |
| Variables | Prefer `const` | Yes | Auto-fixed |
| Functions | Arrow only | Yes | Auto-fixed |
| Functions | Explicit return types | Yes | Auto-fixed |
| Functions | No nested functions | No | Manual extraction required |
| Functions | JSDoc required | No | Manual documentation required |
| Types | Explicit annotations | Yes | Auto-fixed |
| Types | No inline types | No | Manual extraction required |
| Types | Module-scoped prefixes | No | Manual renaming required |
| Imports | `node:` prefix | Yes | Auto-fixed |

## Tips

- **Red vs Yellow**: ESLint shows errors (red) and warnings (yellow). Both should be fixed.
- **Stubborn lint error?** Read the rule name carefully, search for it in this guide, and follow the example.
- **Can't auto-fix?** Use `bun run lint:fix` first to handle what can be automated, then manually fix the rest.
- **Linting slows you down?** Good lint rules prevent bugs. Invest upfront, save later.
