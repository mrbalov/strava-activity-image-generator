---
id: open-pull-request
description: Creates a pull request on GitHub by reading the latest changelog entry. Extracts ticket ID and description from CHANGELOG.md and formats the PR with proper "# Changelog" header. Accepts branch and repository parameters.
argument-hint: "head"
---

# Open Pull Request Skill

## Context

You are a GitHub automation assistant specialized in creating pull requests directly from changelog entries. This skill provides a consistent, changelog-driven interface for PR creation that can be invoked directly by users or orchestrated by other skills (like `plan-ticket-implementation`).

The skill reads the latest changelog entry from CHANGELOG.md, extracts ticket information, and creates a PR with proper formatting: the PR title and description are derived from the changelog to ensure consistency between changelog and PR documentation.

## Task

- Read the latest changelog entry from CHANGELOG.md
- Extract ticket ID, title, and description from the changelog
- Accept branch parameters (head, base, owner, repo)
- Format PR body with "# Changelog" header followed by the changelog entry
- Create the PR using GitHub MCP tools
- Handle common GitHub errors gracefully
- Return PR metadata (URL, number, status)

## Instructions

### 1. Read Latest Changelog Entry

Read `CHANGELOG.md` and extract the most recent entry:

```bash
cat CHANGELOG.md | head -50
```

Parse the entry to extract:
- **Ticket ID**: From the section heading, e.g., `[<Ticket-ID> Title](url)` → extract the number
- **Ticket Title**: The full title from the heading
- **Changelog Body**: All content under the ticket heading (Added/Changed/Fixed/Removed/Security sections)

**Entry Format** (example):
```markdown
## [6.1.0] - 2026-03-31

### [0 Add Ticket Planning and Pull Request Creation Skills](https://github.com/torqlab/torq/issues/0)

### Added
- **open-pull-request skill** - Generic GitHub PR creation tool
  ...details...
```

Extract:
- Ticket ID: `0`
- Ticket Title: `Add Ticket Planning and Pull Request Creation Skills`
- Description: Everything under "### Added" onwards

### 2. Parameter Validation

Before creating a PR, validate required branch parameters:
- `head` is provided and not empty (required) - Source branch name
- `base` is provided or defaults to "main" (optional)
- `owner` is provided (required) - GitHub organization/user (e.g., "torqlab")
- `repo` is provided (required) - Repository name (e.g., "torq")

If any required parameter is missing, report the specific missing field and ask user to provide it.

### 3. Pre-Creation Checks

Before calling `gh_create_pull_request()`:
- Verify `head` branch differs from `base` branch
- Verify repository format is valid
- Show user a summary of what will be created:
  ```
  Creating PR from changelog entry:
  - Ticket: #[ID] - [Title]
  - Repository: [owner]/[repo]
  - From: [head] → [base]
  - Body: # Changelog\n\n[first 100 chars of changelog description]...
  ```

### 4. Construct PR Title and Body

**PR Title:**
Extract from changelog entry heading: `[Ticket-ID Title](issue-link)`
- Format: `[ID] Title` (e.g., `[0] Add Ticket Planning and Pull Request Creation Skills`)

**PR Body:**
Format with "# Changelog" header as first line, followed by changelog entry content:
```markdown
# Changelog

### [ID Title](issue-link)

### Added
- item 1
- item 2

### Changed
- item 1
```

Ensure the "# Changelog" header appears on the first line of the body.

### 5. PR Creation

Call GitHub MCP `gh_create_pull_request()` with:
- `title`: Constructed from changelog entry: `[ID] Title`
- `body`: Body with "# Changelog" header + changelog entry content
- `head`: The source branch name (provided parameter)
- `base`: The target branch (defaults to "main")
- `draft`: false (unless user specifies draft mode)

**Note**: GitHub MCP is currently scoped to `torqlab/torq`. For other organizations, manual setup may be required.

### 6. Error Handling

Handle these common GitHub errors:

#### 401 Unauthorized
- **Cause**: GitHub MCP token invalid or expired
- **Solution**: Inform user to check GITHUB_MCP_TOKEN in .env file
- **Message**: "Authentication failed. Verify GITHUB_MCP_TOKEN in .env is valid and not expired."

#### 403 Forbidden
- **Cause**: Token lacks PR creation permissions
- **Solution**: User needs to regenerate token with PR write permission
- **Message**: "Permission denied. Verify GitHub token has 'pull_requests:write' permission."

#### 404 Not Found
- **Cause**: Branch doesn't exist or repository not found
- **Solution**: List available branches or verify repo name
- **Message**: "Branch [branch-name] not found. Common branches: main, develop, release/*"

#### 409 Conflict
- **Cause**: Merge conflict between branches
- **Solution**: Suggest user resolve conflicts in the branch
- **Message**: "Merge conflict detected. Please resolve conflicts in [head] branch before creating PR."

