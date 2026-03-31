# Specification: Test Fixture System

**Status**: Proposed
**Type**: NEW capability
**Component**: Testing Infrastructure
**Audience**: Claude (AI agent), Development Team

## Summary

Define a structured system for creating and maintaining mock test data for GitHub MCP integration. This enables deterministic, reproducible testing without requiring live API calls or credentials.

## Requirements

### Functional Requirements

#### FR-001: Fixture Organization
The fixture system MUST organize test data by resource type:
- Issues
- Pull Requests
- Repositories
- Errors
- Edge cases

**File Structure**:
```
.claude/test-fixtures/github-mcp/
├── issues/
├── pull-requests/
├── repositories/
└── errors/
```

#### FR-002: Fixture Format
All fixtures MUST be valid JSON files matching GitHub API schema:
- Fixture files represent API responses
- Include realistic field values
- Include both success and error responses
- Timestamp values must be valid ISO 8601

**File Naming Convention**: `{operation}-{scenario}.json`
- Example: `search-issues-empty.json`
- Example: `create-pr-conflict.json`

#### FR-003: Issue Fixtures
The system MUST provide comprehensive issue test data:

**Required Issue Fixtures**:
- `search-issues.json` - Multiple issues from search
- `search-issues-empty.json` - Search with zero results
- `get-issue.json` - Single issue detail
- `get-issue-not-found.json` - 404 error response

**Fields in Issue Fixture**:
- number, title, body, state, labels
- assignee, created_at, updated_at
- comments_count, url, repository

#### FR-004: Pull Request Fixtures
The system MUST provide comprehensive PR test data:

**Required PR Fixtures**:
- `create-pr-success.json` - Successful PR creation
- `create-pr-conflict.json` - Merge conflict during creation
- `update-pr-success.json` - Successful state update
- `list-prs.json` - Multiple PRs in list response
- `get-pr.json` - Single PR detail
- `get-pr-not-found.json` - 404 error response

**Fields in PR Fixture**:
- number, title, body, state, draft
- head (ref, sha), base (ref, sha)
- labels, assignee, created_at, updated_at
- merged_at, comments_count, commits_count, url

#### FR-005: Repository Fixtures
The system MUST provide repository test data:

**Required Repository Fixtures**:
- `search-repos.json` - Organization repositories
- `get-repo.json` - Single repository detail

**Fields in Repository Fixture**:
- name, full_name, description
- url, created_at, updated_at
- stars, forks, open_issues_count

#### FR-006: Error Response Fixtures
The system MUST provide standardized error responses:

**Required Error Fixtures**:
- `error-rate-limited.json` - 429 rate limit
- `error-unauthorized.json` - 401 invalid token
- `error-forbidden.json` - 403 insufficient permissions
- `error-not-found.json` - 404 resource not found
- `error-conflict.json` - 409 merge conflict

**Error Response Schema**:
```json
{
  "error": "Error Name",
  "message": "Human readable message",
  "status": 429,
  "documentation_url": "https://docs.github.com/...",
  "retry_after": 60
}
```

### Non-Functional Requirements

#### NFR-001: JSON Schema Validation
All fixtures MUST:
- Parse as valid JSON
- Match GitHub API v3 response schema
- Include realistic example values
- Use consistent formatting (2-space indentation)

#### NFR-002: Fixture Discoverability
Fixtures MUST be:
- Organized in predictable directory structure
- Named with descriptive operation and scenario
- Documented with comments about test purpose
- Linked in setup documentation

#### NFR-003: Maintenance
Fixture system MUST:
- Be easy to update when API changes
- Support adding new scenarios without breaking existing
- Include comments for non-obvious field values
- Have clear versioning when GitHub API updates

#### NFR-004: Performance
Fixture loading MUST:
- Be instantaneous (< 100ms)
- Not require network access
- Support in-memory caching
- Work offline

### Scope

**Included**:
- GitHub API v3 JSON responses
- Success and error responses
- Realistic data values
- Common test scenarios
- Edge cases (empty results, conflicts, rate limits)

**Excluded**:
- Test runner logic
- Assertions and validation
- Mock server implementation
- API request recording
- Snapshot testing

## Fixture Categories

### 1. Success Scenarios

#### Issue Search
- **File**: `issues/search-issues.json`
- **Scenario**: Query returns multiple matching issues
- **Purpose**: Test filtering and result parsing

#### Empty Search
- **File**: `issues/search-issues-empty.json`
- **Scenario**: Query matches zero issues
- **Purpose**: Test empty result handling

#### Single Issue
- **File**: `issues/get-issue.json`
- **Scenario**: Retrieve specific issue detail
- **Purpose**: Test single resource fetching

