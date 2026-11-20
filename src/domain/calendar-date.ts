import { Schema } from 'effect';

const DATE_PATTERN = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/;
const FIRST_DAY = 1;
const MONTH_OFFSET = 1;

/** Date `AAAA-MM` ou `AAAA-MM-JJ` dont le mois et le jour existent (le paquet 3D la refuse sinon). */
export const CalendarDate = Schema.String.pipe(
  Schema.filter((value) => {
    const match = DATE_PATTERN.exec(value);
    if (!match) return 'attendu : AAAA-MM ou AAAA-MM-JJ';
    const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3] ?? FIRST_DAY)];
    const parsed = new Date(Date.UTC(year, month - MONTH_OFFSET, day));
    const exists = parsed.getUTCMonth() === month - MONTH_OFFSET && parsed.getUTCDate() === day;
    return exists || 'cette date n’existe pas dans le calendrier';
  }),
  Schema.brand('CalendarDate'),
);
export type CalendarDate = typeof CalendarDate.Type;
