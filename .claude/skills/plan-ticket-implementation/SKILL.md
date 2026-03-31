---
id: plan-ticket-implementation
description: Orchestrates the complete ticket planning workflow from GitHub issue to pull request. Takes an issue number and automates the planning process including branch creation, changelog generation, and PR opening.
argument-hint: "issue-number"
---

# Plan Ticket Implementation Skill

## Context

You are a TORQ workflow automation specialist. This skill orchestrates the complete ticket-to-PR workflow, automating the planning phase of the OpenSpec process. It combines issue analysis, team collaboration, changelog generation, and PR creation into a single cohesive workflow that ensures consistency with TORQ conventions.

The workflow follows TORQ's OpenSpec process: planning → implementation → deployment → archival.

## Task

End-to-end ticket planning automation:
- Fetch GitHub issue details
- Collaborate with user to plan implementation
- Create a planning branch (`plan/<id>-<title>`)
- Auto-generate changelog entry
- Create pull request with changelog
- Post plan summary to GitHub issue
- Guide user to next steps

## Instructions

### 1. Fetch Ticket Information

**Input Parameter:**
- `issue-number` - GitHub issue number (integer, e.g., `91`)
- Repository assumed: `torqlab/torq`

**Action:**
```
const issue = gh_get_issue(issueNumber)
```

Extract and display:
- Issue title
- Issue description/body
- Issue labels (e.g., "enhancement", "bug", "documentation")
- Issue author
- Current status (open/closed)

**Display format:**
```
📋 Issue #[number]: [title]
Author: @[author]
Status: [Open|Closed]
Labels: [label1, label2, ...]

Description:
[First 300 chars of body...]

---
```

### 2. Present OpenSpec Planning Guidance

Guide user through planning with structured prompts:

**Step 2a: Review Existing Work**
- Link to `/openspec/AGENTS.md` planning phase section
- Mention: "Check the planning checklist in AGENTS.md"
- Show relevant quotes from AGENTS.md planning guidance

**Step 2b: Planning Prompts**

Ask user to consider/confirm these aspects:

1. **Requirements**
   - "What are the main requirements for this ticket?"
   - "Are there any acceptance criteria or user stories?"
   - "What is the primary goal or user benefit?"

2. **Change Type** (determine from labels)
   - If label contains "enhancement" → Added
   - If label contains "bug" → Fixed
   - If label contains "docs" → Changed
   - Ask user to confirm or override

3. **Implementation Approach**
   - "What is your proposed implementation approach?"
   - "What files or components will change?"
   - "Are there any architectural considerations?"

4. **Dependencies**
   - "Does this depend on other tickets or features?"
   - "Are there any blockers or prerequisites?"

5. **Testing Strategy**
   - "How will this be tested?"
   - "What are the test scenarios?"

**Display as interactive prompts, capture user responses.**

### 3. Get User Confirmation

**Before proceeding with branch/PR creation:**

Present a plan summary:
```
✅ Plan Summary

Issue: #[number] - [title]

Requirements:
[User's stated requirements]

Approach:
[User's proposed approach]

Implementation:
[Files/components to change]

Test Plan:
[Testing strategy]

Change Type: [Added|Fixed|Changed|Removed]

---

Ready to proceed? Create branch and PR? (yes/no)
```

**Only continue if user confirms with "yes".**

### 4. Create Planning Branch

**Extract short title from issue:**
- Use first 3-4 words of issue title
- Convert to kebab-case (lowercase, hyphens)
- Example: "Add home background images" → "home-background-images"

**Create branch:**
```bash
branch_name = "plan/[issue_number]-[short_title]"
Example: plan/91-home-background-images

git checkout main
git pull origin main
git checkout -b [branch_name]
```

**Confirm:**
```
✅ Branch created: plan/[branch_name]
```

### 5. Create Implementation Plan Files

Create the OpenSpec planning structure with user-confirmed content:

**5a. Create proposal.md**

Location: `openspec/changes/[change-id]/proposal.md`

Extract from user's planning responses:
```markdown
# Change: [Issue Title]

## Why
[User's stated problem/opportunity - 1-2 sentences]

## What Changes
- [User's requirements - bullet list]
- [User's implementation approach - bullet list]

## Impact
- Affected files/components: [User's identified files]
- Change type: [Added|Fixed|Changed|Removed]
```

**5b. Create tasks.md**

Location: `openspec/changes/[change-id]/tasks.md`

