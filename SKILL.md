---
name: git-commit-push-pr
description: Commit local changes, push the currently checked-out branch to its upstream (non-fork) remote, and create a pull request after explicit user confirmation. Use when asked to commit changes, push the current branch, or open a PR for the active branch.
---

# Git Commit, Push, And PR

## Overview

Commit local changes, push the active branch (default to the user’s fork unless they are on an upstream branch), and create a pull request on the upstream remote only after the user confirms the PR details.

## Workflow

1) Collect inputs
- Ask for a commit message only if the user did not provide one in the prompt.
- Always confirm before staging changes, even if the user requests `git add -A`.
- Ask for PR title only if the user did not provide it in the prompt.
- Do not ask for labels/reviewers; omit them unless explicitly provided.
- Do not ask for draft status; default to ready unless explicitly requested.
- Default PRs to ready (not draft) unless the user explicitly requests a draft.
- Default the PR base branch to `upstream/main` (or the upstream default branch if detectable). Only ask for a different base if the user requests it.
- If the user does not provide a PR body, use the template in `references/PR_BODY_TEMPLATE.md` by default.

2) Inspect repository state
- Check the current branch and upstream: `git rev-parse --abbrev-ref HEAD`, `git branch -vv`.
- Review changes: `git status -sb` and `git diff --stat` (or `git diff --name-only`).
- List remotes: `git remote -v`. If multiple remotes exist, ask which one is the upstream (non-fork) remote.

3) Stage and commit
- Confirm staging intent with the user, then stage selected files with `git add <paths>` or `git add -A`.
- Confirm there is staged content (`git diff --cached --stat`).
- Create the commit: `git commit -m "<message>"`.
- If there is nothing to commit, stop and ask whether to continue with push/PR anyway.

4) Push the current branch
- Default to pushing to the user’s fork remote (`origin`) without asking, unless the current branch is an upstream branch.
- Treat a branch as “upstream branch” when `git branch -vv` shows `[upstream/...]` or the branch name is `upstream`/`upstream-*`. In that case, ask whether to push to `origin` or `upstream`.
- If the branch has no upstream, push with `git push -u <remote> <branch>`.
- If an upstream is set, use `git push`.

5) Create the pull request (only after user confirmation)
- Determine hosting based on the remote URL:
  - GitHub: prefer `gh` (`gh auth status`, then `gh pr create`).
  - GitLab: prefer `glab` (`glab auth status`, then `glab mr create`).
- If no supported CLI is available, ask the user how they want to proceed.
- Before running the PR command, present the exact PR details (base, head, title, body, labels, reviewers, draft) and ask the user to confirm.
- Do not create the PR until the user explicitly approves.

## PR Command Guidance

- GitHub (example):
  ```bash
  gh pr create --base <base> --head <branch> --title "<title>" --body "<body>" [--draft] [--label <label>] [--reviewer <user>]
  ```
- GitLab (example):
  ```bash
  glab mr create --target-branch <base> --source-branch <branch> --title "<title>" --description "<body>" [--draft] [--label <label>] [--reviewer <user>]
  ```

## Guardrails

- Work only on the currently checked-out branch unless the user asks otherwise.
- Do not amend or rewrite commits unless explicitly requested.
- Avoid creating a PR against a fork; use the upstream (non-fork) remote.
