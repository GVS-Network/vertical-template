/** @see docs/phase-6-open-questions.md P6-6 — UTC storage, site timezone in admin UI */

type WallClock = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function wallClockInTimeZone(date: Date, timeZone: string): WallClock {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)])
  ) as WallClock;
  return parts;
}

/** Format UTC ISO for `<input type="datetime-local">` in site timezone. */
export function utcIsoToDatetimeLocal(
  iso: string | null | undefined,
  timeZone: string
): string {
  if (!iso) {
    return '';
  }
  const formatted = new Date(iso).toLocaleString('sv-SE', { timeZone });
  return formatted.replace(' ', 'T').slice(0, 16);
}

/** Parse datetime-local wall time in site timezone to UTC ISO (or null when empty). */
export function datetimeLocalToUtcIso(
  value: string,
  timeZone: string
): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const [datePart, timePart] = trimmed.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  let utcMs = Date.UTC(year, month - 1, day, hour, minute);
  for (let attempt = 0; attempt < 4; attempt++) {
    const wall = wallClockInTimeZone(new Date(utcMs), timeZone);
    const diffMinutes =
      (year - wall.year) * 525_600 +
      (month - wall.month) * 43_200 +
      (day - wall.day) * 1_440 +
      (hour - wall.hour) * 60 +
      (minute - wall.minute);
    if (diffMinutes === 0) {
      break;
    }
    utcMs -= diffMinutes * 60_000;
  }

  return new Date(utcMs).toISOString();
}

export function formatEventDateTime(
  iso: string | null | undefined,
  timeZone: string
): string {
  if (!iso) {
    return 'No start date';
  }
  return new Date(iso).toLocaleString(undefined, { timeZone });
}
