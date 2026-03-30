---
name: check-code-style
description: Code style and organization standards. Use this skill when asking about function structure, file organization, type naming, naming conventions, import patterns, or any code patterns and structural questions.
---

# Code Style Guide

This skill covers how to organize code, structure functions, define types, and follow naming conventions.

## File Organization

Each function gets its own folder with three dedicated files:

```
function-name/
├── function-name.ts       (function implementation)
├── function-name.test.ts  (unit tests)
├── index.ts               (exports)
└── types.ts              (types, if needed)
```

**index.ts re-exports**:
```typescript
export { default } from './function-name';
```

**Test co-location**: Tests sit next to source in the same folder.

**Types separation**: Keep `types.ts` for type definitions within the same folder.

## Function Definition Style

All functions use **arrow function syntax** with explicit types:

```typescript
/**
 * Validates an activity against guardrails.
 * @param {Activity} activity - The activity to validate
 * @returns {Promise<ValidationResult>} Validation result with errors
 */
const validateActivity = async (activity: Activity): Promise<ValidationResult> => {
  if (!activity.id) {
    throw new Error('Activity ID is required');
  }
  // implementation
  if (isValid) {
    return { valid: true, errors: [] };
  } else {
    return { valid: false, errors: [/* ... */] };
  }
};
```

**Key patterns**:
- `const functionName = async (...): Promise<Type> => { ... }`
- Explicit return type annotation
- No early returns — use `if...else if...else` chains
- All parameters have type annotations
- All return values use Promise for async functions

## Type Definitions

Types live in separate `types.ts` files and use **module-scoped prefixes**:

```typescript
// activity/types.ts
export type ActivityValidationResult = {
  /** True if activity passed all validations */
  valid: boolean;
  /** List of validation errors */
  errors: Array<string>;
};

export type ActivityConfig = {
  /** Minimum activity duration in minutes */
  minDuration: number;
  /** Maximum activity duration in hours */
  maxDuration: number;
};
```

**Rules**:
- Prefix types with module name: `ActivityValidationResult`, `ActivityConfig` (not `ValidationResult`)
- Use `export type` for all type exports
- Use PascalCase for type names
- Union types for enums: `type Status = 'VALID' | 'INVALID'`
- **NO inline types** — always define separately
- Document types with JSDoc comments above each property

**Example of FORBIDDEN**:
```typescript
// ❌ WRONG - inline types
const validate = (params: { id: string; duration: number }) => {};
```

**Correct approach**:
```typescript
// ✅ RIGHT - named type
type ValidateParams = {
  id: string;
  duration: number;
};
const validate = (params: ValidateParams) => {};
```

## JSDoc Comments

Every function requires complete JSDoc with all information:

```typescript
/**
 * Transforms activity data into an AI image prompt.
 * @param {Activity} activity - The activity data to transform
 * @param {PromptConfig} [config] - Optional configuration (uses defaults if omitted)
 * @returns {Promise<string>} Promise resolving to the generated prompt
 * @throws {Error} If activity is missing required fields
 * @example
 * const prompt = await generatePrompt(activity);
 */
const generatePrompt = async (
  activity: Activity,
  config?: PromptConfig
): Promise<string> => {
  // ...
};
```

**Required tags**:
- `@param {Type} name - Description` — one per parameter with explicit type
- `@returns {Type} - Description` — always include explicit return type
- `@throws` — document error conditions (if applicable)
- Optional parameters use brackets: `@param {string} [optional] - Description`

**Optional tags**:
- `@example` — usage examples
- `@see` — external references
- `@internal` — mark internal helper functions not part of public API
- `@template T` — for generic functions

## Variables

All variables are declared with `const`:

```typescript
// ✅ CORRECT
const MAX_RETRIES = 3;
const activityId = '12345';
const config = { timeout: 5000 };

// ❌ WRONG
let MAX_RETRIES = 3;  // Use const
var config = {};      // Use const
```

## Constants

Constants use separate `constants.ts` files within the module:

```typescript
// activity/constants.ts
export const ACTIVITY_CONFIG = {
  MIN_DURATION: 5,      // minutes
  MAX_DURATION: 480,    // 8 hours
  DEFAULT_TIMEOUT: 5000, // milliseconds
};

// Access environment variables directly
export const API_KEY = String(process.env.STRAVA_API_KEY);
```

**Rules**:
- Use UPPER_SNAKE_CASE for constant names
- Group related constants in objects
- Access `process.env` directly without `dotenv` (Bun auto-loads .env)

## Import Patterns

All imports use **ESNext modules**:

```typescript
// ✅ Node.js built-ins: use node: prefix
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// ✅ Local imports: use relative paths
import { validateActivity } from './validate-activity';
import { ActivityConfig } from './types';

// ✅ Default imports (for index.ts exports)
import validateActivity from './validate-activity';

// ❌ WRONG: wildcard imports
import * as fs from 'node:fs/promises';

// ❌ WRONG: no node: prefix
import { readFile } from 'fs/promises';
```

**Order imports**:
1. Node.js built-ins first (`node:`)
2. Local imports second
3. Types in separate section if needed

## Error Handling

Throw descriptive errors with context:

```typescript
const validateActivity = (activity: Activity): void => {
  if (!activity.id) {
    throw new Error('Activity ID is required for validation');
  }

  if (activity.duration < 5) {
    throw new Error(`Activity duration (${activity.duration} min) is below minimum of 5 minutes`);
  }

  // ✅ Use if...else, not early returns
  if (isValid) {
    // continue processing
  } else {
    throw new Error('Activity failed validation');
  }
};
```

## CLI Entry Points

CLI files use Bun's dynamic import pattern:

```typescript
#!/usr/bin/env bun

/**
 * CLI entry point.
 */

if (import.meta.main) {
  const { default: getCliArgs } = await import('./get-cli-args');
  const args = getCliArgs();
  
  if (!args.inputPath) {
    throw new Error('--input is required');
  }
  
  const result = await processFiles(args.inputPath);
  console.info(JSON.stringify(result, null, 2));
}
```

**Rules**:
- Shebang: `#!/usr/bin/env bun`
- Check `if (import.meta.main)` for CLI execution
- Use dynamic imports for CLI args
- Output JSON with `console.info(JSON.stringify(data, null, 2))`
- Validate required arguments and throw descriptive errors

## Related Resources

For detailed patterns and examples, see:
- **[file-organization.md](../references/file-organization.md)** — Folder structure patterns
- **[type-definitions.md](../references/type-definitions.md)** — Advanced type patterns
- **[import-patterns.md](../references/import-patterns.md)** — Import guidelines and examples
