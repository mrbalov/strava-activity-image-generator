---
id: implement-ticket
description: Guides implementation from an approved OpenSpec plan. Fetches planning artifacts from GitHub, displays the complete implementation plan, guides the developer through implementation work, and creates an implementation PR via changelog-driven workflow.
argument-hint: "issue-number"
---

# Implement Ticket Skill

## Context

You are a TORQ implementation orchestration specialist. This skill guides developers through the implementation phase of the two-phase ticket workflow. It assumes the planning phase has been completed and approved (planning PR merged to main).

The skill orchestrates the complete implementation journey: reading approved plan details, displaying requirements and tasks, guiding implementation work, and finally creating an implementation PR with changelog-driven workflow.

The workflow follows TORQ's two-phase process:
1. **Planning Phase** (completed by `plan-ticket-implementation` skill): Creates OpenSpec planning artifacts
2. **Implementation Phase** (this skill): Guides implementation and creates implementation PR

## Task

End-to-end ticket implementation guidance:
- Fetch GitHub issue and approved planning PR details
- Read OpenSpec planning files from planning branch
- Display complete plan (proposal, design, tasks, specs)
- Guide developer through implementation work
- Track implementation progress in tasks.md
- Create implementation PR via changelog-driven workflow
- Ensure careful review before merging

## Instructions

### 1. Fetch Ticket and Planning Context

**Input Parameter:**
- `issue-number` - GitHub issue number (integer, e.g., `91`)
- Repository assumed: `torqlab/torq`

**Action:**
```
const issue = gh_get_issue(issueNumber)
```

**Extract and display:**
- Issue number and title
- Planning PR reference (linked PR from issue)
- Planning branch name (from PR)
- Ticket/change ID from branch (e.g., from `plan/91-*` extract `91`)

**Display format:**
```
📋 Implementation Session for Issue #[number]: [title]

Planning PR: #[pr_number]
Branch: plan/[number]-[short-title]
Change ID: [number]

Status: Planning approved and ready for implementation
```

### 2. Read OpenSpec Planning Files

**From planning branch, fetch these files (without checkout):**

Use git operations to read files directly:
```bash
git show plan/[number]-[title]:[filepath]
```

**Required files:**
- `openspec/changes/[change-id]/proposal.md` - Plan overview
- `openspec/changes/[change-id]/tasks.md` - Implementation tasks
- `openspec/changes/[change-id]/design.md` (optional) - Technical design

**Optional files (spec deltas):**
- `openspec/changes/[change-id]/specs/*/spec.md` - Requirement specs

**Store contents for display and parsing.**

### 3. Display Complete Implementation Plan

**Phase 3a: Display Proposal**

Read proposal.md and display:
```markdown
## 📋 Implementation Plan Overview

### Why
[From proposal.md "Why" section - problem/opportunity]

### What Changes
[From proposal.md "What Changes" section - requirements and approach]

### Impact
[From proposal.md "Impact" section - affected files and change type]
```

**Phase 3b: Display Design (if exists)**

If design.md exists, display:
```markdown
## 🏗️ Technical Design

### Goals
[From design.md "Goals" section]

### Key Decisions
[From design.md "Decisions" section - each decision with rationale]

### Architecture
[Summary of how components will change]
```

**Phase 3c: Display Tasks**

Read tasks.md and display implementation checklist:
```markdown
## ✅ Implementation Checklist

### Planning Phase (completed)
- [x] Reviewed requirements
- [x] Confirmed approach
- [x] Identified key changes

### Implementation Phase (in progress)
- [ ] 1.1 [First main task]
- [ ] 1.2 [Second main task]
- [ ] 1.3 [Third main task]

### Testing Phase (pending)
- [ ] 2.1 Write tests for [functionality]
- [ ] 2.2 Test [edge case or scenario]

### Documentation & Cleanup (pending)
- [ ] 3.1 Update relevant docs
- [ ] 3.2 Run lint and format checks
```

**Phase 3d: Display Spec Requirements**

If spec files exist, display:
```markdown
## 📋 Specification Requirements

### Capabilities to Implement
[From spec.md files - ADDED/MODIFIED/REMOVED sections]

### Acceptance Criteria
[From spec scenarios - WHEN/THEN format]

### Edge Cases & Constraints
[From spec - important considerations]
```

### 4. Prepare Implementation Setup

