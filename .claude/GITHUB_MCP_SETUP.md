# GitHub MCP Setup Guide

Complete guide for setting up and using GitHub integration in TORQ via Model Context Protocol (MCP).

## Prerequisites

- GitHub account with access to `torqlab` organization
- Admin or write access to `torqlab/torq` repository
- Claude CLI installed and configured
- 5 minutes to complete setup

## Step 1: Create Fine-Grained Personal Access Token

GitHub Personal Access Tokens (PAT) provide secure, scoped access to the GitHub API.

### Instructions

1. **Go to GitHub Settings**
   - Navigate to https://github.com/settings/personal-access-tokens/new
   - Or: GitHub → Settings → Developer settings → Personal access tokens (Fine-grained tokens)

2. **Configure Token**
   - **Token name**: `TORQ-Claude-Integration` (or your preference)
   - **Description**: GitHub MCP integration for TORQ project automation
   - **Expiration**: 90 days (recommended) or Custom
   - **Resource owner**: `torqlab` (organization)

3. **Set Permissions**

   Select **only** these permissions (minimal scope):
   - ✅ **Issues**: `read` (list, read issues and issue comments)
   - ✅ **Pull requests**: `read` (read PRs) and `write` (create/update PRs)
   - ✅ **Contents**: `read` (read repository code and metadata)

   Leave all other permissions **unchecked**.

4. **Generate & Copy Token**
   - Click "Generate token"
   - ⚠️ **Important**: Copy the token immediately (it only displays once)
   - Save to clipboard or temporary location

## Step 2: Configure Environment Variable

### In `.env` file

1. **Open `.env` in TORQ project root**

   ```bash
   cd /Users/balovb/Documents/torq/torq
   nano .env  # or your preferred editor
   ```

2. **Find the GITHUB_MCP_TOKEN line**

   Look for:
   ```bash
   export GITHUB_MCP_TOKEN=your_github_fine_grained_pat_here
   ```

