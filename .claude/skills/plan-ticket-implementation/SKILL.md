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
git push -u origin [branch_name]
```

**Confirm:**
```
✅ Branch created: plan/[branch_name]
   Pushed to: origin/plan/[branch_name]
```

### 5. Generate Changelog Entry

**Analyze issue context:**
- Extract issue title
- Use issue description and labels
- Apply change type determination (Added/Fixed/Changed)
- Format per Keep a Changelog standard

**Invoke `create-changelog` skill with context:**

The changelog skill should auto-generate an entry. You may need to:
1. Extract/summarize key information from the issue
2. Provide suggested change type to the skill
3. Capture the generated changelog entry

**Expected output format:**
```
### [91 Add Home Background Images Support](https://github.com/torqlab/torq/issues/91)

### Added
- Home background image upload and configuration
- Image preview in dashboard settings
- Support for multiple image formats (JPG, PNG, WebP)

### Changed
- Dashboard settings UI to include background image options
```

### 6. Create PR Using `open-pull-request` Skill

**Prepare PR parameters:**

```
title: From changelog entry (e.g., "Add home background images support")
body: "# Changelog\n\n" + [changelog entry]
owner: "torqlab"
repo: "torq"
head: plan/[issue_number]-[short_title]
base: "main"
```

**Invoke:**
```
/open-pull-request \
  --title="[Changelog title]" \
  --body="# Changelog\n\n[changelog entry]" \
  --owner="torqlab" \
  --repo="torq" \
  --head="plan/[branch_name]" \
  --base="main"
```

**Capture returned PR number and URL.**

### 7. Post Plan to GitHub Issue

**Create comprehensive issue comment:**

Post a comment on the original issue with full plan details:

```markdown
## 📋 Implementation Plan

This plan establishes the approach for implementing issue #[number].

### Requirements
[User-confirmed requirements from planning step]

### Implementation Approach
[User-confirmed approach and strategy]

### Key Changes
[Files and components that will change]

### Test Plan
[Testing strategy and scenarios]

---

### Development Branch
- **Branch**: `plan/[number]-[short-title]`
- **PR**: #[pr_number] - [PR Title]

### Changelog
```
[Full changelog entry]
```

### Next Steps
1. ✅ Plan approved (this comment)
2. 📌 Implementation branch ready: `plan/[number]-[short-title]`
3. 🔄 Review the plan PR: #[pr_number]
4. ✅ Merge when approved
5. 🚀 Start implementation on the branch

---

**Note**: This plan was auto-generated by the OpenSpec planning workflow. Review, adjust, and approve before starting implementation.
```

**Use GitHub MCP to create comment on issue.**

If comment creation fails, report the error but don't block - user can view plan via PR instead.

### 8. Provide Summary to User

**Return completion summary:**

```
✅ Ticket Planning Complete!

Issue: #[number] - [title]

Planning Summary:
- Requirements: [brief summary]
- Approach: [brief summary]
- Branch: plan/[number]-[short-title]
- PR: #[pr_number]
- Plan posted to: https://github.com/torqlab/torq/issues/[number]#comment-[comment_id]

Next Steps:
1. Review the plan in PR #[pr_number]
2. Make any adjustments to the approach
3. Merge the plan branch when ready
4. Start implementation using the approved plan

Links:
- Issue: https://github.com/torqlab/torq/issues/[number]
- Plan PR: https://github.com/torqlab/torq/pull/[pr_number]
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
   ✅ Branch created

5. Skill generates changelog entry:
   ✅ Changelog entry generated

6. Skill creates PR:
   ✅ PR #123 created

7. Skill posts plan to issue:
   ✅ Plan posted to issue #91

8. Skill returns summary:
   ✅ Ticket Planning Complete!
   Issue: #91 - Add home background images
   Branch: plan/91-home-background-images
   PR: #123
   Next steps: Review → Merge → Implement
