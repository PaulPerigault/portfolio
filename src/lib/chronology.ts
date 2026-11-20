const ONGOING = '9999-12';
const UNDATED = '9999-99';

const compareDescending = (a: string, b: string): number => b.localeCompare(a);

interface Dated {
  readonly dateStart: string;
  readonly dateEnd: string | null;
}

/** Plus récent d'abord : en cours en tête, puis fin décroissante, puis début décroissant. */
export const newestFirst = <T extends Dated>(items: readonly T[]): T[] =>
  [...items].sort(
    (a, b) =>
      compareDescending(a.dateEnd ?? ONGOING, b.dateEnd ?? ONGOING) ||
      compareDescending(a.dateStart, b.dateStart),
  );

interface Certified {
  readonly date?: string | undefined;
}

/** Ordre du parcours : date croissante (le plus ancien d'abord), sans date en dernier. */
export const certificationsInOrder = <T extends Certified>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => (a.date ?? UNDATED).localeCompare(b.date ?? UNDATED));