3. **Replace placeholder with your token**

   ```bash
   export GITHUB_MCP_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Save the file**

5. **Verify it's gitignored** ✅
   ```bash
   grep "\.env" .gitignore  # Should show .env is ignored
   ```

### ✅ Security Checklist

- [ ] Token is only in `.env` (never in `.mcp.json`)
- [ ] `.env` is in `.gitignore`
- [ ] Token is never committed to git
- [ ] Never share token or paste in logs/documentation

## Step 3: Verify Configuration

### Check MCP Configuration

Verify `.mcp.json` is valid JSON:

```bash
jq . .mcp.json
```

Expected output:
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

### Test with Claude CLI

After setting `GITHUB_MCP_TOKEN` in `.env`:

```bash
# Verify Claude can see GitHub tools
claude --mcp
```

You should see GitHub MCP tools listed:
- `gh_search_issues`
- `gh_get_issue`
- `gh_create_pull_request`
- `gh_update_pull_request`
- `gh_list_pull_requests`
- `gh_get_pull_request`
- `gh_search_repositories`
- `gh_get_repository`

## Tool Reference

Once configured, these tools become available to Claude:

### Issue Operations

#### `gh_search_issues(query, state, labels, assignee)`
Search for GitHub issues.

**Parameters**:
- `query` (string, required): Search query (e.g., "is:open label:bug")
- `state` (string, optional): "open", "closed", or "all" (default: "open")
- `labels` (array, optional): Filter by labels (e.g., ["enhancement", "documentation"])
- `assignee` (string, optional): Filter by assignee username

**Example**:
```
gh_search_issues("is:open", state="open", labels=["enhancement"])
```

**Returns**: List of issue objects with metadata

#### `gh_get_issue(number)`
Get detailed information about a specific issue.

**Parameters**:
- `number` (integer, required): Issue number

**Example**:
```
gh_get_issue(123)
```

**Returns**: Complete issue object including comments

#### `gh_list_issues(state, per_page)`
List issues in repository.

**Parameters**:
- `state` (string, optional): "open", "closed", or "all"
- `per_page` (integer, optional): Results per page (default: 30, max: 100)

**Returns**: List of issue objects with pagination support

### Pull Request Operations

#### `gh_create_pull_request(title, body, head, base, draft)`
Create a new pull request.

**Parameters**:
- `title` (string, required): PR title
- `body` (string, optional): PR description (markdown supported)
- `head` (string, required): Source branch name
- `base` (string, optional): Target branch (default: "main")
- `draft` (boolean, optional): Create as draft PR (default: false)

**Example**:
```
gh_create_pull_request(
  title="Add GitHub MCP integration",
  body="Enables Claude to create PRs and manage issues",
  head="feature/github-mcp",
  base="main"
)
```

**Returns**: Created PR object with number and URL

**Possible Errors**:
- 409 Conflict: Merge conflict between branches
- 422 Unprocessable Entity: Invalid parameters or reference already exists

#### `gh_update_pull_request(number, state, body)`
Update pull request state or description.

**Parameters**:
- `number` (integer, required): PR number
- `state` (string, optional): "open", "draft", or "closed"
- `body` (string, optional): New PR description

**Example**:
```
gh_update_pull_request(456, state="draft", body="Work in progress")
```

**Returns**: Updated PR object

#### `gh_list_pull_requests(state, base, per_page)`
List pull requests in repository.

**Parameters**:
- `state` (string, optional): "open", "closed", or "all"
- `base` (string, optional): Filter by base branch
- `per_page` (integer, optional): Results per page (default: 30)

**Returns**: List of PR objects

#### `gh_get_pull_request(number)`
Get detailed information about a specific PR.

**Parameters**:
- `number` (integer, required): PR number

**Example**:
```
gh_get_pull_request(456)
```

**Returns**: Complete PR object including commits and reviews

### Repository Operations

#### `gh_search_repositories(query, org)`
Search for repositories in an organization.

**Parameters**:
- `query` (string, required): Search query
- `org` (string, optional): Organization name (default: "torqlab")

**Returns**: List of repository objects

#### `gh_get_repository(repo)`
Get repository metadata.

**Parameters**:
- `repo` (string, required): Repository in format "owner/name"

**Example**:
```
gh_get_repository("torqlab/torq")
```

**Returns**: Repository object with stars, forks, open issues, etc.

## Common Workflows

### Example 1: Search for Open Enhancement Issues

```
gh_search_issues("is:open", labels=["enhancement"])
```

### Example 2: Create a PR from Specification

```
gh_create_pull_request(
  title="47 Add GitHub MCP Integration",
  body="Implements specification from /openspec/changes/add-github-mcp-integration/\n\nEnables:\n- Issue searching\n- PR creation and updates\n- Repository metadata access",
  head="feature/github-mcp",
  base="main"
)
```

### Example 3: Update PR to Mark as Draft

```
gh_update_pull_request(456, state="draft")
```

### Example 4: List All Open PRs

```
gh_list_pull_requests(state="open")
```

## Rate Limits

GitHub API has rate limits:

- **Search API**: 60 requests per hour per user
- **Standard API**: 5,000 requests per hour per user (with authentication)
- **Rate Limit Window**: Resets hourly

### Rate Limit Headers

Responses include rate limit information:
```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1234567890
```

### Best Practices

- ✅ Cache search results when possible
- ✅ Use filters to reduce unnecessary searches
- ✅ Batch operations when practical
- ✅ Implement exponential backoff on 429 errors
- ❌ Don't retry immediately on rate limit

## Error Handling

### Common Errors and Solutions

#### 401 Unauthorized
- **Cause**: Token invalid, expired, or not set
- **Solution**:
  1. Verify `GITHUB_MCP_TOKEN` is set in `.env`
  2. Check token hasn't expired (90 days)
  3. Create new token if needed

#### 403 Forbidden
- **Cause**: Token doesn't have required permissions
- **Solution**:
  1. Verify PAT has "issues:read", "pull_requests:read", "pull_requests:write"
  2. Verify PAT is scoped to `torqlab` organization
  3. Create new token with correct permissions

#### 404 Not Found
- **Cause**: Issue/PR/repository doesn't exist
- **Solution**: Verify issue/PR number or repository name

#### 409 Conflict
- **Cause**: PR creation failed due to merge conflict or branch issues
- **Solution**:
  1. Check branches can be merged
  2. Resolve conflicts in the branch
  3. Verify head and base branches exist

#### 429 Too Many Requests
- **Cause**: Rate limit exceeded
- **Solution**:
  1. Wait for rate limit window to reset
  2. Reduce request frequency
  3. Check remaining quota with `gh_get_rate_limits` (if available)

### Error Response Format

```json
{
  "message": "Error description",
  "documentation_url": "https://docs.github.com/...",
  "status": 404
}
```

## Troubleshooting

### Claude doesn't recognize GitHub tools

1. **Verify `.mcp.json` syntax**:
   ```bash
   jq . .mcp.json
   ```

2. **Check `.env` has token**:
   ```bash
   echo $GITHUB_MCP_TOKEN  # Should show token, not empty
   ```

3. **Restart Claude CLI**:
   ```bash
   # Close and reopen Claude CLI
   # Or run with fresh environment
   ```

### Token-related errors

1. **Token not found**:
   - Verify `GITHUB_MCP_TOKEN=...` is in `.env`
   - Not `GITHUB_TOKEN` (different variable)

2. **Token expired**:
   - GitHub PATs expire after 90 days
   - Create new token and update `.env`

3. **Permissions denied**:
   - Verify token has required scopes
   - Create new token with correct permissions

### Test Fixtures

Test fixtures are provided in `.claude/test-fixtures/github-mcp/` for:
- Deterministic testing without API calls
- Offline development and testing
- CI/CD pipelines with no credentials
- Prototyping without rate limit concerns

## Security Best Practices

1. ✅ **Never commit `.env` to git**
   - `.gitignore` includes `.env`
   - Double-check before committing

2. ✅ **Rotate tokens regularly**
   - Create new token every 90 days
   - Revoke old tokens on GitHub settings

3. ✅ **Use minimal permissions**
   - Only request required scopes
   - Regular security audit of permissions

4. ✅ **Monitor API usage**
   - Check GitHub settings for unusual API activity
   - Review token usage logs periodically

5. ✅ **Never expose tokens in logs**
   - Don't log API responses with sensitive data
   - Be careful when sharing error messages

## Advanced Configuration

### Organization-Wide Setup (Team)

For team/organization use:

1. Create PAT in organization account (not personal)
2. Store in shared secrets management system
3. Document in team onboarding docs
4. Rotate tokens as part of security policy

### Multiple Organizations

If TORQ moves to multiple organizations:

1. Modify `.mcp.json` to add additional servers
2. Create separate PATs for each organization
3. Store each token in `.env` with org-specific variable name

### Custom GitHub Enterprise

For GitHub Enterprise instances:

1. Modify `.mcp.json` URL to your GHE instance
2. Create PAT with GHE-specific permissions
3. Update documentation

## Support & Issues

### Getting Help

- **Claude Code Docs**: https://github.com/anthropics/claude-code
- **GitHub API Docs**: https://docs.github.com/rest
- **GitHub MCP Docs**: Check Anthropic documentation

### Reporting Issues

If you encounter problems:

1. Check error message for specific issue
2. Review troubleshooting section above
3. Verify configuration with provided steps
4. Report issue with:
   - Error message (no tokens!)
   - Steps to reproduce
   - Configuration details (no secrets!)

## References

- GitHub REST API Documentation: https://docs.github.com/rest
- GitHub Personal Access Tokens: https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- GitHub API Rate Limiting: https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting
- Claude Code: https://github.com/anthropics/claude-code
