// Réglages Actions du portfolio (infra/github/actions-permissions.tf, A14), lus dans les .tf :
// la liste des actions tierces autorisées doit couvrir chaque `uses:` des workflows.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const tf = readFileSync('infra/github/actions-permissions.tf', 'utf8');
const imports = readFileSync('infra/github/imports.tf', 'utf8');

const sources = ['.github/workflows', '.github/actions/setup-lychee']
  .flatMap((dir) => readdirSync(dir, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
  .map((entry) => readFileSync(`${entry.parentPath}/${entry.name}`, 'utf8'));

const used = new Set(
  sources.flatMap((text) =>
    [...text.matchAll(/^\s*(?:-\s+)?uses:\s*([^\s#]+)/gm)].map((m) => m[1]),
  ),
);
const external = [...used]
  .filter((ref) => !ref.startsWith('./') && !/^(actions|github)\//.test(ref))
  .map((ref) => ref.split('@')[0].split('/').slice(0, 2).join('/'));

const patterns = [
  ...(/patterns_allowed\s*=\s*\[([\s\S]*?)\]/.exec(tf)?.[1] ?? '').matchAll(/"([^"]+)"/g),
].map((m) => m[1]);

describe('infra/github, réglages Actions du portfolio', () => {
  it('garde le jeton des workflows en lecture seule, sans approbation de PR', () => {
    const block = /resource "github_workflow_repository_permissions"[\s\S]*?\n\}/.exec(tf)?.[0];
    expect(block).toMatch(/default_workflow_permissions\s*=\s*"read"/);
    expect(block).toMatch(/can_approve_pull_request_reviews\s*=\s*false/);
  });

  it('autorise les actions de GitHub et une liste fermée d’actions tierces épinglées', () => {
    expect(tf).toMatch(/allowed_actions\s*=\s*"selected"/);
    expect(tf).toMatch(/github_owned_allowed\s*=\s*true/);
    expect(tf).toMatch(/verified_allowed\s*=\s*false/);
    expect(tf).toMatch(/sha_pinning_required\s*=\s*true/);
    expect(patterns.every((p) => /^[\w.-]+\/[\w.-]+@\*$/.test(p))).toBe(true);
  });

  it('couvre toutes les actions tierces des workflows, sans motif inutile', () => {
    expect(external.length).toBeGreaterThan(0);
    expect(patterns.map((p) => p.replace('@*', '')).sort()).toEqual([...new Set(external)].sort());
  });

  it('n’approuve aucune PR depuis un workflow', () => {
    for (const text of sources) expect(text).not.toMatch(/gh pr review|approve-pull-request/);
  });

  it('importe les deux réglages existants par le nom du dépôt', () => {
    for (const type of [
      'github_workflow_repository_permissions',
      'github_actions_repository_permissions',
    ]) {
      expect(imports).toMatch(
        new RegExp(String.raw`to\s*=\s*${type}\.portfolio\s+id\s*=\s*"portfolio"`),
      );
    }
  });
});
