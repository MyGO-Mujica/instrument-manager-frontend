---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment.
---
# Writing Skills

## Overview

**Writing skills IS Test-Driven Development applied to process documentation.**

**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

## What is a Skill?

A **skill** is a reference guide for proven techniques, patterns, or tools. Skills help future instances find and apply effective approaches.

**Skills are:** Reusable techniques, patterns, tools, reference guides
**Skills are NOT:** Narratives about how you solved a problem once

## SKILL.md Structure

**Frontmatter (YAML):**
- Two required fields: `name` and `description`
- `name`: Use letters, numbers, and hyphens only
- `description`: Third-person, describes ONLY when to use (NOT what it does)
  - Start with "Use when..." to focus on triggering conditions
  - Include specific symptoms, situations, and contexts
  - **NEVER summarize the skill's process or workflow**

```markdown
---
name: skill-name-with-hyphens
description: "Use when [specific triggering conditions]"
---

# Skill Name

## Overview
What is this? Core principle in 1-2 sentences.

## When to Use
Bullet list with symptoms and use cases. When NOT to use.

## Quick Reference
Table or bullets for scanning common operations.

## Common Mistakes
What goes wrong + fixes.
```

## Skill Types

### Technique
Concrete method with steps to follow.

### Pattern
Way of thinking about problems.

### Reference
API docs, syntax guides, tool documentation.

## Discipline-Enforcing Skills

Skills that enforce rules (like TDD) need to resist rationalization.

### Close Every Loophole Explicitly
Don't just state the rule — forbid specific workarounds.

### Create Rationalization Table
Capture excuses agents use and counter them explicitly.

### Create Red Flags List
Make it easy for agents to self-check when rationalizing.

## The Iron Law (Same as TDD)

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

This applies to NEW skills AND EDITS to existing skills.

## RED-GREEN-REFACTOR for Skills

### RED: Write Failing Test (Baseline)
Run pressure scenario with subagent WITHOUT the skill. Document exact behavior.

### GREEN: Write Minimal Skill
Write skill that addresses those specific rationalizations.

### REFACTOR: Close Loopholes
Agent found new rationalization? Add explicit counter. Re-test until bulletproof.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Narrative example | Too specific, not reusable |
| Multi-language dilution | One excellent example beats many mediocre ones |
| Generic labels | Labels should have semantic meaning |
| Description summarizes workflow | Description should only describe triggering conditions |
