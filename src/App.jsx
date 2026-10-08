import { useState, useEffect } from 'react';
import GoalForm from './components/GoalForm.jsx';
import LogWater from './components/LogWater.jsx';
import Progress from './components/Progress.jsx';

const DEFAULT_GOAL = 2500;

// Read a value from localStorage (falls back if nothing saved yet)
function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: ignore
  }
}

export default function App() {
  const [view, setView] = useState('progress'); // 'progress' | 'log' | 'goal'
  const [goal, setGoal] = useState(() => load('goal', DEFAULT_GOAL));
  const [entries, setEntries] = useState(() => load('entries', []));
  const [theme, setTheme] = useState(() =>
    load(
      'theme',
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    )
  );

  useEffect(() => save('goal', goal), [goal]);
  useEffect(() => save('entries', entries), [entries]);
  useEffect(() => {
    save('theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function addEntry(date, amount) {
    setEntries((prev) => [...prev, { id: Date.now(), date, amount }]);
  }

  function deleteEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const tabs = [
    ['progress', 'Progress'],
    ['log', 'Log'],
    ['goal', 'Goal'],
  ];

  return (
    <div className="app">
      <header>
        <h1>Water Tracker</h1>
        <button
          type="button"
          className="theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      <nav>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={view === key ? 'active' : ''}
            onClick={() => setView(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {view === 'progress' && <Progress goal={goal} entries={entries} />}
      {view === 'log' && (
        <LogWater entries={entries} onAdd={addEntry} onDelete={deleteEntry} />
      )}
      {view === 'goal' && <GoalForm goal={goal} onSave={setGoal} />}
    </div>
  );
}
