import { Schema } from 'effect';
import { CalendarDate } from './calendar-date';
import { YearMonth } from './year-month';

/** Jeu fermé d'emblèmes du paquet `@paulperigault/milestones-3d` : une clé inconnue y est une erreur. */
const Emblem = Schema.Literal(
  'disc',
  'check',
  'shield',
  'cloud',
  'network',
  'database',
  'code',
  'key',
  'gear',
);

const HTTPS_URL = /^https:\/\/[^\s]+$/;

export const Certification = Schema.Struct({
  id: Schema.String.pipe(Schema.pattern(/^[a-z0-9-]+$/, { message: () => 'attendu : [a-z0-9-]+' })),
  name: Schema.NonEmptyString,
  issuer: Schema.NonEmptyString,
  /** Code d'examen (ex. `CLF-C02`), facultatif. */
  code: Schema.optional(Schema.NonEmptyString),
  status: Schema.Literal('achieved', 'planned'),
  /** Date d'obtention (`achieved`, obligatoire) ou d'examen prévue (`planned`, facultative). */
  date: Schema.optional(CalendarDate),
  dateExpires: Schema.optional(YearMonth),
  /** Lien de vérification, affiché dans le panneau HTML uniquement. */
  verifyUrl: Schema.optional(
    Schema.String.pipe(Schema.pattern(HTTPS_URL, { message: () => 'attendu : https://…' })),
  ),
  emblem: Schema.optional(Emblem),
}).pipe(
  Schema.filter((cert) =>
    cert.status === 'achieved' && cert.date === undefined
      ? 'une certification obtenue a une date'
      : true,
  ),
);
export type Certification = typeof Certification.Type;

/** Parcours : les certifications et le point d'arrivée, dans un seul fichier par langue. */
export const CertificationPath = Schema.Struct({
  goal: Schema.Struct({ label: Schema.NonEmptyString }),
  items: Schema.NonEmptyArray(Certification),
});
export type CertificationPath = typeof CertificationPath.Type;
