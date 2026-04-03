---
topic: useTransition
type: react
difficulty: intermediate
created: 2026-04-04
---

# useTransition

## Concepts

### Q1: What problem does useTransition solve?
<!-- type: conceptual -->

<details>
<summary>Answer</summary>

`useTransition` lets you mark state updates as non-urgent so React can keep the UI responsive to urgent updates (like typing in an input) while computing expensive re-renders in the background. Without it, a heavy re-render blocks the main thread and causes input lag.

</details>

### Q2: What is the difference between isPending from useTransition and the staleness check from useDeferredValue?
<!-- type: conceptual -->

<details>
<summary>Answer</summary>

`isPending` is a boolean flag that tells you a transition is currently in progress — you typically use it to show a loading spinner or dim the UI. `useDeferredValue` instead gives you the actual previous value that React keeps displaying while computing the new result. They solve similar problems but `isPending` is binary on/off feedback while `useDeferredValue` gives you the old data itself to keep rendering.

</details>

### Q3: In React 19, can you pass an async function to startTransition? What happens?
<!-- type: conceptual -->

<details>
<summary>Answer</summary>

Yes. React 19 added support for async functions inside `startTransition`. The transition stays in the "pending" state until the async function's promise resolves. This enables patterns like calling an API inside a transition — the `isPending` flag remains `true` throughout the await, letting you show a loading indicator without managing separate loading state.

</details>

### Q4: Why does the TransitionDemo split state into inputValue and listQuery instead of using a single state variable?
<!-- type: conceptual -->

<details>
<summary>Answer</summary>

The two-state pattern is essential to how `useTransition` works here. `inputValue` updates urgently (every keystroke syncs immediately to the input field), while `listQuery` updates inside `startTransition` (non-urgent, interruptible). If you used a single state variable, you couldn't separate the urgent input update from the expensive list re-render — either both would be urgent (laggy input) or both would be deferred (input doesn't show what you typed).

</details>

## Code Challenges

### C1: Add visual staleness feedback to the list
<!-- type: code -->
<!-- file: src/demos/TransitionDemo.jsx -->

The `TransitionDemo` currently shows a "Re-rendering list..." badge when `isPending` is true, but the list itself doesn't dim. Modify the demo so the `<ul className="item-list">` wrapper dims to 50% opacity during a pending transition, similar to how `DeferredDemo` handles staleness. Add a smooth CSS transition.

<details>
<summary>Hint</summary>

Look at `DeferredDemo.jsx` line 74 — it wraps the list in a `<div>` with `style={{ opacity: isStale ? 0.5 : 1, transition: "opacity 0.2s" }}`. Apply the same pattern using `isPending` instead of `isStale`.

</details>

<details>
<summary>Solution</summary>

```jsx
{/* Wrap the list section in a div that dims during transitions */}
<div style={{ opacity: isPending ? 0.5 : 1, transition: "opacity 0.2s" }}>
  <p className="count">
    Showing {Math.min(results.length, 100)} of {results.length} matches
    {listQuery !== inputValue && " (list may be one keystroke behind)"}
  </p>

  <ul className="item-list">
    {results.slice(0, 100).map((item) => (
      <SlowItem
        key={item}
        text={item}
        isMatch={!!listQuery && item.includes(listQuery)}
      />
    ))}
    {results.length > 100 && (
      <li className="more">…and {results.length - 100} more</li>
    )}
  </ul>
</div>
```

</details>

### C2: Build a transition-powered tab switcher
<!-- type: code -->
<!-- file: src/demos/TransitionDemo.jsx -->

Create a new component called `TabSwitcher` that renders 3 tabs (A, B, C). Each tab shows a `SlowList` with different data. Use `useTransition` so that switching tabs does not freeze the UI — the old tab content stays visible (dimmed) while the new tab's content renders. Display the `isPending` status using the existing badge classes.

<details>
<summary>Hint</summary>

1. Store `activeTab` in state.
2. Wrap `setActiveTab` calls in `startTransition`.
3. Render content based on `activeTab` — each tab should render a list of ~1000 items using the `SlowItem` component.
4. Use `isPending` to apply opacity dimming to the content area.
5. Use the existing `.nav-btn` and `.active` CSS classes for tab buttons.

</details>

<details>
<summary>Solution</summary>

```jsx
function TabSwitcher() {
  const [activeTab, setActiveTab] = useState("A");
  const [isPending, startTransition] = useTransition();

  const TABS = {
    A: Array.from({ length: 1000 }, (_, i) => `alpha-${i}`),
    B: Array.from({ length: 1000 }, (_, i) => `beta-${i}`),
    C: Array.from({ length: 1000 }, (_, i) => `gamma-${i}`),
  };

  function switchTab(tab) {
    startTransition(() => setActiveTab(tab));
  }

  return (
    <div>
      <div className="controls">
        {Object.keys(TABS).map((tab) => (
          <button
            key={tab}
            className={`nav-btn${activeTab === tab ? " active" : ""}`}
            onClick={() => switchTab(tab)}
          >
            Tab {tab}
          </button>
        ))}
        {isPending ? (
          <span className="badge pending">Switching…</span>
        ) : (
          <span className="badge ready">Ready</span>
        )}
      </div>

      <div style={{ opacity: isPending ? 0.5 : 1, transition: "opacity 0.2s" }}>
        <ul className="item-list">
          {TABS[activeTab].slice(0, 100).map((item) => (
            <SlowItem key={item} text={item} isMatch={false} />
          ))}
        </ul>
      </div>
    </div>
  );
}
```

</details>
