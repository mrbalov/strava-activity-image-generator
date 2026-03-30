# GitHub MCP Integration - Proposal

**Status**: Implemented
**Created**: 2026-03-30
**Author**: Claude
**Scope**: TORQ project-wide

## Problem Statement

TORQ currently lacks programmatic GitHub integration. While the project uses GitHub Actions for CI/CD, Claude has no way to:
- Create or update pull requests programmatically
- Read or search GitHub issues
- Create test fixtures for automated workflows

This limits Claude's ability to autonomously manage GitHub workflows and generate test data for development.

## Proposed Solution

Integrate GitHub Model Context Protocol (MCP) server to enable:

1. **Issue Management**
   - Search issues across `torqlab/torq`
   - Read individual issue details
   - Filter by state, labels, assignees

2. **Pull Request Management**
   - Create new pull requests programmatically
   - Update PR state (open/draft/closed)
   - List and search existing PRs
   - Read PR details and comments

3. **Repository Context**
   - Search for repositories in organization
   - Read repository metadata

## Architecture

| Aspect | Decision |
|--------|----------|
| **MCP Server Type** | HTTP (hosted GitHub MCP) |
| **Authentication** | Fine-grained Personal Access Token (PAT) |
| **Configuration** | Project-level `.mcp.json` (version-controlled) |
| **Token Storage** | `.env` file (gitignored) |
| **Test Data** | Mocked JSON fixtures (no API calls during testing) |

## Benefits

✅ Enables Claude to autonomously create PRs from specifications
✅ Allows automated issue-to-fixture generation for testing
✅ Reduces manual GitHub workflow overhead
✅ Version-controlled configuration for team consistency
✅ Follows TORQ's existing Strava integration pattern

## Implementation Impact

- **New Files**: `.mcp.json`, `.claude/GITHUB_MCP_SETUP.md`, test fixtures
- **Modified Files**: `.env` (add placeholder)
- **New Specs**: GitHub Integration spec, Fixture System spec
- **No Breaking Changes**: Backward compatible, feature addition only

## Success Criteria

- ✅ `.mcp.json` created and valid
- ✅ GITHUB_MCP_TOKEN configured in `.env`
- ✅ All fixture JSON files created
- ✅ Setup documentation complete
- ✅ `claude --mcp` lists GitHub tools
- ✅ PR creation verified (optional integration test)

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| PAT exposed in git | `.gitignore` includes `.env`, code review checks |
| Rate limiting | Document limits in setup guide, implement in prompts |
| Tool discovery | Verify `.mcp.json` syntax, test with `claude --mcp` |
| Fixture staleness | Periodic testing against real API |
| Token expiration | Document 90-day rotation policy |
