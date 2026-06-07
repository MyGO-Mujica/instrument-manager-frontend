---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session.
---
# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Why subagents:** You delegate tasks to specialized agents with isolated context. By precisely crafting their instructions and context, you ensure they stay focused and succeed at their task. They should never inherit your session's context or history — you construct exactly what they need. This also preserves your own context for coordination work.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are: BLOCKED status you cannot resolve, ambiguity that genuinely prevents progress, or all tasks complete.

## When to Use

**vs. Executing Plans (parallel session):**
- Same session (no context switch)
- Fresh subagent per task (no context pollution)
- Two-stage review after each task: spec compliance first, then code quality
- Faster iteration (no human-in-loop between tasks)

## The Process

### Per Task Cycle:
1. Dispatch implementer subagent with full task text + context
2. Implementer implements, tests, commits, self-reviews
3. Dispatch spec reviewer subagent (confirms code matches spec)
4. If issues → implementer fixes → re-review
5. Dispatch code quality reviewer subagent
6. If issues → implementer fixes → re-review
7. Mark task complete

### After All Tasks:
1. Dispatch final code reviewer for entire implementation
2. Use superpowers:finishing-a-development-branch

## Handling Implementer Status

Implementer subagents report one of four statuses:

**DONE:** Proceed to spec compliance review.

**DONE_WITH_CONCERNS:** The implementer completed work but flagged doubts. Read concerns before proceeding.

**NEEDS_CONTEXT:** The implementer needs information. Provide context and re-dispatch.

**BLOCKED:** The implementer cannot complete the task. Assess the blocker and escalate if needed.

## Model Selection

Use the least powerful model that can handle each role:
- **Mechanical implementation** (1-2 files, clear spec) → fast cheap model
- **Integration and judgment** (multi-file coordination) → standard model
- **Architecture, design, and review** → most capable model

## Advantages

**vs. Manual execution:**
- Subagents follow TDD naturally
- Fresh context per task (no confusion)
- Parallel-safe (subagents don't interfere)
- Subagent can ask questions (before AND during work)

**vs. Executing Plans:**
- Same session (no handoff)
- Continuous progress (no waiting)
- Review checkpoints automatic

## Red Flags

**Never:**
- Start implementation on main/master branch without explicit user consent
- Skip reviews (spec compliance OR code quality)
- Proceed with unfixed issues
- Dispatch multiple implementation subagents in parallel (conflicts)
- Make subagent read plan file (provide full text instead)
- Skip scene-setting context
- Ignore subagent questions
- Accept "close enough" on spec compliance
- Skip review loops
