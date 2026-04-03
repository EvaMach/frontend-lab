import { useState, useOptimistic, useTransition } from "react";

const INITIAL_POSTS = [
  { id: 1, title: "Understanding useTransition", likes: 42 },
  { id: 2, title: "Mastering useDeferredValue", likes: 18 },
  { id: 3, title: "React 19 use() hook deep dive", likes: 31 },
  { id: 4, title: "useOptimistic for better UX", likes: 7 },
];

// Simulates a slow network call (1.5 s)
async function apiLikePost(id) {
  await new Promise((_, reject) => setTimeout(reject, 1500));
  // await new Promise((resolve) => setTimeout(resolve, 1500));
  return { ok: true };
}

export default function OptimisticDemo() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isPending, startTransition] = useTransition();

  // useOptimistic(realState, reducerFn)
  // • optimisticPosts reflects addOptimisticLike() calls immediately
  // • once the async action settles and setPosts runs, React discards
  //   the optimistic layer and shows the real state
  const [optimisticPosts, addOptimisticLike] = useOptimistic(
    posts,
    (currentPosts, likedId) =>
      currentPosts.map((p) =>
        p.id === likedId ? { ...p, likes: p.likes + 1 } : p,
      ),
  );

  function handleLike(id) {
    startTransition(async () => {
      addOptimisticLike(id); // show +1 immediately (optimistic)
      await apiLikePost(id); // wait for "server"
      setPosts(
        (
          prev, // commit the real state
        ) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)),
      );
    });
  }

  return (
    <section className="demo">
      <h2>useOptimistic</h2>
      <p className="desc">
        <code>useOptimistic</code> shows a temporary optimistic state while an
        async action is in flight. Click <strong>♥ Like</strong> — the count
        updates instantly even though the simulated API call takes 1.5 seconds.
        If the action fails, React rolls back to the last committed state
        automatically.
      </p>

      <ul className="post-list">
        {optimisticPosts.map((post) => (
          <li key={post.id} className="post-item">
            <span className="post-title">{post.title}</span>
            <button
              className="like-btn"
              onClick={() => handleLike(post.id)}
              disabled={isPending}
            >
              ♥ {post.likes}
            </button>
          </li>
        ))}
      </ul>

      {isPending && <span className="badge pending">Syncing with server…</span>}
    </section>
  );
}
