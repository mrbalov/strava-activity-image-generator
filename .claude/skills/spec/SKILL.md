---
name: spec
description: OpenSpec workflow and specification-driven development guide. Use this skill when planning changes, creating proposals, writing specifications, or questions about the spec format and OpenSpec commands.
---

# Spec-Driven Development with OpenSpec

This skill covers how to create and implement specifications using OpenSpec.

## Three-Stage Workflow

The project uses **OpenSpec** for formal specifications. The workflow has three stages:

1. **Creating Changes** (Planning) — Write proposal and spec deltas
2. **Implementing Changes** (Building) — Code based on approved spec
3. **Archiving Changes** (Completing) — Move to archive after deployment

## When to Create a Spec

Create a spec change if you're:
- Adding new features or functionality
- Making breaking API changes
- Changing system architecture or patterns
- Optimizing performance (if behavior changes)
- Updating security patterns

**Skip specs for**:
- Bug fixes that restore intended behavior
- Typos, comments, formatting
- Non-breaking dependency updates
- Configuration tweaks

## Stage 1: Creating Changes (Proposal & Specs)

### Step 1: Choose a Change ID

Use **kebab-case, verb-led** names:
- ✓ `add-two-factor-auth`
- ✓ `update-activity-guardrails`
- ✓ `refactor-prompt-generation`
- ✗ `twoFactorAuth` (not kebab-case)
- ✗ `my-changes` (not verb-led)

Change ID must be unique. If taken, append `-2`, `-3`, etc.

### Step 2: Create Directory Structure

```
openspec/changes/[change-id]/
├── proposal.md       (Why, what, impact)
├── tasks.md          (Implementation checklist)
├── design.md         (Optional: technical decisions)
└── specs/
    └── [capability]/
        └── spec.md   (ADDED/MODIFIED/REMOVED requirements)
```

### Step 3: Write proposal.md

```markdown
# Change: Add Two-Factor Authentication

## Why
Users request stronger account security. Two-factor auth is industry standard.

## What Changes
- Users must provide OTP after login
- Email delivery for OTP codes
- OTP expiry after 10 minutes
- **BREAKING**: Login response changes to include `mfa_required` field

## Impact
- Affected specs: `auth` capability, `notifications` capability
- Affected code: login endpoint, email service
```

### Step 4: Write tasks.md

```markdown
## Implementation

- [ ] 1.1 Update auth spec with 2FA requirement
- [ ] 1.2 Update notifications spec with OTP email
- [ ] 1.3 Implement 2FA database schema
- [ ] 1.4 Implement OTP generation and validation
- [ ] 1.5 Write tests (80% coverage)
- [ ] 1.6 Update login endpoint
- [ ] 1.7 Write integration tests
```

### Step 5: Create Spec Deltas

Create `specs/[capability]/spec.md` files with delta operations:

```markdown
## ADDED Requirements

### Requirement: Two-Factor Authentication
Users MUST provide a second authentication factor during login.

#### Scenario: OTP Challenge
- **WHEN** valid credentials are provided
- **THEN** system requests OTP via email
- **AND** user must provide OTP within 10 minutes

#### Scenario: OTP Expiry
- **WHEN** OTP expires after 10 minutes
- **THEN** user must request a new OTP

## MODIFIED Requirements

### Requirement: User Login
[Include FULL requirement text with modifications]

#### Scenario: Login Success
- **WHEN** valid credentials and valid OTP provided
- **THEN** return JWT token with 24-hour expiry

## REMOVED Requirements

### Requirement: Legacy Token Auth
**Reason**: Replaced by JWT-based authentication
**Migration**: All clients must migrate to new token format by [date]
```

**Key rules**:
- Use `## ADDED Requirements` for new capabilities
- Use `## MODIFIED Requirements` for changed behavior (include full requirement text)
- Use `## REMOVED Requirements` for deprecated features
- Use `## RENAMED Requirements` for name changes
- **Every requirement MUST have at least one scenario**
- Scenarios use `#### Scenario: Name` format (4 hashtags, not bullets)

### Step 6: Validate Before Sharing

```bash
openspec validate [change-id] --strict --no-interactive
```

Fix any errors before sharing the proposal. Validation must pass.

## Stage 2: Implementing Changes

Get approval before starting implementation. Once approved:

