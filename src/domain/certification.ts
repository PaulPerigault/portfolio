import { Schema } from 'effect';
import { CalendarDate } from './calendar-date';
import { YearMonth } from './year-month';

/** Image du badge de l'émetteur, servie par le site : chemin relatif, dimensions réelles du fichier. */
const Badge = Schema.Struct({
  src: Schema.String.pipe(
    Schema.pattern(/^\/[A-Za-z0-9._/-]+$/, { message: () => 'attendu : chemin relatif du site' }),
  ),
  width: Schema.Int.pipe(Schema.positive()),
  height: Schema.Int.pipe(Schema.positive()),
});

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
  /** Badge fourni par l'émetteur, jamais pour une certification planifiée. */
  badge: Schema.optional(Badge),
}).pipe(
  Schema.filter((cert) => {
    if (cert.status === 'achieved' && cert.date === undefined) {
      return 'une certification obtenue a une date';
    }
    return cert.status === 'planned' && cert.badge !== undefined
      ? "une certification planifiée n'a pas de badge"
      : true;
  }),
);
export type Certification = typeof Certification.Type;

/** Parcours : les certifications et le point d'arrivée, dans un seul fichier par langue. */
export const CertificationPath = Schema.Struct({
  goal: Schema.Struct({ label: Schema.NonEmptyString }),
  items: Schema.NonEmptyArray(Certification),
});
export type CertificationPath = typeof CertificationPath.Type;
