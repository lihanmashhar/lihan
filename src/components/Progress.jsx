import { todayStr, dateToStr } from '../utils/date.js';

// Consecutive days meeting the goal. Today only counts once it is met,
// but an unfinished today does not break a streak from yesterday.
function currentStreak(totals, goal) {
  let streak = 0;
  const d = new Date();
  if ((totals[dateToStr(d)] || 0) < goal) d.setDate(d.getDate() - 1);
  while ((totals[dateToStr(d)] || 0) >= goal) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function Progress({ goal, entries }) {
  const today = todayStr();

  const totals = {};
  for (const e of entries) totals[e.date] = (totals[e.date] || 0) + e.amount;

  const total = totals[today] || 0;
  const percent = goal > 0 ? Math.min(Math.round((total / goal) * 100), 100) : 0;
  const remaining = Math.max(goal - total, 0);
  const streak = currentStreak(totals, goal);

  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = dateToStr(d);
    const ml = totals[date] || 0;
    week.push({
      date,
      ml,
      pct: goal > 0 ? Math.min(Math.round((ml / goal) * 100), 100) : 0,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
    });
  }
  const daysMet = week.filter((d) => d.ml >= goal).length;

  return (
    <div>
      <h2>Today's Progress</h2>
      <p>
        {total} ml of {goal} ml ({percent}%)
      </p>
      <div
        className="bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="fill" style={{ width: `${percent}%` }} />
      </div>
      {remaining > 0 ? (
        <p>{remaining} ml left to reach your goal.</p>
      ) : (
        <p className="success">Goal reached! Good job!</p>
      )}
      <p>
        Streak: {streak} {streak === 1 ? 'day' : 'days'}
      </p>

      <h3>Last 7 days</h3>
      <p>Goal met on {daysMet} of 7 days.</p>
      <ul className="week">
        {week.map((d) => (
          <li key={d.date}>
            <span className="day">{d.label}</span>
            <div className="bar small">
              <div className="fill" style={{ width: `${d.pct}%` }} />
            </div>
            <span className="ml">{d.ml} ml</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
