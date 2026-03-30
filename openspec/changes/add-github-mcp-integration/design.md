# Technical Design - GitHub MCP Integration

## Architecture Overview

```
┌─────────────────────────────────────────┐
│ Claude (via Claude Code / CLI)          │
├─────────────────────────────────────────┤
│ .mcp.json (GitHub MCP HTTP client)      │
├─────────────────────────────────────────┤
│ GitHub MCP Server (hosted by Anthropic) │
│ https://github-mcp.anthropic.com        │
├─────────────────────────────────────────┤
│ GitHub REST API (via HTTP)              │
├─────────────────────────────────────────┤
│ torqlab/torq repository                 │
└─────────────────────────────────────────┘
```

## Configuration Strategy

### Why HTTP over stdio
- **Maintained by Anthropic**: Reduces maintenance burden
- **Single point of failure**: Not our process to manage
- **Network isolation**: Works across machine restarts
- **Official implementation**: Most reliable option

### Why Fine-grained PAT over GitHub App
- **Simpler setup**: No need for GitHub App installation workflow
- **Single org scope**: Fine-grained PAT sufficient for `torqlab`
- **Faster iteration**: No additional infrastructure required
- **Security**: Time-limited tokens, scoped permissions

### Why Project-level Config
- **Version controlled**: Team consistency via git
- **Reproducible**: New team members can clone and run
- **Auditable**: Changes tracked in git history
- **No global pollution**: Config stays within project

### Why Fixtures over Real API
- **Rate limit safe**: No API calls during testing
- **Deterministic**: Same results every run
- **Fast**: No network latency
- **Offline capable**: Works without internet
- **Cost zero**: No GitHub API quota consumption

## File Structure

```
torq/
├── .mcp.json                    # MCP configuration (new)
├── .env                         # Token storage (modified)
├── .gitignore                   # Already includes .env
├── .claude/
│   ├── GITHUB_MCP_SETUP.md      # Setup guide (new)
│   └── test-fixtures/
│       └── github-mcp/          # Test data (new)
│           ├── issues/
│           ├── pull-requests/
│           └── repositories/
└── openspec/
    └── changes/
        └── add-github-mcp-integration/
            ├── proposal.md      # This proposal
            ├── design.md        # This document
            ├── tasks.md         # Implementation tasks
            └── specs/           # Specification additions
                ├── github-integration/
                │   └── spec.md
                └── fixture-system/
                    └── spec.md
```

## MCP Server Configuration

**File**: `.mcp.json`

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://github-mcp.anthropic.com",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_MCP_TOKEN}"
      }
    }
  }
}
```

### Environment Variable Resolution
- Claude CLI reads `.env` file
- Injects `GITHUB_MCP_TOKEN` into MCP server environment
- Token never written to config file (stays in `.env`)

## Authentication Flow

1. **Local Setup**
   ```bash
   # User creates fine-grained PAT on GitHub.com
   # User adds to .env
   echo "GITHUB_MCP_TOKEN=ghp_xxxx..." >> .env
   ```

2. **Runtime**
   ```
   Claude CLI reads .env → GITHUB_MCP_TOKEN
   → Passes to MCP HTTP server
   → MCP server includes in Authorization header
   → GitHub API validates token
   ```

3. **Token Scope**
   - Organization: `torqlab`
   - Repositories: All (can be restricted further)
   - Permissions: `issues:read`, `pull_requests:read/write`, `contents:read`

## Available Tools After Integration

Once configured, these tools become available to Claude:

### Issue Operations
- `gh_search_issues(query, state, labels, assignee)`
- `gh_get_issue(repo, number)`
- `gh_list_issues(repo, state, per_page)`

### Pull Request Operations
- `gh_create_pull_request(repo, title, body, head, base)`
- `gh_update_pull_request(repo, number, state, body)`
- `gh_list_pull_requests(repo, state, base)`
- `gh_get_pull_request(repo, number)`

### Repository Operations
- `gh_search_repositories(query, org)`
- `gh_get_repository(repo)`

## Test Fixture Strategy

### Fixture Location
All fixtures stored in `.claude/test-fixtures/github-mcp/` for:
- Easy discovery by test utilities
- Clear organization by resource type
- Non-interference with runtime config

### Fixture Format
Each fixture is a JSON file representing an API response:

```json
{
  "success": true,
  "data": {
    "number": 123,
    "title": "Example Issue",
    "state": "open"
  }
}
```

### Fixture Coverage

**Issues**
- `search-issues.json` - Successful search result (multiple issues)
- `search-issues-empty.json` - Search with no results
- `get-issue.json` - Single issue detail
- `get-issue-not-found.json` - 404 error case

**Pull Requests**
- `create-pr-success.json` - Successful creation
- `create-pr-conflict.json` - Merge conflict error
- `update-pr-success.json` - Successful state update
- `list-prs.json` - Multiple PRs
- `get-pr.json` - Single PR detail
- `get-pr-not-found.json` - 404 error case

**Repositories**
- `search-repos.json` - Organization repositories
- `get-repo.json` - Single repository metadata

**Error Cases**
- `error-rate-limited.json` - 429 rate limit
- `error-unauthorized.json` - 401 invalid token
- `error-forbidden.json` - 403 insufficient permissions

## Security Considerations

### PAT Security
1. **Minimal Permissions**: Only `issues:read`, `pr:read/write`, `contents:read`
2. **No Admin**: Cannot modify org settings, delete repos, or manage team
3. **Time Limited**: 90-day expiration window
4. **Scoped by Org**: `torqlab` only
5. **Audit Trail**: GitHub logs all API calls with token ID

### Token Storage
1. **Never in Config**: `.mcp.json` is version-controlled but has no secrets
2. **Always in .env**: Environment file is gitignored
3. **Local Only**: Token never transmitted except to GitHub API
4. **Export Careful**: Never include in logs, error messages, or documentation

### Code Review
- Review all PAT-related changes
- Verify `.env` in `.gitignore`
- Check for token in `.mcp.json`

## Verification Checklist

- [ ] `.mcp.json` is valid JSON
- [ ] All fixture JSON files are valid
- [ ] `.env` example includes GITHUB_MCP_TOKEN
- [ ] `.gitignore` includes `.env` and `.env.local`
- [ ] Documentation is complete
- [ ] Setup guide has clear PAT creation steps
- [ ] Error handling documented
- [ ] Rate limit documentation provided

## Success Criteria

✅ Configuration passes validation
✅ Fixtures match GitHub API schema
✅ Claude CLI recognizes tools (`claude --mcp`)
✅ PR creation verified on test branch
✅ Setup guide is followable end-to-end
✅ All tests pass with fixtures
