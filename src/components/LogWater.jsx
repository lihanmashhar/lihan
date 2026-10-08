import { useState } from 'react';
import { todayStr } from '../utils/date.js';

const QUICK_AMOUNTS = [250, 500, 750];

export default function LogWater({ entries, onAdd, onDelete }) {
  const [date, setDate] = useState(todayStr());
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const num = Number(amount);
    if (!date) return setError('Please choose a date.');
    if (amount === '' || !Number.isFinite(num) || num < 50 || num > 5000) {
      return setError('Enter an amount between 50 and 5000 ml.');
    }
    onAdd(date, Math.round(num));
    setAmount('');
    setError('');
  }

  function quickAdd(ml) {
    if (!date) return setError('Please choose a date.');
    onAdd(date, ml);
    setError('');
  }

  // Newest date first
  const sorted = [...entries].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Log Water Intake</h2>
        <label>
          Date
          <input
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div className="quick">
          {QUICK_AMOUNTS.map((ml) => (
            <button key={ml} type="button" onClick={() => quickAdd(ml)}>
              +{ml} ml
            </button>
          ))}
        </div>

        <label>
          Custom amount (ml)
          <input
            type="number"
            inputMode="numeric"
            min="50"
            max="5000"
            value={amount}
            placeholder="e.g. 300"
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
          />
        </label>
        <button type="submit">Add</button>
        {error && <p className="error">{error}</p>}
      </form>

      <h3>Entries</h3>
      {sorted.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul>
          {sorted.map((e) => (
            <li key={e.id}>
              <span>
                {e.date} — {e.amount} ml
              </span>
              <button
                type="button"
                className="delete"
                onClick={() => onDelete(e.id)}
                aria-label={`Delete ${e.amount} ml on ${e.date}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