#### PR Creation
- **File**: `pull-requests/create-pr-success.json`
- **Scenario**: PR created successfully
- **Purpose**: Test PR creation workflow

#### PR Update
- **File**: `pull-requests/update-pr-success.json`
- **Scenario**: PR state updated successfully
- **Purpose**: Test PR state management

### 2. Error Scenarios

#### Not Found
- **File**: `issues/get-issue-not-found.json`
- **Scenario**: Requested issue doesn't exist (404)
- **Purpose**: Test error handling for missing resources

#### Rate Limited
- **File**: `errors/error-rate-limited.json`
- **Scenario**: API rate limit exceeded (429)
- **Purpose**: Test rate limit backoff logic

#### Unauthorized
- **File**: `errors/error-unauthorized.json`
- **Scenario**: Invalid or missing authentication (401)
- **Purpose**: Test authentication error handling

#### Forbidden
- **File**: `errors/error-forbidden.json`
- **Scenario**: Insufficient permissions (403)
- **Purpose**: Test permission error handling

#### Conflict
- **File**: `pull-requests/create-pr-conflict.json`
- **Scenario**: PR creation fails due to merge conflict (409)
- **Purpose**: Test conflict resolution guidance

### 3. Edge Cases

#### Long Content
- Include issues/PRs with very long titles (500+ chars)
- Include PRs with many comments (100+)
- Purpose: Test truncation and pagination

#### Special Characters
- Include issues with emoji and unicode characters
- Include PRs with special markdown formatting
- Purpose: Test encoding and display

#### Dates and Timezones
- Include various date formats and timezones
- Include old and new timestamps
- Purpose: Test date parsing and formatting

## Fixture Format Examples

### Issue Search Response
```json
{
  "total_count": 2,
  "incomplete_results": false,
  "items": [
    {
      "number": 123,
      "title": "Add GitHub integration",
      "body": "Enable Claude to create PRs and manage issues",
      "state": "open",
      "labels": ["enhancement", "documentation"],
      "assignee": "developer-name",
      "created_at": "2026-03-30T12:00:00Z",
      "updated_at": "2026-03-30T14:00:00Z",
      "comments": 5,
      "url": "https://github.com/torqlab/torq/issues/123"
    }
  ]
}
```

### PR Creation Response
```json
{
  "id": 1,
  "number": 456,
  "title": "Implement GitHub MCP",
  "body": "Add MCP integration for GitHub API access",
  "state": "open",
  "draft": false,
  "head": {
    "label": "feature/github-mcp",
    "ref": "feature/github-mcp",
    "sha": "abc123def456"
  },
  "base": {
    "label": "main",
    "ref": "main",
    "sha": "def456abc123"
  },
  "created_at": "2026-03-30T12:00:00Z",
  "updated_at": "2026-03-30T12:00:00Z",
  "merged_at": null,
  "comments": 0,
  "commits": 5,
  "url": "https://github.com/torqlab/torq/pull/456"
}
```

### Error Response
```json
{
  "message": "API rate limit exceeded for user ID 12345.",
  "documentation_url": "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting",
  "status": 429,
  "retry_after": 60
}
```

## Integration Points

Fixtures should be referenced by:
1. **Test utilities** - Load fixtures for mock responses
2. **Setup documentation** - Show example API responses
3. **Development workflow** - Claude uses fixtures for testing without API
4. **Integration tests** - Compare real responses against fixture schema

## Validation Rules

All fixtures MUST pass:

1. **JSON Syntax**
   ```bash
   jq . fixture.json > /dev/null
   ```

2. **Schema Validation**
   - Match GitHub API v3 response structure
   - Include all required fields
   - Use correct data types

3. **Timestamp Validation**
   - All dates must be valid ISO 8601
   - Timestamps must be in UTC timezone (Z suffix)

4. **URL Validation**
   - All URLs must be valid and well-formed
   - Should point to appropriate GitHub resource

5. **Status Code Consistency**
   - Error responses must have status field
   - Status must be valid HTTP status code
   - Message must match status code

## Success Criteria

✅ All fixture files created and valid JSON
✅ Fixture schema matches GitHub API v3
✅ Success and error scenarios covered
✅ Fixtures have realistic example data
✅ Fixtures organized in predictable structure
✅ Documentation references all fixtures
✅ Fixtures load without errors
✅ Tests pass using fixture data

## Maintenance Schedule

- **Monthly**: Review fixture schema against GitHub API changelog
- **Quarterly**: Update fixtures with new API fields if applicable
- **As-needed**: Add new fixtures for new test scenarios
- **When API changes**: Update affected fixtures and document changes

## Future Enhancements

- Fixture versioning for API version compatibility
- Fixture generation from real API responses
- Fixture-based integration test harness
- Snapshot testing integration
- Performance benchmarking fixtures
