# Specification: GitHub Integration Capability

**Status**: Complete
**Type**: NEW capability
**Component**: MCP Integration
**Audience**: Claude (AI agent)

## Summary

Enable Claude to programmatically interact with GitHub via Model Context Protocol (MCP). This spec defines the required capabilities for issue and pull request management.

## Requirements

### Functional Requirements

#### FR-001: Issue Search
Claude MUST be able to search for GitHub issues with filters:
- Query string (full-text search)
- State (open, closed, all)
- Labels (filter by label)
- Assignee
- Sort order (created, updated, comments)

**Expected Response**: List of issues with metadata (number, title, state, labels, created_at, updated_at)

#### FR-002: Get Issue Details
Claude MUST be able to retrieve full details of a specific issue:
- Issue number
- Repository name
- Full issue content (title, body, state, labels, assignee, comments)

**Expected Response**: Complete issue object including all fields and comment history

#### FR-003: Create Pull Request
Claude MUST be able to create new pull requests:
- Repository name
- Title (required)
- Body/description (optional)
- Head branch (required)
- Base branch (required, default: main)
- Draft mode (optional)

**Expected Response**: Created PR object with number, URL, state

#### FR-004: Update Pull Request
Claude MUST be able to update PR state and metadata:
- Repository name
- PR number (required)
- State (open, draft, closed)
- Body/description (optional)

**Expected Response**: Updated PR object with new state

#### FR-005: List Pull Requests
Claude MUST be able to list PRs with filters:
- Repository name
- State (open, closed, all)
- Base branch (optional)
- Head branch (optional)
- Sort order (created, updated, popularity, long-running)
- Pagination (page, per_page)

**Expected Response**: List of PR objects with metadata

#### FR-006: Get Pull Request Details
Claude MUST be able to retrieve full details of a specific PR:
- Repository name
- PR number
- Full PR content (title, body, state, labels, commits, comments, review status)

**Expected Response**: Complete PR object with all fields and related data

### Non-Functional Requirements

#### NFR-001: Rate Limiting
- Respect GitHub API rate limits (60/hour for search, 5000/hour for standard API)
- Implement exponential backoff on rate limit errors
- Cache results when appropriate

#### NFR-002: Error Handling
- Handle authentication errors (401 Unauthorized)
- Handle permission errors (403 Forbidden)
- Handle not found errors (404 Not Found)
- Handle conflict errors (409 Conflict)
- Handle rate limit errors (429 Too Many Requests)
- Provide clear error messages for debugging

#### NFR-003: Security
- Use fine-grained PAT with minimal required permissions
- Never expose token in logs, config files, or error messages
- Validate all input parameters
- Sanitize all output for safety

#### NFR-004: Performance
- Complete issue searches in < 2 seconds
- Complete PR operations in < 3 seconds
- Support pagination for large result sets
- Cache metadata when possible

### Scope

**Included**:
- GitHub REST API v3 interface
- `torqlab` organization
- `torqlab/torq` repository (primary)
- Issue and PR operations
- Search and filtering
- Error handling

**Excluded**:
- Discussions API
- Projects API
- Wiki operations
- Release management
- Webhook management
- Organization settings
- Team management

## Data Models

### Issue
```json
{
  "number": 123,
  "title": "Add GitHub integration",
  "body": "Detailed description...",
  "state": "open",
  "labels": ["enhancement", "documentation"],
  "assignee": "username",
  "created_at": "2026-03-30T12:00:00Z",
  "updated_at": "2026-03-30T14:00:00Z",
  "comments_count": 5,
  "url": "https://github.com/torqlab/torq/issues/123"
}
```

### Pull Request
```json
{
  "number": 456,
  "title": "Implement GitHub MCP integration",
  "body": "This PR adds MCP support...",
  "state": "open",
  "draft": false,
  "head": {
    "ref": "feature/github-mcp",
    "sha": "abc123..."
  },
  "base": {
    "ref": "main",
    "sha": "def456..."
  },
  "labels": ["infrastructure"],
  "assignee": "username",
  "created_at": "2026-03-30T12:00:00Z",
  "updated_at": "2026-03-30T14:00:00Z",
  "merged_at": null,
  "comments_count": 3,
  "commits_count": 5,
  "url": "https://github.com/torqlab/torq/pull/456"
}
```

### Error Response
```json
{
  "error": "Not Found",
  "message": "Issue #999 not found",
  "status": 404,
  "documentation_url": "https://docs.github.com/rest/reference/issues"
}
```

## API Operations

### Search Issues
```
Operation: gh_search_issues(query, state, labels, assignee, sort, direction)
Input: Search query and optional filters
Output: List of issue objects
Errors: 401, 403, 422, 429
Rate Limit: 60 requests/hour (search-specific)
```

### Get Issue
```
Operation: gh_get_issue(repo, number)
Input: Repository name, issue number
Output: Single issue object with all details
Errors: 401, 403, 404, 422
Rate Limit: 5000 requests/hour
```

### Create PR
```
Operation: gh_create_pull_request(repo, title, body, head, base, draft)
Input: Repository, branch names, title, optional body and draft flag
Output: Created PR object with number and URL
Errors: 401, 403, 409, 422, 500
Rate Limit: 5000 requests/hour
Side Effects: Creates branch if not exists, creates PR in GitHub
```

### Update PR
```
Operation: gh_update_pull_request(repo, number, state, body)
Input: Repository, PR number, new state, optional body
Output: Updated PR object
Errors: 401, 403, 404, 409, 422
Rate Limit: 5000 requests/hour
Side Effects: Updates PR state in GitHub
```

### List PRs
```
Operation: gh_list_pull_requests(repo, state, base, head, sort, per_page)
Input: Repository and optional filters
Output: List of PR objects with pagination
Errors: 401, 403, 422
Rate Limit: 5000 requests/hour
```

### Get PR Details
```
Operation: gh_get_pull_request(repo, number)
Input: Repository name, PR number
Output: Single PR object with all details
Errors: 401, 403, 404
Rate Limit: 5000 requests/hour
```

## Success Criteria

✅ All six functional requirements implemented
✅ Error handling for all documented error cases
✅ Rate limiting respected in implementation
✅ Security requirements met (no token exposure)
✅ Performance targets achieved (< 3 seconds per operation)
✅ Integration tests passing with fixtures
✅ Documentation complete with examples

## Implementation Completion

**Implemented**: 2026-03-30

All functional requirements completed and verified:
- GitHub MCP server configured and integrated
- All six API operations (search, get, create, update, list PRs) working
- Error handling and rate limiting implemented
- Security requirements met with fine-grained PAT
- Test fixtures and mocks in place
- Integration verified and tested

## Testing Strategy

See `specs/fixture-system/spec.md` for test fixture requirements.

### Manual Testing
1. Valid PAT setup verification
2. Search issue operations
3. Create PR on test branch
4. Update PR state
5. Error case handling

### Automated Testing
1. Fixture-based testing (no API calls)
2. Schema validation
3. Error response handling
4. Rate limit simulation

## Security Checklist

- [x] PAT has minimal required permissions only
- [x] Token never stored in version-controlled files
- [x] Error messages don't expose sensitive data
- [x] Input validation on all parameters
- [x] Output sanitization for display
- [x] Rate limiting prevents abuse
- [x] Audit trail via GitHub API logs
