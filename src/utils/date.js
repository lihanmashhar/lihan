const pad = (n) => String(n).padStart(2, '0');

// Local date as YYYY-MM-DD (not UTC)
export function dateToStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayStr() {
  return dateToStr(new Date());
}

// Last n local dates as YYYY-MM-DD, oldest first, ending today
export function lastDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(dateToStr(d));
  }
  return out;
}
