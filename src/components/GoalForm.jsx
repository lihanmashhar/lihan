import { useState } from 'react';

export default function GoalForm({ goal, onSave }) {
  const [value, setValue] = useState(String(goal));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    setValue(e.target.value);
    setSaved(false);
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const num = Number(value);
    if (value === '' || !Number.isFinite(num) || num < 500 || num > 10000) {
      setError('Enter a goal between 500 and 10000 ml.');
      setSaved(false);
      return;
    }
    const rounded = Math.round(num);
    onSave(rounded);
    setValue(String(rounded));
    setError('');
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Daily Goal</h2>
      <label>
        Daily goal (ml)
        <input
          type="number"
          inputMode="numeric"
          min="500"
          max="10000"
          step="50"
          value={value}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Save Goal</button>
      {error && <p className="error">{error}</p>}
      {saved && <p className="success">Goal saved: {goal} ml</p>}
    </form>
  );
}
