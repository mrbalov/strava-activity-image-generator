# Implementation Tasks - GitHub MCP Integration

## Phase 1: Specification ✅
- [x] Create proposal.md
- [x] Create design.md
- [x] Create this tasks.md
- [x] Draft GitHub Integration spec
- [x] Draft Fixture System spec

## Phase 2: Configure GitHub MCP

### 2.1 Create `.mcp.json`
- [ ] Create `.mcp.json` at project root
- [ ] Configure HTTP server type
- [ ] Set GitHub MCP URL: `https://github-mcp.anthropic.com`
- [ ] Configure GITHUB_TOKEN environment variable
- [ ] Validate JSON syntax

### 2.2 Update `.env`
- [ ] Add GITHUB_MCP_TOKEN placeholder to `.env`
- [ ] Document required PAT permissions
- [ ] Add comment with GitHub PAT creation link

### 2.3 Verify `.gitignore`
- [ ] Confirm `.env` is in `.gitignore`
- [ ] Confirm `.env.local` is in `.gitignore`
- [ ] Confirm `.env.*.local` is in `.gitignore`

## Phase 3: Create Test Fixtures

### 3.1 Directory Structure
- [ ] Create `.claude/test-fixtures/github-mcp/`
- [ ] Create `.claude/test-fixtures/github-mcp/issues/`
- [ ] Create `.claude/test-fixtures/github-mcp/pull-requests/`
- [ ] Create `.claude/test-fixtures/github-mcp/repositories/`

### 3.2 Issue Fixtures
- [ ] Create `issues/search-issues.json`
- [ ] Create `issues/search-issues-empty.json`
- [ ] Create `issues/get-issue.json`
- [ ] Create `issues/get-issue-not-found.json`
- [ ] Validate all JSON files

### 3.3 Pull Request Fixtures
- [ ] Create `pull-requests/create-pr-success.json`
- [ ] Create `pull-requests/create-pr-conflict.json`
- [ ] Create `pull-requests/update-pr-success.json`
- [ ] Create `pull-requests/list-prs.json`
- [ ] Create `pull-requests/get-pr.json`
- [ ] Create `pull-requests/get-pr-not-found.json`
- [ ] Validate all JSON files

### 3.4 Repository Fixtures
- [ ] Create `repositories/search-repos.json`
- [ ] Create `repositories/get-repo.json`
- [ ] Validate all JSON files

### 3.5 Error Fixtures
- [ ] Create `error-rate-limited.json`
- [ ] Create `error-unauthorized.json`
- [ ] Create `error-forbidden.json`
- [ ] Validate all JSON files

## Phase 4: Documentation

### 4.1 Setup Guide
- [ ] Create `.claude/GITHUB_MCP_SETUP.md`
- [ ] Document prerequisites
- [ ] Write step-by-step PAT creation guide
- [ ] Document environment setup
- [ ] Provide tool reference

### 4.2 Tool Reference
- [ ] Document all available tools
- [ ] Provide usage examples for each
- [ ] Include example workflows

### 4.3 Error Handling
- [ ] Document common errors
- [ ] Provide troubleshooting steps
- [ ] Document rate limits (60/hour search, 5000/hour API)
- [ ] Explain error response format

### 4.4 Best Practices
- [ ] Document token rotation (90-day policy)
- [ ] Explain security considerations
- [ ] Provide commit message examples
- [ ] Document testing patterns

## Phase 5: Validation & Testing

### 5.1 Configuration Validation
- [ ] Parse `.mcp.json` as valid JSON
- [ ] Verify environment variable format
- [ ] Check GitHub URL is correct
- [ ] Validate server type is "http"

### 5.2 Fixture Validation
- [ ] Validate all fixture JSON files parse correctly
- [ ] Verify field names match GitHub API schema
- [ ] Check error responses have correct structure
- [ ] Verify HTTP status codes in responses

### 5.3 Integration Testing (Manual)
- [ ] Set valid GITHUB_MCP_TOKEN locally
- [ ] Run `claude --mcp` to list tools
- [ ] Attempt mock issue search
- [ ] Attempt mock PR creation
- [ ] Verify tools are recognized

### 5.4 Documentation Testing
- [ ] Follow setup guide end-to-end
- [ ] Verify all links work
- [ ] Test all code examples
- [ ] Verify tool names match available tools

## Phase 6: Finalize & Archive

### 6.1 Git Operations
- [ ] Stage all new files and modifications
- [ ] Create git commit with descriptive message
- [ ] Push to feature branch

### 6.2 OpenSpec Archive
- [ ] Mark all tasks as complete
- [ ] Run `openspec archive add-github-mcp-integration --yes`
- [ ] Verify archive in git history

### 6.3 Pull Request
- [ ] Create PR to `main` branch
- [ ] Write PR description with changes summary
- [ ] Add success criteria checklist
- [ ] Request review from team

### 6.4 Merge
- [ ] Address review feedback
- [ ] Merge PR to `main`
- [ ] Delete feature branch
- [ ] Notify team of new capability

## Blocking Dependencies

- Phase 2 depends on Phase 1 ✓
- Phase 3 depends on Phase 2
- Phase 4 depends on Phase 3
- Phase 5 depends on Phase 4
- Phase 6 depends on Phase 5

## Estimated Time

| Phase | Tasks | Time |
|-------|-------|------|
| 1 | Spec | 30 min ✓ |
| 2 | Config | 15 min |
| 3 | Fixtures | 45 min |
| 4 | Docs | 30 min |
| 5 | Validation | 15 min |
| 6 | Archive | 15 min |
| **Total** | **19 tasks** | **~2.5 hrs** |

## Progress Tracking

- [ ] Phase 1: Specification (0% → 100%)
- [ ] Phase 2: Configuration (0%)
- [ ] Phase 3: Fixtures (0%)
- [ ] Phase 4: Documentation (0%)
- [ ] Phase 5: Validation (0%)
- [ ] Phase 6: Finalize (0%)
