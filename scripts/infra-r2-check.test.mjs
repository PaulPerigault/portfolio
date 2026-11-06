// Contrôle d'accès public des buckets de state, avec des doublures de `fetch` et de la console.
import { describe, expect, it } from 'vitest';
import { STATE_BUCKETS, checkR2PublicAccess } from './infra-r2-check.mjs';

const SECRETS = 'TF_VAR_cloudflare_api_token=fake-cf\n';
const NONE = [{ enabled: false }, { domains: [] }];

const setup = (answers) => {
  const urls = [];
  const lines = [];
  const queue = [...answers];
  return {
    urls,
    lines,
    deps: {
      env: { PATH: '/bin', TF_SECRETS_FILE: '/faux' },
      readFile: () => SECRETS,
      root: '/depot',
      fetch: async (url) => {
        urls.push(url);
        const answer = queue.shift();
        return answer instanceof Error
          ? { ok: false, status: 403, json: async () => ({}) }
          : { ok: true, json: async () => ({ result: answer }) };
      },
      log: (line) => lines.push(line),
    },
  };
};

describe('checkR2PublicAccess', () => {
  it('contrôle les deux buckets de state', async () => {
    const { urls, deps } = setup([...NONE, ...NONE]);
    expect(await checkR2PublicAccess(deps)).toBe(0);
    for (const bucket of STATE_BUCKETS)
      expect(urls.filter((u) => u.includes(`/buckets/${bucket}/domains/`))).toHaveLength(2);
    expect(STATE_BUCKETS).toContain('tfstate-portfolio-identity');
  });

  it('code 0 quand aucun bucket n’a d’accès public', async () => {
    const { lines, deps } = setup([...NONE, ...NONE]);
    expect(await checkR2PublicAccess(deps)).toBe(0);
    expect(lines.at(-1)).toMatch(/OK/);
  });

  it('code 1 quand r2.dev est actif sur le bucket d’identity', async () => {
    const { lines, deps } = setup([...NONE, { enabled: true }, { domains: [] }]);
    expect(await checkR2PublicAccess(deps)).toBe(1);
    expect(lines.at(-1)).toMatch(/ALERTE/);
  });

  it('code 1 et alerte quand un domaine public existe', async () => {
    const { lines, deps } = setup([{ enabled: false }, { domains: [{ domain: 'state.example' }] }]);
    expect(await checkR2PublicAccess(deps)).toBe(1);
    expect(lines.join('\n')).toMatch(/state\.example/);
    expect(lines.at(-1)).toMatch(/ALERTE/);
  });

  it('nomme le bucket quand la lecture est refusée', async () => {
    const { deps } = setup([...NONE, new Error('403')]);
    await expect(checkR2PublicAccess(deps)).rejects.toThrow(/tfstate-portfolio-identity/);
  });
});