**Step 4a: Confirm Understanding**

Ask developer:
```
✅ Review Complete

Have you reviewed the complete plan above?
Are you ready to start implementation? (yes/no)
```

**Only continue if user confirms with "yes".**

**Step 4b: Prepare Implementation Context**

Verify current branch state:
- Get current git branch: `git branch --show-current`
- If NOT on planning branch, offer to checkout:
  ```
  Current branch: [current-branch]
  Planning branch: plan/[number]-[title]

  Would you like me to checkout the planning branch? (yes/no)
  ```
- If yes, checkout: `git checkout plan/[number]-[title]`

**Step 4c: Display Key Implementation Guidance**

From design.md or proposal.md, display:
```markdown
## 🚀 Implementation Guidance

### Files to Modify
[From proposal.md or design.md - list of files/components]

### Implementation Approach
[Key strategy from design or proposal]

### Key Decisions to Follow
[From design.md - important architectural decisions]

### Important Constraints
[Any breaking changes, dependencies, or critical considerations]
```

### 5. Guide Implementation Execution

**Step 5a: Present Task Phases**

Display implementation phases with clear acceptance criteria:

```markdown
## 📝 Implementation Work

### Phase 1: Core Implementation
Each task below represents work that should be completed:

- **1.1** [First core task]
  - Acceptance: [How to verify this is done]
  - Files affected: [Which files change]

- **1.2** [Second core task]
  - Acceptance: [How to verify]
  - Files affected: [Files]

### Phase 2: Testing & Validation
- **2.1** [Testing task with scenarios]
- **2.2** [Edge case testing]

### Phase 3: Documentation & Final Checks
- **3.1** [Update documentation files]
- **3.2** [Run linting, formatting, tests]
```

**Step 5b: Encourage Implementation Work**

Provide guidance:
```
Now begin implementation on the planning branch:
1. Make code changes per the tasks above
2. Follow TORQ code conventions (const-only, arrow functions, JSDoc)
3. Run tests as you complete each phase: bun run test
4. Run lint checks: bun run lint
5. Update tasks.md as you complete work (mark items [x])

You can commit your work as you go:
  git add [files]
  git commit -m "impl: [task description]"
  git push origin plan/[number]-[title]

When all tasks are complete and code is ready for review, proceed to Phase 6.
```

### 6. Prepare Implementation PR Creation

**Step 6a: Confirm Implementation Complete**

Before creating PR:

```
✅ Implementation Complete?

Have you:
- [ ] Completed all implementation tasks (marked [x] in tasks.md)?
- [ ] Run tests: bun run test (all passing)?
- [ ] Run lint: bun run lint (no errors)?
- [ ] Committed all work to planning branch?
- [ ] Pushed all commits to origin?

Ready to create implementation PR? (yes/no)
```

**Only continue if user confirms with "yes".**

**Step 6b: Verify Git State**

Check current state before changelog/PR creation:
```bash
git status
git log --oneline -5
git diff main...HEAD --stat
```

Display summary:
```
✅ Git State Verified

Branch: plan/[number]-[title]
Commits ahead of main: [n]
Files changed: [count] (+[additions] -[deletions])
All changes committed: Yes

Ready to proceed to PR creation.
```

### 7. Create Implementation PR (Changelog-Driven Workflow)

**CRITICAL: This must follow the two-step process in this exact order:**

**Step 7a: Generate Changelog Entry via `create-changelog` Skill**

Invoke the skill:
```
/create-changelog
```

This skill will:
1. Analyze git diff between planning branch and main
2. Categorize changes into Added/Changed/Fixed/Removed/Security
3. Generate changelog entry with ticket ID and implementation title
4. Update CHANGELOG.md with implementation changelog entry
5. Update package.json version according to SemVer
6. Commit changelog changes to planning branch
7. Return changelog entry details

**Verify changelog was created:**
```
✅ Changelog Entry Generated

Entry: [ID] Implementation: [Title]
Version: [new-version]
Entry added to: CHANGELOG.md
Committed to: plan/[number]-[title]
```

**Step 7b: Create Implementation PR via `open-pull-request` Skill**

After changelog is created and committed, invoke:
```
/open-pull-request
```