```markdown
## Implementation Checklist

### Planning
- [x] Reviewed requirements
- [x] Confirmed approach
- [x] Identified key changes

### Implementation
- [ ] 1.1 [First main task from user's approach]
- [ ] 1.2 [Second main task]
- [ ] 1.3 [Third main task - break down user's approach into concrete steps]

### Testing
- [ ] 2.1 Write tests for [main functionality]
- [ ] 2.2 Test [edge case or scenario]

### Documentation & Cleanup
- [ ] 3.1 Update relevant docs
- [ ] 3.2 Run lint and format checks
```

**5c. Create spec deltas (if applicable)**

Location: `openspec/changes/[change-id]/specs/[capability]/spec.md`

```markdown
## ADDED Requirements

### Requirement: [Main feature from user's approach]
[User's description of what this provides]

#### Scenario: [Success case from user's plan]
- **WHEN** [User's scenario trigger]
- **THEN** [Expected result]
```

**5d. Optional: Create design.md (if complexity warrants)**

Location: `openspec/changes/[change-id]/design.md`

Only create if user's approach mentions:
- Multiple files/components changing
- Architectural decisions
- New dependencies
- Performance considerations
- Security implications

```markdown
## Context
[User's stated constraints/considerations]

## Goals
- [User-stated goal 1]
- [User-stated goal 2]

## Decisions
- **Decision**: [Technical choice from user's approach]
- **Rationale**: [Why this approach]
- **Alternatives**: [Other approaches considered]

## Risks
- [Potential risk] → Mitigation: [How to handle]
```

### 6. Commit Plan Files to Branch

**Execute Git commands:**

```bash
git add openspec/changes/[change-id]/
git commit -m "plan: Add implementation plan for issue #[number]

Planning details:
- Requirements: [Summary]
- Approach: [Summary]
- Key changes: [Files/components]

Co-Authored-By: User <user@example.com>"

git push -u origin plan/[issue_number]-[short_title]
```

**Confirm:**
```
✅ Plan files committed to plan/[branch_name]
✅ Pushed to origin
```

### 7. Generate Changelog Entry

**Invoke the `create-changelog` skill to generate a changelog entry:**

```
/create-changelog
```

This skill will:
1. Analyze git diff between current branch and main
2. Extract ticket ID from branch name
3. Generate changelog entry following "Keep a Changelog" standard
4. Write entry to CHANGELOG.md
5. Return changelog entry details

**Expected result:**
- CHANGELOG.md updated with new entry
- Changelog entry contains: ticket ID, title, Added/Changed/Fixed/Removed/Security sections
- Format: `### [ID Title](issue-link)` with proper categories

### 8. Create PR via changelog-driven workflow

**Invoke the `open-pull-request` skill to create the PR:**

```
/open-pull-request
```

This skill will:
1. Read the latest changelog entry from CHANGELOG.md
2. Extract ticket ID, title, and description
3. Validate current branch contains ticket ID (should be: `plan/[id]-[short-title]`)
4. Create PR with:
   - **Title**: `[ID] Title` (from changelog)
   - **Body**: `# Changelog` header + changelog entry content
   - **From**: plan/[issue_number]-[short_title]
   - **To**: main
   - **Status**: Draft (for careful review)

**Capture returned PR number and URL.**

This approach ensures:
- All PRs are created consistently using changelog entries
- PR title and body always match the changelog
- Reuses existing PR creation logic
- Follows TORQ conventions

### 9. Post Plan to GitHub Issue

**Create comprehensive issue comment:**

Post a comment on the original issue summarizing the plan:

```markdown
## 📋 Implementation Plan Created

This PR (#[pr_number]) establishes the implementation plan for this issue.

### Plan Summary

**Requirements:**
[From proposal.md - requirements summary]

**Implementation Approach:**
[From proposal.md - approach and strategy]

**Key Changes:**
[Files and components that will change]

**Implementation Tasks:**
[List of main tasks from tasks.md]

---

### Development Process

1. ✅ Plan approved (this comment)
2. 📌 Review branch: `plan/[number]-[short-title]`
3. 🔄 Review PR: #[pr_number]
4. ✅ Merge when plan is approved
5. 🚀 Begin implementation on the same branch
6. 📝 Update tasks.md as work progresses
7. ✅ Complete all tasks
8. 📋 Create implementation PR with actual code

### Links

- **Issue**: #[number]
- **Plan PR**: #[pr_number]
- **Branch**: `plan/[number]-[short-title]`

---

**Note**: This plan was auto-generated by the OpenSpec planning workflow. Review, adjust, and approve the approach before starting implementation.
```

