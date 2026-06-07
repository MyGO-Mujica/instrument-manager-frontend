---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans.
---
# Using Git Worktrees

## Overview

Ensure work happens in an isolated workspace. Prefer your platform's native worktree tools. Fall back to manual git worktrees only when no native tool is available.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0: Detect Existing Isolation

**Before creating anything, check if you are already in an isolated workspace.**

If already in a linked worktree: Skip creation. Do NOT create another worktree.

If in a normal repo checkout: Ask for consent before creating a worktree.

## Step 1: Create Isolated Workspace

### 1a. Native Worktree Tools (preferred)
If you have a native tool (EnterWorktree, WorktreeCreate, /worktree), use it.

### 1b. Git Worktree Fallback
Only use this if no native tool available.

#### Directory Selection
Follow this priority: existing directory > global legacy > instruction file > `.worktrees/` default.

#### Safety Verification
Verify directory is gitignored before creating worktree:
```bash
git check-ignore -q .worktrees 2>/dev/null
```
If NOT ignored: Add to .gitignore, commit, then proceed.

#### Create the Worktree
```bash
git worktree add <path> -b <branch-name>
cd <path>
```

## Step 3: Project Setup

Auto-detect and run appropriate setup:
```bash
# Node.js
if [ -f package.json ]; then npm install; fi
# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi
# Go
if [ -f go.mod ]; then go mod download; fi
```

## Step 4: Verify Clean Baseline

Run tests to ensure workspace starts clean. If tests fail, report and ask. If pass, report ready.

## Quick Reference

| Situation | Action |
|-----------|--------|
| Already in linked worktree | Skip creation |
| Native worktree tool available | Use it |
| No native tool | Git worktree fallback |
| `.worktrees/` exists | Use it (verify ignored) |
| Directory not ignored | Add to .gitignore + commit |
| Tests fail during baseline | Report failures + ask |

## Red Flags

**Never:**
- Create a worktree when already in isolated workspace
- Create worktree without verifying it's ignored
- Skip baseline test verification
- Proceed with failing tests without asking
