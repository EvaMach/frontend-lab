import { useState, Suspense, lazy } from 'react'
import './App.css'

const TransitionDemo = lazy(() => import('./demos/TransitionDemo'))
const DeferredDemo   = lazy(() => import('./demos/DeferredDemo'))
const SuspenseDemo   = lazy(() => import('./demos/SuspenseDemo'))
const OptimisticDemo = lazy(() => import('./demos/OptimisticDemo'))

const DEMOS = [
  { id: 'transition', label: 'useTransition',   component: TransitionDemo },
  { id: 'deferred',   label: 'useDeferredValue', component: DeferredDemo },
  { id: 'suspense',   label: 'Suspense + use()', component: SuspenseDemo },
  { id: 'optimistic', label: 'useOptimistic',    component: OptimisticDemo },
]

export default function App() {
  const [activeId, setActiveId] = useState('transition')
  const ActiveDemo = DEMOS.find(d => d.id === activeId).component

  return (
    <div className="app">
      <header className="app-header">
        <h1>React 19 Concurrent Features</h1>
        <nav className="demo-nav">
          {DEMOS.map(demo => (
            <button
              key={demo.id}
              className={`nav-btn${activeId === demo.id ? ' active' : ''}`}
              onClick={() => setActiveId(demo.id)}
            >
              {demo.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {/* React.lazy + Suspense: each tab is code-split, loaded on first visit */}
        <Suspense fallback={<p className="loading">Loading demo…</p>}>
          <ActiveDemo />
        </Suspense>
      </main>
    </div>
  )
}
