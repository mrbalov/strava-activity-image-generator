---
id: open-pull-request
description: Creates a pull request on GitHub with specified parameters. Use when you need to open a PR with custom title, body, branches, and repository.
argument-hint: "title"
---

# Open Pull Request Skill

## Context

You are a GitHub automation assistant specialized in creating pull requests with proper formatting and error handling. This skill provides a reusable interface for PR creation that can be invoked directly by users or orchestrated by other skills (like `plan-ticket-implementation`).

## Task

- Accept PR parameters (title, body, branches, repository)
- Validate all required parameters are present
- Create the PR using GitHub MCP tools
- Handle common GitHub errors gracefully
- Return PR metadata (URL, number, status)

## Instructions

### 1. Parameter Validation

Before creating a PR, validate:
- `title` is provided and not empty (required)
- `body` is provided (required)
- `owner` is provided (required) - GitHub organization/user (e.g., "torqlab")
- `repo` is provided (required) - Repository name (e.g., "torq")
- `head` is provided and not empty (required) - Source branch name
- `base` is provided or defaults to "main" (optional)

If any required parameter is missing, report the specific missing field and ask user to provide it.

### 2. Pre-Creation Checks

Before calling `gh_create_pull_request()`:
- Verify `head` branch differs from `base` branch
- Verify repository format is valid
- Show user a summary of what will be created:
  ```
  Creating PR:
  - Title: [title]
  - Repository: [owner]/[repo]
  - From: [head] → [base]
  - Body preview: [first 100 chars of body]...
  ```

### 3. PR Creation

Call GitHub MCP `gh_create_pull_request()` with:
- `title`: The provided PR title
- `body`: The provided PR body (markdown formatted)
- `head`: The source branch name
- `base`: The target branch (defaults to "main")
- `draft`: false (unless user specifies draft mode)

**Note**: GitHub MCP is currently scoped to `torqlab/torq`. For other organizations, manual setup may be required.

### 4. Error Handling

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

### 5. Success Response

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
  --title="Add home background images feature" \
  --body="# Changelog\n\n- Added home background image support" \
  --owner="torqlab" \
  --repo="torq" \
  --head="plan/91-home-background-images"
```

### Programmatic Invocation (from other skills)

From `plan-ticket-implementation` skill:

```
1. Prepare PR parameters from issue context:
   - title: From changelog entry title
   - body: Changelog entry content with "# Changelog" header
   - owner: "torqlab"
   - repo: "torq"
   - head: plan/<ticketID>-<short-title>
   - base: "main" (default)

2. Invoke skill with parameters

3. Capture returned PR URL and number

4. Use PR details in subsequent steps (e.g., posting to GitHub issue)
```

### With Custom Base Branch

```
/open-pull-request \
  --title="Fix hotfix for production issue" \
  --body="Urgent fix for issue #456" \
  --owner="torqlab" \
  --repo="torq" \
  --head="hotfix/456-critical-fix" \
  --base="release/1.0"
```

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

- **Repository Scope**: GitHub MCP is currently scoped to `torqlab/torq` repository. The skill accepts `owner` and `repo` parameters for future extensibility, but currently only `torqlab/torq` is supported.
- **Branch Requirements**: Both `head` and `base` branches must exist in the repository before creating the PR.
- **Markdown Support**: PR body supports full GitHub Flavored Markdown (GFM) including code blocks, tables, links, etc.
- **Draft PRs**: Can be created with `draft: true` parameter for work-in-progress PRs.
- **Permissions**: Requires GitHub token with `pull_requests:write` permission (fine-grained token recommended).

## Rate Limiting

GitHub API has rate limits:
- Standard: 5,000 requests per hour per user
- PR creation counts as 1 request

If rate limited (429 error), wait 1 hour for reset or check your quota with GitHub settings.

## Success Criteria

The skill successfully creates a PR when:
- ✅ All required parameters provided and validated
- ✅ GitHub MCP token is valid and has correct permissions
- ✅ Both `head` and `base` branches exist
- ✅ No merge conflicts between branches
- ✅ PR doesn't already exist
- ✅ GitHub API responds successfully

If any condition fails, the skill provides clear error message and guidance on resolution.