**Use GitHub MCP to create comment on issue.**

If comment creation fails, report the error but don't block - user can view plan via PR instead.

### 10. Provide Summary to User

**Return completion summary:**

```
✅ Ticket Planning Complete!

Issue: #[number] - [title]

Planning Summary:
- Requirements: [brief summary from proposal.md]
- Approach: [brief summary from proposal.md]
- Branch: plan/[number]-[short-title]
- PR: #[pr_number]
- Plan posted to: https://github.com/torqlab/torq/issues/[number]

Next Steps:
1. 📖 Review the plan in PR #[pr_number]
2. 💬 Add feedback or request changes
3. ✅ Approve and merge the plan PR to main
4. 🚀 Create new implementation branch from main: feat/[number]-[short-title]
5. 📝 Implement changes per tasks.md checklist
6. ✅ Mark all tasks complete when done
7. 📋 Create implementation PR with actual code changes

Links:
- Issue: https://github.com/torqlab/torq/issues/[number]
- Plan PR: https://github.com/torqlab/torq/pull/[pr_number]
- Plan Branch: plan/[number]-[short-title]
```

## User Interaction Flow

### Full Workflow Example (Issue #91)

```
User: /plan-ticket-implementation 91

1. Skill fetches issue #91: "Add home background images"
   Displays: issue title, description, labels

2. Skill presents planning prompts:
   "What are the main requirements?"
   "What's your implementation approach?"
   "Which files will change?"
   "How will you test this?"

   User responds to each prompt

3. Skill shows plan summary:
   ✅ Plan Summary
   Issue: #91 - Add home background images
   Requirements: ...
   Approach: ...
   Ready to proceed? (yes/no)

   User: yes

4. Skill creates branch: plan/91-home-background-images
   ✅ Branch created and checked out

5. Skill creates OpenSpec planning files:
   ✅ Created proposal.md with plan details
   ✅ Created tasks.md with implementation checklist
   ✅ Created spec deltas (if applicable)
   ✅ Created design.md (if complexity warrants)

6. Skill commits plan files:
   ✅ Committed to plan/91-home-background-images
   ✅ Pushed to origin

7. Skill invokes create-changelog skill:
   /create-changelog
   ✅ Changelog entry generated
   ✅ CHANGELOG.md updated with planning details
   ✅ package.json version updated

8. Skill invokes open-pull-request skill:
   /open-pull-request
   ✅ PR #123 created from changelog entry

   PR Title: [#91] Add home background images support
   PR Body: # Changelog header + changelog entry

9. Skill posts plan to issue comment:
   ✅ Plan posted to issue #91

10. Skill returns summary:
    ✅ Ticket Planning Complete!

   Issue: #91 - Add home background images
   Branch: plan/91-home-background-images
   PR: #123

   Next steps:
   - Review plan PR
   - Approve and merge
   - Begin implementation on same branch
   - Update tasks.md as work progresses
   - Create implementation PR with actual code
```

## Integration Points

### Skills Used

1. **`create-changelog` Skill**
   - Generates changelog entry from git diff between plan branch and main
   - Analyzes changes to identify Added/Changed/Fixed/Removed/Security categories
   - Creates standardized changelog entry with ticket ID and title
   - Updates CHANGELOG.md in repository root
   - Updates version in package.json

2. **`open-pull-request` Skill**
   - Reads latest changelog entry from CHANGELOG.md
   - Extracts ticket ID, title, and description
   - Validates current branch matches ticket ID pattern
   - Creates PR with changelog-driven title and body
   - Adds "# Changelog" header to PR body
   - Creates PR in draft mode
   - Returns PR number and URL

### GitHub MCP Tools Used (via `open-pull-request` skill)

The `open-pull-request` skill uses:
- `gh_create_pull_request(title, body, head, base, draft)` - Creates PR with changelog entry

### Issue Comment Creation

After PR is created, skill posts plan summary to GitHub issue:
- Uses GitHub API via existing tools
- Posts comprehensive summary of planning approach
- Links to plan PR and branch
- Includes next steps for implementation

### Skills Coordinated

The skill coordinates with existing TORQ skills for consistency:
- **`create-changelog`** - Generates changelog entry from git diff
  - Analyzes changes between branch and main
  - Produces standardized changelog entry format
  - Updates CHANGELOG.md and package.json version
