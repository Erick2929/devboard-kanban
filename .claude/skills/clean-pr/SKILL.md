---
name: clean-pr
description: Use when committing finished work, pushing a branch, or opening/updating a PR. Trigger on: "clean pr", "ship this", "push my changes", "create a PR", "commit and push", "open a PR", "push this", "make a PR", "send a PR", "wrap this up", "finalize this branch", or any request to finalize and share the current branch. Also trigger proactively when the user says implementation is done or all tests pass.
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep, mcp__github__list_pull_requests, mcp__github__create_pull_request, mcp__github__pull_request_read, mcp__github__update_pull_request, mcp__github__add_issue_comment
---

You are executing the `clean-pr` workflow. Follow these steps exactly, in order.

**IMPORTANT — Demo mode:** This skill runs under `--dangerously-skip-permissions`. Execute every step autonomously without asking for confirmation. Do NOT stop to ask questions unless you hit a genuine blocker (e.g., merge conflict). Present plans and summaries as informational output, then keep moving.

**TOOL PRIORITY: Always use the GitHub MCP server tools first. Only fall back to `gh` CLI when an MCP tool is unavailable or returns an error. Never skip MCP just because the `gh` command is familiar.**

---

## Step 0 — Detect the integration branch

Run:

```bash
git branch -a | grep -E "remotes/origin/(dev|develop|staging|preview)" | head -1
```

Pick the first match and strip the `remotes/origin/` prefix. This is `<base-branch>`.

**⛔ HARD RULE — NEVER NEGOTIABLE:**
PRs MUST target `dev`, `develop`, `staging`, or `preview`.
PRs MUST **NEVER** target `main` or `master`.
If you find yourself about to set `base="main"` or `base="master"`, STOP — you have made an error. Re-read Step 0 output and use the correct branch.

If no integration branch is found:
- Check if the repo has a `dev` branch that isn't yet pushed: `git branch | grep -E "^dev$|^develop$"`
- If still nothing, default to `dev` — do NOT ask the user.

Also extract owner and repo from the remote URL for MCP use:

```bash
git remote get-url origin
```

Parse as `https://github.com/<owner>/<repo>.git` OR `git@github.com:<owner>/<repo>.git`.

---

## Step 1 — Gather current state

Run the following commands and carefully read their output:

```bash
git status
git diff
git diff --cached
git log <base-branch>..HEAD --oneline
git branch --show-current
```

---

## Step 2 — Build and announce the commit plan

Analyze all changes (staged and unstaged) and group them into logical atomic commits.

Rules for grouping:
- One commit per coherent concern: one component, one domain, one test suite, one migration, etc.
- Order commits so dependencies come first (e.g., DB migrations before services, models before schemas, backend before frontend).
- Use conventional commit format: `feat:`, `refactor:`, `test:`, `fix:`, `chore:`
- Never use `git add -A` or `git add .` — always add specific files by name.
- Always include `.claude/` directory if it has untracked changes — other devs need the skills and hooks.
- Exclude files that likely contain secrets (`.env`, credentials, etc.) and warn the user.

**Print the commit plan** as a numbered list (commit message + files + one-line reason), then **immediately proceed to Step 3 without waiting for confirmation.**

---

## Step 3 — Run tests

Auto-detect the test command:

```bash
# Check which test runner this project uses
if [ -f Makefile ] && grep -q "^test:" Makefile; then
  make test
elif [ -f package.json ] && grep -q '"test"' package.json; then
  npm run test
else
  echo "No test command found — skipping"
fi
```

If tests fail because a service is not running (e.g., PostgreSQL / Docker):

```bash
make docker-up 2>/dev/null || true
sleep 3
# Re-run detected test command
```

If any tests still fail, **stop and report which tests failed**. Do not commit until tests pass.

> Note: Some projects have intentional failing tests (e.g., demo stubs). If the failure is in a known intentional test, note it clearly and continue.

---

## Step 4 — Execute commits

For each commit in the plan (in order):

1. Stage only the specific files for that commit:
   ```bash
   git add <file1> <file2> ...
   ```
2. Create the commit:
   ```bash
   git commit -m "$(cat <<'EOF'
   <commit message here>

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```

Verify each commit succeeded before moving to the next.

---

## Step 5 — Push the branch

```bash
git push -u origin <current-branch>
```

---

## Step 6 — Check for existing PR, then create or comment

**PREFER MCP. Use `gh` only as fallback.**

### 6a — Check for existing PR

**Primary (MCP):**
```
mcp__github__list_pull_requests(owner=<owner>, repo=<repo>, head="<current-branch>", state="open")
```

**Fallback (gh CLI):**
```bash
gh pr list --head <current-branch> --json number,title,url,state
```

---

### 6b — PR already exists → add update comment

Do NOT create a new PR. Add a comment summarizing what was just pushed.

**Primary (MCP):**
```
mcp__github__add_issue_comment(
  owner=<owner>,
  repo=<repo>,
  issue_number=<pr-number>,
  body="## Changes pushed\n\n<bullet summary of commits>\n\nAll tests pass. Ready for re-review."
)
```

**Fallback (gh CLI):**
```bash
gh pr comment <pr-number> --body "$(cat <<'EOF'
## Changes pushed

<bullet summary of what was committed and why>

All tests pass. Ready for re-review.
EOF
)"
```

Return the PR URL to the user.

---

### 6c — No PR exists → create one

**⛔ REMINDER:** `base` MUST be `<base-branch>` from Step 0. NEVER `main` or `master`.

**Primary (MCP):**
```
mcp__github__create_pull_request(
  owner=<owner>,
  repo=<repo>,
  title="<under 70 chars>",
  head="<current-branch>",
  base="<base-branch>",
  body="## Summary\n- <bullet 1>\n- <bullet 2>\n\n## Test plan\n- [ ] All existing tests pass\n- [ ] <specific behavior to verify>\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)"
)
```

**Fallback (gh CLI):**
```bash
gh pr create \
  --base <base-branch> \
  --title "<descriptive title under 70 chars>" \
  --body "$(cat <<'EOF'
## Summary
- <bullet 1>
- <bullet 2>
- <bullet 3>

## Test plan
- [ ] All existing tests pass
- [ ] <specific behavior to verify manually>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Return the PR URL to the user.
