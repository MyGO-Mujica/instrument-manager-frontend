---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work.
---
# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Detect environment → Present options → Execute choice → Clean up.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

## The Process

### Step 1: Verify Tests

**Before presenting options, verify tests pass.**

**If tests fail:**
```
Tests failing (<N> failures). Must fix before completing.
Cannot proceed with merge/PR until tests pass.
```
Stop. Don't proceed to Step 2.

**If tests pass:** Continue to Step 2.

### Step 2: Detect Environment

Determine workspace state before presenting options.

### Step 3: Determine Base Branch

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

### Step 4: Present Options

**Use the `ask_choice` tool to present options** — never list them as text and ask the user to type a number.

**Normal repo — present exactly these 4 options:**

```
ask_choice({
  question: "Implementation complete. What would you like to do?",
  options: [
    { id: "merge",  title: "Merge back to <base-branch> locally" },
    { id: "pr",     title: "Push and create a Pull Request" },
    { id: "keep",   title: "Keep the branch as-is (I'll handle it later)" },
    { id: "discard", title: "Discard this work" }
  ]
})
```

For Option 4 (Discard), if user picks it, use a second `ask_choice` with options "Yes, discard" / "No, cancel" as confirmation instead of requiring typed text.

### Step 5: Execute Choice

#### Option 1: Merge Locally
Merge, verify tests, cleanup worktree, delete branch.

#### Option 2: Push and Create PR
Push branch, create PR with summary + test plan.
Do NOT clean up worktree — user needs it for PR feedback.

#### Option 3: Keep As-Is
Report branch and path. Don't cleanup worktree.

#### Option 4: Discard
Confirm first with `ask_choice` (options: "Yes, discard this work" / "No, cancel"), then cleanup worktree, force-delete branch. Do NOT require the user to type "discard" manually.

### Step 6: Cleanup Workspace

Only runs for Options 1 and 4. Options 2 and 3 always preserve the worktree.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | yes | - | - | yes |
| 2. Create PR | - | yes | yes | - |
| 3. Keep as-is | - | - | yes | - |
| 4. Discard | - | - | - | yes (force) |

## Common Mistakes

**Skipping test verification:** Always verify tests before offering options.
**Cleaning up worktree for Option 2:** Only cleanup for Options 1 and 4.
**Deleting branch before removing worktree:** Merge first, remove worktree, then delete.
**No confirmation for discard:** Always use `ask_choice` to confirm discard (never require typed text).

## Red Flags

**Never:**
- Proceed with failing tests
- Merge without verifying tests on result
- Delete work without confirmation
- Force-push without explicit request
- Remove a worktree before confirming merge success
