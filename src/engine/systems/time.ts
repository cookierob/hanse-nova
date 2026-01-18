export interface GameDate {
  day: number;
  month: number;
  year: number;
}

const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const DAYS_PER_MONTH = 30;
const START_YEAR = 1370;
const START_MONTH = 3; // April (0-indexed)
const START_DAY = 1;

export function gameTimeToDate(gameDays: number): GameDate {
  let totalDays = START_DAY + Math.floor(gameDays);
  let month = START_MONTH;
  let year = START_YEAR;

  while (totalDays > DAYS_PER_MONTH) {
    totalDays -= DAYS_PER_MONTH;
    month++;
    if (month >= 12) {
      month = 0;
      year++;
    }
  }

  return {
    day: totalDays,
    month,
    year,
  };
}

export function formatGameDate(gameDays: number): string {
  const date = gameTimeToDate(gameDays);
  return `${date.day}. ${MONTHS[date.month]} ${date.year}`;
}

export function getDaysRemaining(currentDays: number, maxDays: number): number {
  return Math.max(0, maxDays - currentDays);
}

export function formatDaysRemaining(days: number): string {
  if (days <= 0) return "Keine Zeit mehr!";
  if (days === 1) return "1 Tag verbleibt";
  return `${Math.floor(days)} Tage verbleiben`;
}