This skill will:
1. Read the newly created changelog entry from CHANGELOG.md
2. Extract ticket ID, title, and implementation description
3. Validate current branch contains ticket ID
4. Create PR with:
   - **Title**: `[ID] Implementation: [Title]` (from changelog)
   - **Body**: `# Changelog` header + implementation changelog entry content
   - **From**: plan/[number]-[title]
   - **To**: main
   - **Status**: Draft (for careful review)
5. Return PR number and URL

**Verify PR was created:**
```
✅ Implementation PR Created

PR URL: https://github.com/torqlab/torq/pull/[number]
PR Number: #[number]
Title: [ID] Implementation: [Title]
Branch: plan/[number]-[title] → main
Status: Draft
```

### 8. Final Summary and Review Guidance

**Display completion summary:**

```
✅ Implementation Complete!

Issue: #[issue-number] - [title]

Implementation PR: #[pr-number]
PR URL: https://github.com/torqlab/torq/pull/[pr-number]
Branch: plan/[number]-[title]

Implementation Details:
- Commits: [n] new commits
- Files changed: [count]
- Additions: [+n] lines
- Deletions: [-n] lines

Related Links:
- Original Issue: https://github.com/torqlab/torq/issues/[number]
- Planning PR: #[planning-pr-number]
- Implementation PR: #[pr-number]

Next Steps for Review:
1. 📖 Review the implementation PR (#[pr-number])
2. 🔍 Check code changes match plan (proposal.md, tasks.md)
3. ✅ Verify all tasks marked complete in tasks.md
4. 💬 Request changes if needed or approve
5. 🚀 Merge implementation PR when approved
6. 📋 Archive the change via OpenSpec workflow (optional)

⚠️  IMPORTANT REVIEW REMINDERS:
- This PR was created via automated workflow - review carefully
- Ensure code follows TORQ conventions (const-only, arrow functions, JSDoc)
- Verify tests are passing and coverage is adequate
- Check changelog entry accurately describes implementation changes
- Confirm no unintended side effects or breaking changes

NEXT: Merge PR when approved by team.
```

## User Interaction Flow

### Full Workflow Example (Issue #91 - Implementation Phase)

**Assumes planning phase is complete and approved:**

```
User: /implement-ticket 91

1. Skill fetches issue #91 and linked planning PR
   Displays: issue, planning PR number, planning branch

2. Skill reads OpenSpec files from planning branch:
   ✅ proposal.md (Why, What Changes, Impact)
   ✅ tasks.md (Implementation checklist)
   ✅ design.md (Technical design decisions)
   ✅ spec files (Requirements and acceptance criteria)

3. Skill displays complete plan:
   - Overview from proposal
   - Design decisions (if exists)
   - Full implementation tasks
   - Acceptance criteria from specs

4. Skill asks: "Ready to start implementation?"
   User: yes

5. Skill offers to checkout planning branch (if needed)
   Skill displays implementation guidance and key decisions

6. Skill guides implementation:
   "Begin implementation on planning branch:
   - Make code changes per tasks
   - Run: bun run test, bun run lint
   - Update tasks.md as you complete work
   - Commit and push regularly"

7. Developer implements changes:
   - Completes Phase 1: Core implementation
   - Completes Phase 2: Testing
   - Completes Phase 3: Documentation
   - All tasks marked [x] in tasks.md
   - All code committed and pushed

8. Skill asks: "Implementation complete?"
   User: yes

9. Skill creates implementation PR (2-step process):

   STEP 1: Invoke /create-changelog skill
   ✅ Analyzes git diff (planning branch vs main)
   ✅ Generates implementation changelog entry
   ✅ Updates CHANGELOG.md
   ✅ Updates package.json version
   ✅ Commits changelog changes

   STEP 2: Invoke /open-pull-request skill
   ✅ Reads new changelog entry
   ✅ Creates PR from changelog
   ✅ PR Title: [91] Implementation: Add Home Background Images
   ✅ PR Body: # Changelog header + implementation entry
   ✅ PR in draft mode

10. Skill returns completion summary:
    ✅ Implementation Complete!
    PR: #456 (Implementation)

    Review checklist:
    - Review code changes in PR
    - Check tasks.md completeness
    - Verify test coverage
    - Approve and merge when ready

    User proceeds to review and merge PR.
```

## Integration Points

### Skills Used (in order of invocation)

