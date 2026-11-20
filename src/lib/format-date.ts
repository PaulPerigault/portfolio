import type { Lang } from '@/domain/lang';

const SEPARATOR = ' - ';
const DAY_OF_MONTH = 1;
const MONTH_INDEX_OFFSET = 1;

const formatter = (lang: Lang) =>
  new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** `2023-09` → « sept. 2023 » / « Sep 2023 » (UTC : jamais de décalage de fuseau). */
export const formatYearMonth = (yearMonth: string, lang: Lang): string => {
  const [year, month] = yearMonth.split('-').map(Number) as [number, number];
  return formatter(lang).format(new Date(Date.UTC(year, month - MONTH_INDEX_OFFSET, DAY_OF_MONTH)));
};

/** `2026-11-18` → « 18 nov. 2026 » ; `2024-11` → « nov. 2024 ». */
export const formatCalendarDate = (date: string, lang: Lang): string => {
  const [year, month, day] = date.split('-').map(Number) as [number, number, number | undefined];
  if (day === undefined) return formatYearMonth(date, lang);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat(lang, { ...options, timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - MONTH_INDEX_OFFSET, day)),
  );
};

/** Période localisée : « sept. 2023 - Présent », « août 2022 » si début = fin. */
export const formatPeriod = (
  start: string,
  end: string | null,
  lang: Lang,
  presentLabel: string,
): string => {
  const from = formatYearMonth(start, lang);
  if (end === start) return from;
  return `${from}${SEPARATOR}${end === null ? presentLabel : formatYearMonth(end, lang)}`;
};
