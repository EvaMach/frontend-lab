# Frontend Learning Lab

An interactive playground for learning React 19 and TypeScript features, powered by Claude Code. The repo ships with a set of demos and a CLI-driven workflow to research new topics, generate demos, and quiz yourself — all without leaving the terminal.

## Prerequisites

- Node.js 18+
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated

## Getting Started

```bash
git clone <repo-url>
cd frontend-lab
npm install
npm run dev
```

Open http://localhost:5173 to see the demo app. Each tab is a self-contained, interactive demo of a React 19 feature.

## How It Works

The repo has two layers:

1. **The app** — a Vite + React 19 playground (`src/`) with tabbed demos, each showcasing a single feature (useTransition, Suspense, useOptimistic, etc.).
2. **The Claude Code skills** (`.claude/skills/`) — automated pipelines that research topics, generate new demos, and quiz you on them.


## Workflow

### 1. Research a new topic

In Claude Code, run:

```
/research react useActionState
```

Or leave the argument empty to get auto-suggestions based on what's not yet covered:

```
/research
```

This will:
- Check which topics are already covered in the repo
- Research the topic via web search
- Spawn two subagents in parallel:
  - **demo-maker** — creates a working demo in `src/demos/` (React) or exercise in `src/exercises/` (TypeScript)
  - **task-maker** — creates a quiz file in `tasks/`
- Auto-register the new demo tab in `App.jsx`

### 2. Explore the demo

```bash
npm run dev
```

Click the new tab in the browser to interact with the generated demo.

### 3. Test your knowledge

```
/test-me useActionState
```

Or list all available topics:

```
/test-me
```

The quiz presents conceptual questions and code challenges one at a time, tracks your score, and saves progress to `tasks/.progress.json`.

## Adding Demos Manually

If you prefer to write demos by hand:

1. Create `src/demos/MyFeatureDemo.jsx` — follow the structure of existing demos (see `TransitionDemo.jsx` as reference).
2. Register it in `src/App.jsx`:
   ```jsx
   const MyFeatureDemo = lazy(() => import('./demos/MyFeatureDemo'))
   ```
   Add an entry to the `DEMOS` array:
   ```jsx
   { id: 'my-feature', label: 'My Feature', component: MyFeatureDemo },
   ```
3. Optionally create a task file at `tasks/my-feature.md` so `/test-me` can quiz you on it.

## Tech Stack

- React 19 + Vite 8
- No UI libraries — demos use plain React and a minimal shared CSS (`App.css`)
- Claude Code skills + subagents for automation