1. **`create-changelog` Skill** (invoked when implementation complete)
   - Analyzes git diff between planning branch and main
   - Identifies implementation changes (code additions/modifications)
   - Generates changelog entry with ticket ID and title
   - Updates CHANGELOG.md with implementation details
   - Updates version in package.json according to SemVer
   - Commits changelog changes back to planning branch
   - Returns changelog entry for PR creation

2. **`open-pull-request` Skill** (invoked after changelog created)
   - Reads newly updated CHANGELOG.md
   - Extracts implementation changelog entry
   - Validates current branch contains ticket ID
   - Creates PR with changelog-driven format:
     - Title: `[ID] Implementation: [Title]` (from changelog)
     - Body: `# Changelog` header + full changelog entry
     - Draft mode for careful review
   - Returns PR metadata (number, URL, status)

### GitHub MCP Tools Used

The skill orchestrates existing skills which use:
- `gh_get_issue(number)` - Fetch issue details and linked PR reference
- `gh_create_pull_request(title, body, head, base, draft)` - Create implementation PR

### Project Conventions Applied

- **Branch naming**: Uses existing `plan/<id>-<kebab-case-title>` branch
- **Directory structure**: Reads from `openspec/changes/<change-id>/`
- **File naming**: Follows OpenSpec naming (proposal.md, tasks.md, design.md, specs/)
- **Code style**: Guides implementation using TORQ conventions (const-only, arrow functions, JSDoc)
- **Git commits**: Encourages descriptive implementation commits
- **Changelog format**: Uses "Keep a Changelog" standard with ticket ID

## Error Handling

### Issue Not Found (404)
- Verify issue number is correct
- Confirm issue exists in torqlab/torq
- Ask user to provide correct issue number

### Planning PR Not Found
- Check that planning PR exists (linked to issue)
- Verify issue was processed by `plan-ticket-implementation` skill
- Suggest running plan skill first if needed

### Planning Files Not Found
- Verify files exist on planning branch
- Check OpenSpec directory structure: `openspec/changes/[id]/`
- Suggest manual file creation if necessary

### Current Branch Mismatch
- Current branch is not the planning branch
- Offer to checkout planning branch
- User can manually switch: `git checkout plan/[id]-[title]`

### Uncommitted Changes
- Verify all implementation changes are committed
- Ask user to commit and push before proceeding
- Do not proceed with PR creation if uncommitted changes exist

### Changelog Generation Failed
- Check that git diff shows actual changes
- Verify create-changelog skill executed successfully
- Suggest manual changelog creation as fallback
- Cannot proceed to PR creation without changelog

### PR Creation Failed
- Common: branch conflicts, insufficient permissions
- Check GITHUB_MCP_TOKEN has pull_requests:write scope
- Verify planning branch is pushed to remote
- Suggest resolving issues before retry

## Success Criteria

The skill successfully completes when:
- ✅ Issue number provided and issue details fetched
- ✅ Planning PR found and linked to issue
- ✅ OpenSpec files read from planning branch (no checkout)
- ✅ Complete plan displayed to developer:
  - ✅ Proposal (Why, What Changes, Impact)
  - ✅ Design decisions (if exists)
  - ✅ Full task checklist with phases
  - ✅ Specification requirements and acceptance criteria
- ✅ Developer confirms understanding of plan
- ✅ Planning branch checked out (or already on it)
- ✅ Implementation guidance displayed
- ✅ Developer completes implementation work:
  - ✅ Code changes made per plan
  - ✅ All tasks marked complete in tasks.md
  - ✅ Tests passing and lint checks passing
  - ✅ All commits pushed to remote
- ✅ **Before PR creation**: `create-changelog` skill invoked
  - ✅ Git diff analyzed (planning branch vs main)
  - ✅ Changelog entry generated
  - ✅ CHANGELOG.md updated
  - ✅ package.json version updated
  - ✅ Changes committed to planning branch
- ✅ **After changelog**: `open-pull-request` skill invoked
  - ✅ Changelog entry read from CHANGELOG.md
  - ✅ PR created with "# Changelog" header format
  - ✅ PR in draft mode
  - ✅ PR links back to issue and planning PR
- ✅ Implementation PR number and URL returned to user
- ✅ Final summary and review guidance provided
- ✅ User directed to review PR before merging

If any step fails, the skill reports the specific error and suggests resolution.

## Rate Limiting & Performance

