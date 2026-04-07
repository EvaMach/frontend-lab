---
description: "Research latest React/TS features and generate demos + quiz tasks. Triggers when user asks what to learn next or wants to explore a new frontend feature."
argument-hint: "[topic] (e.g., 'react useActionState', 'typescript satisfies') — leave empty to auto-suggest"
allowed-tools:
  - Read
  - Glob
  - Grep
  - WebSearch
  - WebFetch
  - AskUserQuestion
  - Agent
---

You are a research-and-generate pipeline for a frontend learning lab. Your job is to find a new React or TypeScript feature to learn, then produce a working demo and a quiz task file.

## Phase 1: Inventory existing coverage

Glob these three locations and build a list of topics already covered:

- `src/demos/*.jsx` — React demos (extract feature name from filename, e.g. TransitionDemo → useTransition)
- `src/exercises/*.ts` — TypeScript exercises
- `tasks/*.md` — existing task files

Store the covered-topic list for dedup.

## Phase 2: Topic selection

**If the user provided arguments** (`$ARGUMENTS` is non-empty):
- Use `$ARGUMENTS` as the topic.
- Check it against covered topics. If it matches an existing demo/exercise, warn the user and ask if they want to proceed anyway or pick something else.

**If no arguments** (auto-suggest mode):
1. Use `WebSearch` to find the latest React and TypeScript features:
   - Search for "React 19 new features 2025 2026" and "TypeScript 5.x new features 2025 2026"
2. Filter out topics already covered in the repo.
3. Do NOT output any intermediate thinking, search results, sources, or commentary. Go straight to `AskUserQuestion` with exactly 5 numbered suggestions. Each suggestion should have: **`Name`** (version) — one sentence description. Nothing else — no sources, no preamble, no "let me ask" text.
4. Let the user pick one.

## Phase 3: Classify the topic

Determine whether this topic is:
- **react** — a React hook, API, or component pattern → produces `.jsx` demo + task `.md`
- **typescript** — a type-system feature or pattern → produces `.ts` exercise + task `.md`
- **both** — a React feature that also showcases TS generics/patterns → produces all three files

## Phase 4: Spawn subagents

Launch two Agent tool calls in a single message to run both subagents in parallel. Reference each agent by name — Claude will route to the custom subagent defined in `.claude/agents/`.

### demo-maker

> Use the demo-maker agent to create a learning demo for the topic "TOPIC_NAME". Topic type: TOPIC_TYPE.

### task-maker

> Use the task-maker agent to create a task file for the topic "TOPIC_NAME". Topic type: TOPIC_TYPE. The demo/exercise file will be at: `src/demos/<TopicName>Demo.jsx` (or `src/exercises/<topic-kebab>.ts`).

## Phase 5: Auto-register in App.jsx (React demos only)

After BOTH subagents complete, verify the expected files were created using `Glob`.

If a React demo `.jsx` file was created in `src/demos/`:

1. Read `src/App.jsx`
2. Find the last `lazy(() => import(` line and insert the new lazy import after it:
   ```
   const <TopicName>Demo = lazy(() => import('./demos/<TopicName>Demo'))
   ```
3. Find the closing `]` of the `DEMOS` array and insert a new entry before it:
   ```
     { id: '<topic-kebab>', label: '<Display Label>', component: <TopicName>Demo },
   ```
4. Use the `Edit` tool for both insertions.

If the demo file was NOT created (subagent failed), report the error and provide manual registration instructions. Do NOT leave App.jsx in a half-modified state.

**Skip registration entirely for TypeScript-only topics.**

## Phase 6: Summary

Report what was created:
- Demo file path (if any)
- Exercise file path (if any)
- Task file path
- Whether App.jsx was updated
- Suggest running `npm run dev` to verify the new demo tab works
- Suggest running `/test-me <topic>` to try the quiz
