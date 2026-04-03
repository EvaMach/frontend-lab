---
description: "Research latest React/TS features and generate demos + quiz tasks. Triggers when user asks what to learn next or wants to explore a new frontend feature."
argument-hint: "[topic] (e.g., 'react useActionState', 'typescript satisfies') — leave empty to auto-suggest"
context: fork
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - WebSearch
  - WebFetch
  - Agent
  - AskUserQuestion
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
   - If `mcp__context7__*` tools are available, also query context7 for React and TypeScript documentation
2. Filter out topics already covered in the repo.
3. Present 3–5 suggestions to the user via `AskUserQuestion`, each with a one-line description.
4. Let the user pick one.

## Phase 3: Classify the topic

Determine whether this topic is:
- **react** — a React hook, API, or component pattern → produces `.jsx` demo + task `.md`
- **typescript** — a type-system feature or pattern → produces `.ts` exercise + task `.md`
- **both** — a React feature that also showcases TS generics/patterns → produces all three files

## Phase 4: Spawn two agents in parallel

Launch both agents in a single message using the Agent tool. Provide each with the FULL prompt from the supporting template files.

### Agent 1: Demo/Exercise Maker

Read the template from `.claude/skills/research/demo-maker-prompt.md` and substitute TOPIC_NAME and the topic type. Send this as the Agent prompt.

### Agent 2: Task Maker

Read the template from `.claude/skills/research/task-maker-prompt.md` and substitute TOPIC_NAME and the topic type. Send this as the Agent prompt.

## Phase 5: Auto-register in App.jsx (React demos only)

After BOTH agents complete, verify the expected files were created using `Glob`.

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

If the demo file was NOT created (agent failed), report the error and provide manual registration instructions. Do NOT leave App.jsx in a half-modified state.

**Skip registration entirely for TypeScript-only topics.**

## Phase 6: Summary

Report what was created:
- Demo file path (if any)
- Exercise file path (if any)
- Task file path
- Whether App.jsx was updated
- Suggest running `npm run dev` to verify the new demo tab works
- Suggest running `/test-me <topic>` to try the quiz
