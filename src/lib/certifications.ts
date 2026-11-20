import type { Certification } from '@/domain/certification';
import { certificationsInOrder } from './chronology';

/** Jalon au format du composant `Milestones3D` de `@paulperigault/astro` (et du paquet 3D). */
export interface Milestone {
  id: string;
  label: string;
  status: Certification['status'];
  group: string;
  date?: string;
  href?: string;
  emblem?: string;
}

/** Libellé d'un jalon : le nom de la certification suivi de son code d'examen. */
export const certificationLabel = (cert: Certification): string =>
  cert.code ? `${cert.name} (${cert.code})` : cert.name;

/** Données du composant : même ordre et mêmes valeurs que la liste, le JSON-LD et le Markdown. */
export const toMilestones = (items: readonly Certification[]): Milestone[] =>
  certificationsInOrder(items).map((cert) => ({
    id: cert.id,
    label: certificationLabel(cert),
    status: cert.status,
    group: cert.issuer,
    ...(cert.date ? { date: cert.date } : {}),
    ...(cert.verifyUrl ? { href: cert.verifyUrl } : {}),
    ...(cert.emblem ? { emblem: cert.emblem } : {}),
  }));
