import { useState, useTransition } from "react";

// 2 000 items gives React's reconciler enough work to make the
// difference between urgent and non-urgent renders visible.
const ALL_ITEMS = Array.from(
  { length: 2000 },
  (_, i) => `item-${String(i).padStart(4, "0")}`,
);

// Each item does a tiny busy-wait so that rendering 2 000 of them
// costs ~80 ms — enough to notice without freezing the page.
function SlowItem({ text, isMatch }) {
  const end = performance.now() + 0.1;
  while (performance.now() < end) {}
  return <li className={isMatch ? "highlight" : ""}>{text}</li>;
}

export default function TransitionDemo() {
  const [inputValue, setInputValue] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const val = e.target.value;
    setInputValue(val); // urgent  → input stays in sync with typing
    startTransition(() => {
      setListQuery(val); // non-urgent → list update can be interrupted
    });
  }

  const results = ALL_ITEMS.filter((item) =>
    listQuery ? item.includes(listQuery) : true,
  );

  return (
    <section className="demo">
      <h2>useTransition</h2>
      <p className="desc">
        <code>startTransition</code> marks the list re-render as{" "}
        <em>non-urgent</em>. React keeps the input responsive and, if you type
        again before the list finishes, it throws away the in-progress render
        and starts fresh. Type quickly — the input should never lag even while{" "}
        <strong>2 000 slow items</strong> are re-rendering.
      </p>

      <div className="controls">
        <input
          className="search"
          placeholder="Filter items…"
          value={inputValue}
          onChange={handleChange}
        />
        {isPending ? (
          <span className="badge pending">Re-rendering list…</span>
        ) : (
          <span className="badge ready">List up to date</span>
        )}
      </div>

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
    </section>
  );
}