#### 422 Unprocessable Entity
- **Cause**: Invalid parameters or duplicate PR
- **Solution**: Check if PR already exists or parameters are invalid
- **Message**: "Invalid parameters or PR already exists. Verify branch names and repository."

#### 429 Too Many Requests
- **Cause**: GitHub rate limit exceeded
- **Solution**: Wait before retrying
- **Message**: "Rate limit exceeded. Please wait a few minutes and try again."

### 7. Success Response

On successful PR creation, return:
```
✅ Pull request created successfully!

PR Details:
- URL: https://github.com/[owner]/[repo]/pull/[number]
- Number: #[number]
- Title: [title]
- Status: Open
- From: [head] → [base]

Next steps: Review, request changes, or merge when ready.
```

## Usage Examples

### Direct Invocation by User

```
/open-pull-request \
  --owner="torqlab" \
  --repo="torq" \
  --head="plan/91-home-background-images" \
  --base="main"
```

The skill will:
1. Read CHANGELOG.md
2. Extract latest entry (ticket ID, title, description)
3. Create PR with title: `[91] Add home background images support`
4. Format body with "# Changelog" header + changelog entry
5. Create PR on GitHub

### Programmatic Invocation (from other skills)

From `plan-ticket-implementation` skill:

```
1. After generating changelog entry on current branch

2. Invoke skill with branch parameters:
   - owner: "torqlab"
   - repo: "torq"
   - head: plan/<ticketID>-<short-title>
   - base: "main" (default)

3. Skill reads CHANGELOG.md

4. Extracts latest entry and creates PR

5. Returns PR metadata (URL, number, status)
```

### With Custom Base Branch

```
/open-pull-request \
  --owner="torqlab" \
  --repo="torq" \
  --head="hotfix/456-critical-fix" \
  --base="release/1.0"
```

Skill reads latest changelog and creates PR against release/1.0 branch instead of main.

## Integration Points

### GitHub MCP Tools

The skill uses:
- `gh_create_pull_request(title, body, head, base, draft)` - Creates PR
- Error handling for rate limits and conflicts

### Used By

This skill can be invoked by:
- Users directly via `/open-pull-request` command
- `plan-ticket-implementation` skill - for creating plan PRs
- Other workflow automation skills

### Project Conventions

Follows TORQ conventions:
- Arrow functions and const (internal implementation)
- No nested functions
- JSDoc for all functions (internal)
- Proper error handling and messaging

## Common Scenarios

### Scenario 1: User Creates PR Manually
1. User runs `/open-pull-request` with all parameters
2. Skill validates parameters
3. Displays confirmation summary
4. Creates PR on GitHub
5. Returns PR URL to user

### Scenario 2: Orchestrated PR Creation
1. `plan-ticket-implementation` skill calls `open-pull-request`
2. Parameters prepared from issue/changelog context
3. Skill creates PR silently (no user confirmation needed)
4. Returns PR metadata for further processing

### Scenario 3: Error Recovery
1. PR creation fails (e.g., branch conflict)
2. Skill catches error and reports specific issue
3. Provides guidance on resolving the issue
4. Offers option to retry or adjust parameters

## Important Notes

- **Changelog Required**: The skill reads CHANGELOG.md from the current working directory (repository root)
  - CHANGELOG.md must exist and contain at least one entry
  - Latest entry is extracted and used for PR title and body
  - Entry format must follow Keep a Changelog standard with `### [ID Title](url)` heading

- **Repository Scope**: GitHub MCP is currently scoped to `torqlab/torq` repository
  - The skill accepts `owner` and `repo` parameters for future extensibility
  - Currently only `torqlab/torq` is supported via GitHub MCP

- **Branch Requirements**: Both `head` and `base` branches must exist in the repository before creating the PR

- **PR Body Format**: Automatically prefixed with `# Changelog` on the first line
  - Followed by the full changelog entry from CHANGELOG.md
  - Supports full GitHub Flavored Markdown (GFM)

- **Draft PRs**: Can be created with `draft: true` parameter for work-in-progress PRs

- **Permissions**: Requires GitHub token with `pull_requests:write` permission (fine-grained token recommended)

## Rate Limiting

GitHub API has rate limits:
- Standard: 5,000 requests per hour per user
- PR creation counts as 1 request

If rate limited (429 error), wait 1 hour for reset or check your quota with GitHub settings.

## Success Criteria

The skill successfully creates a PR when:
- ✅ CHANGELOG.md exists and contains at least one entry
- ✅ Latest changelog entry is properly formatted with `### [ID Title](url)` heading
- ✅ Required branch parameters provided and validated
- ✅ GitHub MCP token is valid and has correct permissions
- ✅ Both `head` and `base` branches exist
- ✅ No merge conflicts between branches
- ✅ PR doesn't already exist
- ✅ GitHub API responds successfully
- ✅ PR is created with "# Changelog" as first line in body

If any condition fails, the skill provides clear error message and guidance on resolution.
