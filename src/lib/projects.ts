import type { Project } from '@/domain/project';

export const MAX_TOPICS = 4;

export interface ProjectOverrides {
  /** Nom du dépôt → site du projet, qui remplace `homepage`. */
  readonly sites: Readonly<Record<string, string>>;
  /** Nom du dépôt → description, qui remplace celle de GitHub. */
  readonly descriptions: Readonly<Record<string, string>>;
}

/** Remplace le site et la description d'un projet quand la configuration en donne un. */
export const withOverrides = (
  project: Project,
  { sites, descriptions }: ProjectOverrides,
): Project => ({
  ...project,
  homepage: sites[project.name] ?? project.homepage,
  description: descriptions[project.name] ?? project.description,
});

/** Dépôts les plus récemment mis à jour d'abord. */
export const newestUpdatedFirst = (projects: readonly Project[]): Project[] =>
  [...projects].sort((a, b) => b.updated_at.localeCompare(a.updated_at));

export const visibleTopics = (topics: readonly string[]): readonly string[] =>
  topics.slice(0, MAX_TOPICS);

/** `2026-09-01T00:00:00Z` → `2026-09` (entrée de `formatYearMonth`). */
export const toYearMonth = (isoDate: string): string => isoDate.slice(0, 'YYYY-MM'.length);
