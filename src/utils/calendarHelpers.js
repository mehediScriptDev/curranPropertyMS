/**
 * Calendar helpers for the Admin Rent Payment Calendar view.
 * Monday-first week layout (Ireland/UK convention).
 */

const DAY_OFFSET = 1; // Monday = first day (getDay() returns 0=Sun,1=Mon,...,6=Sat)

/**
 * Build a flat array of cells for a 7-column month grid.
 * Leading / trailing nulls pad the grid to full weeks.
 * @param {number} year
 * @param {number} month  1-indexed month
 * @returns {{ day: number, dateKey: string }[] | null[]}
 */
export function buildCalendarGrid(year, month) {
  const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const offset = (firstDow + 6) % 7; // Mon=0, Tue=1, …, Sun=6
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, dateKey });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * Human-readable month label, e.g. "February 2026"
 */
export function getMonthLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleDateString("en-IE", {
    month: "long",
    year: "numeric",
  });
}

/** Navigate to previous month, handling year rollover. */
export function prevMonth(year, month) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

/** Navigate to next month, handling year rollover. */
export function nextMonth(year, month) {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

/**
 * Returns Tailwind class sets for a payment status.
 * @param {"PAID"|"PENDING"|"OVERDUE"} status
 */
export function getStatusConfig(status) {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        badge: "bg-teal-100 text-teal-700 border-teal-200",
        dot: "bg-teal-500",
        activeFilter: "bg-teal-600 text-white border-teal-600",
        idleFilter: "border-teal-200 text-teal-700 hover:bg-teal-50",
      };
    case "OVERDUE":
      return {
        label: "Overdue",
        badge: "bg-rose-100 text-rose-700 border-rose-200",
        dot: "bg-rose-500",
        activeFilter: "bg-rose-500 text-white border-rose-500",
        idleFilter: "border-rose-200 text-rose-600 hover:bg-rose-50",
      };
    case "PENDING":
    default:
      return {
        label: "Pending",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        dot: "bg-amber-400",
        activeFilter: "bg-amber-500 text-white border-amber-500",
        idleFilter: "border-amber-200 text-amber-700 hover:bg-amber-50",
      };
  }
}

/**
 * Format a number as Irish Euro with no decimal places, e.g. "€1,450"
 */
export function formatCalCurrency(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "€0";
  return `€${n.toLocaleString("en-IE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Today's dateKey string in YYYY-MM-DD format.
 */
export function todayKey() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
