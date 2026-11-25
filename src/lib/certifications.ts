import type { Certification } from '@/domain/certification';
import { certificationsInOrder } from './chronology';

/** Jalon au format du composant `Milestones3D` de `@paulperigault/astro` (et du paquet 3D). */
export interface Milestone {
  id: string;
  label: string;
  status: Certification['status'];
  group: string;
  date?: string;
  code?: string;
  badge?: NonNullable<Certification['badge']>;
  href?: string;
}

/** Libellé écrit en toutes lettres : le nom de la certification suivi de son code d'examen. */
export const certificationLabel = (cert: Certification): string =>
  cert.code ? `${cert.name} (${cert.code})` : cert.name;

/** Données du composant : même ordre et mêmes valeurs que la liste, le JSON-LD et le Markdown. */
export const toMilestones = (items: readonly Certification[]): Milestone[] =>
  certificationsInOrder(items).map((cert) => ({
    id: cert.id,
    label: cert.name,
    status: cert.status,
    group: cert.issuer,
    ...(cert.date ? { date: cert.date } : {}),
    ...(cert.code ? { code: cert.code } : {}),
    ...(cert.badge ? { badge: cert.badge } : {}),
    ...(cert.verifyUrl ? { href: cert.verifyUrl } : {}),
  }));
