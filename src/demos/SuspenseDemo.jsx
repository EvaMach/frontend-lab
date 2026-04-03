import { use, Suspense, useState, Component } from 'react'

// Simulated async API — returns a promise that resolves after ~1–2 s
function fetchUser(id) {
  const names  = ['Alice', 'Bob', 'Carol', 'Dave']
  const roles  = ['admin', 'viewer', 'admin', 'viewer']
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() < 0.15) {        // 15% chance of error, for ErrorBoundary demo
        reject(new Error(`Server error loading user ${id}`))
      } else {
        resolve({
          id,
          name:  names[id - 1],
          email: `${names[id - 1].toLowerCase()}@example.com`,
          role:  roles[id - 1],
        })
      }
    }, 800 + Math.random() * 800)
  )
}

// React 19: use(promise) suspends the component until the promise resolves.
// The promise must be stable (not re-created on every render) — here it comes
// from props, created once per button click in the parent.
function UserProfile({ userPromise }) {
  const user = use(userPromise)
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span className={`role role-${user.role}`}>{user.role}</span>
    </div>
  )
}

// Class-based ErrorBoundary — required until React ships a hook equivalent.
class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="user-card" style={{ borderColor: 'var(--accent-border)' }}>
          <p style={{ color: 'var(--accent)' }}>
            {this.state.error.message}
          </p>
          <button className="nav-btn" onClick={() => this.setState({ error: null })}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function SuspenseDemo() {
  // Store {userId, promise} together so a new promise is created for each load.
  const [state, setState] = useState(() => ({
    userId:  1,
    promise: fetchUser(1),
  }))

  function loadUser(id) {
    setState({ userId: id, promise: fetchUser(id) })
  }

  return (
    <section className="demo">
      <h2>Suspense + use()</h2>
      <p className="desc">
        React 19's <code>use(promise)</code> lets a component suspend while
        reading async data — no <code>useEffect</code>, no loading state variable.
        The nearest <code>&lt;Suspense&gt;</code> boundary handles the fallback.
        There's also a 15% chance of an error so you can see the{' '}
        <code>ErrorBoundary</code> in action.
      </p>

      <div className="controls">
        {[1, 2, 3, 4].map(id => (
          <button
            key={id}
            className={`nav-btn${state.userId === id ? ' active' : ''}`}
            onClick={() => loadUser(id)}
          >
            User {id}
          </button>
        ))}
      </div>

      {/* ErrorBoundary wraps Suspense so errors surface gracefully */}
      <ErrorBoundary key={`${state.userId}-${state.promise}`}>
        <Suspense fallback={<div className="loading-card">Fetching user…</div>}>
          <UserProfile userPromise={state.promise} />
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}
