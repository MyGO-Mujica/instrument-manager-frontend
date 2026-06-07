---
name: using-superpowers
description: Use when starting any conversation — establishes how to find and use skills.
---
# Using Superpowers

## Core Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means that you should invoke the skill to check. If an invoked skill turns out to be wrong for the situation, you don't need to use it.

## Platform Adaptation: Claude Code → Reasonix

Superpowers skills were originally written for Claude Code's tool set. In Reasonix, use these tool mappings:

| Claude Code Tool | Reasonix Equivalent |
|------------------|-------------------|
| `Skill` tool | `run_skill` — invoke skills by name |
| `TodoWrite` | `todo_write` — track task progress |
| `ask_choice` (new) | `ask_choice` — **render interactive picker for multiple-choice questions** |
| `Task` (subagent) | `run_skill` with subagent skills, `explore`, or `research` |
| `Read` on skill files | `run_skill` — never read SKILL.md files directly, invoke them |
| `Bash` | `run_command` — shell commands |

### Critical: Always Use `ask_choice` for Multiple-Choice Questions

When a skill says "prefer multiple choice" or "ask user to pick between options":
- **DO NOT** list options as text and ask the user to type a letter/number
- **ALWAYS** use the `ask_choice` tool — it renders an arrow-key picker
- One `ask_choice` call per question
- Valid for: yes/no decisions, option selection, approval gates, menu choices

This applies to ALL skills, not just brainstorming.

## How to Access Skills

In Reasonix, use the `run_skill` tool with the skill name. When you invoke a skill, its content is loaded and presented to you—follow it directly.

## Instruction Priority

Superpowers skills override default system prompt behavior, but **user instructions always take precedence**:

1. **User's explicit instructions** — highest priority
2. **Superpowers skills** — override default system behavior
3. **Default system prompt** — lowest priority

## Skill Type Awareness

**Rigid** (TDD, debugging): Follow exactly. Don't adapt away discipline.

**Flexible** (patterns): Adapt principles to context. The skill itself tells you which.

## Red Flags

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "I'll ask them to type A/B/C" | **Use `ask_choice` tool** — don't make the user type replies to multiple-choice questions. |

## Skill Priority

When multiple skills could apply:

1. **Process skills first** (brainstorming, debugging) — these determine HOW to approach the task
2. **Implementation skills second** — these guide execution

"Let's build X" → brainstorming first, then implementation.
"Fix this bug" → debugging first, then domain-specific skills.

## Workflow Reference

| Scenario | Skills |
|----------|--------|
| **New feature** | brainstorming → writing-plans → test-driven-development → requesting-code-review → finishing-a-development-branch |
| **Bug fix** | systematic-debugging → test-driven-development → verification-before-completion |
| **Code review** | requesting-code-review → receiving-code-review |
| **Multi-step plan** | writing-plans → subagent-driven-development or executing-plans |
| **Multiple bugs** | dispatching-parallel-agents |
