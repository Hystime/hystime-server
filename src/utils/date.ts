import moment from 'moment';

export function isSameDay(a: Date, b: Date): boolean {
  return moment(a).isSame(b, 'day');
}

export function daysBetween(a: Date, b: Date): number {
  return Math.abs(moment(a).diff(b, 'day'));
}
