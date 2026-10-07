import { toDate } from './format';

export interface Scheduled {
  /** ISO date "YYYY-MM-DD"; the item is live from the start of this day. */
  startDate: string;
  /** ISO date "YYYY-MM-DD"; the item retires at the end of this day. */
  endDate: string;
}

/** True when `now` falls inside [startDate 00:00, endDate 23:59:59]. Expired items retire automatically. */
export function isLive(item: Scheduled, now: Date = new Date()): boolean {
  const start = toDate(item.startDate);
  const end = toDate(item.endDate);
  end.setHours(23, 59, 59, 999);
  return now >= start && now <= end;
}

export function liveItems<T extends Scheduled>(items: T[], now: Date = new Date()): T[] {
  return items.filter((i) => isLive(i, now));
}
