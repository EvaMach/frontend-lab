import { useState, useDeferredValue, memo } from "react";

const ALL_ITEMS = Array.from(
  { length: 2000 },
  (_, i) => `item-${String(i).padStart(4, "0")}`,
);

// memo is the key partner to useDeferredValue:
// the list only re-renders when deferredQuery changes, not on every keystroke.
const FilteredList = memo(function FilteredList({ query }) {
  // Artificial cost so the "stale" state is visible during fast typing.
  const end = performance.now() + 80;
  while (performance.now() < end) {}

  const results = query
    ? ALL_ITEMS.filter((item) => item.includes(query))
    : ALL_ITEMS;

  return (
    <>
      <p className="count">
        Showing {Math.min(results.length, 100)} of {results.length} matches
      </p>
      <ul className="item-list">
        {results.slice(0, 100).map((item) => (
          <li
            key={item}
            className={query && item.includes(query) ? "highlight" : ""}
          >
            {item}
          </li>
        ))}
        {results.length > 100 && (
          <li className="more">…and {results.length - 100} more</li>
        )}
      </ul>
    </>
  );
});

export default function DeferredDemo() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <section className="demo">
      <h2>useDeferredValue</h2>
      <p className="desc">
        <code>useDeferredValue</code> gives the list a <em>stale copy</em> of
        the query while React is still computing the new result. Combined with{" "}
        <code>memo</code>, the list only re-renders when the deferred value
        actually changes — so the input is always instant. The dimming effect
        shows when you're looking at stale content.
      </p>

      <div className="controls">
        <input
          className="search"
          placeholder="Filter items…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isStale ? (
          <span className="badge pending">
            Stale — showing "{deferredQuery}"
          </span>
        ) : (
          <span className="badge ready">Up to date</span>
        )}
      </div>

      {/* Dimming the list while stale is a common production pattern */}
      <div style={{ opacity: isStale ? 0.5 : 1, transition: "opacity 0.2s" }}>
        <FilteredList query={deferredQuery} />
      </div>
    </section>
  );
}