1. **Read proposal.md** — Understand the change
2. **Read design.md** (if exists) — Review technical decisions
3. **Read tasks.md** — Get the implementation checklist
4. **Implement each task sequentially** — Complete in order
5. **Update task checklist** — Mark each as complete (`- [x]`)
6. **Run tests and linting** — Both must pass
7. **Verify completion** — Ensure every task is finished

Keep all tasks working — don't skip ahead until dependencies are complete.

## Stage 3: Archiving Changes

After deployment to production, archive the change:

```bash
openspec archive [change-id] --yes
```

This moves `changes/[change-id]/` → `changes/archive/YYYY-MM-DD-[change-id]/` and updates specs.

## Spec Format Rules

### Scenario Format (Critical)

```markdown
#### Scenario: User login with valid credentials
- **WHEN** valid credentials provided
- **THEN** return JWT token
- **AND** set authentication cookie
```

**Important**:
- Use `#### Scenario:` (4 hashtags)
- Start with **WHEN** — the condition
- Follow with **THEN** — the expected result
- Use **AND** for additional results
- Never use bullets (`-`) for the scenario header itself

### Requirement Format

```markdown
### Requirement: User Authentication
User MUST provide valid credentials before accessing protected resources.

#### Scenario: Valid credentials
- **WHEN** correct username and password
- **THEN** return authentication token

#### Scenario: Invalid credentials
- **WHEN** incorrect password
- **THEN** return error: "Invalid credentials"
```

### Delta Operations

| Operation | Use When | Format |
|-----------|----------|--------|
| **ADDED** | New capability | `## ADDED Requirements` + requirement block |
| **MODIFIED** | Changed behavior | `## MODIFIED Requirements` + full requirement (what changed gets updated) |
| **REMOVED** | Deprecated feature | `## REMOVED Requirements` + reason + migration plan |
| **RENAMED** | Name change | `## RENAMED Requirements` (FROM → TO) |

## OpenSpec CLI Commands

```bash
# List active changes
openspec list

# List all specifications
openspec list --specs

# Show details of a change
openspec show [change-id]

# Show details of a spec
openspec show [spec-id] --type spec

# Validate a change
openspec validate [change-id] --strict --no-interactive

# Archive a change (after deployment)
openspec archive [change-id] --yes

# Interactive mode (prompts for selection)
openspec show          # Prompts for item
openspec validate      # Bulk validation mode
```

## Tips

- **Keep proposals short**: 1-2 pages of Why/What/Impact
- **Requirement wording**: Use "SHALL", "MUST", "SHOULD" for clarity
- **Scenario examples**: Real user flows, not edge cases
- **Test early**: Write tests before implementing features
- **Validate often**: Run `openspec validate` after each edit
- **Document decisions**: Use design.md for complex architectural changes

## Common Mistakes

### Scenario Parsing Issues

❌ **WRONG** - Using bullets for scenario header:
```markdown
- **Scenario: User login**
```

✓ **CORRECT** - Using `####` header:
```markdown
#### Scenario: User login
- **WHEN** credentials provided
- **THEN** token returned
```

### Missing Scenarios

❌ **WRONG** - No scenarios:
```markdown
### Requirement: Authentication
Users must authenticate.
```

✓ **CORRECT** - At least one scenario:
```markdown
### Requirement: Authentication
Users MUST authenticate before access.

#### Scenario: Valid login
- **WHEN** valid credentials
- **THEN** grant access
```

### MODIFIED Without Full Text

❌ **WRONG** - Partial requirement:
```markdown
## MODIFIED Requirements
### Requirement: Login
Now also requires 2FA.
```

✓ **CORRECT** - Full requirement with changes:
```markdown
## MODIFIED Requirements
### Requirement: Login
Users MUST provide valid credentials AND valid OTP.

#### Scenario: With OTP
- **WHEN** credentials and OTP valid
- **THEN** return token
```

## Project Context

See [../project.md](../project.md) for:
- Current capabilities and active changes
- Project structure and conventions
- Tech stack (Bun, TypeScript, ESNext)
- Testing and linting requirements

## Quick Links

- **Source**: [openspec/ directory](../)
- **Active changes**: Run `openspec list`
- **All specs**: Run `openspec list --specs`
- **Project conventions**: See [project.md](../project.md)