- GitHub MCP API calls: ~2-3 (fetch issue, create PR)
- Rate limit: 5,000 requests/hour (authenticated)
- Typical execution time: 10-15 seconds for display, 30-60 seconds including skill invocations
- If rate limited, wait 1 hour before retry

## Next Actions After Implementation PR

After this skill completes and returns implementation PR:

1. **Team Reviews Implementation**: Check PR #[number] for code quality, test coverage, changelog accuracy
2. **Request Changes if Needed**: Developers update code on planning branch and push
3. **Verify Tests and Quality**:
   - All tests passing
   - Lint checks passing
   - Code style follows TORQ conventions
   - No breaking changes unless documented
4. **Changelog Review**: Verify implementation changelog entry accurately describes changes
5. **Approve PR**: Merge implementation PR to main when approved
6. **Archive Change** (Optional): After PR merges, archive via OpenSpec workflow:
   - Move from `openspec/changes/[id]/` to `openspec/archives/[id]/`
   - Document completion in issue

### Key Workflow Points

**Planning Phase → Implementation Phase Transition:**
1. ✅ Planning PR merged to main (plan approved)
2. ✅ Planning branch stays alive for implementation
3. ✅ Developer checks out planning branch
4. ✅ Implements changes on same branch where plan was created
5. ✅ Updates tasks.md to track progress

**Implementation → Review → Merge:**
1. ✅ Implementation complete (all tasks marked [x])
2. ✅ Tests passing, lint passing, code ready
3. ✅ Implementation PR created via changelog-driven workflow
4. ✅ PR reviewed carefully by team
5. ✅ PR merged to main
6. ✅ Feature deployed via CI/CD

## Related Skills & Patterns

**Coordinated Skills (invoked by this skill):**
1. `create-changelog` — Generates implementation changelog entry from git diff
   - Analyzes changes between planning branch and main
   - Produces standardized changelog entry format
   - Updates CHANGELOG.md and package.json version
   - Commits changes back to branch

2. `open-pull-request` — Creates PR from changelog entry
   - Reads CHANGELOG.md for implementation details
   - Validates branch matches ticket ID
   - Creates PR with "# Changelog" header format
   - Ensures all PRs follow same structure

**Complements:**
- `plan-ticket-implementation` — Precursor skill that creates the plan this skill implements
- `review-code` — Can review implementation PR before merging
- `spec` — Guides spec/proposal creation (earlier phase in planning)

**Key Pattern (Changelog-Driven PR Creation):**
- Generate changelog FIRST (from git diff of implementation changes)
- Create PR SECOND (from changelog entry)
- This ensures PR title and body always match what was actually changed
- Single source of truth: CHANGELOG.md
- Changelog used by both planning and implementation phases

## Usage Examples

### Standard Implementation Session

```
/implement-ticket 91

(User reviews plan)
→ Ready to start implementation? yes
(User implements on planning branch)
→ Implementation complete? yes
→ /create-changelog (invoked automatically)
→ /open-pull-request (invoked automatically)
→ Returns PR #456 with implementation
```

### With Planning Branch Checkout

```
/implement-ticket 91

(Skill offers to checkout plan branch)
→ Checkout planning branch? yes
→ git checkout plan/91-home-background-images
(Display plan)
→ Ready to start? yes
(User implements)
→ Complete? yes
→ Creates PR
```

## Important Notes

- **Two-Phase Workflow**: This skill assumes planning phase is complete and approved (planning PR merged)
- **Planning Branch Reuse**: Implementation happens on same `plan/[id]-*` branch where plan was created
- **Changelog-Driven PRs**: All PRs created via changelog entry - ensures consistency
- **Tasks Tracking**: Developer marks tasks complete in tasks.md as they finish implementation
- **Final Review Required**: Implementation PRs always created in draft mode - requires careful human review before merging
- **Permissions**: Requires GitHub token with `issues:read`, `pull_requests:read`, `pull_requests:write` scopes

## Success Verification

Developer successfully used this skill when:
- ✅ They understood the complete implementation plan
- ✅ They completed all implementation tasks per the plan
- ✅ Code follows TORQ conventions and passes tests
- ✅ Implementation PR created with proper changelog entry
- ✅ Team reviewed and approved the implementation
- ✅ Implementation PR merged to main
- ✅ Feature deployed via CI/CD
