import { describe, expect, it } from 'vitest';
import type { Project } from '@/domain/project';
import { inlineText, projectLine } from './markdown-blocks';

const project = (overrides: Partial<Project> = {}): Project => ({
  id: 1,
  name: 'demo',
  description: 'Un outil',
  html_url: 'https://github.com/PaulPerigault/demo',
  homepage: null,
  topics: ['go'],
  language: 'Go',
  stargazers_count: 0,
  updated_at: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('inlineText', () => {
  it('ramène les retours à la ligne et espaces répétés à un espace', () => {
    expect(inlineText('  a\n\n- b\r\n\tc  ')).toBe('a - b c');
  });

  it('échappe les crochets', () => {
    expect(inlineText('[lien](https://x.example)')).toBe('\\[lien\\](https://x.example)');
  });

  it('échappe l’antislash, pour qu’il ne défasse pas l’échappement des crochets', () => {
    expect(inlineText('a\\[b')).toBe('a\\\\\\[b');
    expect(inlineText('fin\\')).toBe('fin\\\\');
  });
});

describe('projectLine', () => {
  it('garde la ligne d’un projet ordinaire', () => {
    expect(projectLine(project())).toBe(
      '- [demo](https://github.com/PaulPerigault/demo): Un outil (Go, go)',
    );
  });

  it('reste une seule puce et un seul lien avec une description hostile', () => {
    const line = projectLine(project({ description: 'ok\n## Titre\n[x](https://y.example)' }));
    expect(line.split('\n')).toHaveLength(1);
    expect(line.match(/(?<!\\)\]\(/g)).toHaveLength(1);
  });

  it('nettoie aussi les sujets', () => {
    expect(projectLine(project({ topics: ['a\nb', '[c]'] }))).toContain('(Go, a b, \\[c\\])');
  });
});
