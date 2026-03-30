# TORQ Development Instructions

Welcome to TORQ, an AI-powered Strava activity image generator. This is your guide to building and maintaining this project.

## What is TORQ?

TORQ automatically transforms Strava workout data into visually compelling, shareable images. We build with modern TypeScript, Bun, and a modular architecture focused on clarity and safety.

**Key goals**: Generate AI-powered images from activity data, create safe and appropriate content, maintain strict guardrails.

## Tech Stack

- **Runtime**: Bun (v1.3.6+) — fast, modern JavaScript runtime
- **Language**: TypeScript (v5.9.3, strict mode enabled)
- **Modules**: ESNext with Bun's resolver
- **Testing**: Bun test (not Jest)
- **Package Manager**: Bun workspaces (monorepo)
- **Specs**: OpenSpec for formal specifications

## Essential Development Rules

These rules are non-negotiable. Follow them for every function you write.

### Variables & Functions
- **NEVER use `let`** — always use `const`
- **Arrow functions only** — `const fn = () => {}`  not `function fn() {}`
- **No nested functions** — all functions must be top-level; pass dependencies explicitly
- **No early returns** — use `if...else if...else` chains, not early `return` statements

### Documentation & Types
- **JSDoc required for ALL functions** — every function gets `/** @param {Type} param @returns {Type} */`
- **Explicit type annotations** — parameters, return types, variables all have types
- **No inline types** — define types separately, use module-scoped prefixes (e.g., `ActivityConfig`)
- **Module-scoped type names** — prefix with module name to avoid collisions

### File Structure
- **One function per folder** — `function-name/function-name.ts`, `function-name/index.ts`, `function-name/function-name.test.ts`
- **Types in separate files** — `function-name/types.ts` for type definitions
- **Co-locate tests** — tests sit next to source code in same folder
- **Index exports** — `index.ts` re-exports the main function: `export { default } from './function-name'`

### Test-Driven Development
- **Write tests FIRST** before implementing code
- **Tests MUST pass** before you write implementation
- **Get explicit approval** before proceeding past test phase
- **Comprehensive coverage** — 80% minimum, 100% for critical paths

## Routine Tasks

### Run Tests
```bash
bun run test
```
Tests fail? Fix them. Always run tests after code changes.

### Run Linter
```bash
bun run lint
```
Lint fails? Use `bun run lint:fix` to auto-fix, then manually fix remaining issues.

### After Code Changes
1. Run `bun run test` → fix failures
2. Run `bun run lint` → fix violations
3. Both must pass before considering work done

## How to Use This Instruction System

This file provides essentials. Detailed guidance lives in **skills**, loaded on demand for specific tasks.

### For Code Style Questions
**You ask**: "How should I organize imports?" or "What does the file structure look like?"

**You see**: Check the `check-code-style` skill → File organization, type patterns, import rules, constants, error handling patterns.

### For Linting Issues
**You ask**: "ESLint says..." or "How do I fix this lint error?"

**You see**: Check the `lint` skill → ESLint configuration, common errors, automated vs. manual rules.

### For Testing
**You ask**: "How do I write a test?" or "What test patterns should I use?"

**You see**: Check the `test` skill → Test structure, test.each() patterns, mocking, coverage requirements.

### For Planning & Proposals
**You ask**: "I want to create a spec" or "Let me plan a change"

**You see**: Check the `spec` skill → OpenSpec workflow, proposal format, delta specifications, CLI commands.

## Quick Links

| Task | Resource | Triggers |
|------|----------|----------|
| Implement code | [openspec/project.md](../openspec/project.md) | General context, project structure, user journey |
| Code style & patterns | `check-code-style` skill | "code style", "file structure", "imports", "types" |
| Linting & ESLint | `lint` skill | "eslint", "lint error", "linting" |
| Writing tests | `test` skill | "test", "TDD", "coverage", "unit test" |
| Planning & specs | `spec` skill | "proposal", "spec", "plan", "change" |
| UI components | `frontend-design` skill | "build component", "interface design", "styling" |
| Reviewing code | `review-code` skill | "review my code", "code review" |

## Core Design Principles

- **Modular**: Clear boundaries between modules, explicit dependencies
- **Specification-driven**: Formal specs guide implementation, then archived after deployment
- **Testable**: Each module tested in isolation, dependency injection for mocking
- **Resilient**: Failures isolated, guardrails enforce safety
- **Type-safe**: Strict TypeScript, explicit types, no `any`

## Questions?

1. **General project context?** → Read [openspec/project.md](../openspec/project.md)
2. **Task-specific guidance?** → Find the matching skill in the table above
3. **Stuck on implementation?** → Run `bun run test` and `bun run lint` to see errors
4. **Need a spec?** → Use the `spec` skill to learn OpenSpec workflow
