export const pad = (n: number) => String(n).padStart(2, '0');

export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayKey = () => toKey(new Date());

/** Ayın ızgarası: Pazartesi başlangıçlı, 6 hafta (42 gün). */
export function monthGrid(year: number, month: number): { key: string; inMonth: boolean; day: number }[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { key: toKey(d), inMonth: d.getMonth() === month, day: d.getDate() };
  });
}

export const monthTitle = (year: number, month: number) =>
  new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));

export const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export const longDate = (k: string) =>
  new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }).format(fromKey(k));

export const shortDate = (k: string) =>
  new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(fromKey(k));

export function daysUntil(k: string) {
  const ms = fromKey(k).getTime() - fromKey(todayKey()).getTime();
  return Math.round(ms / 86_400_000);
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

/** Türkçe yönelme eki: Ali → Ali'ye, Ece → Ece'ye, Can → Can'a. */
export function dative(name: string) {
  const vowels = 'aeıioöuü';
  const lower = name.toLocaleLowerCase('tr-TR');
  const last = [...lower].reverse().find((c) => vowels.includes(c)) ?? 'e';
  const suffix = 'aıou'.includes(last) ? 'a' : 'e';
  return `${name}'${vowels.includes(lower.slice(-1)) ? 'y' : ''}${suffix}`;
}