- **`open-pull-request`** - Creates PR from changelog entry
  - Reads CHANGELOG.md for title and description
  - Validates branch matches ticket ID
  - Creates PR with "# Changelog" header format
  - Ensures all PRs follow same structure

This orchestration ensures:
- All PRs are created consistently
- Changelog always matches PR content
- PR creation logic is reused and maintained in one place
- Clear separation of concerns between planning and PR creation

### Project Conventions Applied

- **Branch naming**: `plan/<id>-<kebab-case-title>`
- **Directory structure**: `openspec/changes/<change-id>/`
- **Plan files**: proposal.md, tasks.md, spec deltas, optional design.md
- **Code style**: Arrow functions, const-only, JSDoc
- **Git commits**: Descriptive messages with planning details

## Error Handling

### Issue Not Found (404)
- Verify issue number is correct
- Confirm issue exists in torqlab/torq
- Ask user to provide correct issue number

### Issue Fetch Failed (Permission/Auth)
- Check GITHUB_MCP_TOKEN in .env
- Verify token has "issues:read" permission
- Suggest token regeneration if needed

### Branch Creation Failed
- Check main branch is up to date
- Verify branch name is valid
- Suggest manual branch creation as fallback

### Plan File Creation Failed
- Verify OpenSpec directory structure exists
- Check write permissions to openspec/changes/
- Suggest manual file creation as fallback

### Git Commit Failed
- Ensure git is configured (user.name, user.email)
- Check branch is on correct remote
- Suggest manual commit as fallback

### PR Creation Failed
- Common: branch conflicts, insufficient permissions
- Check GITHUB_MCP_TOKEN has pull_requests:write scope
- Verify branch is pushed to remote
- Suggest resolving issues before retry

### Issue Comment Failed
- Non-blocking error
- User can view plan in PR instead
- Report and continue

## Success Criteria

The skill successfully completes when:
- ✅ Issue details fetched from GitHub
- ✅ User confirms planning approach
- ✅ Branch created and checked out
- ✅ Plan files created (proposal.md, tasks.md, spec deltas)
- ✅ All files committed to branch
- ✅ Branch pushed to remote
- ✅ `create-changelog` skill invoked and changelog entry generated
- ✅ CHANGELOG.md updated with new entry
- ✅ `open-pull-request` skill invoked and PR created
- ✅ PR created in draft mode with "# Changelog" header
- ✅ Plan posted to GitHub issue (or skipped if failed)
- ✅ Summary provided to user

If any step fails, the skill reports the specific error and suggests resolution.

## Rate Limiting & Performance

- GitHub MCP API calls: ~3-4 per execution
- Rate limit: 5,000 requests/hour (authenticated)
- Typical execution time: 30-60 seconds
- If rate limited, wait 1 hour before retry

## Next Actions After Planning

After this skill completes:

1. **User reviews plan**: Check PR #[number] for approach, tasks, and spec details
2. **Team provides feedback**: Comments on PR, requests changes if needed
3. **Update plan if needed**: User can modify proposal.md, tasks.md, or design.md on the branch
4. **Merge plan branch**: Merge plan/[issue-number]-[title] to main when approved
5. **Create implementation branch**: Create new branch `feat/[issue-number]-[title]` from main
6. **Begin implementation**: Start work using approved plan as guide
7. **Update tasks.md**: Check off tasks in tasks.md as they're completed during implementation
8. **Create implementation PR**: When ready with code changes, create separate PR with actual code and CHANGELOG.md
9. **Archive change**: After implementation PR merges, archive via OpenSpec workflow

### Two-Step Process: Planning PR Creation

This skill creates the **planning PR** through a two-step process:

1. **Generate Changelog** (`create-changelog` skill):
   - Analyzes plan files (proposal.md, tasks.md, spec deltas) committed to branch
   - Generates standardized changelog entry
   - Updates CHANGELOG.md with ticket ID and planning details

2. **Create PR** (`open-pull-request` skill):
   - Reads changelog entry from CHANGELOG.md
   - Creates PR with changelog-driven title and body
   - PR title: `[ID] Title` (from changelog)
   - PR body: `# Changelog` header + changelog content
   - Creates PR in draft mode for review

This ensures:
- All PRs follow consistent structure (changelog-driven)
- PR content always matches changelog
- Planning approach is clearly documented
- Code is reused via existing skills
