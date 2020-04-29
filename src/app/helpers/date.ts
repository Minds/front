import { chunkArray } from './array';

/**
 * Days of the week (JS-like enum)
 */
export enum WeekDays {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

/**
 * Months (JS-like enum)
 */
export enum Months {
  January = 0,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

/**
 * Builds a 2D array for a month, including last and next month offset days
 * @param year
 * @param month
 * @param startOn
 */
export function getCalendar(
  year: number,
  month: number,
  startOn = WeekDays.Sunday
): Date[][] {
  if (month < 0 || month > 11) {
    throw new Error('Invalid month');
  }

  // JavaScript is funny, get the 0th day of next month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // JavaScript is funny (II), get the 0th day of this month
  const daysInLastMonth = new Date(year, month, 0).getDate();

  // Offset
  const firstWeekDay = new Date(year, month, 1).getDay();

  // Last Month
  const lastMonthSlice = firstWeekDay - startOn;

  // Next Month
  const nextMonthSlice = 7 - ((lastMonthSlice + daysInMonth) % 7);

  // Build a plain array with offset days
  const days: Date[] = [
    ...Array(lastMonthSlice)
      .fill(0)
      .map(
        (_, i, lastMonthSlice) =>
          new Date(
            year,
            month - 1,
            daysInLastMonth - lastMonthSlice.length + i + 1
          )
      ),
    ...Array(daysInMonth)
      .fill(0)
      .map((_, i) => new Date(year, month, i + 1)),
    ...Array(nextMonthSlice)
      .fill(0)
      .map((_, i) => new Date(year, month + 1, i + 1)),
  ];

  return chunkArray(days, 7);
}

/**
 * Normalizes a date to 00:00:00.000 and returns its Unix timestamp
 * @param date
 */
export function normalizeDate(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
}

/**
 * Normalizes a month using a number in YYYYMM format for simple comparisons
 * @param date
 */
export function normalizeMonth(date: Date): number {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return parseInt([year, month].join(''), 10);
}