```

## Integration Points

### GitHub MCP Tools Used

1. **`gh_get_issue(number)`**
   - Fetch issue details by number
   - Assumes torqlab/torq repository
   - Returns: title, body, labels, author, state

2. **`gh_create_pull_request(title, body, head, base)`**
   - Create PR from branch
   - Used via `open-pull-request` skill
   - Returns: PR number, URL, state

3. **Issue Comment Creation**
   - Post plan summary as comment
   - Verify availability in GITHUB_MCP_SETUP.md

### Skills Coordinated

1. **`create-changelog` Skill**
   - Called to auto-generate changelog entry
   - Receives: issue context, change type suggestion
   - Returns: formatted changelog entry

2. **`open-pull-request` Skill**
   - Called to create PR with changelog
   - Receives: PR parameters (title, body, branches)
   - Returns: PR URL and number

3. **`spec` Skill (referenced)**
   - Planning guidance documented in OpenSpec
   - Link to: `/openspec/AGENTS.md`
   - Used for planning phase recommendations

### Project Conventions Applied

- **Branch naming**: `plan/<id>-<kebab-case-title>`
- **Changelog format**: Keep a Changelog standard
- **PR body format**: `# Changelog\n\n[entry]`
- **Code style**: Arrow functions, const-only, JSDoc
- **No nested functions**: Top-level functions only

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

### Changelog Generation Failed
- Check `create-changelog` skill is available
- Verify changelog skill parameters
- Suggest manual changelog entry as fallback

### PR Creation Failed
- See error handling in `open-pull-request` skill
- Common: branch conflicts, insufficient permissions
- Suggest resolving issues before retry

### Issue Comment Failed
- Non-blocking error
- User can view plan in PR instead
- Report and continue

## Important Notes

### Branch Naming Convention
- Format: `plan/<issue-number>-<short-description>`
- Example: `plan/91-home-background-images`
- Short description: 3-4 words, kebab-case, from issue title

### Changelog Integration
- Automatically formats per Keep a Changelog standard
- Includes issue link: `[Issue #number](https://github.com/torqlab/torq/issues/[number])`
- Categorized by change type: Added, Fixed, Changed, etc.
- Invokes `create-changelog` skill for consistency

### PR Body Format
```markdown
# Changelog

### [Issue ID: Title](issue-link)

### Added/Fixed/Changed/Removed
- Item 1
- Item 2
```

### OpenSpec Alignment
- Follows planning phase from AGENTS.md
- Creates branch for plan proposal
- Generates proposal via PR for review
- Posts plan to issue for visibility
- Prepares for implementation phase

### Repository Assumptions
- Organization: `torqlab`
- Repository: `torq`
- Main branch: `main`
- GitHub MCP configured with valid token

## Success Criteria

The skill successfully completes when:
- ✅ Issue details fetched from GitHub
- ✅ User confirms planning approach
- ✅ Branch created and pushed to remote
- ✅ Changelog entry generated
- ✅ PR created with changelog content
- ✅ Plan posted to GitHub issue
- ✅ Summary provided to user

If any step fails, the skill reports the specific error and suggests resolution.

## Rate Limiting & Performance

- GitHub MCP API calls: ~5-6 per execution
- Rate limit: 5,000 requests/hour (authenticated)
- Typical execution time: 30-60 seconds
- If rate limited, wait 1 hour before retry

## Next Actions After Planning

After this skill completes:
1. **User reviews plan**: Check PR #[number] for approach and changelog
2. **Team approves**: Get feedback and approval on implementation strategy
3. **Merge plan branch**: Merge plan/[issue-number]-[title] to main
4. **Start implementation**: Begin work with approved plan in place
5. **Create implementation branch**: Use `impl/[issue-number]-[title]` for actual changes
6. **Track progress**: Update tasks.md as work progresses
7. **Archive change**: After PR merge, archive via OpenSpec workflow
